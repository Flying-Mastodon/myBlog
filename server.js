import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public')); // Serve HTML/CSS/JS
app.use(express.json());

// Supabase config
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// API route to get scripts by category
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

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
