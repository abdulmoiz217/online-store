// ========================================
// Mega Admin Panel - API Integration
// This script overrides localStorage calls with API calls to Neon DB
// ========================================

const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api' 
  : '/api';

// Override global variables
let apiProducts = [];
let apiOrders = [];

// ========================================
// PRODUCT API FUNCTIONS
// ========================================

// Fetch products from API
async function fetchProductsFromAPI() {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    apiProducts = await response.json();
    console.log(`✅ Fetched ${apiProducts.length} products from database`);
    return apiProducts;
  } catch (error) {
    console.error('❌ Error fetching products:', error.message);
    showNotification('Failed to load products from database', 'error');
    return [];
  }
}

// Add product via API
async function addProductToAPI(productData) {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    
    if (!response.ok) throw new Error('Failed to add product');
    const result = await response.json();
    console.log('✅ Product added to database:', result.product.id);
    return result.product;
  } catch (error) {
    console.error('❌ Error adding product:', error.message);
    throw error;
  }
}

// Update product via API
async function updateProductInAPI(productId, productData) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    
    if (!response.ok) throw new Error('Failed to update product');
    const result = await response.json();
    console.log('✅ Product updated in database:', result.product.id);
    return result.product;
  } catch (error) {
    console.error('❌ Error updating product:', error.message);
    throw error;
  }
}

// Delete product via API
async function deleteProductFromAPI(productId) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) throw new Error('Failed to delete product');
    console.log('✅ Product deleted from database:', productId);
    return true;
  } catch (error) {
    console.error('❌ Error deleting product:', error.message);
    throw error;
  }
}

// ========================================
// ORDER API FUNCTIONS
// ========================================

// Fetch orders from API
async function fetchOrdersFromAPI() {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`);
    if (!response.ok) throw new Error('Failed to fetch orders');
    apiOrders = await response.json();
    console.log(`✅ Fetched ${apiOrders.length} orders from database`);
    return apiOrders;
  } catch (error) {
    console.error('❌ Error fetching orders:', error.message);
    return [];
  }
}

// Update order status via API
async function updateOrderStatusInAPI(orderId, status) {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    
    if (!response.ok) throw new Error('Failed to update order');
    const result = await response.json();
    console.log('✅ Order updated in database:', orderId);
    return result.order;
  } catch (error) {
    console.error('❌ Error updating order:', error.message);
    throw error;
  }
}

// ========================================
// SETTINGS API FUNCTIONS
// ========================================

// Fetch settings from API
async function fetchSettingsFromAPI() {
  try {
    const response = await fetch(`${API_BASE_URL}/settings`);
    if (!response.ok) throw new Error('Failed to fetch settings');
    const settings = await response.json();
    console.log('✅ Fetched settings from database');
    return settings;
  } catch (error) {
    console.error('❌ Error fetching settings:', error.message);
    return null;
  }
}

// Save settings via API
async function saveSettingsToAPI(settingsData) {
  try {
    const response = await fetch(`${API_BASE_URL}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settingsData)
    });
    
    if (!response.ok) throw new Error('Failed to save settings');
    const result = await response.json();
    console.log('✅ Settings saved to database');
    return result.settings;
  } catch (error) {
    console.error('❌ Error saving settings:', error.message);
    throw error;
  }
}

// ========================================
// OVERRIDE EXISTING FUNCTIONS
// ========================================

// Override loadData to use API
const originalLoadData = window.loadData;
window.loadData = async function() {
  await fetchProductsFromAPI();
  
  // Load carts from localStorage (user-specific, stays local)
  const storedCarts = localStorage.getItem('cart');
  if (storedCarts) {
    try {
      carts = JSON.parse(storedCarts);
    } catch (e) {
      console.error('Error loading carts:', e);
      carts = [];
    }
  }
  
  updateStats();
};

