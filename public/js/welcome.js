// Smooth scroll animation observer
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

// Track which elements have been animated out to prevent repeated animations
const animatedOutElements = new Set();

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
      entry.target.classList.remove('fade-out');
      // Remove from animated out set when back in view
      animatedOutElements.delete(entry.target);
    }
  });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.animate-element').forEach(el => {
    observer.observe(el);
  });
});

// Scroll direction detection for fade out animation (only when scrolling up)
let lastScrollTop = 0;
let ticking = false;

function updateScrollDirection() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  // Only trigger fade out when scrolling up
  if (scrollTop < lastScrollTop) {
    // Scrolling up - fade out elements that are completely out of view at the top
    document.querySelectorAll('.animate-element').forEach(el => {
      const rect = el.getBoundingClientRect();
      // Only animate out if element is completely above viewport and hasn't been animated out yet
      if (rect.bottom < -50 && !animatedOutElements.has(el)) {
        el.classList.add('fade-out');
        el.classList.remove('fade-in');
        animatedOutElements.add(el);
      }
    });
  }
  // When scrolling down, we don't add fade-out animations
  
  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(updateScrollDirection);
    ticking = true;
  }
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    if (window.scrollY > 100) {
      navbar.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
      navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    }
  }
});

// Smooth scroll for anchor links
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});

// Add loading animation for better UX
window.addEventListener('load', function() {
  document.body.classList.add('loaded');
});

// Mobile menu toggle (if needed in future)
function toggleMobileMenu() {
  const navButtons = document.querySelector('.nav-buttons');
  if (navButtons) {
    navButtons.classList.toggle('mobile-active');
  }
}

// Performance optimization for scroll events
let scrollTimer = null;
window.addEventListener('scroll', function() {
  if (scrollTimer !== null) {
    clearTimeout(scrollTimer);        
  }
  scrollTimer = setTimeout(function() {
    // Scroll ended - can add any cleanup here
  }, 50);
});