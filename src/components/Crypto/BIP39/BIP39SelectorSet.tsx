// BIP39SelectorSet.tsx
import React from "react";
import "./BIP39SelectorSet.css";
import BIP39Selector from "./BIP39Selector";

type Count = 12 | 24;
interface Props {
  count?: Count;
  values?: string[];
  onChange?: (index: number, word: string) => void;
}

const BIP39SelectorSet: React.FC<Props> = ({ count = 12, values = [], onChange }) => {
  const handleSelect = (index: number, word: string) => onChange?.(index, word);

  return (
    <div className="bip39-grid">
      {Array.from({ length: count }).map((_, i) => (
        <BIP39Selector key={i} index={i} value={values[i] || ""} onChange={handleSelect} />
      ))}
    </div>
  );
};

export default BIP39SelectorSet;
