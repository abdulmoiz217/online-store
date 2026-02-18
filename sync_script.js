// Real-time synchronization script
// This script should be added to all HTML pages to enable real-time updates

// Function to update store information across the site
function updateStoreInfo() {
    // Get store settings from localStorage
    const settings = JSON.parse(localStorage.getItem('store-settings') || '{}');
    
    // Update logo/name
    const logoElements = document.querySelectorAll('.logo');
    logoElements.forEach(logo => {
        if (settings.name) {
            logo.textContent = settings.name;
        }
    });
    
    // Update page title
    if (settings.name) {
        document.title = `${settings.name} - ${document.title.split('-')[1] || 'Store'}`;
    }
    
    // Update contact information if elements exist
    if (settings.address) {
        // Find the contact item with "Address" header and update its paragraph
        const addressItems = document.querySelectorAll('.contact-item');
        addressItems.forEach(item => {
            const header = item.querySelector('h3');
            if (header && header.textContent.trim() === 'Address') {
                const pTag = item.querySelector('p');
                if (pTag) {
                    pTag.textContent = settings.address;
                }
            }
        });
    }
    
    if (settings.contact) {
        // Find the contact item with "Phone" header and update its paragraph
        const phoneItems = document.querySelectorAll('.contact-item');
        phoneItems.forEach(item => {
            const header = item.querySelector('h3');
            if (header && header.textContent.trim() === 'Phone') {
                const pTag = item.querySelector('p');
                if (pTag) {
                    pTag.textContent = settings.contact;
                }
            }
        });
    }
    
    if (settings.email) {
        // Find the contact item with "Email" header and update its paragraph
        const emailItems = document.querySelectorAll('.contact-item');
        emailItems.forEach(item => {
            const header = item.querySelector('h3');
            if (header && header.textContent.trim() === 'Email') {
                const pTag = item.querySelector('p');
                if (pTag) {
                    pTag.textContent = settings.email;
                }
            }
        });
    }
}

// Listen for changes in localStorage from other tabs
window.addEventListener('storage', function(e) {
    // If settings were updated in another tab, refresh them
    if (e.key === 'settings-update' || e.key === 'store-settings') {
        // Small delay to ensure the data is written before reading
        setTimeout(updateStoreInfo, 100);
    }
    
    // If products were updated in another tab, refresh product listings
    if (e.key === 'products') {
        setTimeout(() => {
            // Reload products if functions exist
            if (typeof loadFeaturedProducts === 'function') {
                loadFeaturedProducts();
            }
            if (typeof loadAllProducts === 'function') {
                loadAllProducts();
            }
        }, 100);
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', updateStoreInfo);