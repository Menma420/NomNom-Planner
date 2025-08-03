import { CACHE_TTL } from '@/lib/redis';

describe('CACHE_TTL', () => {
  it('should have correct TTL values', () => {
    expect(CACHE_TTL.SHORT).toBe(300);    // 5 minutes
    expect(CACHE_TTL.MEDIUM).toBe(1800);  // 30 minutes
    expect(CACHE_TTL.LONG).toBe(3600);    // 1 hour
    expect(CACHE_TTL.DAY).toBe(86400);    // 24 hours
  });
}); 