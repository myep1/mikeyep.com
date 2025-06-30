import { useState, useEffect, useMemo } from "react";

export default function AES256GCM({ onKeyReady, password, children }) {  
  const [keyInfo, setKeyInfo] = useState(null);

  const salt = useMemo(() => crypto.getRandomValues(new Uint8Array(16)), []);
  const iv = useMemo(() => crypto.getRandomValues(new Uint8Array(12)), []);

  useEffect(() => {
    if (!password) return;

    const deriveKey = async () => {
      const enc = new TextEncoder();
      const baseKey = await crypto.subtle.importKey("raw", enc.encode(password), { name: "PBKDF2" }, false, ["deriveKey"]);
      const derivedKey = await crypto.subtle.deriveKey(
        { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
        baseKey,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
      );
      const result = { key: derivedKey, salt, iv };
      setKeyInfo(result);
      onKeyReady?.(result);
    };

    deriveKey();
  }, [password, salt, iv, onKeyReady]);

  return children?.(keyInfo, password);  
}
