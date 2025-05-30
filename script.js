// Replace with your Supabase project URL and anon key
const SUPABASE_URL = 'https://zcwrudkrhtczcumhbvwh.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpjd3J1ZGtyaHRjemN1bWhidndoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MTEwOTgsImV4cCI6MjA2NDE4NzA5OH0.LBaC-ZFC9eq2zIFGVpZtOTCK0DFk6cidOCghJijafc8';

// create the client without shadowing the global object
const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener('DOMContentLoaded', () => {
  const postForm      = document.getElementById('post-form');
  const postTitle     = document.getElementById('post-title');
  const postContent   = document.getElementById('post-content');
  const postsContainer = document.getElementById('posts-container');

  /** Load posts from Supabase */
  async function loadPosts() {
    const { data: posts, error } = await client
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    postsContainer.innerHTML = '';
    if (error) {
      postsContainer.textContent = 'Error loading posts.';
      console.error(error);
      return;
    }

    posts.forEach(post => {
      const el = document.createElement('div');
      el.className = 'post';
      el.innerHTML = `<h3>${post.title}</h3><p>${post.content}</p>`;
      postsContainer.appendChild(el);
    });
  }

  /** Submit a new post */
  postForm.addEventListener('submit', async e => {
    e.preventDefault();
    const title   = postTitle.value.trim();
    const content = postContent.value.trim();
    if (!title || !content) return;

    const { error } = await client
      .from('posts')
      .insert([{ title, content }]);

    if (error) {
      alert('Failed to post. See console for details.');
      console.error(error);
      return;
    }

    postTitle.value = '';
    postContent.value = '';
    loadPosts();
  });

  loadPosts();
});