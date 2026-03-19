document.addEventListener('DOMContentLoaded', () => {
    const categories = document.querySelectorAll('.mega-category-item');
    const submenus = document.querySelectorAll('.mega-submenu');

    categories.forEach(category => {
        category.addEventListener('mouseenter', () => {
            // Remove active state
            categories.forEach(c => c.classList.remove('active'));
            submenus.forEach(s => s.classList.remove('active'));

            // Add active state to hovered element
            category.classList.add('active');

            // Show target submenu
            const targetId = category.getAttribute('data-target');
            const targetSubmenu = document.getElementById(targetId);
            if (targetSubmenu) {
                targetSubmenu.classList.add('active');
            }
        });
    });

    // Allow mega-menu dropping down seamlessly without closing abruptly on hover outside.
    const dropdown = document.querySelector('.mega-dropdown');
    const toggle = dropdown.querySelector('.dropdown-toggle');

    // If user prefers hover over click for dropdown itself, could add here.
    // Currently relies on click standard to Bootstrap, with hover for internal tabs.

// Typing animation for Hero Section
    const messages = [
        { line1: "Skill development,", line2: "personalized to you" },
        { line1: "Learning that adapts,", line2: "powered by AI" }
    ];

    const typingText1 = document.getElementById("typing-text-1");
    const typingText2 = document.getElementById("typing-text-2");

    if (typingText1 && typingText2) {
        let msgIndex = 0;
        let isDeleting = false;
        let currentLine = 1;
        let charIndex = 0;

        const typingSpeed = 60;
        const deletingSpeed = 30;
        const delayBetweenLines = 300;
        const delayBetweenMessages = 2500;

        function typeLoop() {
            const currentMsg = messages[msgIndex];

            if (isDeleting) {
                // Deleting state
                if (currentLine === 2) {
                    if (charIndex > 0) {
                        charIndex--;
                        typingText2.innerHTML = currentMsg.line2.substring(0, charIndex);
                        setTimeout(typeLoop, deletingSpeed);
                    } else {
                        currentLine = 1;
                        charIndex = currentMsg.line1.length;
                        typingText2.classList.remove('typing-cursor');
                        typingText1.classList.add('typing-cursor');
                        setTimeout(typeLoop, deletingSpeed);
                    }
                } else if (currentLine === 1) {
                    if (charIndex > 0) {
                        charIndex--;
                        typingText1.innerHTML = currentMsg.line1.substring(0, charIndex);
                        setTimeout(typeLoop, deletingSpeed);
                    } else {
                        isDeleting = false;
                        msgIndex = (msgIndex + 1) % messages.length;
                        setTimeout(typeLoop, typingSpeed);
                    }
                }
            } else {
                // Typing state
                if (currentLine === 1) {
                    typingText1.classList.add('typing-cursor');
                    typingText2.classList.remove('typing-cursor');

                    if (charIndex < currentMsg.line1.length) {
                        typingText1.innerHTML = currentMsg.line1.substring(0, charIndex + 1);
                        charIndex++;
                        setTimeout(typeLoop, typingSpeed);
                    } else {
                        currentLine = 2;
                        charIndex = 0;
                        typingText1.classList.remove('typing-cursor');
                        typingText2.classList.add('typing-cursor');
                        setTimeout(typeLoop, delayBetweenLines);
                    }
                } else if (currentLine === 2) {
                    if (charIndex < currentMsg.line2.length) {
                        typingText2.innerHTML = currentMsg.line2.substring(0, charIndex + 1);
                        charIndex++;
                        setTimeout(typeLoop, typingSpeed);
                    } else {
                        isDeleting = true;
                        setTimeout(typeLoop, delayBetweenMessages);
                    }
                }
            }
        }

        setTimeout(typeLoop, 500); // Initial start delay
    }
});

// ── Auth & Session Logic ──────────────────────────────────────────────
const API_BASE = 'http://localhost/Learnify XAMP/api';

function updateGlobalCartBadge() {
    const badge = document.getElementById('global-cart-badge');
    if (!badge) return;
    try {
        const cart = JSON.parse(localStorage.getItem('learnify_cart') || '[]');
        if (cart.length > 0) {
            badge.textContent = cart.length;
            badge.classList.remove('d-none');
        } else {
            badge.classList.add('d-none');
        }
    } catch (e) {}
}

document.addEventListener('DOMContentLoaded', async () => {
    updateGlobalCartBadge();
    try {
        const res = await fetch(`${API_BASE}/cart.php?action=check`);
        const data = await res.json();
        if (data.loggedIn) {
            // Restore user-specific cart into session cart
            const userCart = JSON.parse(localStorage.getItem('learnify_cart_' + data.user.userID));
            if (userCart) {
                let currentCart = JSON.parse(localStorage.getItem('learnify_cart') || '[]');
                let merged = [...new Set([...currentCart, ...userCart])];
                localStorage.setItem('learnify_cart', JSON.stringify(merged));
            }

            // Intercept cart saves to mirror them to this user's persistent cart and update badge
            const origSet = localStorage.setItem;
            localStorage.setItem = function(k, v) {
                origSet.apply(this, arguments);
                if (k === 'learnify_cart') {
                    origSet.call(this, 'learnify_cart_' + data.user.userID, v);
                    updateGlobalCartBadge();
                }
            };

            // Swap Login/Register buttons with user info + logout
            const navRight = document.querySelector('.d-flex.align-items-center.gap-3');
            const loginBtn = document.getElementById('nav-login-btn');
            const registerBtn = document.getElementById('nav-register-btn');
            if (loginBtn) loginBtn.outerHTML = `<a href="student-panel.html" class="btn fs-5 px-3 py-2 rounded-pill font-sans fw-bold border-0" style="color:#111827; text-decoration: none;">My Courses</a>`;
            if (registerBtn) registerBtn.outerHTML = `<span class="font-sans fw-bold me-1" style="color:#111827;">Hi, ${data.user.name.split(' ')[0]}!</span><button onclick="doLogout()" class="btn px-4 py-2 rounded-pill fs-6 font-sans fw-bold border-0" style="background-color:#111827;color:white;">Log Out</button>`;
        }
    } catch { }
});

async function doLogout() {
    await fetch(`${API_BASE}/logout.php`);
    localStorage.removeItem('learnify_cart');
    location.reload();
}

async function submitLogin(e) {
    e.preventDefault();
    const errEl = document.getElementById('loginError');
    errEl.classList.add('d-none');
    const res = await fetch(`${API_BASE}/login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: document.getElementById('loginEmail').value, password: document.getElementById('loginPassword').value })
    });
    const data = await res.json();
    if (data.success) {
        bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
        location.reload();
    } else {
        errEl.textContent = data.message;
        errEl.classList.remove('d-none');
    }
}

async function submitRegister(e) {
    e.preventDefault();
    const errEl = document.getElementById('registerError');
    const sucEl = document.getElementById('registerSuccess');
    errEl.classList.add('d-none'); sucEl.classList.add('d-none');
    const res = await fetch(`${API_BASE}/register.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: document.getElementById('regName').value, email: document.getElementById('regEmail').value, password: document.getElementById('regPassword').value })
    });
    const data = await res.json();
    if (data.success) {
        sucEl.textContent = data.message;
        sucEl.classList.remove('d-none');
        document.getElementById('registerForm').reset();
        setTimeout(() => {
            bootstrap.Modal.getInstance(document.getElementById('registerModal')).hide();
            new bootstrap.Modal(document.getElementById('loginModal')).show();
        }, 1500);
    } else {
        errEl.textContent = data.message;
        errEl.classList.remove('d-none');
    }
}
