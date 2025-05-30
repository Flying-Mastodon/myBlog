// Wait for the DOM to be fully loaded before executing our code
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize Supabase client
const supabaseUrl = 'https://zcwrudkrhtczcumhbvwh.supabase.co';
const supabaseKey = 'eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpjd3J1ZGtyaHRjemN1bWhidndoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MTEwOTgsImV4cCI6MjA2NDE4NzA5OH0';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

    // DOM elements
    const signinBtn = document.getElementById('signin-btn');
    const signoutBtn = document.getElementById('signout-btn');
    const userEmail = document.getElementById('user-email');
    const postForm = document.getElementById('post-form');
    const newPostForm = document.getElementById('new-post-form');
    const postsList = document.getElementById('posts-list');
    const authModal = document.getElementById('auth-modal');
    const closeBtn = document.querySelector('.close-btn');
    const authForm = document.getElementById('auth-form');
    const authError = document.getElementById('auth-error');
    const toggleSignup = document.getElementById('toggle-signup');

    let isSignUp = false;

    // Event listeners
    signinBtn.addEventListener('click', () => authModal.classList.remove('hidden'));
    signoutBtn.addEventListener('click', () => signOut(supabase));
    closeBtn.addEventListener('click', () => authModal.classList.add('hidden'));
    newPostForm.addEventListener('submit', (e) => createPost(e, supabase));
    toggleSignup.addEventListener('click', (e) => {
        e.preventDefault();
        isSignUp = !isSignUp;
        authForm.querySelector('button').textContent = isSignUp ? 'Sign Up' : 'Sign In';
        toggleSignup.textContent = isSignUp ? 'Sign in instead' : 'Sign up instead';
        authError.textContent = '';
    });

    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            let response;
            if (isSignUp) {
                response = await supabase.auth.signUp({ email, password });
            } else {
                response = await supabase.auth.signInWithPassword({ email, password });
            }
            
            if (response.error) throw response.error;
            
            authModal.classList.add('hidden');
            checkAuth(supabase);
        } catch (error) {
            authError.textContent = error.message;
        }
    });

    // Check authentication state
    async function checkAuth(supabaseClient) {
        const { data: { user } } = await supabaseClient.auth.getUser();
        
        if (user) {
            // User is signed in
            signinBtn.classList.add('hidden');
            signoutBtn.classList.remove('hidden');
            userEmail.textContent = user.email;
            userEmail.classList.remove('hidden');
            postForm.classList.remove('hidden');
            
            // Load posts
            loadPosts(supabaseClient);
        } else {
            // User is signed out
            signinBtn.classList.remove('hidden');
            signoutBtn.classList.add('hidden');
            userEmail.classList.add('hidden');
            postForm.classList.add('hidden');
            loadPosts(supabaseClient); // Still load posts for public viewing
        }
    }

    // Sign out
    async function signOut(supabaseClient) {
        const { error } = await supabaseClient.auth.signOut();
        if (!error) {
            checkAuth(supabaseClient);
        }
    }

    // Create a new post
    async function createPost(e, supabaseClient) {
        e.preventDefault();
        
        const title = document.getElementById('post-title').value;
        const content = document.getElementById('post-content').value;
        
        const { data: { user } } = await supabaseClient.auth.getUser();
        
        if (!user) {
            alert('You must be signed in to create a post');
            return;
        }
        
        const { data, error } = await supabaseClient
            .from('posts')
            .insert([
                { 
                    title, 
                    content, 
                    user_id: user.id,
                    author_email: user.email
                }
            ])
            .select();
        
        if (error) {
            console.error('Error creating post:', error);
            return;
        }
        
        // Clear form
        newPostForm.reset();
        
        // Reload posts
        loadPosts(supabaseClient);
    }

    // Load all posts
    async function loadPosts(supabaseClient) {
        const { data: posts, error } = await supabaseClient
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('Error loading posts:', error);
            return;
        }
        
        // Clear existing posts
        postsList.innerHTML = '<h2>Recent Posts</h2>';
        
        if (posts.length === 0) {
            postsList.innerHTML += '<p>No posts yet. Be the first to post!</p>';
            return;
        }
        
        // Add each post to the list
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'post';
            
            const date = new Date(post.created_at).toLocaleString();
            
            postElement.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.content}</p>
                <div class="post-meta">
                    Posted by ${post.author_email} on ${date}
                </div>
            `;
            
            postsList.appendChild(postElement);
        });
    }

    // Initialize the app
    checkAuth(supabase);

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === authModal) {
            authModal.classList.add('hidden');
        }
    });
});