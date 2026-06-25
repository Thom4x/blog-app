const dummy = (blogs) => {
    if (Array.isArray(blogs)) {
        return 1
    }
}

const totalLikes = (likedBlog) => {
    const liked = likedBlog.map((blogLike) => blogLike.likes)
    return liked.reduce((sum, likes) => sum + likes, 0)
}

const favoriteBlog = (blogLiked) => {
    if (blogLiked.length === 0) return null;

    const maxLiked = Math.max(...blogLiked.map((user) => user.likes))
    const favorite = blogLiked.find(max => max.likes === maxLiked)

    return {
        title: favorite.title,
        author: favorite.author,
        likes: favorite.likes
    }
}


module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}

