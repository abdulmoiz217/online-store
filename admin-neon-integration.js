// ========================================
// Mega Admin Panel - Neon DB Integration
// Full CRUD operations via REST API
// ========================================

let products = [];
let orders = [];
let currentPage = 1;
const itemsPerPage = 10;

// ========================================
// LOAD DATA
// ========================================

// Load all products from Neon DB
async function loadProducts(page = 1) {
  const container = document.getElementById('product-list');
  if (!container) return;

  try {
    products = await fetchProducts();
    
    // Filter products based on search
    const searchTerm = document.getElementById('product-search')?.value.toLowerCase() || '';
    const filteredProducts = products.filter(p =>
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
      const pricePKR = formatCurrency(product.price);
      productDiv.innerHTML = `
        <div class="item-info">
          <h3>${product.name} - ${pricePKR}</h3>
          <p><strong>Category:</strong> ${product.category}</p>
          <p><strong>Description:</strong> ${product.description ? product.description.substring(0, 100) : ''}${product.description && product.description.length > 100 ? '...' : ''}</p>
          <p><strong>Status:</strong> ${product.sold ? '<span style="color: green;">Sold</span>' : '<span style="color: orange;">Available</span>'}</p>
          ${product.stock !== undefined ? `<p><strong>Stock:</strong> ${product.stock}</p>` : ''}
        </div>
        <div class="item-actions">
          <button class="action-btn btn-sold" onclick="toggleProductSoldStatus(${product.id})">${product.sold ? 'Mark Available' : 'Mark Sold'}</button>
          <button class="action-btn btn-edit" onclick="editProduct(${product.id})">Edit</button>
          <button class="action-btn btn-delete" onclick="deleteProduct(${product.id})">Delete</button>
        </div>
      `;
      container.appendChild(productDiv);
    });

    updatePagination(totalPages, page);
  } catch (error) {
    console.error('Error loading products:', error);
    container.innerHTML = '<p>Error loading products. Please refresh the page.</p>';
  }
}

// Load all orders from Neon DB
async function loadOrders() {
  const ordersList = document.getElementById('orders-list');
  if (!ordersList) return;

  try {
    orders = await fetchOrders();
    
    if (orders.length === 0) {
      ordersList.innerHTML = '<p>No orders yet.</p>';
      return;
    }

    let ordersHtml = '<div class="orders-container" style="display: grid; gap: 15px;">';
    
    orders.forEach(order => {
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
            <p><strong>Total:</strong> ${formatCurrency(order.total)}</p>
            <p><strong>Date:</strong> ${formatDate(order.created_at)}</p>
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
              ${item.name} x${item.quantity} - ${formatCurrency(item.price * item.quantity)}
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
  } catch (error) {
    console.error('Error loading orders:', error);
    ordersList.innerHTML = '<p>Error loading orders. Please refresh the page.</p>';
  }
}

// ========================================
// PRODUCT CRUD OPERATIONS
// ========================================

// Add product form submission
async function handleAddProduct(e) {
  e.preventDefault();

  const name = document.getElementById('product-name').value.trim();
  const price = parseFloat(document.getElementById('product-price').value);
  const category = document.getElementById('product-category').value;
  const description = document.getElementById('product-description').value.trim();
  const imageValue = document.getElementById('product-image').value;
  const stock = parseInt(document.getElementById('product-stock')?.value) || 100;

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

  try {
    await addProduct({
      name,
      price,
      category,
      description,
      image: imageValue,
      stock
    });

    // Reset form
    document.getElementById('product-form').reset();
    document.getElementById('image-preview').innerHTML = '';

    // Refresh product list
    await loadProducts();
    await updateStats();

    showNotification('Product added successfully!', 'success');
  } catch (error) {
    showNotification('Failed to add product: ' + error.message, 'error');
  }
}

// Toggle product sold status
async function toggleProductSoldStatus(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) {
    showNotification('Product not found', 'error');
    return;
  }

  try {
    await toggleProductSold(productId, product.sold);
    await loadProducts(currentPage);
    await updateStats();
    showNotification(`Product marked as ${!product.sold ? 'sold' : 'available'}`, 'success');
  } catch (error) {
    showNotification('Failed to update product status', 'error');
  }
}

// Delete product
async function deleteProduct(productId) {
  if (!confirm('Are you sure you want to delete this product?')) {
    return;
  }

  try {
    await deleteProduct(productId);
    await loadProducts(currentPage);
    await updateStats();
    showNotification('Product deleted successfully', 'success');
  } catch (error) {
    showNotification('Failed to delete product: ' + error.message, 'error');
  }
}

// Edit product (placeholder - you can implement modal editing)
async function editProduct(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) {
    showNotification('Product not found', 'error');
    return;
  }

  // For now, just show an alert - you can implement a modal editor
  alert(`Edit product: ${product.name}\n\nYou can implement a modal editor here.\n\nCurrent price: ${formatCurrency(product.price)}`);
}

