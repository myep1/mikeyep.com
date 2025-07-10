import { useState, useRef } from "react";
import SecretKey from "./SecretKey";

function Encrypt() {
  const secretKeyRef = useRef();
  const [plaintext, setPlaintext] = useState("");
  const [ciphertext, setCiphertext] = useState("");
  const [mode, setMode] = useState("text");
  const [file, setFile] = useState(null);

  const enc = new TextEncoder();
  const toBase64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));

  const formatCiphertext = (salt, iv, ct) =>
    `@aes256gcm$pbkdf2$100000$${toBase64(salt)}$${toBase64(iv)}$${toBase64(ct)}`;

  const encryptText = async () => {
    const keyInfo = await secretKeyRef.current?.getKey();
    if (!keyInfo) return;
    const { key, salt, iv } = keyInfo;
    const ptBytes = enc.encode(plaintext);
    const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, ptBytes);
    setCiphertext(formatCiphertext(salt, iv, ct));
  };

  const encryptFile = async () => {
    const keyInfo = await secretKeyRef.current?.getKey();
    if (!file || !keyInfo) return;
    const { key, salt, iv } = keyInfo;
    const arrayBuffer = await file.arrayBuffer();
    const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, arrayBuffer);

    const s = new Uint8Array(salt);
    const v = new Uint8Array(iv);
    const c = new Uint8Array(ct);
    const combined = new Uint8Array(s.length + v.length + c.length);
    combined.set(s, 0);
    combined.set(v, s.length);
    combined.set(c, s.length + v.length);

    const blob = new Blob([combined], { type: "application/octet-stream" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${file.name}.enc`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div>
      {/* Key input */}
      <SecretKey ref={secretKeyRef} />

      {/* Mode Toggle */}
      <div style={{ marginBottom: "0.5rem" }}>
        <label>
          <input
            type="radio"
            value="text"
            checked={mode === "text"}
            onChange={() => setMode("text")}
          /> Text
        </label>
        <label style={{ marginLeft: "1rem" }}>
          <input
            type="radio"
            value="file"
            checked={mode === "file"}
            onChange={() => setMode("file")}
          /> File
        </label>
      </div>

      {/* Text Mode */}
      {mode === "text" && (
        <>
          <textarea
            value={plaintext}
            onChange={(e) => setPlaintext(e.target.value)}
            placeholder="Enter plaintext"
            rows={4}
            style={{ width: "100%" }}
          />
          <button onClick={encryptText} style={{ marginTop: "0.5rem" }}>Encrypt</button>
          <textarea
            value={ciphertext}
            readOnly
            rows={4}
            style={{ width: "100%", marginTop: "0.5rem" }}
          />
        </>
      )}

      {/* File Mode */}
      {mode === "file" && (
        <>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ marginTop: "0.5rem" }}
          />
          <button
            onClick={encryptFile}
            disabled={!file}
            style={{ marginTop: "0.5rem", display: "block" }}
          >
            Encrypt & Download
          </button>
        </>
      )}
    </div>
  );
}

export default Encrypt;
