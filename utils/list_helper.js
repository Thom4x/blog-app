const dummy = (blogs) => {
    if (Array.isArray(blogs)) {
        return 1
    }
}

const totalLikes = (likedBlog) => {
    const liked = likedBlog.map((blogLike) => blogLike.likes)
    return liked.reduce((sum, likes) => sum + likes, 0)
}

module.exports = {
    dummy,
    totalLikes
}

