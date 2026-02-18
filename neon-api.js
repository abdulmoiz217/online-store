// ========================================
// Neon DB REST API Helper Functions
// ========================================

const NEON_API_BASE = 'https://ep-soft-poetry-aiictqbu.apirest.c-4.us-east-1.aws.neon.tech/neondb/rest/v1';

// ========================================
// PRODUCTS API
// ========================================

// Fetch all products from Neon DB
async function fetchProducts() {
  try {
    const response = await fetch(`${NEON_API_BASE}/products?order=created_at.desc`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    console.log(`✅ Fetched ${data.length} products from Neon DB`);
    return data;
  } catch (error) {
    console.error('❌ Error fetching products:', error.message);
    return [];
  }
}

// Add new product to Neon DB
async function addProduct(productData) {
  try {
    const response = await fetch(`${NEON_API_BASE}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        name: productData.name,
        price: parseFloat(productData.price),
        category: productData.category,
        description: productData.description || '',
        image: productData.image || `https://via.placeholder.com/250x250?text=${encodeURIComponent(productData.name)}`,
        sold: false,
        stock: productData.stock || 100
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add product');
    }
    
    const result = await response.json();
    console.log('✅ Product added:', result[0]);
    return result[0];
  } catch (error) {
    console.error('❌ Error adding product:', error.message);
    throw error;
  }
}

// Update product in Neon DB
async function updateProduct(id, productData) {
  try {
    const response = await fetch(`${NEON_API_BASE}/products?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        name: productData.name,
        price: parseFloat(productData.price),
        category: productData.category,
        description: productData.description,
        image: productData.image,
        sold: productData.sold,
        stock: productData.stock
      })
    });
    
    if (!response.ok) throw new Error('Failed to update product');
    const result = await response.json();
    console.log('✅ Product updated:', result[0]);
    return result[0];
  } catch (error) {
    console.error('❌ Error updating product:', error.message);
    throw error;
  }
}

// Delete product from Neon DB
async function deleteProduct(id) {
  try {
    const response = await fetch(`${NEON_API_BASE}/products?id=eq.${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) throw new Error('Failed to delete product');
    console.log('✅ Product deleted:', id);
    return true;
  } catch (error) {
    console.error('❌ Error deleting product:', error.message);
    throw error;
  }
}

// Toggle product sold status
async function toggleProductSold(id, currentStatus) {
  return await updateProduct(id, { sold: !currentStatus });
}

// ========================================
// ORDERS API
// ========================================

// Fetch all orders from Neon DB
async function fetchOrders() {
  try {
    const response = await fetch(`${NEON_API_BASE}/orders?order=created_at.desc`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    console.log(`✅ Fetched ${data.length} orders from Neon DB`);
    return data;
  } catch (error) {
    console.error('❌ Error fetching orders:', error.message);
    return [];
  }
}

// Place new order in Neon DB
async function placeOrder(orderData) {
  try {
    const response = await fetch(`${NEON_API_BASE}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        items: orderData.items,
        total: parseFloat(orderData.total),
        customer_info: orderData.customer_info,
        payment_method: orderData.payment_method,
        verification: orderData.verification || null,
        status: 'pending_verification'
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to place order');
    }
    
    const result = await response.json();
    console.log('✅ Order placed:', result[0]);
    return result[0];
  } catch (error) {
    console.error('❌ Error placing order:', error.message);
    throw error;
  }
}

// Update order status
async function updateOrderStatus(id, status) {
  try {
    const response = await fetch(`${NEON_API_BASE}/orders?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        status: status
      })
    });
    
    if (!response.ok) throw new Error('Failed to update order');
    const result = await response.json();
    console.log('✅ Order updated:', result[0]);
    return result[0];
  } catch (error) {
    console.error('❌ Error updating order:', error.message);
    throw error;
  }
}

// ========================================
// SETTINGS API
// ========================================

// Fetch store settings
async function fetchSettings() {
  try {
    const response = await fetch(`${NEON_API_BASE}/settings?limit=1`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    console.log('✅ Fetched settings from Neon DB');
    return data[0] || getDefaultSettings();
  } catch (error) {
    console.error('❌ Error fetching settings:', error.message);
    return getDefaultSettings();
  }
}

// Get default settings
function getDefaultSettings() {
  return {
    store_name: 'ShoeStore',
    address: 'Punjabi Club Kharader Custom House Karachi',
    contact: '03322942248',
    email: 'moizshabbir2248@gmail.com'
  };
}

// Update store settings
async function updateSettings(settingsData) {
  try {
    // Check if settings exist
    const existing = await fetch(`${NEON_API_BASE}/settings?limit=1`);
    const existingData = await existing.json();
    
    let response;
    if (existingData && existingData.length > 0) {
      // Update existing
      response = await fetch(`${NEON_API_BASE}/settings?id=eq.${existingData[0].id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(settingsData)
      });
    } else {
      // Insert new
      response = await fetch(`${NEON_API_BASE}/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(settingsData)
      });
    }
    
    if (!response.ok) throw new Error('Failed to save settings');
    const result = await response.json();
    console.log('✅ Settings saved:', result[0]);
    return result[0];
  } catch (error) {
    console.error('❌ Error saving settings:', error.message);
    throw error;
  }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Format currency
function formatCurrency(amount) {
  return 'Rs ' + parseFloat(amount).toFixed(2);
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('en-PK');
}

// Show notification
function showNotification(message, type = 'info') {
  // Create notification element if it doesn't exist
  let notification = document.getElementById('api-notification');
  if (!notification) {
    notification = document.createElement('div');
    notification.id = 'api-notification';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 25px;
      border-radius: 5px;
      color: white;
      font-weight: bold;
      z-index: 10000;
      opacity: 0;
      transform: translateX(400px);
      transition: all 0.3s ease;
    `;
    document.body.appendChild(notification);
  }
  
  // Set color based on type
  const colors = {
    success: '#27ae60',
    error: '#e74c3c',
    info: '#3498db',
    warning: '#f39c12'
  };
  
  notification.style.backgroundColor = colors[type] || colors.info;
  notification.textContent = message;
  
  // Show notification
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateX(0)';
  }, 10);
  
  // Hide after 3 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(400px)';
  }, 3000);
}

console.log('✅ Neon DB API Helper loaded');
