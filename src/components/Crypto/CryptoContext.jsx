// CryptoContext.jsx
import { createContext, useContext, useState } from "react";

export const CryptoContext = createContext({});

export function useCrypto() {
  return useContext(CryptoContext);
}

export function CryptoProvider({ children }) {
  const [password, setPassword] = useState("");
  return (
    <CryptoContext.Provider value={{ password, setPassword }}>
      {children}
    </CryptoContext.Provider>
  );
}
