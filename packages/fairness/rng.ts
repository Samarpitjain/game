import crypto from 'crypto';

/**
 * Stake-style Provably Fair RNG System
 * Uses HMAC-SHA256 with server seed, client seed, and nonce
 */

export interface SeedData {
  serverSeed: string;
  clientSeed: string;
  nonce: number;
  cursor?: number;
}

/**
 * Generate a cryptographically secure random server seed
 */
export function generateServerSeed(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Generate SHA256 hash of server seed (for client verification before reveal)
 */
export function hashServerSeed(serverSeed: string): string {
  return crypto.createHash('sha256').update(serverSeed).digest('hex');
}

/**
 * Generate default client seed
 */
export function generateClientSeed(): string {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Core byte generator using HMAC-SHA256
 * Returns hex string of HMAC output
 */
export function generateHmac(serverSeed: string, clientSeed: string, nonce: number, cursor: number = 0): string {
  const message = `${clientSeed}:${nonce}:${cursor}`;
  return crypto.createHmac('sha256', serverSeed).update(message).digest('hex');
}

/**
 * Byte generator - produces unlimited bytes using cursor system
 * @param seedData - Server seed, client seed, nonce, and cursor
 * @param count - Number of bytes needed
 * @returns Buffer of random bytes
 */
export function byteGenerator(seedData: SeedData, count: number): Buffer {
  const { serverSeed, clientSeed, nonce } = seedData;
  let cursor = seedData.cursor || 0;
  const bytes: number[] = [];

  while (bytes.length < count) {
    const hmac = generateHmac(serverSeed, clientSeed, nonce, cursor);
    const hmacBytes = Buffer.from(hmac, 'hex');
    
    for (let i = 0; i < hmacBytes.length && bytes.length < count; i++) {
      bytes.push(hmacBytes[i]);
    }
    
    cursor++;
  }

  return Buffer.from(bytes);
}

/**
 * Generate floats from bytes (0.0 to 1.0)
 * Uses 4 bytes per float for precision
 */
export function generateFloats(seedData: SeedData, count: number): number[] {
  const bytesNeeded = count * 4;
  const bytes = byteGenerator(seedData, bytesNeeded);
  const floats: number[] = [];

  for (let i = 0; i < count; i++) {
    const offset = i * 4;
    const value = bytes.readUInt32BE(offset);
    floats.push(value / 0x100000000); // Divide by 2^32 to get 0-1 range
  }

  return floats;
}

/**
 * Generate a single float (0.0 to 1.0)
 */
export function generateFloat(seedData: SeedData): number {
  return generateFloats(seedData, 1)[0];
}

/**
 * Fisher-Yates shuffle using provably fair RNG
 * Used for card games, mines, keno, etc.
 */
export function shuffle<T>(array: T[], seedData: SeedData): T[] {
  const result = [...array];
  const floats = generateFloats(seedData, result.length);

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(floats[result.length - 1 - i] * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

/**
 * Generate random integer in range [min, max] inclusive
 */
export function generateInt(seedData: SeedData, min: number, max: number): number {
  const float = generateFloat(seedData);
  return Math.floor(float * (max - min + 1)) + min;
}

/**
 * Generate multiple random integers
 */
export function generateInts(seedData: SeedData, count: number, min: number, max: number): number[] {
  const floats = generateFloats(seedData, count);
  return floats.map(f => Math.floor(f * (max - min + 1)) + min);
}

/**
 * Verify a bet result using seed data
 */
export function verifyResult(
  serverSeed: string,
  clientSeed: string,
  nonce: number,
  cursor: number = 0
): string {
  return generateHmac(serverSeed, clientSeed, nonce, cursor);
}

/**
 * Calculate house edge adjusted probability
 */
export function applyHouseEdge(winChance: number, houseEdge: number): number {
  return winChance * (1 - houseEdge / 100);
}

/**
 * Calculate multiplier from win chance
 */
export function calculateMultiplier(winChance: number, houseEdge: number = 1): number {
  const adjustedChance = applyHouseEdge(winChance, houseEdge);
  return adjustedChance > 0 ? (100 / adjustedChance) : 0;
}

/**
 * Calculate win chance from multiplier
 */
export function calculateWinChance(multiplier: number, houseEdge: number = 1): number {
  return (100 / multiplier) * (1 - houseEdge / 100);
}
