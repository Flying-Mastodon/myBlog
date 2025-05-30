document.addEventListener("DOMContentLoaded", () => {
  const postForm = document.getElementById("post-form");
  const postTitle = document.getElementById("post-title");
  const postContent = document.getElementById("post-content");
  const postsContainer = document.getElementById("posts-container");

  // Load posts from the server
  const loadPosts = async () => {
    postsContainer.innerHTML = "";
    const res = await fetch("/api/posts");
    const posts = await res.json();
    posts.reverse().forEach(post => {
      const postElement = document.createElement("div");
      postElement.classList.add("post");
      postElement.innerHTML = `<h3>${post.title}</h3><p>${post.content}</p>`;
      postsContainer.appendChild(postElement);
    });
  };

  // Submit new post
  postForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newPost = {
      title: postTitle.value.trim(),
      content: postContent.value.trim()
    };
    if (newPost.title && newPost.content) {
      await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost)
      });
      postTitle.value = "";
      postContent.value = "";
      loadPosts();
    }
  });

  loadPosts(); // Initial load
});
