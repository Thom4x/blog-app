import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Blog from './Blog'

const blog = {
    id: '1',
    title: 'Test Blog Title',
    author: 'Test Author',
    url: 'http://testblog.com',
    likes: 5,
    user: {
        username: 'creator',
        name: 'Creator Name',
        id: 'user1'
    }
}

// Helper porque Blog usa useMatch, necesita estar dentro de un Router
const renderBlog = (props) => {
    return render(
        <MemoryRouter initialEntries={[`/blogs/${blog.id}`]}>
            <Blog blog={blog} {...props} />
        </MemoryRouter>
    )
}

describe('<Blog />', () => {
    test('muestra info del blog y likes a usuarios no autenticados, sin botones', () => {
        renderBlog({ user: null })

        expect(screen.getByText('Test Blog Title', { exact: false })).toBeInTheDocument()
        expect(screen.getByText('5 likes', { exact: false })).toBeInTheDocument()

        expect(screen.queryByTestId('like-button')).not.toBeInTheDocument()
        expect(screen.queryByText('remove')).not.toBeInTheDocument()
    })

    test('a un usuario autenticado que NO es el creador solo se le muestra el botón like', () => {
        renderBlog({ user: 'otheruser' })

        expect(screen.getByRole('button', { name: 'like' })).toBeInTheDocument()
        expect(screen.queryByText('remove')).not.toBeInTheDocument()
    })

    test('al creador del blog se le muestra también el botón remove', () => {
        renderBlog({ user: 'creator' })

        expect(screen.getByText('like')).toBeInTheDocument()
        expect(screen.getByText('remove')).toBeInTheDocument()
    })
})