// Override updateStats to use API data
const originalUpdateStats = window.updateStats;
window.updateStats = async function() {
  document.getElementById('total-products').textContent = apiProducts.length;
  document.getElementById('active-carts').textContent = carts.length;
  
  // Calculate revenue from sold items
  const soldProducts = apiProducts.filter(p => p.sold);
  const productRevenuePKR = soldProducts.reduce((sum, p) => sum + parseFloat(p.price || 0), 0);
  
  // Calculate revenue from approved orders
  await fetchOrdersFromAPI();
  const approvedOrders = apiOrders.filter(order => order.status === 'approved');
  const orderRevenue = approvedOrders.reduce((sum, order) => sum + parseFloat(order.total || 0), 0);
  
  const totalRevenue = productRevenuePKR + orderRevenue;
  
  document.getElementById('total-revenue').textContent = 'Rs ' + totalRevenue.toFixed(2);
  document.getElementById('approved-orders').textContent = approvedOrders.length;
  document.getElementById('sold-items').textContent = soldProducts.length;
};

// Override loadProducts to use API data
const originalLoadProducts = window.loadProducts;
window.loadProducts = async function(page = 1) {
  const container = document.getElementById('product-list');
  if (!container) return;
  
  // Ensure we have latest products from API
  await fetchProductsFromAPI();
  
  // Filter products based on search
  const searchTerm = document.getElementById('product-search')?.value.toLowerCase() || '';
  const filteredProducts = apiProducts.filter(p =>
    p.name.toLowerCase().includes(searchTerm) ||
    p.category.toLowerCase().includes(searchTerm) ||
    (p.description && p.description.toLowerCase().includes(searchTerm))
  );
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageProducts = filteredProducts.slice(startIndex, endIndex);
  
  container.innerHTML = '';
  
  if (pageProducts.length === 0) {
    container.innerHTML = '<p>No products found.</p>';
    document.getElementById('product-pagination').innerHTML = '';
    return;
  }
  
  pageProducts.forEach(product => {
    const productDiv = document.createElement('div');
    productDiv.className = 'product-item';
    const pricePKR = parseFloat(product.price).toFixed(2);
    productDiv.innerHTML = `
      <div class="item-info">
        <h3>${product.name} - Rs ${pricePKR}</h3>
        <p><strong>Category:</strong> ${product.category}</p>
        <p><strong>Description:</strong> ${product.description ? product.description.substring(0, 100) : ''}${product.description && product.description.length > 100 ? '...' : ''}</p>
        <p><strong>Status:</strong> ${product.sold ? '<span style="color: green;">Sold</span>' : '<span style="color: orange;">Available</span>'}</p>
      </div>
      <div class="item-actions">
        <button class="action-btn btn-sold" onclick="toggleSoldStatus(${product.id})">${product.sold ? 'Mark Available' : 'Mark Sold'}</button>
        <button class="action-btn btn-delete" onclick="deleteProduct(${product.id})">Delete</button>
      </div>
    `;
    container.appendChild(productDiv);
  });
  
  updatePagination(totalPages, page);
};

// Override toggleSoldStatus to use API
const originalToggleSoldStatus = window.toggleSoldStatus;
window.toggleSoldStatus = async function(productId) {
  const product = apiProducts.find(p => p.id === productId);
  if (!product) {
    showNotification('Product not found', 'error');
    return;
  }
  
  try {
    const newSoldStatus = !product.sold;
    await updateProductInAPI(productId, { ...product, sold: newSoldStatus });
    
    // Refresh products
    await fetchProductsFromAPI();
    loadProducts(currentPage);
    updateStats();
    
    showNotification(`Product marked as ${newSoldStatus ? 'sold' : 'available'}`, 'success');
  } catch (error) {
    showNotification('Failed to update product status', 'error');
  }
};

// Override deleteProduct to use API
const originalDeleteProduct = window.deleteProduct;
window.deleteProduct = async function(productId) {
  if (!confirm('Are you sure you want to delete this product?')) {
    return;
  }
  
  try {
    await deleteProductFromAPI(productId);
    
    // Refresh products
    await fetchProductsFromAPI();
    loadProducts(currentPage);
    updateStats();
    
    showNotification('Product deleted successfully', 'success');
  } catch (error) {
    showNotification('Failed to delete product', 'error');
  }
};

