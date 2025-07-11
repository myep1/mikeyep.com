// CryptoHeader.js (versioned binary header definitions)

export const HEADER_MAGIC = [0x59, 0x45, 0x4E, 0x43]; // 'YENC'
export const HEADER_VERSION = 1;

export const CIPHER_IDS = {
  AES256GCM: 1,
  AES256CFB: 2,
};

export const KDF_IDS = {
  PBKDF2: 1,
  BIP39_12: 2,
  BIP39_24: 3,
};

export class CryptoHeader {
  constructor({
    cipherId = CIPHER_IDS.AES256GCM,
    kdfId = KDF_IDS.PBKDF2,
    iterations = 100000,
    iv = new Uint8Array(12),
    salt = new Uint8Array(16),
  } = {}) {
    this.magic = Uint8Array.from(HEADER_MAGIC);
    this.version = HEADER_VERSION;
    this.cipherId = cipherId;
    this.kdfId = kdfId;
    this.iterations = iterations;
    this.iv = iv;
    this.salt = salt;
  }

  toBytes() {
    const bytes = [];
    bytes.push(...this.magic);
    bytes.push(this.version);
    bytes.push(this.cipherId);
    bytes.push(this.kdfId);
    bytes.push(...this._intToBytes(this.iterations, 4));
    bytes.push(...this.iv);
    bytes.push(...this.salt);
    return Uint8Array.from(bytes);
  }

  _intToBytes(num, length) {
    const arr = new Uint8Array(length);
    for (let i = length - 1; i >= 0; i--) {
      arr[i] = num & 0xff;
      num >>= 8;
    }
    return arr;
  }

  static fromBytes(buffer) {
    const view = new DataView(buffer.buffer);
    const magic = buffer.slice(0, 4);
    const version = buffer[4];

    if (!magic.every((b, i) => b === HEADER_MAGIC[i])) throw new Error("Invalid magic");
    if (version !== HEADER_VERSION) throw new Error("Unsupported header version");

    const cipherId = buffer[5];
    const kdfId = buffer[6];
    const iterations = view.getUint32(7);
    const iv = buffer.slice(11, 23);
    const salt = buffer.slice(23, 39);

    return new CryptoHeader({ cipherId, kdfId, iterations, iv, salt });
  }
}
