import { useState } from "react";

export default function Decrypt() {
  const [ciphertext, setCiphertext] = useState("");
  const [decrypted, setDecrypted] = useState("");
  const [error, setError] = useState("");

  const fromBase64 = (b64) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  const dec = new TextDecoder();

  const decrypt = async () => {
    setError("");
    try {
      const parts = ciphertext.trim().split("$");
      if (parts.length !== 6 || parts[0] !== "@aes256gcm") {
        throw new Error("Invalid format");
      }

      const [, kdf, iterations, saltB64, ivB64, ctB64] = parts;
      if (kdf !== "pbkdf2") throw new Error("Unsupported KDF");

      const salt = fromBase64(saltB64);
      const iv = fromBase64(ivB64);
      const ct = fromBase64(ctB64);
      const password = prompt("Enter password to decrypt");
      if (!password) return;

      const enc = new TextEncoder();
      const baseKey = await crypto.subtle.importKey("raw", enc.encode(password), { name: "PBKDF2" }, false, ["deriveKey"]);
      const key = await crypto.subtle.deriveKey(
        { name: "PBKDF2", salt, iterations: parseInt(iterations), hash: "SHA-256" },
        baseKey,
        { name: "AES-GCM", length: 256 },
        false,
        ["decrypt"]
      );

      const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ct);
      setDecrypted(dec.decode(pt));
    } catch (e) {
      setError("Decryption failed: " + e.message);
      setDecrypted("");
    }
  };

  return (
    <div>
      <textarea
        value={ciphertext}
        onChange={(e) => setCiphertext(e.target.value)}
        placeholder="Paste ciphertext here"
        rows={4}
        style={{ width: "100%" }}
      />
      <button onClick={decrypt}>Decrypt</button>
      <textarea
        value={decrypted}
        readOnly
        rows={4}
        style={{ width: "100%", marginTop: "0.5rem" }}
      />
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
}
