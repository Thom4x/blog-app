import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import { expect } from 'vitest'
import userEvent from '@testing-library/user-event'

test('Componente que muestra un blog solo con titulo y autor ', () => {
    const blog = {
        title: 'OVOSOUND-ICEMAN',
        author: 'Drake',
        url: 'https://www.youtube.com/watch?v=6p6PcFFUm5I',
        likes: 1000,
        user: {
            username: 'drake',
            name: 'Drake'
        }
    }

    render(<Blog blog={blog} />)

    const element = screen.getByTestId('blog')
    expect(element).toHaveTextContent('OVOSOUND-ICEMAN')
    expect(element).toHaveTextContent('Drake')
    expect(element).not.toHaveTextContent('https://www.youtube.com/watch?v=6p6PcFFUm5I')
    expect(element).not.toHaveTextContent('1000')

})
test('Al hacer click en ver, se muestra mas informacion', async () => {
    const blog = {
        title: 'OVOSOUND-ICEMAN',
        author: 'Drake',
        url: 'https://www.youtube.com/watch?v=6p6PcFFUm5I',
        likes: 1000,
        user: {
            username: 'drake',
            name: 'Drake'
        }
    }

    render(<Blog blog={blog} />)

    //screen.debug()

    const user = userEvent.setup()
    const button = screen.getByTestId('view')
    await user.click(button)

    //screen.debug()

    const element = screen.getByTestId('blog-details')
    expect(element).toHaveTextContent('https://www.youtube.com/watch?v=6p6PcFFUm5I')
})
test('Al hacer click en like, se llama al controlador de eventos 2 veces', async () => {
    const blog = {
        title: 'OVOSOUND-ICEMAN',
        author: 'Drake',
        url: 'https://www.youtube.com/watch?v=6p6PcFFUm5I',
        likes: 1000,
        user: {
            username: 'drake',
            name: 'Drake'
        }
    }

    const mockLikeHandler = vi.fn()

    render(<Blog blog={blog} updateLikes={mockLikeHandler} />)


    const user = userEvent.setup()
    const button = screen.getByTestId('view')
    await user.click(button)

    // aqui se hace click en el boton like dos veces
    const button2 = screen.getAllByText('like')
    await user.click(button2[0])
    await user.click(button2[0])

    expect(mockLikeHandler.mock.calls).toHaveLength(2)
})