const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Read from environment variables (set in Render Dashboard)
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Endpoint to fetch blog posts
app.get('/posts', async (req, res) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Endpoint to add a blog post
app.post('/posts', async (req, res) => {
  const { title, content } = req.body;
  const { error } = await supabase
    .from('posts')
    .insert([{ title, content }]);

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ message: 'Post created!' });
});

// Endpoint to get scripts by category
app.get('/scripts', async (req, res) => {
  const { category } = req.query;

  if (!category) return res.status(400).json({ error: 'Category required' });

  const { data, error } = await supabase
    .from('scripts')
    .select('id, title, description, script, created_at')
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Endpoint to add a script
app.post('/scripts', async (req, res) => {
  const { title, description, script, category} = req.body;
  const { error } = await supabase
    .from('scripts')
    .insert([{ title, description, script, category}]);

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ message: 'Article created!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


app.use(express.static('public'));

// Optional: fallback for unmatched routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});