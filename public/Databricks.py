# Paste into a Databricks Python notebook cell and run
from pyspark.sql import functions as F
from pyspark.sql.types import StringType

# --- utility: list columns with index for quick selection ---
def list_columns(df):
    for i, c in enumerate(df.columns):
        print(f"{i:3d}: {c}")

# --- show summary + top values for one column ---
def show_column(df, col, top_n=20, sample_n=50):
    total = df.count()                                     # expensive on huge tables; optional cache
    stats = df.select(
        F.lit(total).alias("total"),
        F.count(F.when(F.col(col).isNull(), 1)).alias("nulls"),
        F.count(F.when(F.trim(F.coalesce(F.col(col).cast(StringType()), F.lit(''))) == "", 1)).alias("blanks"),
        F.approx_count_distinct(F.col(col)).alias("distinct_approx"),
        F.min(F.length(F.coalesce(F.col(col).cast(StringType()), F.lit('')))).alias("min_len"),
        F.max(F.length(F.coalesce(F.col(col).cast(StringType()), F.lit('')))).alias("max_len")
    ).collect()[0]

    print(f"Column: {col}")
    print(f"  total: {stats['total']}, nulls: {stats['nulls']}, blanks: {stats['blanks']}, distinct_approx: {stats['distinct_approx']}")
    print(f"  min_len: {stats['min_len']}, max_len: {stats['max_len']}")
    print("\nTop values (count desc):")
    display(df.groupBy(col).count().orderBy(F.desc("count")).limit(top_n))

    print("\nSample rows (up to sample_n):")
    display(df.select(col).where(F.col(col).isNotNull()).limit(sample_n))

# --- flag invalid numeric values (non-digit characters) for a column stored as string ---
def show_invalid_numeric(df, col, limit=50):
    s = F.coalesce(F.col(col).cast(StringType()), F.lit(''))
    invalid = df.filter((F.trim(s) != "") & (~s.rlike(r'^\d+$')))
    print(f"Rows with non-digit content in {col}: {invalid.count()}")
    display(invalid.select(col).limit(limit))

# --- validate YYYYMMDD date strings (common for PIC 9(8)) ---
def show_invalid_yyyymmdd(df, col, limit=50):
    s = F.coalesce(F.col(col).cast(StringType()), F.lit(''))
    parsed = F.to_date(s, 'yyyyMMdd')
    invalid = df.filter((F.trim(s) != "") & (parsed.isNull()))
    print(f"Invalid YYYYMMDD in {col}: {invalid.count()}")
    display(invalid.select(col).limit(limit))

# --- column-level summary report (quick overview for all columns) ---
def column_report(df):
    # single-pass-ish: will still do one count per column (could be slow on many cols)
    rows = []
    total = df.count()
    for c in df.columns:
        r = df.select(
            F.count(F.when(F.col(c).isNull(), 1)).alias("nulls"),
            F.count(F.when(F.trim(F.coalesce(F.col(c).cast(StringType()), F.lit(''))) == "", 1)).alias("blanks"),
            F.approx_count_distinct(F.col(c)).alias("distinct_approx"),
            F.min(F.length(F.coalesce(F.col(c).cast(StringType()), F.lit('')))).alias("min_len"),
            F.max(F.length(F.coalesce(F.col(c).cast(StringType()), F.lit('')))).alias("max_len")
        ).collect()[0]
        rows.append((c, total, int(r['nulls']), int(r['blanks']), int(r['distinct_approx']),
                     int(r['min_len']) if r['min_len'] is not None else None,
                     int(r['max_len']) if r['max_len'] is not None else None))
    report_df = spark.createDataFrame(rows, schema=["column","total","nulls","blanks","distinct_approx","min_len","max_len"])
    display(report_df.orderBy("column"))

# ---------- Usage examples ----------
# list_columns(df_parsed)
# show_column(df_parsed, "ACCOUNT-NUMBER")
# show_invalid_numeric(df_parsed, "CLIENT-ID")
# show_invalid_yyyymmdd(df_parsed, "INPUT-DATE")
# column_report(df_parsed)