// Override loadOrders to use API
const originalLoadOrders = window.loadOrders;
window.loadOrders = async function() {
  await fetchOrdersFromAPI();
  
  const ordersList = document.getElementById('orders-list');
  
  if (apiOrders.length === 0) {
    ordersList.innerHTML = '<p>No orders yet.</p>';
    return;
  }
  
  // Sort orders by date (newest first)
  apiOrders.sort((a, b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date));
  
  let ordersHtml = '<div class="orders-container" style="display: grid; gap: 15px;">';
  
  apiOrders.forEach(order => {
    const statusClass = order.status === 'approved' ? 'status-approved' :
                       order.status === 'rejected' ? 'status-rejected' : 'status-pending';
    
    const customerInfo = typeof order.customer_info === 'string' 
      ? JSON.parse(order.customer_info) 
      : order.customer_info;
    
    const items = typeof order.items === 'string' 
      ? JSON.parse(order.items) 
      : order.items;
    
    const verification = order.verification && typeof order.verification === 'string'
      ? JSON.parse(order.verification)
      : order.verification;

    ordersHtml += `
    <div class="order-card" style="border: 1px solid #ddd; padding: 15px; border-radius: 5px; background-color: #f9f9f9;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <h4>Order #${order.id}</h4>
        <span class="order-status ${statusClass}" style="padding: 3px 8px; border-radius: 3px; font-size: 12px; font-weight: bold;">
          ${order.status.toUpperCase()}
        </span>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
        <div>
          <h5>Customer Info:</h5>
          <p><strong>Name:</strong> ${customerInfo.firstName} ${customerInfo.lastName}</p>
          <p><strong>Email:</strong> ${customerInfo.email}</p>
          <p><strong>Phone:</strong> ${customerInfo.phone}</p>
          <p><strong>Address:</strong> ${customerInfo.address}, ${customerInfo.city}</p>
        </div>

        <div>
          <h5>Payment Info:</h5>
          <p><strong>Method:</strong> ${order.payment_method}</p>
          <p><strong>Total:</strong> Rs ${parseFloat(order.total).toFixed(2)}</p>
          <p><strong>Date:</strong> ${new Date(order.created_at || order.date).toLocaleString()}</p>
          ${verification ? `<p><strong>Transaction ID:</strong> ${verification.transactionId || 'Not provided'}</p>` : ''}
        </div>
      </div>

      ${verification && verification.screenshot ? `
      <div style="margin: 15px 0;">
        <h5>Payment Screenshot:</h5>
        <img src="${verification.screenshot}" alt="Payment Screenshot" style="max-width: 200px; max-height: 200px; border: 1px solid #ddd; border-radius: 5px;" onclick="openScreenshot('${verification.screenshot}', '${order.payment_method}', '${verification.transactionId || 'N/A'}')">
        <p style="font-size: 12px; color: #666; margin-top: 5px;">Click image to verify</p>
      </div>
      ` : ''}

      <div style="margin-top: 15px;">
        <h5>Items:</h5>
        <ul style="list-style-type: none; padding: 0;">
          ${items.map(item => `
          <li style="padding: 5px 0; border-bottom: 1px solid #eee;">
            ${item.name} x${item.quantity} - Rs ${(item.price * item.quantity).toFixed(2)}
          </li>
          `).join('')}
        </ul>
      </div>

      ${order.status === 'pending_verification' ? `
      <div style="margin-top: 15px; display: flex; gap: 10px;">
        <button class="btn-approve" onclick="updateOrderStatus(${order.id}, 'approved')"
                style="background-color: #27ae60; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer;">
          Approve
        </button>
        <button class="btn-reject" onclick="updateOrderStatus(${order.id}, 'rejected')"
                style="background-color: #e74c3c; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer;">
          Reject
        </button>
      </div>
      ` : ''}
    </div>
    `;
  });
  
  ordersHtml += '</div>';
  ordersList.innerHTML = ordersHtml;
};

