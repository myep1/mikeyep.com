// Crypto.jsx
import Encrypt from "./Encrypt";
import Decrypt from "./Decrypt";

export default function Crypto() {  
  return (
    <div style={{ padding: "1rem" }}>     
      <h2>Encrypt</h2>
      <Encrypt />
      <h2 style={{ marginTop: "2rem" }}>Decrypt</h2>
      <Decrypt />     
    </div>
  );
}
