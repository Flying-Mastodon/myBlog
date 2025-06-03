const API_BASE_URL = 'https://myblog-sy0j.onrender.com'; 


const postsContainer = document.getElementById('posts-container');

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

loadPosts();



function formatUKDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

