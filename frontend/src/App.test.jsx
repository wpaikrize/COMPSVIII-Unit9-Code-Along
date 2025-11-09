import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from './App'

const createMockTask = (id, overrides = {}) => ({
  id,
  title: `Task ${id}`,
  completed: false,
  createdAt: new Date().toISOString(),
  ...overrides,
})

describe('Task Tracker App', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
    global.fetch = jest.fn((url, options = {}) => {
      if (options.method === 'POST') {
        const body = JSON.parse(options.body)
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(createMockTask(Date.now(), { title: body.title }))
        })
      }

      if (options.method === 'PUT' || options.method === 'DELETE') {
        return Promise.resolve({ ok: true })
      }

      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([createMockTask(1), createMockTask(2, { completed: true })])
      })
    })
  })

  test('renders existing tasks and adds a new task', async () => {
    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument()
      expect(screen.getByText('Task 2')).toBeInTheDocument()
    })

    const input = screen.getByPlaceholderText('Enter a new task...')
    fireEvent.change(input, { target: { value: 'Write tests' } })
    fireEvent.submit(input.closest('form'))

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/tasks'),
        expect.objectContaining({ method: 'POST' })
      )
    })
  })
})
