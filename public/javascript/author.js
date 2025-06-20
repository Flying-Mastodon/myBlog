const API_BASE_URL = 'https://myblog-sy0j.onrender.com'; 
// Replace the above with your deployed backend URL

document.addEventListener('DOMContentLoaded', () => {
  const postForm = document.getElementById('post-form');
  const postTitle = document.getElementById('post-title');
  const postContent = tinymce.get('post-content');
  const postsContainer = document.getElementById('posts-container');

  // Load posts from backend
  async function loadPosts() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/posts`);
      if (!res.ok) throw new Error('Failed to fetch posts');
      const posts = await res.json();

      postsContainer.innerHTML = '';
      posts.forEach(post => {
        const formattedDate = formatUKDate(post.created_at);
        const el = document.createElement('div');
        el.className = 'post';
        el.innerHTML = `${formattedDate}<h3>${post.title}</h3><p>${post.content}</p>`;
        postsContainer.appendChild(el);
      });
    } catch (error) {
      postsContainer.textContent = 'Error loading posts.';
      console.error(error);
    }
  }



  // Submit new post to backend
  postForm.addEventListener('submit', async e => {
    e.preventDefault();

    const title = postTitle.value.trim();
    const content = tinyMCE.activeEditor.getContent();
    if (!title || !content) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) throw new Error('Failed to post');

      postTitle.value = '';
      postContent.value = '';
      loadPosts();
    } catch (error) {
      alert('Error submitting post.');
      console.error(error);
    }
  });

  

  loadPosts();
});


function formatUKDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}