// Override updateOrderStatus to use API
const originalUpdateOrderStatus = window.updateOrderStatus;
window.updateOrderStatus = async function(orderId, status) {
  if (!confirm(`Are you sure you want to ${status} this order?`)) {
    return;
  }
  
  try {
    await updateOrderStatusInAPI(orderId, status);
    
    // Reload orders
    await loadOrders();
    updateStats();
    
    alert(`Order #${orderId} has been ${status}.`);
  } catch (error) {
    alert('Failed to update order: ' + error.message);
  }
};

// Override saveSettings to use API
const originalSaveSettings = window.saveSettings;
window.saveSettings = async function() {
  const settings = {
    store_name: document.getElementById('store-name').value,
    address: document.getElementById('store-address').value,
    contact: document.getElementById('contact-number').value,
    email: document.getElementById('email').value
  };
  
  try {
    await saveSettingsToAPI(settings);
    
    // Also save to localStorage for offline fallback
    localStorage.setItem('store-settings', JSON.stringify(settings));
    
    showNotification('Settings saved to database!', 'success');
  } catch (error) {
    showNotification('Failed to save settings', 'error');
  }
};

// Override add product form submission
const originalFormSubmit = document.getElementById('product-form')?.addEventListener;
document.getElementById('product-form')?.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const name = document.getElementById('product-name').value.trim();
  const price = parseFloat(document.getElementById('product-price').value);
  const category = document.getElementById('product-category').value;
  const description = document.getElementById('product-description').value.trim();
  const imageValue = document.getElementById('product-image').value;
  
  // Validation
  if (!name) {
    showNotification('Please enter a product name', 'error');
    return;
  }
  
  if (isNaN(price) || price <= 0) {
    showNotification('Please enter a valid price greater than 0', 'error');
    return;
  }
  
  if (!category) {
    showNotification('Please select a category', 'error');
    return;
  }
  
  if (!description) {
    showNotification('Please enter a description', 'error');
    return;
  }
  
  try {
    const newProduct = {
      name: name,
      price: price,
      category: category,
      description: description,
      image: imageValue || `https://via.placeholder.com/250x250?text=${encodeURIComponent(name)}`,
      sold: false
    };
    
    await addProductToAPI(newProduct);
    
    // Reset form
    document.getElementById('product-form').reset();
    document.getElementById('image-preview').innerHTML = '';
    document.getElementById('product-image-file').value = '';
    document.getElementById('product-image').value = '';
    
    // Refresh products
    await fetchProductsFromAPI();
    loadProducts();
    updateStats();
    
    showNotification('Product added to database successfully!', 'success');
  } catch (error) {
    showNotification('Failed to add product: ' + error.message, 'error');
  }
});

// ========================================
// EXPORT FUNCTIONS (Updated for API)
// ========================================

window.exportProducts = async function() {
  await fetchProductsFromAPI();
  const dataStr = JSON.stringify(apiProducts, null, 2);
  downloadFile('products.json', dataStr);
};

window.exportAllData = async function() {
  await fetchProductsFromAPI();
  await fetchOrdersFromAPI();
  const settings = await fetchSettingsFromAPI();
  
  const allData = {
    products: apiProducts,
    orders: apiOrders,
    settings: settings || {},
    exportedAt: new Date().toISOString()
  };
  const dataStr = JSON.stringify(allData, null, 2);
  downloadFile('all-store-data.json', dataStr);
};

// ========================================
// INITIALIZATION
// ========================================

// Override DOMContentLoaded to fetch from API first
document.addEventListener('DOMContentLoaded', async function() {
  console.log('🚀 Admin Panel initializing with Neon DB...');
  
  // Load initial data from API
  await fetchProductsFromAPI();
  await fetchOrdersFromAPI();
  
  // Call original initialization if it exists
  if (originalLoadData) {
    originalLoadData();
  }
  
  loadData();
  loadProducts();
  
  console.log('✅ Admin Panel initialized with database');
});

console.log('✅ API Integration loaded - All admin functions now use Neon DB');
