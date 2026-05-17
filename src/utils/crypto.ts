export async function generatePaymentHash(
  cardNumber: string,
  email: string
): Promise<string> {
  // Step 1: Extract first 6 and last 4 digits
  const digits = cardNumber.replace(/\D/g, '');
  const first6 = digits.slice(0, 6);
  const last4 = digits.slice(-4);

  // Step 2: Concatenate
  const combined = first6 + last4;

  // Step 3: Reverse the 10-digit string
  const reversedDigits = combined.split('').reverse().join('');

  // Step 4: Reverse the email
  const reversedEmail = email.split('').reverse().join('');

  // Step 5: Build the message
  const message = reversedEmail + 'AXIPAYS' + reversedDigits;

  // Step 6: Convert to uppercase
  const uppercaseMessage = message.toUpperCase();

  // Step 7: Generate HMAC-SHA256 hash
  const secretKey = 'AXI2026';
  const hash = await hmacSHA256(uppercaseMessage, secretKey);

  return hash;
}

/**
 * HMAC-SHA256 implementation using Web Crypto API
 */
async function hmacSHA256(message: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(message);

  // Import the key
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  // Sign the message
  const signature = await crypto.subtle.sign('HMAC', key, messageData);

  // Convert to hex string (uppercase)
  const hashArray = Array.from(new Uint8Array(signature));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();

  return hashHex;
}
