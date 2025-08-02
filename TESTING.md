# Testing with Jest

This project uses Jest for testing with React Testing Library for component testing.

## Setup

The project is already configured with Jest. The following files are set up:

- `jest.config.js` - Jest configuration
- `jest.setup.js` - Jest setup file with common mocks
- `__tests__/` - Test files directory

## Available Scripts

```bash
# Run all tests
npm test

# Run tests in watch mode (recommended for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Writing Tests

### Component Tests

Test files should be placed in the `__tests__` directory and follow the naming convention: `*.test.tsx` for components and `*.test.ts` for utilities.

Example component test:

```tsx
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import MyComponent from '@/components/MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('handles user interactions', async () => {
    const user = userEvent.setup()
    render(<MyComponent />)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    expect(screen.getByText('Clicked!')).toBeInTheDocument()
  })
})
```

### API Route Tests

For testing API routes, you can import the route handlers directly:

```tsx
import { NextRequest } from 'next/server'
import { GET, POST } from '@/app/api/my-route/route'

describe('/api/my-route', () => {
  it('handles GET requests', async () => {
    const request = new NextRequest('http://localhost:3000/api/my-route')
    const response = await GET(request)
    
    expect(response.status).toBe(200)
  })
})
```

### Utility Function Tests

For testing utility functions:

```tsx
import { myUtilityFunction } from '@/lib/my-utility'

describe('myUtilityFunction', () => {
  it('returns expected result', () => {
    const result = myUtilityFunction('input')
    expect(result).toBe('expected output')
  })
})
```

## Common Mocks

The following mocks are already set up in `jest.setup.js`:

- **Next.js Router**: `useRouter`, `useSearchParams`, `usePathname`
- **Next.js Image**: `next/image` component
- **Environment Variables**: Common env vars for testing

## Adding Custom Mocks

To mock external libraries or components, add them to your test file:

```tsx
// Mock external library
jest.mock('@clerk/nextjs', () => ({
  useUser: () => ({ isSignedIn: false, user: null }),
  UserButton: () => <div>User Button</div>,
}))

// Mock API calls
jest.mock('@/lib/api', () => ({
  fetchData: jest.fn(() => Promise.resolve({ data: 'test' })),
}))
```

## Testing Best Practices

1. **Test Behavior, Not Implementation**: Focus on what the component does, not how it does it
2. **Use Semantic Queries**: Prefer `getByRole`, `getByLabelText` over `getByTestId`
3. **Test User Interactions**: Use `userEvent` for simulating user actions
4. **Keep Tests Simple**: Each test should have a single responsibility
5. **Use Descriptive Names**: Test names should clearly describe what is being tested

## Coverage

The project is configured to collect coverage for:
- `app/**/*.{js,jsx,ts,tsx}`
- `components/**/*.{js,jsx,ts,tsx}`
- `lib/**/*.{js,jsx,ts,tsx}`

Coverage thresholds are set to 70% for branches, functions, lines, and statements.

## Debugging Tests

To debug tests, you can:

1. Use `console.log` in your tests
2. Use the `--verbose` flag: `npm test -- --verbose`
3. Use `debugger` statements in your test code
4. Run a single test file: `npm test -- __tests__/my-test.test.tsx` 