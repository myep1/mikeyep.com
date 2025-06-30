// Crypto.jsx
import Encrypt from "./Encrypt";
import Decrypt from "./Decrypt";
import BIP39Panel from "./BIP39/BIP39Panel";


export default function Crypto() {  
  return (
    <div style={{ padding: "1rem" }}>
      <h2>BIP39</h2>
      <BIP39Panel /> 
      <h2>Encrypt</h2>
      <Encrypt />
      <h2 style={{ marginTop: "2rem" }}>Decrypt</h2>
      <Decrypt />     
    </div>
  );
}
