import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ShortenForm from '@/app/components/ShortenForm'

// `fetch` doesn't exist in the jsdom test environment by default.
// We replace it with a Jest mock function so we can control what the
// "API" returns in each test without making real network requests.
beforeEach(() => {
  global.fetch = jest.fn()
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('ShortenForm', () => {
  test('renders the heading, input, and button', () => {
    render(<ShortenForm />)

    expect(
      screen.getByRole('heading', { name: /url shortener/i })
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/url to shorten/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /shorten/i })).toBeInTheDocument()
  })

  test('disables the button when input is empty', () => {
    render(<ShortenForm />)
    const button = screen.getByRole('button', { name: /shorten/i })
    expect(button).toBeDisabled()
  })

  test('enables the button when user types a URL', async () => {
    const user = userEvent.setup()
    render(<ShortenForm />)

    const input = screen.getByLabelText(/url to shorten/i)
    await user.type(input, 'https://example.com')

    expect(screen.getByRole('button', { name: /shorten/i })).toBeEnabled()
  })

  test('shows the shortened URL on successful submission', async () => {
    // Tell the mocked fetch what to return for this test
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ shortUrl: 'http://localhost:3000/abc123' }),
    })

    const user = userEvent.setup()
    render(<ShortenForm />)

    await user.type(
      screen.getByLabelText(/url to shorten/i),
      'https://example.com'
    )
    await user.click(screen.getByRole('button', { name: /shorten/i }))

    // Wait for the result to appear in the DOM
    const link = await screen.findByRole('link', {
      name: /localhost:3000\/abc123/i,
    })
    expect(link).toHaveAttribute('href', 'http://localhost:3000/abc123')
  })

  test('shows an error message when the API returns an error', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Invalid URL' }),
    })

    const user = userEvent.setup()
    render(<ShortenForm />)

    await user.type(screen.getByLabelText(/url to shorten/i), 'not-a-url')
    await user.click(screen.getByRole('button', { name: /shorten/i }))

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent(/invalid url/i)
  })

  test('shows a network error when fetch throws', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network failure'))

    const user = userEvent.setup()
    render(<ShortenForm />)

    await user.type(
      screen.getByLabelText(/url to shorten/i),
      'https://example.com'
    )
    await user.click(screen.getByRole('button', { name: /shorten/i }))

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent(/network error/i)
  })

  test('shows loading state while waiting for the API', async () => {
    // Create a fetch that never resolves so we can observe the loading state
    global.fetch.mockImplementationOnce(() => new Promise(() => {}))

    const user = userEvent.setup()
    render(<ShortenForm />)

    await user.type(
      screen.getByLabelText(/url to shorten/i),
      'https://example.com'
    )
    await user.click(screen.getByRole('button', { name: /shorten/i }))

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /shortening/i })
      ).toBeDisabled()
    })
  })
})