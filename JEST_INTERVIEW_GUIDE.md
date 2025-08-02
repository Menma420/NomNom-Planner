# Jest Interview Preparation Guide

## 🎯 **What is Jest?**

Jest is a JavaScript testing framework developed by Facebook. It's the most popular testing framework for React applications and provides:
- **Test Runner**: Executes your tests
- **Assertion Library**: Built-in expect() functions
- **Mocking**: Built-in mocking capabilities
- **Coverage**: Code coverage reporting
- **Watch Mode**: Re-runs tests when files change

---

## 📚 **Core Concepts**

### 1. **Test Structure**
```javascript
describe('Test Suite Name', () => {
  it('should do something specific', () => {
    // Test code here
    expect(result).toBe(expectedValue);
  });
});
```

**Real Example from Your Project:**
```typescript
describe('Plans', () => {
  it('should have the correct structure for each plan', () => {
    availablePlans.forEach((plan) => {
      expect(plan).toHaveProperty('name');
      expect(plan).toHaveProperty('amount');
    });
  });
});
```

### 2. **Assertions (Matchers)**

#### **Basic Matchers**
```javascript
// Exact equality
expect(value).toBe(expected);
expect(value).toEqual(expected);

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();

// Numbers
expect(value).toBeGreaterThan(3);
expect(value).toBeLessThan(5);
expect(value).toBeCloseTo(0.3);

// Strings
expect(value).toMatch(/regex/);
expect(value).toContain('substring');

// Arrays
expect(array).toContain(item);
expect(array).toHaveLength(3);

// Objects
expect(object).toHaveProperty('key');
expect(object).toEqual(expect.objectContaining({key: 'value'}));
```

**Real Example:**
```typescript
// From your plans.test.ts
expect(plan.amount).toBeGreaterThan(0);
expect(plan.currency).toBe('USD');
expect(plan.features).toHaveLength(3);
```

### 3. **Setup and Teardown**
```javascript
describe('Test Suite', () => {
  beforeAll(() => {
    // Runs once before all tests
  });

  beforeEach(() => {
    // Runs before each test
  });

  afterEach(() => {
    // Runs after each test
  });

  afterAll(() => {
    // Runs once after all tests
  });
});
```

---

## 🧪 **Testing React Components**

