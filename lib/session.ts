const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

type SessionPayload = {
  authenticated: true;
  exp: number;
};

function bytesToBase64Url(bytes: Uint8Array): string {
  const binary = Array.from(bytes, (b) => String.fromCharCode(b)).join('');
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlToBytes(input: string): Uint8Array {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(input.length / 4) * 4, '=');
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function createHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

export async function createSessionToken(secret: string): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload: SessionPayload = {
    authenticated: true,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };

  const headerPart = bytesToBase64Url(new TextEncoder().encode(JSON.stringify(header)));
  const payloadPart = bytesToBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const unsignedToken = `${headerPart}.${payloadPart}`;

  const key = await createHmacKey(secret);
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(unsignedToken));

  return `${unsignedToken}.${bytesToBase64Url(new Uint8Array(signature))}`;
}

export async function verifySessionToken(token: string | undefined, secret: string): Promise<boolean> {
  if (!token) return false;

  const parts = token.split('.');
  if (parts.length !== 3) return false;

  const [headerPart, payloadPart, signaturePart] = parts;
  const unsignedToken = `${headerPart}.${payloadPart}`;

  const key = await createHmacKey(secret);
  const isValidSignature = await crypto.subtle.verify(
    'HMAC',
    key,
    toArrayBuffer(base64UrlToBytes(signaturePart)),
    new TextEncoder().encode(unsignedToken)
  );

  if (!isValidSignature) return false;

  try {
    const payloadJson = new TextDecoder().decode(base64UrlToBytes(payloadPart));
    const payload = JSON.parse(payloadJson) as Partial<SessionPayload>;

    if (payload.authenticated !== true || typeof payload.exp !== 'number') {
      return false;
    }

    return payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}
