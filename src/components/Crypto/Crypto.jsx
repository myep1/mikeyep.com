// Crypto.jsx
import Encrypter from "./Encrypter";
import Decrypter from "./Decrypter";

export default function Crypto() {
  return (
    <div style={{ padding: "1rem" }}>
      <h2>Encrypt</h2>
      <Encrypter />

      <h2 style={{ marginTop: "2rem" }}>Decrypt</h2>
      <Decrypter />
    </div>
  );
}
