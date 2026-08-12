import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import { expect } from 'vitest'
import userEvent from '@testing-library/user-event'

test('El formulario llama al controlador de eventos cuando se envía', async () => {
    const mockCreateBlog = vi.fn()
    const user = userEvent.setup()
    render(<BlogForm createBlog={mockCreateBlog} />)

    const titleInput = screen.getByLabelText('title:')
    const authorInput = screen.getByLabelText('author:')
    const urlInput = screen.getByLabelText('url:')
    const submitButton = screen.getByText('Create')

    await user.type(titleInput, 'Test Blog')
    await user.type(authorInput, 'Test Author')
    await user.type(urlInput, 'https://www.test.com')
    await user.click(submitButton)

    expect(mockCreateBlog.mock.calls).toHaveLength(1)
    expect(mockCreateBlog.mock.calls[0][0].title).toBe('Test Blog')
    expect(mockCreateBlog.mock.calls[0][0].author).toBe('Test Author')
    expect(mockCreateBlog.mock.calls[0][0].url).toBe('https://www.test.com')

})