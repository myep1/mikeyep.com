import { useState } from "react";
import AES256GCM from "./AES256GCM";

function Encrypt() {
  const [keyInfo, setKeyInfo] = useState(null);
  const [plaintext, setPlaintext] = useState("");
  const [ciphertext, setCiphertext] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const enc = new TextEncoder();
  const toBase64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));

  const formatCiphertext = (salt, iv, ct) =>
    `@aes256gcm$pbkdf2$100000$${toBase64(salt)}$${toBase64(iv)}$${toBase64(ct)}`;

  const encrypt = async () => {
    if (!keyInfo) return;
    const { key, salt, iv } = keyInfo;
    const ptBytes = enc.encode(plaintext);
    const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, ptBytes);
    setCiphertext(formatCiphertext(salt, iv, ct));
  };

  return (
      <AES256GCM onKeyReady={setKeyInfo} password={password}>
      {() => (
        <div>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%" }}
            />
            <button onClick={() => setShowPassword((v) => !v)} style={{ marginLeft: "0.5rem" }}>
              {showPassword ? "👁️" : "🔒"}
            </button>
          </div>
          <textarea
            value={plaintext}
            onChange={(e) => setPlaintext(e.target.value)}
            placeholder="Enter plaintext"
            rows={4}
            style={{ width: "100%" }}
          />
          <button onClick={encrypt} style={{ marginTop: "0.5rem" }}>Encrypt</button>
          <textarea
            value={ciphertext}
            readOnly
            rows={4}
            style={{ width: "100%", marginTop: "0.5rem" }}
          />
        </div>
      )}
    </AES256GCM>
  );
}

export default Encrypt;
