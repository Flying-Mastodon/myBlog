document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('/api/user', { credentials: 'include' });
    if (!res.ok) throw new Error('Not authenticated');

    const user = await res.json();
    document.getElementById('user-email').textContent = user.email;
    document.getElementById('user-id').textContent = user.id;
  } catch (err) {
    window.location.href = '/login.html';
  }
});

document.getElementById('logout-btn').addEventListener('click', async () => {
  await fetch('/api/logout', { method: 'POST' });
  window.location.href = '/login.html';
});
