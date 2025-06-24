import { useState, useEffect, useMemo } from "react";
import SecretKey from "./SecretKey";

export default function AES256GCM({ onKeyReady, defaultPassword, salt: externalSalt, iv: externalIv, children }) {
  const [password, setPassword] = useState(defaultPassword || "");
  const [keyInfo, setKeyInfo] = useState(null);

  const salt = useMemo(() =>
    externalSalt
      ? Uint8Array.from(externalSalt.split(":").map(x => parseInt(x, 16)))
      : crypto.getRandomValues(new Uint8Array(16)),
    [externalSalt]
  );

  const iv = useMemo(() =>
    externalIv
      ? Uint8Array.from(externalIv.split(":").map(x => parseInt(x, 16)))
      : crypto.getRandomValues(new Uint8Array(12)),
    [externalIv]
  );

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

  return (
    <>
      <SecretKey onPassword={setPassword} preset={defaultPassword} />
      {keyInfo && children?.(keyInfo)}
    </>
  );
}
