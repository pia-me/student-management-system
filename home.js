// Handle role selection
function navigateTo(role) {
    // Store selected role in local storage
    localStorage.setItem('userRole', role);
    
    // Redirect to login page with role parameter
    window.location.href = 'login.html?role=' + role;
}

// Optional: Add loading animation
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.role-card');
    
    // Add stagger animation effect
    cards.forEach((card, index) => {
        card.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s both`;
    });
});

// Add animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
