const API_URL = 'https://jsonplaceholder.typicode.com/posts';

// DOM elements
const postList = document.getElementById('postList');
const errorDiv = document.getElementById('error');
const fetchButton = document.getElementById('fetchButton');
const postForm = document.getElementById('postForm');
const formError = document.getElementById('formError');
const formSuccess = document.getElementById('formSuccess');

// Fetch and display posts
async function fetchPosts() {
    try {
        // Show loading state
        postList.innerHTML = '<p>Loading...</p>';
        errorDiv.textContent = '';

        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const posts = await response.json();
        
        // Clear loading state
        postList.innerHTML = '';

        // Render posts with delete button
        posts.forEach(post => {
            const postDiv = document.createElement('div');
            postDiv.className = 'post';
            postDiv.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.body}</p>
                <button class="deleteButton" data-id="${post.id}">Delete Post</button>
            `;
            postList.appendChild(postDiv);
        });

        // Add event listeners to delete buttons
        document.querySelectorAll('.deleteButton').forEach(button => {
            button.addEventListener('click', handleDeletePost);
        });
    } catch (error) {
        errorDiv.textContent = `Failed to load posts: ${error.message}`;
        postList.innerHTML = '';
    }
}

// Handle form submission
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const title = document.getElementById('titleInput').value;
    const body = document.getElementById('bodyInput').value;

    try {
        // Clear previous messages
        formError.textContent = '';
        formSuccess.textContent = 'Submitting...';

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                body,
                userId: 1 // JSONPlaceholder requires a userId
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const newPost = await response.json();
        
        // Show success message
        formSuccess.textContent = `Post created successfully! ID: ${newPost.id}`;
        
        // Clear form
        postForm.reset();
        
        // Refresh posts
        await fetchPosts();
    } catch (error) {
        formError.textContent = `Failed to create post: ${error.message}`;
        formSuccess.textContent = '';
    }
}

// Handle delete post
async function handleDeletePost(event) {
    const postId = event.target.getAttribute('data-id');
    
    try {
        errorDiv.textContent = '';

        const response = await fetch(`${API_URL}/${postId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Show success message
        formSuccess.textContent = `Post ${postId} deleted successfully!`;
        
        // Refresh posts
        await fetchPosts();
    } catch (error) {
        errorDiv.textContent = `Failed to delete post: ${error.message}`;
    }
}

// Event listeners for window buttons
fetchButton.addEventListener('click', fetchPosts);
postForm.addEventListener('submit', handleFormSubmit);

// Initial fetch all post from service.
fetchPosts();