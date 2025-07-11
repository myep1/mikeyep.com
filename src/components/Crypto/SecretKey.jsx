import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { Eye, Lock } from "lucide-react";
import BIP39Panel from "./BIP39/BIP39Panel";

const SecretKey = forwardRef(({ preset, mode = "ascii" }, ref) => {
  const [password, setPassword] = useState(preset || "");
  const [show, setShow] = useState(false);
  const [keyInfo, setKeyInfo] = useState(null);
  const [bipRef, setBipRef] = useState(null);

  const deriveKey = async (pw) => {
    const enc = new TextEncoder();
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const baseKey = await crypto.subtle.importKey("raw", enc.encode(pw), { name: "PBKDF2" }, false, ["deriveKey"]);
    const derivedKey = await crypto.subtle.deriveKey(
      { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
      baseKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
    const result = { key: derivedKey, salt, iv };
    setKeyInfo(result);
    return result;
  };

  useEffect(() => {
    if (preset) {
      deriveKey(preset);
    }
  }, [preset]);

  useEffect(() => {
    if (!preset && password && mode === "ascii") {
      deriveKey(password);
    }
  }, [password, preset, mode]);

  useImperativeHandle(ref, () => ({
    async deriveKey(password, salt, iv) {
      const enc = new TextEncoder();
      const baseKey = await crypto.subtle.importKey("raw", enc.encode(password), { name: "PBKDF2" }, false, ["deriveKey"]);
      const derivedKey = await crypto.subtle.deriveKey(
        { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
        baseKey,
        { name: "AES-GCM", length: 256 },
        false,
        ["decrypt"]
      );
      return { key: derivedKey, salt, iv };
    },

    async getKey() {
      if (mode === "bip39" && bipRef?.current) {
        const key = await bipRef.current.getSecretKey(password);
        return { key, salt: new Uint8Array(16), iv: new Uint8Array(12) }; // placeholder salt/iv
      }
      return keyInfo;
    },

    getPassword() {
      return password;
    }
  }));

  if (preset) return null;

  return (
    <div style={{ marginBottom: "0.5rem" }}>
      {mode === "ascii" && (
        <div style={{ display: "flex" }}>
          <input
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password (optional)"
            style={{ flex: 1 }}
          />
          <button onClick={() => setShow((s) => !s)}>{show ? <Eye size={16} /> : <Lock size={16} />}</button>
        </div>
      )}

      {mode === "bip39" && (
        <BIP39Panel ref={(r) => setBipRef({ current: r })} />
      )}
    </div>
  );
});

export default SecretKey;