// ========================================
// ORDER OPERATIONS
// ========================================

// Update order status
async function updateOrderStatus(orderId, status) {
  if (!confirm(`Are you sure you want to ${status} this order?`)) {
    return;
  }

  try {
    await updateOrderStatusAPI(orderId, status);
    await loadOrders();
    await updateStats();
    showNotification(`Order #${orderId} has been ${status}`, 'success');
  } catch (error) {
    showNotification('Failed to update order: ' + error.message, 'error');
  }
}

// Rename to avoid conflict
async function updateOrderStatusAPI(orderId, status) {
  return await updateOrderStatus(orderId, status);
}

// ========================================
// STATS & UTILITIES
// ========================================

// Update dashboard statistics
async function updateStats() {
  try {
    const totalProductsEl = document.getElementById('total-products');
    const activeCartsEl = document.getElementById('active-carts');
    const totalRevenueEl = document.getElementById('total-revenue');
    const approvedOrdersEl = document.getElementById('approved-orders');
    const soldItemsEl = document.getElementById('sold-items');

    if (totalProductsEl) totalProductsEl.textContent = products.length;
    
    // Carts are still in localStorage
    const carts = JSON.parse(localStorage.getItem('cart') || '[]');
    if (activeCartsEl) activeCartsEl.textContent = carts.length;

    // Calculate revenue
    const soldProducts = products.filter(p => p.sold);
    const productRevenue = soldProducts.reduce((sum, p) => sum + parseFloat(p.price || 0), 0);

    const approvedOrders = orders.filter(o => o.status === 'approved');
    const orderRevenue = approvedOrders.reduce((sum, o) => sum + parseFloat(o.total || 0), 0);

    const totalRevenue = productRevenue + orderRevenue;

    if (totalRevenueEl) totalRevenueEl.textContent = formatCurrency(totalRevenue);
    if (approvedOrdersEl) approvedOrdersEl.textContent = approvedOrders.length;
    if (soldItemsEl) soldItemsEl.textContent = soldProducts.length;
  } catch (error) {
    console.error('Error updating stats:', error);
  }
}

// Update pagination controls
function updatePagination(totalPages, currentPage) {
  const paginationContainer = document.getElementById('product-pagination');
  if (!paginationContainer) return;

  if (totalPages <= 1) {
    paginationContainer.innerHTML = '';
    return;
  }

  let paginationHTML = '';

  if (currentPage > 1) {
    paginationHTML += `<button class="page-btn" onclick="loadProducts(${currentPage - 1})">Previous</button>`;
  }

  for (let i = 1; i <= totalPages; i++) {
    paginationHTML += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="loadProducts(${i})">${i}</button>`;
  }

  if (currentPage < totalPages) {
    paginationHTML += `<button class="page-btn" onclick="loadProducts(${currentPage + 1})">Next</button>`;
  }

  paginationContainer.innerHTML = paginationHTML;
}

// Search products
function searchProducts() {
  loadProducts(1);
}

// Reset form
function resetForm() {
  document.getElementById('product-form').reset();
  document.getElementById('image-preview').innerHTML = '';
  document.getElementById('product-image-file').value = '';
  document.getElementById('product-image').value = '';
}

// Export functions
function exportProducts() {
  const dataStr = JSON.stringify(products, null, 2);
  downloadFile('products.json', dataStr);
}

function exportOrders() {
  const dataStr = JSON.stringify(orders, null, 2);
  downloadFile('orders.json', dataStr);
}

function exportAllData() {
  const allData = {
    products: products,
    orders: orders,
    exportedAt: new Date().toISOString()
  };
  const dataStr = JSON.stringify(allData, null, 2);
  downloadFile('all-store-data.json', dataStr);
}

function downloadFile(filename, content) {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Open screenshot modal
function openScreenshot(screenshotSrc, paymentMethod, transactionId) {
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    flex-direction: column;
  `;

  const content = document.createElement('div');
  content.style.cssText = `
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    max-width: 90%;
    max-height: 90%;
    overflow: auto;
    text-align: center;
  `;

  content.innerHTML = `
    <h3>Payment Verification</h3>
    <p><strong>Payment Method:</strong> ${paymentMethod}</p>
    <p><strong>Transaction ID:</strong> ${transactionId}</p>
    <img src="${screenshotSrc}" alt="Payment Screenshot" style="max-width: 100%; max-height: 60vh; border: 1px solid #ddd; margin: 10px 0;">
    <div style="margin-top: 15px;">
      <button onclick="this.parentElement.parentElement.parentElement.remove()"
              style="background-color: #95a5a6; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
        Close
      </button>
    </div>
  `;

  modal.appendChild(content);
  document.body.appendChild(modal);
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', async function() {
  console.log('🚀 Admin Panel initializing with Neon DB...');
  
  // Load initial data
  await loadProducts();
  await updateStats();
  
  console.log('✅ Admin Panel initialized');
});

console.log('✅ Neon DB Admin Integration loaded');
