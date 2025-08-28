import {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  ForwardRefRenderFunction,
} from "react";

interface SecretKeyProps {
  preset?: string;
}

const SecretKey: ForwardRefRenderFunction<SecretKeyHandle, SecretKeyProps> = (
  { preset },
  ref
) => {
  const [password, setPassword] = useState<string>(preset || "");
  const [show, setShow] = useState<boolean>(false);
  const [keyInfo, setKeyInfo] = useState<KeyInfo | null>(null);

  const deriveKey = async (pw: string): Promise<KeyInfo> => {
    const enc = new TextEncoder();
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const baseKey = await crypto.subtle.importKey(
      "raw",
      enc.encode(pw),
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );
    const derivedKey = await crypto.subtle.deriveKey(
      { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
      baseKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
    const result: KeyInfo = { key: derivedKey, salt, iv };
    setKeyInfo(result);
    return result;
  };

  useEffect(() => {
    if (preset) {
      deriveKey(preset);
    }
  }, [preset]);

  useEffect(() => {
    if (!preset && password) {
      deriveKey(password);
    }
  }, [password, preset]);

  useImperativeHandle(ref, () => ({
    async deriveKey(password: string, salt: Uint8Array, iv: Uint8Array) {
      const enc = new TextEncoder();
      const baseKey = await crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
      );
      const derivedKey = await crypto.subtle.deriveKey(
        { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
        baseKey,
        { name: "AES-GCM", length: 256 },
        false,
        ["decrypt"]
      );
      return { key: derivedKey, salt, iv };
    },

    getKey() {
      return keyInfo;
    },

    getPassword() {
      return password;
    },
  }));

  if (preset) return null;

  return (
    <div style={{ display: "flex", marginBottom: "0.5rem" }}>
      <input
        type={show ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
        style={{ flex: 1 }}
      />
      <button onClick={() => setShow((s) => !s)}>
        {show ? "👁️" : "🔒"}
      </button>
    </div>
  );
};

export type SecretKeyHandle = {
  deriveKey(password: string, salt: Uint8Array, iv: Uint8Array): Promise<{ key: CryptoKey; salt: Uint8Array; iv: Uint8Array }>;
  getKey(): { key: CryptoKey; salt: Uint8Array; iv: Uint8Array } | null;
  getPassword(): string | undefined;
};
export type KeyInfo = { key: CryptoKey; salt: Uint8Array; iv: Uint8Array };
export default SecretKey;


