/**
 * Cloudflare Workers uyumlu şifre hash'leme ve doğrulama fonksiyonları
 * PBKDF2 algoritması kullanır (Web Crypto API tarafından desteklenir)
 */

const ITERATIONS = 100000;
const KEY_LENGTH = 64;
const ALGORITHM = "PBKDF2";

/**
 * Rastgele salt oluşturur
 */
function generateSalt(length: number = 16): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length));
}

/**
 * ArrayBuffer'ı hex string'e dönüştürür
 */
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Hex string'i Uint8Array'e dönüştürür
 */
function hexToBuffer(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Şifreyi PBKDF2 ile hash'ler
 * Format: $pbkdf2$iterations$salt$hash
 */
export async function hashPasswordPBKDF2(password: string): Promise<string> {
  const salt = generateSalt();
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  // Import password as key
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    passwordBuffer,
    ALGORITHM,
    false,
    ["deriveBits"],
  );

  // Derive bits using PBKDF2
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: ALGORITHM,
      salt: salt.buffer as ArrayBuffer,
      iterations: ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    KEY_LENGTH * 8,
  );

  const saltHex = bufferToHex(salt.buffer as ArrayBuffer);
  const hashHex = bufferToHex(derivedBits);

  return `$pbkdf2$${ITERATIONS}$${saltHex}$${hashHex}`;
}

/**
 * Hash'lenmiş şifreyi doğrular
 */
export async function verifyPasswordPBKDF2(
  hashedPassword: string,
  password: string,
): Promise<boolean> {
  try {
    // Parse the hash format: $pbkdf2$iterations$salt$hash
    const parts = hashedPassword.split("$");
    if (parts.length !== 5 || parts[1] !== "pbkdf2") {
      return false;
    }

    const iterations = parseInt(parts[2], 10);
    const salt = hexToBuffer(parts[3]);
    const storedHash = parts[4];

    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);

    // Import password as key
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      passwordBuffer,
      ALGORITHM,
      false,
      ["deriveBits"],
    );

    // Derive bits using PBKDF2
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: ALGORITHM,
        salt: salt.buffer as ArrayBuffer,
        iterations: iterations,
        hash: "SHA-256",
      },
      keyMaterial,
      KEY_LENGTH * 8,
    );

    const computedHash = bufferToHex(derivedBits);

    // Constant-time comparison to prevent timing attacks
    if (computedHash.length !== storedHash.length) {
      return false;
    }

    let result = 0;
    for (let i = 0; i < computedHash.length; i++) {
      result |= computedHash.charCodeAt(i) ^ storedHash.charCodeAt(i);
    }

    return result === 0;
  } catch {
    return false;
  }
}
