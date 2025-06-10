const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));


// Read from environment variables (set in Render Dashboard)
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Endpoint to fetch blog posts
app.get('/api/posts', async (req, res) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Endpoint to add a blog post
app.post('/api/posts', async (req, res) => {
  const { title, content } = req.body;
  const { error } = await supabase
    .from('posts')
    .insert([{ title, content }]);

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ message: 'Post created!' });
});

// Endpoint to get analytics
app.get('/api/analytics', async (req, res) => {
  const { data, error } = await supabase
    .from('analytics')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Endpoint to post analytics 
app.post('/api/analytics', async (req, res) => {
  const { ip_address, os } = req.body;
  const { error } = await supabase
    .from('analytics')
    .insert([{ ip_address, os }]);

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ message: 'Record created!' });
});

// Endpoint to get scripts by category
app.get('/api/scripts', async (req, res) => {
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
app.post('/api/scripts', async (req, res) => {
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

app.post('/api/scan', async (req, res) => {
  const { instanceNames, path } = req.body;
  const instances = instanceNames.split(',').map(i => i.trim()).filter(Boolean);
  const results = [];

  for (const name of instances) {
    const url = `https://${name}.service-now.com/${path}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        redirect: 'follow'
      });

      const finalUrl = response.url;
      if (finalUrl !== url) {
        results.push(`🔁 ${url} redirected to ${finalUrl}`);
      } else {
        results.push(`✅ ${url} is accessible with no redirect`);
      }
    } catch (err) {
      results.push(`⚠️ ${url} failed: ${err.message}`);
    }
  }

  res.json({ output: results.join('\n') });
});






// fallback for unmatched routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
