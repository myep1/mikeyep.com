import { useState, useMemo, useEffect } from "react";
import SecretKey from "./SecretKey";

export default function AES256GCM({ children, onKeyReady }) {
  const [password, setPassword] = useState(null);
  const [key, setKey] = useState(null);

  const salt = useMemo(() => crypto.getRandomValues(new Uint8Array(12)), []);
  const iv   = useMemo(() => crypto.getRandomValues(new Uint8Array(16)), []);

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
      setKey(derivedKey);
      onKeyReady?.({ key: derivedKey, salt, iv });
    };

    deriveKey();
  }, [password]);

  return (
    <>
      <SecretKey onPassword={setPassword} />
      {key && typeof children === "function" ? children({ key, salt, iv }) : null}
    </>
  );
}
