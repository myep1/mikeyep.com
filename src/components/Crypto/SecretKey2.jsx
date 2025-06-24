// SecretKey2.jsx
import { useState, useEffect } from "react";

export default function SecretKey2({ IV, SALT, kdf = "pbkdf2", mode = "CFB", children, onReady }) {
  const raw = (children || "").toString().trim();
  const [password, setPassword] = useState(raw || "");
  const [show, setShow] = useState(false);

  const parseHex = (hexStr) => Uint8Array.from(hexStr.match(/.{1,2}/g), (b) => parseInt(b, 16));
  const isBase64 = (str) => /^[A-Za-z0-9+/=]+$/.test(str) && str.length % 4 === 0;
  const isHex = (str) => /^[0-9a-fA-F]+$/.test(str) && str.length % 2 === 0;

  const saltBytes = SALT ? parseHex(SALT) : crypto.getRandomValues(new Uint8Array(16));
  const ivBytes = IV ? parseHex(IV) : crypto.getRandomValues(new Uint8Array(16));

  useEffect(() => {
    if (!password || typeof onReady !== "function") return;

    const detectedFormat = isHex(password)
      ? "hex"
      : isBase64(password)
      ? "base64"
      : "utf8";

    const encodedPassword = (() => {
      if (detectedFormat === "hex")
        return Uint8Array.from(password.match(/.{1,2}/g).map((b) => parseInt(b, 16)));
      if (detectedFormat === "base64")
        return Uint8Array.from(atob(password), (c) => c.charCodeAt(0));
      return new TextEncoder().encode(password);
    })();

    const kdfParams = {
      salt: saltBytes,
      iterations: 100000,
      hash: "SHA-256",
    };

    crypto.subtle.importKey("raw", encodedPassword, { name: "AES-CFB" }, false, ["encrypt", "decrypt"])
      .then((key) => {
        if (typeof onReady === "function") {
          onReady({ key, iv: ivBytes, salt: saltBytes, mode, kdf, kdfParams });
        }
      })
      .catch((e) => console.error("Key import failed:", e));
  }, [password, IV, SALT, kdf, mode, onReady]);

  if (raw) return null;

  return (
    <div style={{ display: "flex", marginBottom: "0.5rem" }}>
      <input
        type={show ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
        style={{ flex: 1 }}
      />
      <button onClick={() => setShow((s) => !s)}>{show ? "👁️" : "🔒"}</button>
    </div>
  );
}