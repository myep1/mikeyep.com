import { useState } from "react";
export default function Encryption() {
  const [keyInfo, setKeyInfo] = useState(null);

  return (
    <AES256GCM onKeyReady={setKeyInfo}>
      {keyInfo && (
        <div>
          Key, salt, and IV ready!
          {/* You can now render encrypt/decrypt buttons, etc. */}
        </div>
      )}
    </AES256GCM>
  );
}
