// Crypto.jsx
import Encrypter from "./Encrypter";
import Decrypter from "./Decrypter";
import BIP39Panel from "./BIP39/BIP39Panel";


export default function Crypto() {  
  return (
    <div style={{ padding: "1rem" }}>
      <h2>Encrypt</h2>
      <Encrypter />

      <h2 style={{ marginTop: "2rem" }}>Decrypt</h2>
      <Decrypter />

      <h2 style={{ marginTop: "2rem" }}>BIP39 Test</h2>
      <BIP39Panel count={24} /> 
    </div>
  );
}
