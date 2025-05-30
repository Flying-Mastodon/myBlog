document.addEventListener("DOMContentLoaded", () => {
  const postForm = document.getElementById("post-form");
  const postTitle = document.getElementById("post-title");
  const postContent = document.getElementById("post-content");
  const postsContainer = document.getElementById("posts-container");

  const loadPosts = async () => {
    const res = await fetch("get_posts.php");
    const posts = await res.json();
    postsContainer.innerHTML = "";
    posts.reverse().forEach(post => {
      const el = document.createElement("div");
      el.classList.add("post");
      el.innerHTML = `<h3>${post.title}</h3><p>${post.content}</p>`;
      postsContainer.appendChild(el);
    });
  };

  postForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newPost = {
      title: postTitle.value.trim(),
      content: postContent.value.trim()
    };
    await fetch("save_post.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost)
    });
    postTitle.value = "";
    postContent.value = "";
    loadPosts();
  });

  loadPosts();
});
