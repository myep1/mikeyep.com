// Crypto.jsx
import Encrypter from "./Encrypter";
import Decrypter from "./Decrypter";
import SecretKey from "./SecretKey";

export default function Crypto() {
  return (
    <div>
      <SecretKey
          salt="00:01:02:03:04:05:06:07:ff:07:06"
          iv="00:01:02:03:04:05:06:07:ff:07:06:05:05:04:03:02"
      />
      <Encrypter>Hello world</Encrypter>
      <Decrypter> 
  @aes256gcm$pbkdf2$100000$yvIX2G2E8buYgsovVXpP5w==
  $xBvtT2+kA+7kP/Xk$Xmq9lE3qTTl05No97etaEuTtk0VVN9LwYfJd1SGhdy0UzarW3qEC/cpvDFiczkxutIjTVFouZBWo/3addViTZ63Zuoc/dkjMj0ObeFocKayOJ14eynnNv3goF8Eg50fYdudZ/8Yi/G99RFjptI5wai8pz0k411IYg+NdXhMWlO+qtu5sx0eOHe4IAgdyg/kY1+ibdO4qKGZrJ1@aln9GjTVUZi9niMs2RMNuUZYmxd1pRwrCcQ7O57hRMt3Ye09/HLiEadFuyAYTCKVpzn7eSd8ZZLRwLAE91Gc4SGwpNn/EuM6tXnif4Q4mrPx3ip0DITwp3QJD3fdYJe/v11MK1e4fHpJEFCyF31q8C/0zAThD70rJiSFYJT9FHKQKufl4+424dftl6M/zwDmAhDBq5yfG+n/5sBHN+1QfvNruteKbn+tqXLjN1LBpdAIT/pTSDCaLcRyaejoVmoYGyVr0RSrDikcOwVzCCiC526wLCuGm7e+925yCBnWoFjQeah1Xljv088uJ6BxBBR+lv/Vo248TDQbKKYqNZD6ZMdk332Eh4Yn6OwBOL3OveL1ypZTGnlQnGabAcPWAHaViU3klFzqbs2UdRQRf6o2cCVqwvfzRl0tmzRROGTB4RQWiHw3RSgYQoL+wAmFa5Gabvn1AExPL3oTvqTn2pQgumUQLajNfdWGB3YsetfmvFCFg==
      </Decrypter>
    </div>
  );
}