### **Basic Component Test**
```typescript
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### **Testing User Interactions**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

describe('Button Component', () => {
  it('handles click events', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    
    render(<button onClick={handleClick}>Click me</button>);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

**Real Example from Your Project:**
```typescript
// From navbar.test.tsx
describe('NavBar', () => {
  it('shows signed out content when user is not signed in', () => {
    render(<NavBar />);
    expect(screen.getByTestId('signed-out')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });
});
```

---

## 🎭 **Mocking**

### **Function Mocking**
```javascript
// Mock a function
const mockFunction = jest.fn();
mockFunction.mockReturnValue('mocked value');
mockFunction.mockResolvedValue('async mocked value');

// Mock implementation
jest.fn(() => 'mocked implementation');
```

### **Module Mocking**
```javascript
// Mock entire module
jest.mock('./api', () => ({
  fetchData: jest.fn(() => Promise.resolve({ data: 'test' }))
}));

// Mock specific functions
jest.mock('@clerk/nextjs', () => ({
  useUser: () => ({ isSignedIn: false, user: null }),
  SignedIn: ({ children }) => <div data-testid="signed-in">{children}</div>
}));
```

**Real Example from Your Project:**
```typescript
// From navbar.test.tsx
const mockUseUser = jest.fn();

jest.mock('@clerk/nextjs', () => ({
  SignedIn: ({ children }: { children: React.ReactNode }) => 
    <div data-testid="signed-in">{children}</div>,
  useUser: () => mockUseUser(),
}));

beforeEach(() => {
  mockUseUser.mockReturnValue({
    isLoaded: true,
    isSignedIn: false,
    user: null,
  });
});
```

### **Spy vs Mock**
```javascript
// Spy - watches real function
const spy = jest.spyOn(console, 'log');

// Mock - replaces function
const mock = jest.fn();
```

---

## 🔧 **Jest Configuration**

### **jest.config.js Structure**
```javascript
module.exports = {
  testEnvironment: 'jsdom',        // For React testing
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',   // Path aliases
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

**Your Project's Config:**
```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
  ],
};

module.exports = createJestConfig(customJestConfig);
```

---

## 📊 **Coverage**

### **Coverage Types**
- **Statements**: Percentage of statements executed
- **Branches**: Percentage of branches executed (if/else)
- **Functions**: Percentage of functions called
- **Lines**: Percentage of lines executed

### **Running Coverage**
```bash
npm test -- --coverage
```

### **Coverage Configuration**
```javascript
collectCoverageFrom: [
  'src/**/*.{js,jsx,ts,tsx}',
  '!src/**/*.d.ts',
  '!src/**/*.stories.{js,jsx,ts,tsx}',
],
coverageThreshold: {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80,
  },
},
```

---

## 🚀 **Advanced Concepts**

### **Async Testing**
```javascript
// Promise-based
it('async test', async () => {
  const data = await fetchData();
  expect(data).toEqual(expectedData);
});

// Callback-based
it('callback test', (done) => {
  fetchData((data) => {
    expect(data).toEqual(expectedData);
    done();
  });
});
```

### **Testing API Routes**
```typescript
import { NextRequest } from 'next/server';
import { GET } from '@/app/api/my-route/route';

describe('/api/my-route', () => {
  it('handles GET requests', async () => {
    const request = new NextRequest('http://localhost:3000/api/my-route');
    const response = await GET(request);
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('message');
  });
});
```

### **Testing Custom Hooks**
```typescript
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('increments counter', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });
});
```

---

## 🎯 **Interview Questions & Answers**

### **Q1: What is Jest and why use it?**
**A:** Jest is a JavaScript testing framework that provides:
- Zero configuration setup
- Built-in assertion library
- Mocking capabilities
- Code coverage
- Watch mode for development
- Snapshot testing
- Parallel test execution

### **Q2: What's the difference between `toBe()` and `toEqual()`?**
**A:** 
- `toBe()`: Uses `Object.is()` for exact equality (===)
- `toEqual()`: Deep equality comparison for objects/arrays

```javascript
expect(5).toBe(5);           // ✅
expect({a: 1}).toBe({a: 1}); // ❌ (different objects)
expect({a: 1}).toEqual({a: 1}); // ✅
```

### **Q3: How do you mock external dependencies?**
**A:** Use `jest.mock()`:
```javascript
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: 'mocked' }))
}));
```

### **Q4: What are the different types of mocks?**
**A:**
- **jest.fn()**: Mock functions
- **jest.spyOn()**: Spy on existing functions
- **jest.mock()**: Mock entire modules
- **jest.doMock()**: Dynamic mocking

### **Q5: How do you test async code?**
**A:** Use `async/await` or `done` callback:
```javascript
// Async/await
it('async test', async () => {
  const result = await asyncFunction();
  expect(result).toBe(expected);
});

// Done callback
it('callback test', (done) => {
  asyncFunction((result) => {
    expect(result).toBe(expected);
    done();
  });
});
```

### **Q6: What is test coverage and why is it important?**
**A:** Test coverage measures how much of your code is tested:
- **Statements**: Lines of code executed
- **Branches**: Conditional paths taken
- **Functions**: Functions called
- **Lines**: Lines executed

Important because it helps identify untested code and ensures quality.

### **Q7: How do you debug Jest tests?**
**A:**
```javascript
// Console.log
console.log('Debug info');

// Debugger statement
debugger;

// Verbose output
npm test -- --verbose

// Run specific test
npm test -- --testNamePattern="My Test"
```

### **Q8: What are the Jest lifecycle methods?**
**A:**
- `beforeAll()`: Runs once before all tests
- `beforeEach()`: Runs before each test
- `afterEach()`: Runs after each test
- `afterAll()`: Runs once after all tests

### **Q9: How do you test React components?**
**A:** Use React Testing Library:
```javascript
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

render(<MyComponent />);
expect(screen.getByText('Hello')).toBeInTheDocument();
await userEvent.click(button);
```

### **Q10: What's the difference between unit, integration, and e2e tests?**
**A:**
- **Unit**: Test individual functions/components in isolation
- **Integration**: Test how components work together
- **E2E**: Test entire user workflows (Cypress, Playwright)

---

## 🛠 **Common Jest Commands**

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- MyComponent.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="button"

# Run with coverage
npm test -- --coverage

# Run with verbose output
npm test -- --verbose

# Run tests in parallel
npm test -- --maxWorkers=4
```

---

## 📝 **Best Practices**

1. **Test Behavior, Not Implementation**
   ```javascript
   // ❌ Bad - testing implementation
   expect(component.state.count).toBe(1);
   
   // ✅ Good - testing behavior
   expect(screen.getByText('Count: 1')).toBeInTheDocument();
   ```

2. **Use Descriptive Test Names**
   ```javascript
   // ❌ Bad
   it('works', () => {});
   
   // ✅ Good
   it('should increment counter when increment button is clicked', () => {});
   ```

3. **Follow AAA Pattern (Arrange, Act, Assert)**
   ```javascript
   it('should add two numbers', () => {
     // Arrange
     const a = 2;
     const b = 3;
     
     // Act
     const result = add(a, b);
     
     // Assert
     expect(result).toBe(5);
   });
   ```

4. **Keep Tests Independent**
   ```javascript
   // ❌ Bad - tests depend on each other
   let counter = 0;
   
   it('should increment', () => {
     counter++;
     expect(counter).toBe(1);
   });
   
   it('should increment again', () => {
     counter++;
     expect(counter).toBe(2); // Depends on previous test
   });
   ```

5. **Use Setup and Teardown**
   ```javascript
   describe('User API', () => {
     beforeEach(() => {
       // Reset database
       // Clear mocks
     });
     
     afterEach(() => {
       // Cleanup
     });
   });
   ```

---

## 🎯 **Your Project Examples**

### **Component Testing (Navbar)**
```typescript
// __tests__/components/navbar.test.tsx
describe('NavBar', () => {
  it('renders without crashing', () => {
    render(<NavBar />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
```

### **Utility Testing (Plans)**
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

### **Mock Testing (getPriceIDFromType)**
```typescript
// __tests__/lib/getPriceIDFromType.test.ts
jest.mock('@/lib/plans', () => ({
  getPriceIDFromType: (planType: string) => {
    const priceIDMap = {
      week: 'price_weekly_test',
      month: 'price_monthly_test',
      year: 'price_yearly_test',
    };
    return priceIDMap[planType];
  }
}));
```

---

## 🚀 **Quick Reference**

### **Common Matchers**
```javascript
expect(value).toBe(expected);
expect(value).toEqual(expected);
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();
expect(value).toBeGreaterThan(3);
expect(value).toBeLessThan(5);
expect(value).toContain('item');
expect(value).toHaveLength(3);
expect(value).toHaveProperty('key');
expect(value).toMatch(/regex/);
```

### **Mock Functions**
```javascript
const mockFn = jest.fn();
mockFn.mockReturnValue('value');
mockFn.mockResolvedValue('async value');
mockFn.mockRejectedValue('error');
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith('arg');
expect(mockFn).toHaveBeenCalledTimes(1);
```

### **React Testing Library Queries**
```javascript
screen.getByText('text');
screen.getByRole('button');
screen.getByLabelText('label');
screen.getByTestId('test-id');
screen.getByPlaceholderText('placeholder');
screen.queryByText('text'); // Returns null if not found
screen.findByText('text'); // Async query
```

This guide covers everything you need to know for Jest technical interviews! 🎉 