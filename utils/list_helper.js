import _ from 'lodash';

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

