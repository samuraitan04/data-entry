document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // In a real application, this would be handled by a secure backend
    // For demo purposes, we'll use a simple check
    if (username === 'admin' && password === 'password') {
        // Store authentication state
        localStorage.setItem('isAuthenticated', 'true');
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    } else {
        alert('Invalid credentials. Please try again.');
    }
});

// Check if user is already authenticated
window.addEventListener('load', function() {
    if (localStorage.getItem('isAuthenticated') === 'true') {
        window.location.href = 'dashboard.html';
    }
}); 