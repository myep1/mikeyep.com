import { useState, useEffect } from "react";

export default function SecretKey({ onPassword, preset }) {
  const [password, setPassword] = useState(preset || "");
  const [show, setShow] = useState(false);

 useEffect(() => {
  if (!password) return;

  const derive = async () => {
    // ...derive key
    onKeyReady?.({ key, salt, iv });
  };

  derive();
}, [password, salt, iv, onKeyReady]);


  // if preset is provided, skip rendering UI
  if (preset) return null;

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
