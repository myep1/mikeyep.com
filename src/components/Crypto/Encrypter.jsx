import { useState } from "react";
import AES256GCM from "./AES256GCM";

export default function Encrypter({ children }) {
  const [plaintext, setPlaintext] = useState("");
  const [ciphertext, setCiphertext] = useState("");
  const enc = new TextEncoder();
  const toBase64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));
  const formatCiphertext = (salt, iv, ct) => `@aes256gcm$pbkdf2$100000$${toBase64(salt)}$${toBase64(iv)}$${toBase64(ct)}`;
  const encryptText = async (keyInfo, input) => {
    const { key, salt, iv } = keyInfo;
    const ptBytes = enc.encode(input);
    const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, ptBytes);
    setCiphertext(formatCiphertext(salt, iv, ct));
  };
  const handleEncryptClick = async (keyInfo) => { await encryptText(keyInfo, plaintext);  };
  return (
    <AES256GCM onKeyReady={(keyInfo) => {
        const str = children?.toString().trim();
        if (str) encryptText(keyInfo, str);
      }}
    >
      {(keyInfo) => children ? (
          <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{ciphertext}</pre>
        ) : (
          <div>
            <textarea
              value={plaintext}
              onChange={(e) => setPlaintext(e.target.value)}
              placeholder="Enter plaintext"
              rows={4}
              style={{ width: "100%" }}
            />
            <button onClick={() => handleEncryptClick(keyInfo)}>Encrypt</button>
            <textarea
              value={ciphertext}
              readOnly
              rows={4}
              style={{ width: "100%", marginTop: "0.5rem" }}
            />
          </div>
        )
      }
    </AES256GCM>
  );
}