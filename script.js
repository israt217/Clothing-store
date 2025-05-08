// Authentication and Form Handling
document.addEventListener('DOMContentLoaded', function() {
    // Create default test users if none exist
    const defaultUsers = [
        {
            name: "Test User",
            email: "test@example.com",
            password: "test123"
        },
        {
            name: "Admin User",
            email: "admin@evaclothing.com",
            password: "admin123"
        }
    ];

    // Check if users exist in localStorage, if not, add default users
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify(defaultUsers));
    }

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Update UI based on login status
    updateAuthUI();

    // Login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            // Get users from localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                // Store login status and user info
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('currentUser', JSON.stringify({
                    name: user.name,
                    email: user.email
                }));
                
                // Update UI
                updateAuthUI();
                
                // Close modal and show success message
                const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
                loginModal.hide();
                showAlert('Login successful! Welcome back, ' + user.name, 'success');
            } else {
                showAlert('Invalid email or password', 'danger');
            }
        });
    }

    // Signup form submission
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Validate passwords match
            if (password !== confirmPassword) {
                showAlert('Passwords do not match', 'danger');
                return;
            }
            
            // Get existing users
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Check if email already exists
            if (users.some(user => user.email === email)) {
                showAlert('Email already registered', 'danger');
                return;
            }
            
            // Add new user
            users.push({ name, email, password });
            localStorage.setItem('users', JSON.stringify(users));
            
            // Auto login after signup
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', JSON.stringify({ name, email }));
            
            // Update UI
            updateAuthUI();
            
            // Close modal and show success message
            const signupModal = bootstrap.Modal.getInstance(document.getElementById('signupModal'));
            signupModal.hide();
            showAlert('Account created successfully! Welcome to Eva Clothing', 'success');
        });
    }

    // Logout functionality
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('currentUser');
            updateAuthUI();
            showAlert('Logged out successfully', 'info');
        });
    }

    // Function to update UI based on auth status
    function updateAuthUI() {
        const authButtons = document.querySelector('.d-flex');
        if (isLoggedIn && currentUser) {
            authButtons.innerHTML = `
                <span class="me-3">Welcome, ${currentUser.name}</span>
                <button id="logoutButton" class="btn btn-outline-danger me-2">Logout</button>
                <a href="#cart" class="btn btn-outline-secondary">
                    <i class="fas fa-shopping-cart"></i>
                </a>
            `;
        } else {
            authButtons.innerHTML = `
                <a href="#login" class="btn btn-outline-primary me-2" data-bs-toggle="modal" data-bs-target="#loginModal">Login</a>
                <a href="#cart" class="btn btn-outline-secondary">
                    <i class="fas fa-shopping-cart"></i>
                </a>
            `;
        }
    }

    // Function to show alerts
    function showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
        alertDiv.style.zIndex = '9999';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(alertDiv);
        
        // Remove alert after 3 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    }

    // Add to Cart functionality
    const addToCartButtons = document.querySelectorAll('.btn-primary');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (!isLoggedIn) {
                showAlert('Please login to add items to cart', 'warning');
                const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
                loginModal.show();
                return;
            }
            
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.card-title').textContent;
            const productPrice = productCard.querySelector('.price').textContent;
            
            // Get existing cart or create new one
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart.push({ name: productName, price: productPrice });
            localStorage.setItem('cart', JSON.stringify(cart));
            
            showAlert(`Added to cart: ${productName}`, 'success');
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Initialize all Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}); 