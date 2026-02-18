// ========================================
// ShoeStore - Neon DB Integration
// Fetches products from Neon DB REST API
// ========================================

// Currency conversion constants
const USD_TO_PKR_RATE = 300;
const SHIPPING_COST_PKR = 500;

// Global products array
let products = [];

// ========================================
// PRODUCT FUNCTIONS
// ========================================

// Fetch products from Neon DB API
async function loadProductsFromAPI() {
  try {
    products = await fetchProducts();
    console.log(`✅ Loaded ${products.length} products from Neon DB`);
    return products;
  } catch (error) {
    console.error('❌ Error loading products:', error.message);
    showNotification('Failed to load products', 'error');
    return [];
  }
}

// Currency conversion functions
function usdToPkr(usdAmount) {
  return usdAmount * USD_TO_PKR_RATE;
}

function getShippingCost() {
  return SHIPPING_COST_PKR;
}

// ========================================
// DISPLAY FUNCTIONS
// ========================================

// Function to load featured products (for index.html)
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
    const pricePKR = parseFloat(product.price).toFixed(2);
    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="product-image">
      <h3 class="product-name">${product.name}</h3>
      <p class="product-price">Rs ${pricePKR}</p>
      <p class="product-category">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
      <p class="product-description">${product.description || ''}</p>
      <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    container.appendChild(productCard);
  });
}

// Function to load all products (for products.html)
async function loadAllProducts() {
  const container = document.getElementById('products-container');
  if (!container) return;

  // Ensure products are loaded
  if (products.length === 0) {
    await loadProductsFromAPI();
  }

  container.innerHTML = '';

  // Get filter values
  const categoryFilter = document.getElementById('category-filter')?.value || 'all';
  const priceFilter = document.getElementById('price-filter')?.value || 60000;

  // Filter products
  let availableProducts = products.filter(p => !p.sold);
  
  if (categoryFilter !== 'all') {
    availableProducts = availableProducts.filter(p => p.category === categoryFilter);
  }
  
  availableProducts = availableProducts.filter(p => parseFloat(p.price) <= parseFloat(priceFilter));

  if (availableProducts.length === 0) {
    container.innerHTML = '<p>No products available matching your filters.</p>';
    return;
  }

  availableProducts.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    const pricePKR = parseFloat(product.price).toFixed(2);
    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="product-image">
      <h3 class="product-name">${product.name}</h3>
      <p class="product-price">Rs ${pricePKR}</p>
      <p class="product-category">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
      <p class="product-description">${product.description || ''}</p>
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
  showNotification(`${product.name} added to cart!`, 'success');
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
    const settings = await fetchSettings();
    updateStoreUI(settings);
  } catch (error) {
    console.log('Using default settings');
  }
}

function updateStoreUI(settings) {
  // Update logo/text in navigation
  const logoElements = document.querySelectorAll('.logo');
  logoElements.forEach(logo => {
    logo.textContent = settings.store_name || 'ShoeStore';
  });

  // Update page title
  const storeName = settings.store_name || 'ShoeStore';
  if (storeName) {
    document.title = `${storeName}`;
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
  console.log('🚀 ShoeStore initializing with Neon DB...');
  
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
