import { render } from '@testing-library/react'
import AuthForm from '../../src/components/AuthForm'
import { UserProvider } from '../../src/contexts/UserContext'
import { describe, it, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'

// Mock Appwrite dependencies
vi.mock('../../src/lib/appwrite', () => ({
  account: {
    get: vi.fn().mockRejectedValue(new Error('Not authenticated'))
  }
}))

describe('AuthForm', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <UserProvider>
          <AuthForm />
        </UserProvider>
      </BrowserRouter>
    )
  })
})
