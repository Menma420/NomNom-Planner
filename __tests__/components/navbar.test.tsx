import { render, screen } from '@testing-library/react'
import NavBar from '@/components/navbar'

// Create a mock useUser function
const mockUseUser = jest.fn()

// Mock Clerk components
jest.mock('@clerk/nextjs', () => ({
  SignedIn: ({ children }: { children: React.ReactNode }) => <div data-testid="signed-in">{children}</div>,
  SignedOut: ({ children }: { children: React.ReactNode }) => <div data-testid="signed-out">{children}</div>,
  SignOutButton: ({ children }: { children: React.ReactNode }) => <div data-testid="sign-out-button">{children}</div>,
  useUser: () => mockUseUser(),
}))

describe('NavBar', () => {
  beforeEach(() => {
    mockUseUser.mockReturnValue({
      isLoaded: true,
      isSignedIn: false,
      user: null,
    })
  })

  it('renders without crashing', () => {
    render(<NavBar />)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('displays the logo', () => {
    render(<NavBar />)
    expect(screen.getByAltText('logo')).toBeInTheDocument()
  })

  it('shows signed out content when user is not signed in', () => {
    render(<NavBar />)
    expect(screen.getByTestId('signed-out')).toBeInTheDocument()
    expect(screen.getByText('Sign Up')).toBeInTheDocument()
  })

  it('shows signed in content when user is signed in', () => {
    mockUseUser.mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
      user: { imageUrl: 'test-image.jpg' },
    })

    render(<NavBar />)
    expect(screen.getByTestId('signed-in')).toBeInTheDocument()
    expect(screen.getByText('MealPlan')).toBeInTheDocument()
  })
}) 