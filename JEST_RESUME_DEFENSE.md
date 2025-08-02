# Jest Resume Defense Guide

## 🎯 **Your Resume Line: "Implemented TDD (Jest) with 90% coverage"**

### **What This Means:**
- **TDD**: Test-Driven Development - writing tests before code
- **Jest**: JavaScript testing framework
- **90% coverage**: 90% of your code is tested

---

## 🚀 **Quick Jest Fundamentals**

### **Basic Test Structure**
```javascript
describe('Component/Function Name', () => {
  it('should do something specific', () => {
    // Test code
    expect(result).toBe(expectedValue);
  });
});
```

### **Common Assertions**
```javascript
expect(value).toBe(expected);           // Exact equality
expect(value).toEqual(expected);        // Deep equality
expect(value).toBeTruthy();            // Truthy check
expect(value).toBeFalsy();             // Falsy check
expect(array).toHaveLength(3);         // Array length
expect(object).toHaveProperty('key');  // Object property
```

### **Mocking (Essential)**
```javascript
// Mock function
const mockFn = jest.fn();
mockFn.mockReturnValue('mocked value');

// Mock module
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: 'test' }))
}));
```

---

## 💼 **Interview Questions & Answers**

### **Q1: "Tell me about the testing setup you implemented"**

**A:** "I set up Jest with React Testing Library for our Next.js project. The setup includes:
- Jest configuration for TypeScript and Next.js
- React Testing Library for component testing
- Coverage reporting with 90% threshold
- Mocking for external dependencies like Clerk authentication
- TDD workflow where we write tests first, then implement features"

**Show them your config:**
```javascript
// jest.config.js
const nextJest = require('next/jest');
const createJestConfig = nextJest({ dir: './' });

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/$1' },
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
  ],
};
```

### **Q2: "How did you achieve 90% coverage?"**

**A:** "I focused on testing:
- **Components**: User interactions, rendering, props
- **Utility functions**: Business logic, data validation
- **API routes**: Request/response handling
- **Edge cases**: Error states, boundary conditions

I used coverage reports to identify untested code and prioritized critical business logic."

### **Q3: "What's TDD and how did you implement it?"**

**A:** "TDD is Test-Driven Development - writing tests before code. My workflow:
1. **Red**: Write failing test for new feature
2. **Green**: Write minimal code to pass test
3. **Refactor**: Clean up code while keeping tests green

Example from our project:"
```javascript
// 1. Write test first
it('should validate plan amounts', () => {
  expect(validatePlan({ amount: -1 })).toBe(false);
  expect(validatePlan({ amount: 10 })).toBe(true);
});

// 2. Implement function
function validatePlan(plan) {
  return plan.amount > 0;
}
```

### **Q4: "Show me a test you wrote"**

**A:** "Here's a component test from our navbar:"
```typescript
describe('NavBar', () => {
  it('shows sign up button when user is not signed in', () => {
    render(<NavBar />);
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });
});
```

### **Q5: "How do you mock external dependencies?"**

**A:** "I use jest.mock() for external libraries. Example:"
```javascript
jest.mock('@clerk/nextjs', () => ({
  useUser: () => ({ isSignedIn: false, user: null }),
  SignedIn: ({ children }) => <div data-testid="signed-in">{children}</div>
}));
```

### **Q6: "What testing challenges did you face?"**

**A:** "Main challenges:
- **Async testing**: Used async/await for API calls
- **Component mocking**: Mocked Next.js components like Image and Link
- **State management**: Tested user interactions with userEvent
- **External APIs**: Mocked Stripe and Clerk integrations

I solved these by reading Jest docs and using React Testing Library best practices."

### **Q7: "How do you run tests?"**

**A:** "I use these commands:
```bash
npm test              # Run all tests
npm run test:watch    # Watch mode for development
npm run test:coverage # Generate coverage report
```

### **Q8: "What's the difference between unit and integration tests?"**

**A:** "In our project:
- **Unit tests**: Test individual functions/components in isolation
- **Integration tests**: Test how components work together

Example: Testing a utility function is unit, testing a form submission is integration."

---

## 🛠 **Your Project Examples (Memorize These)**

### **Component Test**
```typescript
// __tests__/components/navbar.test.tsx
describe('NavBar', () => {
  it('renders without crashing', () => {
    render(<NavBar />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
```

### **Utility Test**
```typescript
// __tests__/lib/plans.test.ts
describe('Plans', () => {
  it('should have valid amount values', () => {
    availablePlans.forEach((plan) => {
      expect(typeof plan.amount).toBe('number');
      expect(plan.amount).toBeGreaterThan(0);
    });
  });
});
```

### **Mock Test**
```typescript
// __tests__/lib/getPriceIDFromType.test.ts
jest.mock('@/lib/plans', () => ({
  getPriceIDFromType: (planType: string) => {
    const priceIDMap = {
      week: 'price_weekly_test',
      month: 'price_monthly_test',
    };
    return priceIDMap[planType];
  }
}));
```

---

## 📊 **Coverage Explanation**

### **What 90% Coverage Means:**
- **Statements**: 90% of code lines executed
- **Branches**: 90% of if/else paths tested
- **Functions**: 90% of functions called
- **Lines**: 90% of lines covered

### **How to Check Coverage:**
```bash
npm run test:coverage
```

---

## 🎯 **Key Points to Remember**

1. **Jest is Facebook's testing framework**
2. **TDD = Test First, Code Second**
3. **90% coverage = 90% of code tested**
4. **React Testing Library for component testing**
5. **jest.mock() for external dependencies**
6. **Coverage reports help identify untested code**

---

## 🚨 **If You Don't Know Something**

**Honest Answer:** "I'm still learning Jest. I know the basics like writing tests, mocking, and running coverage reports. I can show you what I've implemented in our project, but I'm always eager to learn more advanced concepts."

**Then show them your actual tests and config files.**

---

## 💡 **Pro Tips for Interview**

1. **Show your actual code** - Have your test files ready
2. **Explain the business value** - "Tests catch bugs before production"
3. **Mention CI/CD** - "Tests run automatically on every commit"
4. **Talk about team benefits** - "Other developers can confidently refactor code"
5. **Be honest about limitations** - "I'm still learning advanced Jest features"

**Remember: You implemented real tests in a real project. That's valuable experience!** 🎉 