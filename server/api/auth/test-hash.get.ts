import {
  hashPasswordPBKDF2,
  verifyPasswordPBKDF2,
} from "~~/server/utils/password";

export default defineEventHandler(async () => {
  const testPassword = "123123";

  // Hash the password with PBKDF2
  const hashedPassword = await hashPasswordPBKDF2(testPassword);

  // Verify immediately
  const verifyResult = await verifyPasswordPBKDF2(hashedPassword, testPassword);

  // Try with wrong password
  const wrongVerifyResult = await verifyPasswordPBKDF2(
    hashedPassword,
    "wrongpassword",
  );

  return {
    originalPassword: testPassword,
    hashedPassword: hashedPassword,
    verifyWithCorrectPassword: verifyResult,
    verifyWithWrongPassword: wrongVerifyResult,
    hashLength: hashedPassword.length,
  };
});
