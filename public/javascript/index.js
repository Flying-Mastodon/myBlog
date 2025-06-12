const API_BASE_URL = 'https://myblog-sy0j.onrender.com'; 



//Post Management
const postsContainer = document.getElementById('posts-container');
const likeCounts = {}; // Temporary like storage

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

      // Initialize like count if not already present
      if (!likeCounts[post.id]) {
        likeCounts[post.id] = 0;
      }

      el.innerHTML = `
        <div class="post-header">
          <small>${formattedDate}</small>
          <h3>${post.title}</h3>
        </div>
        <p>${post.content}</p>
        <div class="post-footer">
          <button class="like-btn" data-id="${post.id}">👍 Like</button>
          <span class="like-count" id="like-${post.id}">${likeCounts[post.id]} likes</span>
        </div>
      `;

      postsContainer.appendChild(el);
    });

    attachLikeHandlers();
  } catch (error) {
    postsContainer.textContent = 'Error loading posts.';
    console.error(error);
  }
}



//Like Handler 
function attachLikeHandlers() {
  const buttons = document.querySelectorAll('.like-btn');
  buttons.forEach(button => {
    button.addEventListener('click', async () => {
      const postId = button.getAttribute('data-id');
      try {
        const res = await fetch(`${API_BASE_URL}/api/posts/${postId}/like`, {
          method: 'POST'
        });

        if (!res.ok) throw new Error('Failed to like post');
        const data = await res.json();
        const countEl = document.getElementById(`like-${postId}`);
        countEl.textContent = `${data.likes} likes`;
      } catch (err) {
        console.error('Error liking post:', err);
      }
    });
  });
}

loadPosts();


//Format date to UK standard
function formatUKDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
//Initialise IP data
let get_ip_address = getIP();
let get_country = "";
let get_isp ="";
//Capture Analytics
async function postAnalytics() {  
  await sleep(3000);
  const os = getOS();
  const ip_address = get_ip_address;
  const country = get_country;
  const isp = get_isp;
  console.log('Debug Public IP Address:', get_ip_address);
    try {
           const res = await fetch(`${API_BASE_URL}/api/analytics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip_address, os, country, isp }),
      });

      if (!res.ok) throw new Error('Failed to post');

    
    
    } catch (error) {
      postsContainer.innerHTML = '<div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>';
      console.error(error);
    }
  }
  postAnalytics();


//Capture OS
function getOS() {
  const userAgent = window.navigator.userAgent;
  const platform = window.navigator.platform;
  const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
  const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
  const iosPlatforms = ['iPhone', 'iPad', 'iPod'];

  if (macosPlatforms.includes(platform)) {
    return 'macOS';
  } else if (iosPlatforms.includes(platform)) {
    return 'iOS';
  } else if (windowsPlatforms.includes(platform)) {
    return 'Windows';
  } else if (/Android/.test(userAgent)) {
    return 'Android';
  } else if (/Linux/.test(platform)) {
    return 'Linux';
  }

  return 'Unknown OS';
}

async function getIP() {
  try {
    const response = await fetch('http://ip-api.com/json/');
    const data = await response.json();
    console.log('Public IP Address:', data.query);
    get_ip_address = data.query;
    get_country = data.country;
    get_isp = data.isp;
    return data.ip;
  } catch (error) {
    console.error('Error fetching IP:', error);
    getIPbasic();
    return null;
  }
}


//fallback if the better ip-api does not work (typically due to HTTPS)
async function getIPbasic() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    console.log('Public IP Address:', data.ip);
    get_ip_address = data.ip;
    return data.ip;
  } catch (error) {
    console.error('Error fetching IP:', error);
    return null;
  }
}