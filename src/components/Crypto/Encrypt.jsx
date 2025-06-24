// Encrypt.jsx
import { useState, useEffect } from "react";

export default function Encrypt({ keyInfo, children }) {
  const [ciphertext, setCiphertext] = useState("");
 

  useEffect(() => {
    if (!children) return;
   const enc = new TextEncoder();

  const toBase64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));
  const format = (salt, iv, ct) => `@aes256cfb$raw$0$${toBase64(ct)}`;
    const encryptText = async () => {
      const input = children.toString().trim();
      const pt = enc.encode(input);
      const ct = await crypto.subtle.encrypt({ name: "AES-CFB", iv: keyInfo.iv }, keyInfo.key, pt);
      setCiphertext(format(keyInfo.salt, keyInfo.iv, ct));
    };

    encryptText();
  }, [children, keyInfo]);

  return <pre>{ciphertext}</pre>;
}
