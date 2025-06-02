const API_BASE_URL = 'https://myblog-sy0j.onrender.com'; 
const categorySelect = document.getElementById('category-select');
const scriptsList = document.getElementById('scripts-list');

const modal = document.getElementById('script-modal');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalScript = document.getElementById('modal-script');
const closeModal = document.getElementById('close-modal');
const postForm = document.getElementById('post-form');
const postTitle = document.getElementById('post-title');
const postCategory = document.getElementById('post-category');
const postDescription = document.getElementById('post-description');
const postScript = document.getElementById('post-content');

categorySelect.addEventListener('change', async () => {
  const category = categorySelect.value;
  const query = API_BASE_URL + '/scripts?category=' + categorySelect.value;
  scriptsList.innerHTML = '';
  if (!category) return;

  try {
    const res = await fetch(query);
    const data = await res.json();

    if (!res.ok) {
      scriptsList.innerHTML = `<p>Error loading scripts: ${data.error}</p>`;
      return;
    }

    if (data.length === 0) {
      scriptsList.innerHTML = `<p>No scripts found in this category.</p>`;
      return;
    }

    data.forEach(script => {
      const item = document.createElement('div');
      item.className = 'script-item';
      item.innerHTML = `
        <h4>${script.title}</h4>
        <small>${formatUKDate(script.created_at)}</small>
        <p>${script.description}</p>
        <button data-title="${script.title}" data-description="${script.description}" data-script="${encodeURIComponent(script.script)}">View Script</button>
      `;
      scriptsList.appendChild(item);
    });

    document.querySelectorAll('.script-item button').forEach(btn => {
      btn.addEventListener('click', () => {
        modalTitle.textContent = btn.dataset.title;
        modalDescription.textContent = btn.dataset.description;
        modalScript.textContent = decodeURIComponent(btn.dataset.script);
        modal.classList.remove('hidden');
      });
    });
  } catch (err) {
    scriptsList.innerHTML = `<p>Error fetching data.</p>`;
  }
});

closeModal.addEventListener('click', () => {
  modal.classList.add('hidden');
});

function formatUKDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-GB');
}

  // Submit new post to backend
  postForm.addEventListener('submit', async e => {
    e.preventDefault();

    const title = postTitle.value.trim();
    const description = postDescription.value.trim();
    const script = postScript.value.trim();
    const category =postCategory.value.trim()
     
    if (!title || !description || !title || !category) return;

    try {
      const res = await fetch(`${API_BASE_URL}/scripts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, script, category}),
      });

      if (!res.ok) throw new Error('Failed to post');
      if (res.ok) {
        document.getElementById('post-title').value = '';
        document.getElementById('post-category').value = '';
        document.getElementById('post-description').value = '';
        document.getElementById('post-content').value = '';
        alert('Script submitted successfully!');
      }
     
    } catch (error) {
      alert('Error submitting post.');
      console.error(error);
    }
  });
