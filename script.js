// ========================================
// ShoeStore - API-Enabled Script
// Fetches products from Neon DB
// ========================================

// Currency conversion constants
const USD_TO_PKR_RATE = 300;
const SHIPPING_COST_PKR = 500;

// API Base URL (auto-detects based on environment)
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api' 
  : '/api';

// Global products array
let products = [];

// ========================================
// PRODUCT FUNCTIONS
// ========================================

// Fetch products from API
async function loadProductsFromAPI() {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    products = await response.json();
    console.log(`✅ Loaded ${products.length} products from database`);
    return products;
  } catch (error) {
    console.error('❌ Error loading products:', error.message);
    // Fallback to localStorage if API fails
    loadProductsFromStorage();
    return products;
  }
}

// Load products from localStorage (fallback)
function loadProductsFromStorage() {
  const storedProducts = localStorage.getItem('products');
  if (storedProducts) {
    try {
      products = JSON.parse(storedProducts);
      console.log(`⚠️ Loaded ${products.length} products from localStorage (fallback)`);
    } catch (e) {
      console.error('Error parsing localStorage products:', e);
      products = [];
    }
  }
}

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

// ========================================
// DISPLAY FUNCTIONS
// ========================================

// Function to load featured products
async function loadFeaturedProducts() {
  const container = document.getElementById('featured-products');
  if (!container) return;

  // Ensure products are loaded
  if (products.length === 0) {
    await loadProductsFromAPI();
  }

  const featuredProducts = products.filter(p => !p.sold).slice(0, 4);
  container.innerHTML = '';

  if (featuredProducts.length === 0) {
    container.innerHTML = '<p>No products available yet. Please check back later.</p>';
    return;
  }

  featuredProducts.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    const pricePKR = (product.price).toFixed(2);
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
async function loadAllProducts() {
  const container = document.getElementById('products-container');
  if (!container) return;

  // Ensure products are loaded
  if (products.length === 0) {
    await loadProductsFromAPI();
  }

  container.innerHTML = '';

  const availableProducts = products.filter(p => !p.sold);

  if (availableProducts.length === 0) {
    container.innerHTML = '<p>No products available yet. Please check back later.</p>';
    return;
  }

  availableProducts.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    const pricePKR = (product.price).toFixed(2);
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

// ========================================
// CART FUNCTIONS
// ========================================

// Shopping cart functionality (localStorage for user-specific cart)
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) {
    alert('Product not found!');
    return;
  }

  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
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

// ========================================
// STORE SETTINGS
// ========================================

// Apply store settings
async function applyStoreSettings() {
  try {
    // Try to fetch from API first
    const response = await fetch(`${API_BASE_URL}/settings`);
    if (response.ok) {
      const settings = await response.json();
      updateStoreUI(settings);
      return;
    }
  } catch (error) {
    console.log('Using localStorage for settings');
  }

  // Fallback to localStorage
  const settings = JSON.parse(localStorage.getItem('store-settings') || '{}');
  if (settings && Object.keys(settings).length > 0) {
    updateStoreUI(settings);
  }
}

function updateStoreUI(settings) {
  // Update logo/text in navigation
  const logoElements = document.querySelectorAll('.logo');
  logoElements.forEach(logo => {
    logo.textContent = settings.store_name || settings.name || 'ShoeStore';
  });

  // Update page title
  const storeName = settings.store_name || settings.name || 'ShoeStore';
  if (storeName) {
    document.title = `${storeName} - Home`;
  }

  // Update contact information on contact page
  updateContactInfo(settings);
}

function updateContactInfo(settings) {
  const contactItems = document.querySelectorAll('.contact-item');
  contactItems.forEach(item => {
    const header = item.querySelector('h3');
    if (!header) return;

    const pTag = item.querySelector('p');
    if (!pTag) return;

    if (header.textContent.trim() === 'Address' && settings.address) {
      pTag.textContent = settings.address;
    } else if (header.textContent.trim() === 'Phone' && settings.contact) {
      pTag.textContent = settings.contact;
    } else if (header.textContent.trim() === 'Email' && settings.email) {
      pTag.textContent = settings.email;
    }
  });
}

// ========================================
// INITIALIZATION
// ========================================

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
  console.log('🚀 ShoeStore initializing...');
  
  // Load products from API
  await loadProductsFromAPI();
  
  // Update cart count
  updateCartCount();
  
  // Apply store settings
  applyStoreSettings();

  // Load featured products on home page
  if (document.getElementById('featured-products')) {
    loadFeaturedProducts();
  }
  
  // Load all products on products page
  if (document.getElementById('products-container')) {
    loadAllProducts();
  }
  
  console.log('✅ ShoeStore initialized successfully');
});
