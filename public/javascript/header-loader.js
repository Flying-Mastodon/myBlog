fetch('header.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('header-placeholder').innerHTML = html;

    // Highlight active link based on current URL
    const links = document.querySelectorAll('.nav-links a');
    const currentPath = window.location.pathname;

    links.forEach(link => {
      if (link.getAttribute('href') === currentPath) {
        link.classList.add('active');
      }
    });
  })
  .catch(err => {
    console.error('Error loading header:', err);
  });