
# PowerShell Unix-style Alias Pack
# Admin-free, designed to run on locked-down Windows environments (AVD safe)

# --- CORE ALIASES ---
Set-Alias ls Get-ChildItem
function ll { Get-ChildItem -Force | Format-Table Mode,Length,LastWriteTime,Name -Auto }
Set-Alias cat Get-Content
Set-Alias more More
function which($name){ (Get-Command $name -ErrorAction SilentlyContinue).Source }
function whoami { $env:USERNAME }
function id { [System.Security.Principal.WindowsIdentity]::GetCurrent().Name }

# --- TEXT UTILITIES ---
function grep([string]$p){ $input | Select-String -Pattern $p }
function fgrep([string]$s){ $input | Select-String -SimpleMatch $s }
function cut([int[]]$f, [string]$d=','){ process{ ($_.ToString() -split [regex]::Escape($d))[$f | ForEach-Object {$_-1}] -join $d } }
function head([int]$n=10){ $input | Select-Object -First $n }
function tail([int]$n=10){ $input | Select-Object -Last $n }
function wc {
  $t = ($in = ($input | Out-String))
  [pscustomobject]@{
    lines = ($t -split "\r?\n").Where({$_ -ne ''}).Count
    words = ($t -split '\s+').Where({$_ -ne ''}).Count
    bytes = [Text.Encoding]::UTF8.GetByteCount($in)
  }
}
function strings($path,[int]$min=4){
  $bytes=[IO.File]::ReadAllBytes($path)
  $sb=[Text.StringBuilder]::new(); $run=0
  foreach($b in $bytes){
    if($b -ge 32 -and $b -le 126){ [void]$sb.Append([char]$b); $run++ }
    elseif($run -ge $min){ $sb.ToString(); $sb.Clear() | Out-Null; $run=0 }
    else { $sb.Clear() | Out-Null; $run=0 }
  }
  if($run -ge $min){ $sb.ToString() }
}

# --- FILES & ARCHIVES ---
function zip($path,$zip){ Compress-Archive -Path $path -DestinationPath $zip -Force }
function unzip($zip,$dest="."){ Expand-Archive -Path $zip -DestinationPath $dest -Force }
function unzip-test($zip){
  try{
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $z=[System.IO.Compression.ZipFile]::OpenRead($zip)
    foreach($e in $z.Entries){ $s=$e.Open(); $buf=New-Object byte[] 8192; while($s.Read($buf,0,$buf.Length)>0){} $s.Dispose() }
    $z.Dispose(); "OK"
  } catch { "Corrupt: $($_.Exception.Message)" }
}
function gzip($file){
  $out="$file.gz"
  $in=[IO.File]::OpenRead($file)
  $gz=[IO.Compression.GZipStream]::new([IO.File]::Create($out),[IO.Compression.CompressionMode]::Compress)
  $in.CopyTo($gz); $gz.Dispose(); $in.Dispose(); $out
}
function gunzip($gzfile){
  $out=($gzfile -replace '\.gz$','')
  $gz=[IO.Compression.GZipStream]::new([IO.File]::OpenRead($gzfile),[IO.Compression.CompressionMode]::Decompress)
  $outStream=[IO.File]::Create($out); $gz.CopyTo($outStream); $outStream.Dispose(); $gz.Dispose(); $out
}

# --- HASHING & DIFF ---
function md5($p){ (Get-FileHash $p -Algorithm MD5).Hash }
function sha256($p){ (Get-FileHash $p -Algorithm SHA256).Hash }
Set-Alias hexdump Format-Hex
function diff($a,$b){ Compare-Object (Get-Content $a) (Get-Content $b) -IncludeEqual:$false }

# --- SYSTEM UTILITIES ---
function df { Get-PSDrive | Where-Object { $_.Provider -like "*FileSystem*" } | Select-Object Name, @{n='Used(GB)';e={[math]::Round(($_.Used/1GB),2)}}, @{n='Free(GB)';e={[math]::Round(($_.Free/1GB),2)}}, @{n='Total(GB)';e={[math]::Round(($_.Used + $_.Free)/1GB,2)}}, Root }
function du($path="."){ Get-ChildItem $path -Recurse -File | Measure-Object -Property Length -Sum | Select-Object @{n="MB";e={[math]::Round($_.Sum/1MB,2)}} }
function rm($p){ Remove-Item -Path $p -Recurse -Force }
function mv($src,$dst){ Move-Item $src $dst }
function cp($src,$dst){ Copy-Item $src $dst }
function touch($f){ if (!(Test-Path $f)) { New-Item $f -ItemType File } else { (Get-Item $f).LastWriteTime = Get-Date } }

# --- MISC ---
Set-Alias lsblk Get-Volume
Set-Alias whoami whoami
