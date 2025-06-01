import { render, screen, fireEvent } from '@testing-library/react'
import AuthForm from '../../src/components/AuthForm'
import { UserProvider } from '../../src/contexts/UserContext'
import { describe, it, expect, vi } from 'vitest'

describe('AuthForm', () => {
  it('switches between login and signup modes', () => {
    render(
      <UserProvider>
        <AuthForm />
      </UserProvider>
    )
    
    // Initial login mode
    expect(screen.getByText('Welcome Back')).toBeInTheDocument()
    expect(screen.getByText("Don't have an account? Sign up")).toBeInTheDocument()
    
    // Switch to signup
    fireEvent.click(screen.getByText("Don't have an account? Sign up"))
    expect(screen.getByText('Create Account')).toBeInTheDocument()
    expect(screen.getByText('Already have an account? Sign in')).toBeInTheDocument()
  })
})
