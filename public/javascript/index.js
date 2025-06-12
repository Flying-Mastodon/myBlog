const API_BASE_URL = 'https://myblog-sy0j.onrender.com'; 

let get_ip_address = getIP();
let get_country = "";
let get_isp ="";

//Post Management
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
    return null;
  }
}