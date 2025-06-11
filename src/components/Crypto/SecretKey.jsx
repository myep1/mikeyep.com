import { useState, useEffect } from "react";

export default function SecretKey({ onPassword, preset, children }) {
  const raw = (children || "").toString().trim();
  const [password, setPassword] = useState(preset || raw || "");
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (password) onPassword(password);
  }, [password, onPassword]);

  if (preset || raw) return null;

  return (
    <div style={{ display: "flex", marginBottom: "0.5rem" }}>
      <input
        type={show ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
        style={{ flex: 1 }}
      />
      <button onClick={() => setShow((s) => !s)}>{show ? "👁️" : "🔒"}</button>
    </div>
  );
}
