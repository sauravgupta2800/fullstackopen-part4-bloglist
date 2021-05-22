const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const reducer = (sum, { likes }) => sum + likes;
  return blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  let likesArray = blogs.map(({ likes }) => likes);
  let maxLikes = Math.max(...likesArray);
  return blogs.find(({ likes }) => likes === maxLikes);
};

const mostBlogs = (blogs) => {
  const authorBlogMap = blogs.reduce((mp, { author }) => {
    mp[author] = (mp[author] || 0) + 1;
    return mp;
  }, {});
  let ans = {};
  let maxblog = 0;
  Object.keys(authorBlogMap).forEach((author) => {
    if (maxblog < authorBlogMap[author]){
      maxblog = authorBlogMap[author];
      ans = { author, blogs: authorBlogMap[author] };
    }
  });
  return ans;
};

const mostLikes = (blogs) => {
  const authorLikesMap = blogs.reduce((mp, { author, likes }) => {
    mp[author] = (mp[author] || 0) + likes;
    return mp;
  }, {});

  let result = {};
  let maxLikes = 0;
  Object.keys(authorLikesMap).forEach((author) => {
    if (maxLikes < authorLikesMap[author]){
      maxLikes = authorLikesMap[author];
      result = { author, likes: authorLikesMap[author] };
    }
  });
  return result;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
};
