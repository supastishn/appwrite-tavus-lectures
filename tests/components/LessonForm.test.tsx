import { render } from '@testing-library/react'
import LessonForm from '../../src/components/LessonForm'
import { UserProvider } from '../../src/contexts/UserContext'
import { describe, it, vi } from 'vitest'

// Mock Appwrite dependencies
vi.mock('../../src/lib/appwrite', () => ({
  account: {
    get: vi.fn().mockRejectedValue(new Error('Not authenticated'))
  }
}))

describe('LessonForm', () => {
  it('renders without crashing', () => {
    render(
      <UserProvider>
        <LessonForm onLessonCreated={vi.fn()} />
      </UserProvider>
    )
  })
})
