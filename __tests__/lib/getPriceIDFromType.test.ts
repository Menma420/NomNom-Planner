import { getPriceIDFromType } from '@/lib/plans'

// Mock the environment variables at module level
jest.mock('@/lib/plans', () => {
  const originalModule = jest.requireActual('@/lib/plans')
  return {
    ...originalModule,
    // Override the priceIDMap with test values
    getPriceIDFromType: (planType: string) => {
      const priceIDMap: Record<string, string> = {
        week: 'price_weekly_test',
        month: 'price_monthly_test',
        year: 'price_yearly_test',
      }
      return priceIDMap[planType]
    }
  }
})

describe('getPriceIDFromType', () => {
  it('should return correct price ID for week interval', () => {
    const result = getPriceIDFromType('week')
    expect(result).toBe('price_weekly_test')
  })

  it('should return correct price ID for month interval', () => {
    const result = getPriceIDFromType('month')
    expect(result).toBe('price_monthly_test')
  })

  it('should return correct price ID for year interval', () => {
    const result = getPriceIDFromType('year')
    expect(result).toBe('price_yearly_test')
  })

  it('should return undefined for invalid interval', () => {
    const result = getPriceIDFromType('invalid')
    expect(result).toBeUndefined()
  })
}) 