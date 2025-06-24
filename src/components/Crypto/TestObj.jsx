import { useState } from "react";
import SecretKey2 from "./SecretKey2";
import Encrypt from "./Encrypt";
import Decrypt from "./Decrypt";

export default function TestObj() {
  const [keyInfo, setKeyInfo] = useState(null);

  return (
    <div> {/*AES256-CFB test vectors*/}		
      <SecretKey2       
        IV="000102030405060708090A0B0C0D0E0F"
        onReady={setKeyInfo}
      >603DEB1015CA71BE2B73AEF0857D77811F352C073B6108D72D9810A30914DFF4</SecretKey2>
      {keyInfo && (
        <>
          <Encrypt keyInfo={keyInfo}>6BC1BEE22E409F96E93D7E117393172A</Encrypt>
          <Decrypt keyInfo={keyInfo}>@aes256cfb$raw$0$DC7E84BFDA79164B7ECD8486985D3860</Decrypt>
        </>
      )}
       <SecretKey2        
        IV="DC7E84BFDA79164B7ECD8486985D3860"
        onReady={setKeyInfo}
      >603DEB1015CA71BE2B73AEF0857D77811F352C073B6108D72D9810A30914DFF4</SecretKey2>
      {keyInfo && (
        <>
          <Encrypt keyInfo={keyInfo}>AE2D8A571E03AC9C9EB76FAC45AF8E51</Encrypt>
          <Decrypt keyInfo={keyInfo}>@aes256cfb$raw$0$39FFED143B28B1C832113C6331E5407B</Decrypt>
        </>
      )}
       <SecretKey2       
        IV="39FFED143B28B1C832113C6331E5407B"
        onReady={setKeyInfo}
      >603DEB1015CA71BE2B73AEF0857D77811F352C073B6108D72D9810A30914DFF4</SecretKey2>
      {keyInfo && (
        <>
          <Encrypt keyInfo={keyInfo}>30C81C46A35CE411E5FBC1191A0A52EF</Encrypt>
          <Decrypt keyInfo={keyInfo}>@aes256cfb$raw$0$DF10132415E54B92A13ED0A8267AE2F9</Decrypt>
        </>
      )}
       <SecretKey2      
        IV="DF10132415E54B92A13ED0A8267AE2F9"
        onReady={setKeyInfo}
      >603DEB1015CA71BE2B73AEF0857D77811F352C073B6108D72D9810A30914DFF4</SecretKey2>
      {keyInfo && (
        <>
          <Encrypt keyInfo={keyInfo}>F69F2445DF4F9B17AD2B417BE66C3710</Encrypt>
          <Decrypt keyInfo={keyInfo}>@aes256cfb$raw$0$75A385741AB9CEF82031623D55B1E471</Decrypt>
        </>
      )}
    </div>
  );

   	
			
	
}
