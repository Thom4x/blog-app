import _ from 'lodash';
import Blog from '../models/blog.js'

export const blogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Robert C. Martin",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    },
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Robert C. Martin",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 15,
        __v: 0
    },
    {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 20,
        __v: 0
    },
    {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
        __v: 0
    },
    {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0
    }
]


export const dummy = (blogs) => {
    if (Array.isArray(blogs)) {
        return 1
    }
}

export const totalLikes = (likedBlog) => {
    const liked = likedBlog.map((blogLike) => blogLike.likes)
    return liked.reduce((sum, likes) => sum + likes, 0)
}

export const favoriteBlog = (blogLiked) => {
    if (blogLiked.length === 0) return null;

    const maxLiked = Math.max(...blogLiked.map((user) => user.likes))
    const favorite = blogLiked.find(max => max.likes === maxLiked)

    return {
        title: favorite.title,
        author: favorite.author,
        likes: favorite.likes
    }
}

export const mostBlogsByAuthor = (blogLiked) => {
    const mapped = blogLiked.map(user => user.author)
    const most = _.countBy(mapped);
    const pairs = _.toPairs(most);
    const winner = _.maxBy(pairs, (pair) => pair[1]);
    const result = {
        author: winner[0],
        blogs: winner[1]
    };
    return result;
}


export const mostLiked = (blogLiked) => {
    const gropued = _.groupBy(blogLiked, 'author')
    const mapped = _.map(gropued, (blogs, author) => {
        const totalLikes = _.sumBy(blogs, 'likes');
        return { author, totalLikes };
    });
    const winner = _.maxBy(mapped, 'totalLikes');
    return winner;
}

export const blogsDb = async () => { // Este método devuelve todas las notas que hay en la base de datos en formato JSON. Se utiliza para comprobar el estado de la base de datos antes y después de realizar operaciones de prueba.
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

export const verifyTitleUrl = async (title, url) => {
    const blogs = await Blog.find({})

    if (!blogs.some(blog => blog.title === title) || !blogs.some(blog => blog.url === url)) {
        response.status(400).json({ error: 'Title and URL are required' })
    }
}
