// ==================== //
// Configuration //
// ==================== //

const BUSINESS_EMAIL = 'markomido9101@gmail.com'; // Order notifications email

// ==================== //
// Shopping Cart State //
// ==================== //

let cart = [];

// ==================== //
// Cart Functions //
// ==================== //

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();
    showNotification(`تمت إضافة ${product.name} إلى السلة`);

    // Add pulse animation to cart button
    const cartBtn = document.getElementById('cartBtn');
    cartBtn.style.animation = 'none';
    setTimeout(() => {
        cartBtn.style.animation = 'pulse 0.5s ease';
    }, 10);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);

    if (item) {
        item.quantity += change;

        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
}

function updateCart() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const totalPrice = document.getElementById('totalPrice');
    const checkoutBtn = document.getElementById('checkoutBtn');

    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';

    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <p>السلة فارغة</p>
            </div>
        `;
        checkoutBtn.disabled = true;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.price} د.ل</div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        <button class="remove-item" onclick="removeFromCart(${item.id})">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                            حذف
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        checkoutBtn.disabled = false;
    }

    // Update total price
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalPrice.textContent = `${total} د.ل`;

    // Save to localStorage
    localStorage.setItem('audix-cart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('audix-cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}

// ==================== //
// Modal Functions //
// ==================== //

function openCart() {
    const cartModal = document.getElementById('cartModal');
    cartModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    const cartModal = document.getElementById('cartModal');
    cartModal.classList.remove('active');
    document.body.style.overflow = '';
}

function openCheckout() {
    // Close cart modal
    closeCart();

    // Populate checkout summary
    const checkoutSummary = document.getElementById('checkoutOrderSummary');
    const checkoutTotal = document.getElementById('checkoutTotal');

    if (cart.length === 0) {
        showNotification('السلة فارغة! يرجى إضافة منتجات أولاً');
        return;
    }

    checkoutSummary.innerHTML = cart.map(item => `
        <div class="summary-item">
            <span>${item.name} × ${item.quantity}</span>
            <span>${item.price * item.quantity} د.ل</span>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    checkoutTotal.textContent = `${total} د.ل`;

    // Show checkout modal
    const checkoutModal = document.getElementById('checkoutModal');
    checkoutModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCheckout() {
    const checkoutModal = document.getElementById('checkoutModal');
    checkoutModal.classList.remove('active');
    document.body.style.overflow = '';
}

// ==================== //
// Buy Now Function //
// ==================== //

function buyNow(product) {
    // Clear cart and add only this product
    cart = [{
        ...product,
        quantity: 1
    }];
    updateCart();

    // Open checkout directly
    openCheckout();
}

// ==================== //
// Checkout Form Submission //
// ==================== //

async function submitOrder(formData) {
    const submitBtn = document.querySelector('.confirm-order-btn');
    const originalBtnContent = submitBtn.innerHTML;

    // Show loading state
    submitBtn.innerHTML = '<span>جاري الإرسال...</span>';
    submitBtn.disabled = true;

    const orderData = {
        customer: {
            name: formData.get('customerName'),
            phone: formData.get('customerPhone'),
            city: formData.get('customerCity'),
            address: formData.get('customerAddress'),
            notes: formData.get('customerNotes') || 'لا توجد ملاحظات'
        },
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        timestamp: new Date().toLocaleString('ar-LY', { timeZone: 'Africa/Tripoli' })
    };

    // Determine API URL based on environment
    const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3000/api/order'
        : '/api/order';

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });

        const result = await response.json();

        if (result.success) {
            showNotification('تم إرسال الطلب بنجاح! شكراً لك.');

            // Close modal and clear cart after a delay
            setTimeout(() => {
                closeCheckout();
                cart = [];
                updateCart();
                submitBtn.innerHTML = originalBtnContent;
                submitBtn.disabled = false;
            }, 2000);
        } else {
            throw new Error('Server returned error');
        }

    } catch (error) {
        console.error('Error:', error);
        showNotification('حدث خطأ أثناء الإرسال. يرجى التأكد من تشغيل السيرفر والمحاولة مرة أخرى.');
        submitBtn.innerHTML = originalBtnContent;
        submitBtn.disabled = false;
    }
}

// ==================== //
// Notification System //
// ==================== //

function showNotification(message) {
    // Remove existing notification if any
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <span>${message}</span>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #0066FF 0%, #00A3FF 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 102, 255, 0.3);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-weight: 600;
        z-index: 3000;
        animation: slide-in-left 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slide-out-left 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ==================== //
// Event Listeners //
// ==================== //

document.addEventListener('DOMContentLoaded', () => {
    // Load cart from localStorage
    loadCart();

    // Cart button
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', openCart);
    }

    // Close cart button
    const closeCartBtn = document.getElementById('closeCart');
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCart);
    }

    // Cart overlay
    const cartOverlay = document.getElementById('cartOverlay');
    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCart);
    }

    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const product = JSON.parse(button.dataset.product);
            addToCart(product);

            // Add success animation to button
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
            }, 100);
        });
    });

    // Buy Now buttons
    const buyNowButtons = document.querySelectorAll('.buy-now-btn');
    buyNowButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const product = JSON.parse(button.dataset.product);
            buyNow(product);
        });
    });

    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', openCheckout);
    }

    // Close checkout button
    const closeCheckoutBtn = document.getElementById('closeCheckout');
    if (closeCheckoutBtn) {
        closeCheckoutBtn.addEventListener('click', closeCheckout);
    }

    // Checkout overlay
    const checkoutOverlay = document.getElementById('checkoutOverlay');
    if (checkoutOverlay) {
        checkoutOverlay.addEventListener('click', closeCheckout);
    }

    // Checkout form submission
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(checkoutForm);
            submitOrder(formData);
        });
    }

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Update active link
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // Show success message
            showNotification('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.');

            // Reset form
            contactForm.reset();
        });
    }

    // Close success modal button
    const closeSuccessBtn = document.getElementById('closeSuccessBtn');
    if (closeSuccessBtn) {
        closeSuccessBtn.addEventListener('click', closeSuccessModal);
    }

    // Success overlay
    const successOverlay = document.querySelector('.success-overlay');
    if (successOverlay) {
        successOverlay.addEventListener('click', closeSuccessModal);
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe product cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Observe feature boxes
    const featureBoxes = document.querySelectorAll('.feature-box');
    featureBoxes.forEach((box, index) => {
        box.style.opacity = '0';
        box.style.transform = 'translateX(30px)';
        box.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(box);
    });
});

// ==================== //
// Animation Styles //
// ==================== //

// Add keyframes for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    @keyframes slide-in-left {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slide-out-left {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);
