// CryptoContext.jsx
import { createContext, useContext, useState } from "react";

const CryptoContext = createContext(null);

export function useCrypto() {
  const context = useContext(CryptoContext);
  if (!context) throw new Error("useCrypto must be used within a CryptoProvider");
  return context;
}

export function CryptoProvider({ children }) {
  const [password, setPassword] = useState("");
  const [keyInfo, setKeyInfo] = useState(null);

  return (
    <CryptoContext.Provider value={{ password, setPassword, keyInfo, setKeyInfo }}>
      {children}
    </CryptoContext.Provider>
  );
}
