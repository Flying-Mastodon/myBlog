fetch('header.html')
  .then(res => res.text())
  .then(async html => {
    document.getElementById('header-placeholder').innerHTML = html;

    // Highlight active link based on current URL
    const links = document.querySelectorAll('.nav-links a');
    const currentPath = window.location.pathname;

    links.forEach(link => {
      if (link.getAttribute('href') === currentPath) {
        link.classList.add('active');
      }
    });

    // Check if user is authenticated and update header
    const nav = document.querySelector('.nav-links');
    const link = document.createElement('a');
    link.classList.add('nav-item');

    const response = await fetch('https://myblog-sy0j.onrender.com/api/me', { credentials: 'include' });

    if (response.ok) {
      link.href = 'profile.html';
      link.textContent = 'Profile';
    } else {
      link.href = 'login.html';
      link.textContent = 'Login';
    }

    nav.appendChild(link);
  })
  .catch(err => {
    console.error('Error loading header:', err);
  });


