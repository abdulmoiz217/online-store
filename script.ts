// Product interface
interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    image: string;
    description: string;
    sold: boolean;
}

// Cart item interface
interface CartItem {
    id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
}

// Cart class for better organization
class ShoppingCart {
    private items: CartItem[] = [];

    constructor() {
        this.loadFromStorage();
    }

    // Load cart from localStorage
    private loadFromStorage(): void {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            this.items = JSON.parse(storedCart);
        }
    }

    // Save cart to localStorage
    private saveToStorage(): void {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    // Add item to cart
    addItem(productId: number, products: Product[]): void {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = this.items.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }

        this.saveToStorage();
        this.updateUI();
    }

    // Remove item from cart
    removeItem(productId: number): void {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveToStorage();
        this.updateUI();
    }

    // Update item quantity
    updateQuantity(productId: number, newQuantity: number): void {
        if (newQuantity <= 0) {
            this.removeItem(productId);
            return;
        }

        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
            this.saveToStorage();
            this.updateUI();
        }
    }

    // Get cart total
    getTotal(): number {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Get cart count
    getCount(): number {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    // Update UI elements showing cart count
    updateUI(): void {
        const count = this.getCount();
        const cartCountElements = document.querySelectorAll('#cart-count');
        cartCountElements.forEach(element => {
            element.textContent = count.toString();
        });
    }

    // Get all cart items
    getItems(): CartItem[] {
        return [...this.items]; // Return a copy
    }
}

// Product manager class
class ProductManager {
    private products: Product[] = this.getStoredProducts();

    private getStoredProducts(): Product[] {
        const storedProducts = localStorage.getItem('products');
        if (storedProducts) {
            return JSON.parse(storedProducts);
        } else {
            // Default products if no admin products exist
            return [
                {
                    id: 1,
                    name: "Running Shoes",
                    price: 89.99,
                    category: "sports",
                    image: "https://via.placeholder.com/250x250?text=Running+Shoes",
                    description: "Lightweight running shoes for maximum comfort",
                    sold: false
                },
                {
                    id: 2,
                    name: "Casual Sneakers",
                    price: 59.99,
                    category: "casual",
                    image: "https://via.placeholder.com/250x250?text=Casual+Sneakers",
                    description: "Stylish casual sneakers for everyday wear",
                    sold: false
                }
            ];
        }
    }

    getProducts(): Product[] {
        return [...this.products];
    }

    getProductById(id: number): Product | undefined {
        return this.products.find(p => p.id === id);
    }

    getFilteredProducts(category?: string, maxPrice?: number): Product[] {
        let filtered = [...this.products];

        if (category && category !== 'all') {
            filtered = filtered.filter(p => p.category === category);
        }

        if (maxPrice !== undefined) {
            filtered = filtered.filter(p => p.price <= maxPrice);
        }

        return filtered;
    }

    // Refresh products from storage
    refreshProducts(): void {
        this.products = this.getStoredProducts();
    }
}

// Initialize the application
let shoppingCart: ShoppingCart;
let productManager: ProductManager;

document.addEventListener('DOMContentLoaded', () => {
    shoppingCart = new ShoppingCart();
    productManager = new ProductManager();

    // Update cart count on page load
    shoppingCart.updateUI();

    // Load page-specific content
    if (document.getElementById('featured-products')) {
        loadFeaturedProducts();
    }

    if (document.getElementById('products-container')) {
        loadAllProducts();
    }

    if (document.getElementById('cart-items')) {
        loadCartItems();
    }
});

// Page-specific functions
function loadFeaturedProducts(): void {
    productManager.refreshProducts(); // Refresh products from storage
    const container = document.getElementById('featured-products');
    if (!container) return;

    const featuredProducts = productManager.getProducts().filter(p => !p.sold).slice(0, 4);
    container.innerHTML = '';

    featuredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <p class="product-category">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
            <p class="product-description">${product.description}</p>
            <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        container.appendChild(productCard);
    });
}

function loadAllProducts(): void {
    productManager.refreshProducts(); // Refresh products from storage
    const container = document.getElementById('products-container');
    if (!container) return;

    // Get filter values
    const categoryFilterInput = document.getElementById('category-filter') as HTMLSelectElement;
    const priceFilterInput = document.getElementById('price-filter') as HTMLInputElement;

    const categoryFilter = categoryFilterInput?.value || 'all';
    const maxPrice = parseInt(priceFilterInput?.value || '200');

    const filteredProducts = productManager.getFilteredProducts(categoryFilter, maxPrice).filter(p => !p.sold);
    container.innerHTML = '';

    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <p class="product-category">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
            <p class="product-description">${product.description}</p>
            <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        container.appendChild(productCard);
    });
}

function loadCartItems(): void {
    const container = document.getElementById('cart-items');
    if (!container) return;

    container.innerHTML = '';

    const cartItems = shoppingCart.getItems();

    if (cartItems.length === 0) {
        container.innerHTML = '<p>Your cart is empty.</p>';
        document.getElementById('cart-total')!.textContent = '0.00';
        return;
    }

    let total = 0;

    cartItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <div class="cart-item-actions">
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
        container.appendChild(cartItem);
    });

    document.getElementById('cart-total')!.textContent = total.toFixed(2);
}

// Global functions for HTML onclick attributes
function addToCart(productId: number): void {
    if (!shoppingCart) {
        shoppingCart = new ShoppingCart();
    }
    shoppingCart.addItem(productId, productManager.getProducts());
    const product = productManager.getProductById(productId);
    if (product) {
        alert(`${product.name} added to cart!`);
    }
}

function removeFromCart(productId: number): void {
    shoppingCart.removeItem(productId);
}

function updateQuantity(productId: number, newQuantity: number): void {
    shoppingCart.updateQuantity(productId, newQuantity);
}

// Export for potential use in modules
export { ShoppingCart, ProductManager, Product, CartItem };