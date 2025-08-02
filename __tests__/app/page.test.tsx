import { render, screen } from '@testing-library/react'
import Page from '@/app/page'

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
})

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<Page />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('displays call to action buttons', () => {
    render(<Page />)
    expect(screen.getByText(/get started/i)).toBeInTheDocument()
  })

  it('has navigation links', () => {
    render(<Page />)
    expect(screen.getByRole('link', { name: /get started/i })).toBeInTheDocument()
  })

  it('displays how it works section', () => {
    render(<Page />)
    expect(screen.getByText(/how it works/i)).toBeInTheDocument()
  })
}) 