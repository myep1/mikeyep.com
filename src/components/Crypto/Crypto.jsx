// Crypto.jsx
import Encrypter from "./Encrypter";
import Decrypter from "./Decrypter";
import BIP39SelectorSet from "./BIP39/BIP39SelectorSet";
import { Buffer } from 'buffer';
import * as bip39 from 'bip39';


export default function Crypto() {
  window.Buffer = Buffer;
  const handleComplete = (words) => {
    const mnemonic = words.join(' ');
    console.log("Mnemonic:", mnemonic);
    const entropy = bip39.mnemonicToEntropy(mnemonic); // hex string
    const bits = BigInt('0x' + entropy).toString(2).padStart(entropy.length * 4, '0');
    console.log(bits);
  };
  
  return (
    <div style={{ padding: "1rem" }}>
      <h2>Encrypt</h2>
      <Encrypter />

      <h2 style={{ marginTop: "2rem" }}>Decrypt</h2>
      <Decrypter />

      <h2 style={{ marginTop: "2rem" }}>BIP39 Test</h2>
      <BIP39SelectorSet
        count={12}
        onComplete={(words) => handleComplete(words)}
      /> 
    </div>
  );
}
