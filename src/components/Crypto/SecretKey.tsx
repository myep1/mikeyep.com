import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react"

export interface KeyInfo {
  key: CryptoKey
  salt: Uint8Array
  iv: Uint8Array
}

export interface SecretKeyHandle {
  deriveKey(password: string, salt: Uint8Array, iv: Uint8Array): Promise<KeyInfo>
  getKey(): KeyInfo | null
  getPassword(): string
}

export interface SecretKeyProps {
  preset?: string
}

const SecretKey = forwardRef<SecretKeyHandle, SecretKeyProps>(({ preset }, ref) => {
  const [password, setPassword] = useState(preset ?? "")
  const [show, setShow] = useState(false)
  const [keyInfo, setKeyInfo] = useState<KeyInfo | null>(null)

  const deriveKey = async (pw: string): Promise<KeyInfo> => {
    const enc = new TextEncoder()
    const salt = crypto.getRandomValues(new Uint8Array(16))
    const iv = crypto.getRandomValues(new Uint8Array(12))

    const baseKey = await crypto.subtle.importKey(
      "raw",
      enc.encode(pw),
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    )

    const derivedKey = await crypto.subtle.deriveKey(
      { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
      baseKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    )

    const result = { key: derivedKey, salt, iv }
    setKeyInfo(result)
    return result
  }

  useEffect(() => {
    if (preset) void deriveKey(preset)
  }, [preset])

  useEffect(() => {
    if (!preset && password) void deriveKey(password)
  }, [password, preset])

  useImperativeHandle(ref, () => ({
    async deriveKey(password: string, salt: Uint8Array, iv: Uint8Array) {
      const enc = new TextEncoder()
      const baseKey = await crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
      )
      const derivedKey = await crypto.subtle.deriveKey(
        { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
        baseKey,
        { name: "AES-GCM", length: 256 },
        false,
        ["decrypt"]
      )
      return { key: derivedKey, salt, iv }
    },

    getKey() {
      return keyInfo
    },

    getPassword() {
      return password
    },
  }))

  if (preset) return null

  return (
    <div style={{ display: "flex", marginBottom: "0.5rem" }}>
      <input
        type={show ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
        style={{ flex: 1 }}
      />
      <button type="button" onClick={() => setShow((s) => !s)}>
        {show ? "👁️" : "🔒"}
      </button>
    </div>
  )
})

SecretKey.displayName = "SecretKey"
export default SecretKey
