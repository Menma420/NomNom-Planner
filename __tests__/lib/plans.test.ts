import { availablePlans } from '@/lib/plans'

describe('Plans', () => {
  it('should have the correct structure for each plan', () => {
    availablePlans.forEach((plan) => {
      expect(plan).toHaveProperty('name')
      expect(plan).toHaveProperty('amount')
      expect(plan).toHaveProperty('currency')
      expect(plan).toHaveProperty('interval')
      expect(plan).toHaveProperty('description')
      expect(plan).toHaveProperty('features')
      expect(Array.isArray(plan.features)).toBe(true)
    })
  })

  it('should have unique names for each plan', () => {
    const names = availablePlans.map((plan) => plan.name)
    const uniqueNames = new Set(names)
    expect(uniqueNames.size).toBe(names.length)
  })

  it('should have valid amount values', () => {
    availablePlans.forEach((plan) => {
      expect(typeof plan.amount).toBe('number')
      expect(plan.amount).toBeGreaterThan(0)
    })
  })

  it('should have at least one feature per plan', () => {
    availablePlans.forEach((plan) => {
      expect(plan.features.length).toBeGreaterThan(0)
    })
  })

  it('should have valid currency values', () => {
    availablePlans.forEach((plan) => {
      expect(plan.currency).toBe('USD')
    })
  })
}) 