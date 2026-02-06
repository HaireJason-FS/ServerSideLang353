// Task: Refactor the following code to use a promise chain instead of nested callbacks.
// The function should fetch a user, then their posts, and finally their comments.

// function fetchUserData(userId, callback) {
//   setTimeout(() => {
//     const user = { id: userId, name: 'User ' + userId };
//     callback(user);
//   }, 1000);
// }

// function fetchUserPosts(userId, callback) {
//   setTimeout(() => {
//     const posts = ['Post 1', 'Post 2', 'Post 3'];
//     callback(posts);
//   }, 1000);
// }

// function fetchPostComments(postId, callback) {
//   setTimeout(() => {
//     const comments = ['Comment 1', 'Comment 2'];
//     callback(comments);
//   }, 1000);
// }

// // Example usage (to be refactored):
// fetchUserData(1, (user) => {
//   console.log('User:', user);
//   fetchUserPosts(user.id, (posts) => {
//     console.log('Posts:', posts);
//     fetchPostComments(posts[0], (comments) => {
//       console.log('Comments:', comments);
//     });
//   });
// });

// Your task: Rewrite the above code using Promises and .then() chain.
// Bonus: Implement error handling in your promise chain.

function fetchUserData(userId, callback){
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userId <= 0) {
        reject('Invalid user ID');
        return;
      }
      const user = { id: userId, name: 'User ' + userId };
      resolve(user);
    }, 1000);
  });
} 

function fetchUserPosts(userId, callback){
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userId <= 0) {
        reject('Invalid user ID');
        return;
      }
      const posts = ['Post 1', 'Post 2', 'Post 3'];
      resolve(posts);
    }, 1000);
  });
}

function fetchPostComments(postId, callback){
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!postId) {
        reject('Invalid post ID');
        return;
      }
      const comments = ['Comment 1', 'Comment 2'];
      resolve(comments);
    }, 1000);
  });
}

// Example usage with Promises:
fetchUserData(1)
  .then(user => {
    console.log('User:', user);
    return fetchUserPosts(user.id);
  })
  .then(posts => {
    console.log('Posts:', posts);
    return fetchPostComments(posts[0]);
  })
  .then(comments => {
    console.log('Comments:', comments);
  })
  .catch(error => {
    console.error('Error:', error);
  });