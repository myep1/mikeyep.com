// Encrypt.tsx
import { useState, useRef } from "react";
import SecretKey, { SecretKeyHandle } from "./SecretKey";
import type { KeyInfo } from './SecretKey'; // note `type`

type Mode = "text" | "file";

const enc = new TextEncoder();

function toBase64(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function formatCiphertext(salt: Uint8Array, iv: Uint8Array, ct: ArrayBuffer): string {
  return `@aes256gcm$pbkdf2$100000$${toBase64(salt)}$${toBase64(iv)}$${toBase64(ct)}`;
}

export default function Encrypt() {
  const secretKeyRef = useRef<SecretKeyHandle | null>(null);
  const [plaintext, setPlaintext] = useState<string>("");
  const [ciphertext, setCiphertext] = useState<string>("");
  const [mode, setMode] = useState<Mode>("text");
  const [file, setFile] = useState<File | null>(null);

  const encryptText = async () => {
    const keyInfo: KeyInfo | null | undefined = secretKeyRef.current?.getKey();
    if (!keyInfo) return;
    const { key, salt, iv } = keyInfo;
    const ptBytes = enc.encode(plaintext);
    const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, ptBytes);
    setCiphertext(formatCiphertext(salt, iv, ct));
  };

  const encryptFile = async () => {
    const keyInfo: KeyInfo | null | undefined = secretKeyRef.current?.getKey();
    if (!file || !keyInfo) return;
    const { key, salt, iv } = keyInfo;
    const arrayBuffer = await file.arrayBuffer();
    const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, arrayBuffer);

    // concatenate salt || iv || ciphertext for binary output
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
          />{" "}
          Text
        </label>
        <label style={{ marginLeft: "1rem" }}>
          <input
            type="radio"
            value="file"
            checked={mode === "file"}
            onChange={() => setMode("file")}
          />{" "}
          File
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
          <button onClick={encryptText} style={{ marginTop: "0.5rem" }}>
            Encrypt
          </button>
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
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
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
