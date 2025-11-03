import CryptoJS from "crypto-js";

const SECRET_KEY = "Jayaveerapandia"; // same key as backend

export const encryptPassword = (plainText) => {
  const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
  const iv = CryptoJS.lib.WordArray.random(16); // random IV like in C#

  const encrypted = CryptoJS.AES.encrypt(plainText, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  // Combine IV + ciphertext (like backend)
  const combined = iv.concat(encrypted.ciphertext);

  // Return Base64 string
  return CryptoJS.enc.Base64.stringify(combined);
};
