import React, { useState } from "react";

const Crypto = () => {
 
  const STARICON = '\u2B50';
  const STAROUTLINEICON = '\u2606';
  const [password, setPassword] = useState("");
  const [plaintext, setPlaintext] = useState("secret");
  const [ciphertext, setCiphertext] = useState("");
  const [decrypted, setDecrypted] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  const enc = new TextEncoder();
  const dec = new TextDecoder();

  const toBase64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));
  const fromBase64 = (b64) =>
    Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

  const getKeyFromPassword = async (pwd, salt) => {
    const baseKey = await crypto.subtle.importKey(
      "raw",
      enc.encode(pwd),
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );
    return await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      baseKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  };

  const doEncrypt = async () => {
    setError("");
    try {
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const key = await getKeyFromPassword(password, salt);

      const ct = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        enc.encode(plaintext)
      );

      const result =
        toBase64(salt) + "." + toBase64(iv) + "." + toBase64(ct);
      setCiphertext(result);
    } catch (e) {
      setError("Encryption failed: " + e.message);
    }
  };

  const doDecrypt = async () => {
    setError("");
    try {
      const [saltB64, ivB64, ctB64] = ciphertext.split(".");
      const salt = fromBase64(saltB64);
      const iv = fromBase64(ivB64);
      const ct = fromBase64(ctB64);
      const key = await getKeyFromPassword(password, salt);
      const pt = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        ct
      );
      setDecrypted(dec.decode(pt));
    } catch (e) {
      setError("Decryption failed: " + e.message);
      setDecrypted("");
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>AES-GCM + PBKDF2</h2>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
        <input 
         type={showPassword ? "text" : "password"}
         placeholder="Password"
         value={password}
         onChange={(e) => setPassword(e.target.value)}
         style={{ flex: 1 }}
        />
        <button onClick={() => setShowPassword((s) => !s)} style={{ marginLeft: "0.5rem" }}>
          {showPassword ? STAROUTLINEICON : STARICON }
        </button>
      </div>
      <textarea
        placeholder="Plaintext"
        value={plaintext}
        onChange={(e) => setPlaintext(e.target.value)}
        rows={3}
        style={{ width: "100%", marginBottom: "0.5rem" }}
      />
      <button onClick={doEncrypt}>Encrypt</button>
      <br />
      <textarea
        placeholder="Ciphertext (salt.iv.ct)"
        value={ciphertext}
        onChange={(e) => setCiphertext(e.target.value)}
        rows={3}
        style={{ width: "100%", marginTop: "0.5rem", marginBottom: "0.5rem" }}
      />
      <button onClick={doDecrypt}>Decrypt</button>
      <br />
      <textarea
        placeholder="Decrypted plaintext"
        value={decrypted}
        readOnly
        rows={3}
        style={{ width: "100%", marginTop: "0.5rem" }}
      />
      {error && <div style={{ color: "red", marginTop: "0.5rem" }}>{error}</div>}
    </div>
  );
};

export default Crypto;
