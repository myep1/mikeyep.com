import React, { useState } from "react";
import AES256GCM from "./AES256GCM";
import SecretKey from "./SecretKey";

const Crypto = () => {
  const [key, setKey] = useState(null);
  const [salt, setSalt] = useState(null);
  const [iv, setIv] = useState(null);

  const [plaintext, setPlaintext] = useState("");
  const [ciphertext, setCiphertext] = useState("");
  const [decrypted, setDecrypted] = useState("");
  const [error, setError] = useState("");

  const enc = new TextEncoder();
  const dec = new TextDecoder();

  const toBase64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));
  const fromBase64 = (b64) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

  const doEncrypt = async () => {
    try {
      setError("");
      const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(plaintext));
      setCiphertext(`${toBase64(salt)}.${toBase64(iv)}.${toBase64(ct)}`);
    } catch (e) {
      setError("Encryption failed: " + e.message);
    }
  };

  const doDecrypt = async () => {
    try {
      setError("");
      const [saltB64, ivB64, ctB64] = ciphertext.split(".");
      const saltBuf = fromBase64(saltB64);
      const ivBuf = fromBase64(ivB64);
      const ctBuf = fromBase64(ctB64);

      const password = prompt("Enter password used to encrypt:");
      const baseKey = await crypto.subtle.importKey("raw", enc.encode(password), { name: "PBKDF2" }, false, ["deriveKey"]);
      const derivedKey = await crypto.subtle.deriveKey(
        { name: "PBKDF2", salt: saltBuf, iterations: 100000, hash: "SHA-256" },
        baseKey,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
      );

      const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: ivBuf }, derivedKey, ctBuf);
      setDecrypted(dec.decode(pt));
    } catch (e) {
      setError("Decryption failed: " + e.message);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>AES-GCM + PBKDF2</h2>

      <AES256GCM onKeyReady={({ key, salt, iv }) => {
        setKey(key);
        setSalt(salt);
        setIv(iv);
      }}>
        {({ salt, iv }) => (
          <>
            <SecretKey onPassword={() => {}} />
            <p>Salt: {toBase64(salt)}</p>
            <p>IV: {toBase64(iv)}</p>
            <p>Key derived and usable</p>
            <textarea
              placeholder="Plaintext"
              value={plaintext}
              onChange={(e) => setPlaintext(e.target.value)}
              rows={4}
              style={{ width: "100%", marginBottom: "0.5rem" }}
            />
            <button onClick={doEncrypt}>Encrypt</button>
          </>
        )}
      </AES256GCM>

      <textarea
        placeholder="Ciphertext (salt.iv.ct)"
        value={ciphertext}
        onChange={(e) => setCiphertext(e.target.value)}
        rows={4}
        style={{ width: "100%", margin: "0.5rem 0" }}
      />
      <button onClick={doDecrypt}>Decrypt</button>

      <textarea
        placeholder="Decrypted plaintext"
        value={decrypted}
        readOnly
        rows={4}
        style={{ width: "100%", marginTop: "0.5rem" }}
      />

      {error && <div style={{ color: "red", marginTop: "0.5rem" }}>{error}</div>}
    </div>
  );
};

export default Crypto;
