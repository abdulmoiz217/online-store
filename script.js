// Currency conversion constants
const USD_TO_PKR_RATE = 300; // 1 USD = 300 PKR (adjust as needed)
const SHIPPING_COST_PKR = 500; // Fixed shipping cost in PKR

// Currency conversion functions
function usdToPkr(usdAmount) {
    return usdAmount * USD_TO_PKR_RATE;
}

function pkrToUsd(pkrAmount) {
    return pkrAmount / USD_TO_PKR_RATE;
}

function getShippingCost() {
    return SHIPPING_COST_PKR;
}

// Simple product management system
let products = [];

// Load products from localStorage if available
function loadProductsFromStorage() {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
        try {
            const parsedProducts = JSON.parse(storedProducts);
            // Validate and add products with proper data
            parsedProducts.forEach(product => {
                if (product.name && product.name.trim() !== '' && 
                    product.price != null && !isNaN(parseFloat(product.price)) && 
                    parseFloat(product.price) > 0) {
                    // Check if product already exists (avoid duplicates)
                    const exists = products.some(p => p.id === product.id);
                    if (!exists) {
                        products.push(product);
                    }
                }
            });
        } catch (e) {
            console.log('Error loading products from localStorage');
        }
    }
}

// Save products to localStorage
function saveProductsToStorage() {
    localStorage.setItem('products', JSON.stringify(products));
}

// Initialize products from storage
loadProductsFromStorage();

// Function to load featured products
function loadFeaturedProducts() {
    const container = document.getElementById('featured-products');
    if (!container) return;

    const featuredProducts = products.filter(p => !p.sold).slice(0, 4);
    container.innerHTML = '';

    if (featuredProducts.length === 0) {
        container.innerHTML = '<p>No products available yet. Please check back later.</p>';
        return;
    }

    featuredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        // Convert price from USD to PKR
        const pricePKR = usdToPkr(product.price).toFixed(2);
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">Rs ${pricePKR}</p>
            <p class="product-category">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
            <p class="product-description">${product.description}</p>
            <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        container.appendChild(productCard);
    });
}

// Function to load all products
function loadAllProducts() {
    const container = document.getElementById('products-container');
    if (!container) return;

    container.innerHTML = '';

    const availableProducts = products.filter(p => !p.sold);

    if (availableProducts.length === 0) {
        container.innerHTML = '<p>No products available yet. Please check back later.</p>';
        return;
    }

    availableProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        // Convert price from USD to PKR
        const pricePKR = usdToPkr(product.price).toFixed(2);
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">Rs ${pricePKR}</p>
            <p class="product-category">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
            <p class="product-description">${product.description}</p>
            <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        container.appendChild(productCard);
    });
}

// Shopping cart functionality
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        // Store the original USD price in the cart
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price, // Keep original USD price
            image: product.image,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(`${product.name} added to cart!`);
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('#cart-count');
    cartCountElements.forEach(element => {
        element.textContent = count.toString();
    });
}

// Apply store settings to the website
function applyStoreSettings() {
    // Get store settings from localStorage
    const settings = JSON.parse(localStorage.getItem('store-settings') || null);
    
    if (settings) {
        // Update logo/text in navigation
        const logoElements = document.querySelectorAll('.logo');
        logoElements.forEach(logo => {
            logo.textContent = settings.name || 'ShoeStore';
        });
        
        // Update page titles if needed
        if (settings.name) {
            document.title = `${settings.name} - Home`;
        }
        
        // Update contact information if on contact page
        // Find the contact item with "Address" header and update its paragraph
        const addressItems = document.querySelectorAll('.contact-item');
        addressItems.forEach(item => {
            const header = item.querySelector('h3');
            if (header && header.textContent.trim() === 'Address') {
                const pTag = item.querySelector('p');
                if (pTag) {
                    pTag.textContent = settings.address || 'Default Address';
                }
            }
        });

        // Find the contact item with "Phone" header and update its paragraph
        const phoneItems = document.querySelectorAll('.contact-item');
        phoneItems.forEach(item => {
            const header = item.querySelector('h3');
            if (header && header.textContent.trim() === 'Phone') {
                const pTag = item.querySelector('p');
                if (pTag) {
                    pTag.textContent = settings.contact || 'Default Phone';
                }
            }
        });

        // Find the contact item with "Email" header and update its paragraph
        const emailItems = document.querySelectorAll('.contact-item');
        emailItems.forEach(item => {
            const header = item.querySelector('h3');
            if (header && header.textContent.trim() === 'Email') {
                const pTag = item.querySelector('p');
                if (pTag) {
                    pTag.textContent = settings.email || 'default@email.com';
                }
            }
        });
    }
}

// Listen for changes in localStorage from other tabs
window.addEventListener('storage', function(e) {
    // If settings were updated in another tab, refresh them
    if (e.key === 'settings-update' || e.key === 'store-settings' || e.key === 'products') {
        // Small delay to ensure the data is written before reading
        setTimeout(() => {
            applyStoreSettings();
            
            // If on a product page, reload products
            if (document.getElementById('featured-products')) {
                loadFeaturedProducts();
            }
            if (document.getElementById('products-container')) {
                loadAllProducts();
            }
        }, 100);
    }
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    applyStoreSettings(); // Apply store settings

    if (document.getElementById('featured-products')) {
        loadFeaturedProducts();
    }
    if (document.getElementById('products-container')) {
        loadAllProducts();
    }
});