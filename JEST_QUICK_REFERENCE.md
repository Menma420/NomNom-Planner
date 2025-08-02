# Jest Quick Reference - Interview Edition

## 🎯 **Your Resume Line**
**"Implemented TDD (Jest) with 90% coverage"**

---

## 💼 **Top 5 Interview Questions**

### **1. "What is Jest?"**
**Answer:** "Jest is Facebook's JavaScript testing framework. It provides test running, assertions, mocking, and coverage reporting. I used it with React Testing Library for our Next.js project."

### **2. "What is TDD?"**
**Answer:** "Test-Driven Development - writing tests before code. Red-Green-Refactor cycle: write failing test, write code to pass, refactor."

### **3. "How did you achieve 90% coverage?"**
**Answer:** "I tested components, utility functions, API routes, and edge cases. Used coverage reports to identify untested code and prioritized business logic."

### **4. "Show me a test you wrote"**
**Answer:** "Here's a component test:"
```typescript
describe('NavBar', () => {
  it('shows sign up button when user is not signed in', () => {
    render(<NavBar />);
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });
});
```

### **5. "How do you mock dependencies?"**
**Answer:** "I use jest.mock() for external libraries:"
```javascript
jest.mock('@clerk/nextjs', () => ({
  useUser: () => ({ isSignedIn: false, user: null })
}));
```

---

## 🚀 **Essential Commands**
```bash
npm test              # Run tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

---

## 📝 **Key Assertions**
```javascript
expect(value).toBe(expected);           // Exact equality
expect(value).toEqual(expected);        // Deep equality
expect(value).toBeTruthy();            // Truthy
expect(array).toHaveLength(3);         // Array length
expect(object).toHaveProperty('key');  // Object property
```

---

## 🎭 **Mocking Examples**
```javascript
// Mock function
const mockFn = jest.fn();
mockFn.mockReturnValue('value');

// Mock module
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: 'test' }))
}));
```

---

## 📊 **Coverage Types**
- **Statements**: Lines of code executed
- **Branches**: If/else paths tested  
- **Functions**: Functions called
- **Lines**: Lines covered

---

## 🛠 **Your Project Setup**
- Jest + React Testing Library
- TypeScript support
- Next.js integration
- Coverage reporting
- Mocking for external APIs

**Remember: You have real tests in a real project. That's valuable!** 🎉 