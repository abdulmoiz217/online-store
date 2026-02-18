from flask import Flask, request, jsonify, render_template, send_from_directory
import json
import os
from datetime import datetime
import uuid


app = Flask(__name__)

# In-memory storage for products and orders (since database not available)
products = []
orders = []

# Initialize with some default products
def init_default_products():
    global products
    if not products:  # Only initialize if empty
        products = [
            {
                "id": 1,
                "name": "Running Shoes",
                "price": 89.99,
                "category": "sports",
                "image": "https://via.placeholder.com/250x250?text=Running+Shoes",
                "description": "Lightweight running shoes for maximum comfort",
                "sold": False
            },
            {
                "id": 2,
                "name": "Casual Sneakers",
                "price": 59.99,
                "category": "casual",
                "image": "https://via.placeholder.com/250x250?text=Casual+Sneakers",
                "description": "Stylish casual sneakers for everyday wear",
                "sold": False
            }
        ]

init_default_products()

@app.route('/')
def home():
    return send_from_directory('.', 'index.html')

@app.route('/products')
def products():
    return send_from_directory('.', 'products.html')

@app.route('/cart')
def cart():
    return send_from_directory('.', 'cart.html')

@app.route('/contact')
def contact():
    return send_from_directory('.', 'contact.html')

@app.route('/payment')
def payment():
    return send_from_directory('.', 'payment.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('.', path)

@app.route('/api/products', methods=['GET'])
def get_products():
    """Return the list of products from in-memory storage"""
    global products
    init_default_products()  # Ensure defaults are loaded
    return jsonify(products)

@app.route('/api/cart', methods=['GET'])
def get_cart():
    """Get current cart from session"""
    cart = request.cookies.get('cart', '[]')
    return jsonify(json.loads(cart))

@app.route('/api/cart', methods=['POST'])
def update_cart():
    """Add item to cart"""
    data = request.json
    cart = request.cookies.get('cart', '[]')
    cart = json.loads(cart)

    # Check if item already in cart
    found = False
    for item in cart:
        if item['id'] == data['id']:
            item['quantity'] += data.get('quantity', 1)
            found = True
            break

    if not found:
        cart.append(data)

    response = jsonify({"success": True})
    response.set_cookie('cart', json.dumps(cart))
    return response

# Admin API routes for product management
@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    """Admin login endpoint"""
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    # In a real application, you would validate against a database
    # For now, using hardcoded credentials
    if username == "moizshabbir2248@gmail.com" and password == "abdulmoiz217":
        # In a real app, you'd generate a JWT token here
        return jsonify({"success": True, "token": "fake-jwt-token"})
    else:
        return jsonify({"success": False, "error": "Invalid credentials"}), 401

@app.route('/api/admin/products', methods=['GET'])
def get_admin_products():
    """Get all products for admin panel"""
    global products
    init_default_products()  # Ensure defaults are loaded
    return jsonify(products)

@app.route('/api/admin/products', methods=['POST'])
def add_product():
    """Add a new product"""
    global products
    data = request.json
    name = data.get('name')
    price = data.get('price')
    category = data.get('category')
    image = data.get('image', '')
    description = data.get('description', '')
    
    if not all([name, price, category]):
        return jsonify({"error": "Missing required fields"}), 400
    
    new_product = {
        "id": int(datetime.now().timestamp() * 1000),  # Unique ID based on timestamp
        "name": name,
        "price": float(price),
        "category": category,
        "image": image or 'https://via.placeholder.com/250x250?text=' + name.replace(' ', '+'),
        "description": description,
        "sold": False
    }
    
    products.append(new_product)
    return jsonify({"success": True, "id": new_product["id"]})

@app.route('/api/admin/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    """Update a product"""
    global products
    data = request.json
    name = data.get('name')
    price = data.get('price')
    category = data.get('category')
    image = data.get('image')
    description = data.get('description')
    sold = data.get('sold', False)
    
    if not all([name, price, category]):
        return jsonify({"error": "Missing required fields"}), 400
    
    # Find the product to update
    for i, product in enumerate(products):
        if product['id'] == product_id:
            products[i] = {
                "id": product_id,
                "name": name,
                "price": float(price),
                "category": category,
                "image": image or product['image'],
                "description": description,
                "sold": sold
            }
            return jsonify({"success": True})
    
    return jsonify({"error": "Product not found"}), 404

@app.route('/api/admin/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    """Delete a product"""
    global products
    products = [p for p in products if p['id'] != product_id]
    return jsonify({"success": True})

@app.route('/api/admin/products/<int:product_id>/toggle_sold', methods=['PUT'])
def toggle_product_sold(product_id):
    """Toggle product sold status"""
    global products
    for product in products:
        if product['id'] == product_id:
            product['sold'] = not product['sold']
            return jsonify({"success": True, "sold": product['sold']})
    
    return jsonify({"error": "Product not found"}), 404


@app.route('/api/place_order', methods=['POST'])
def place_order():
    """Place an order"""
    data = request.json
    order = {
        "id": len(orders) + 1,
        "items": data.get('items'),
        "total": data.get('total'),
        "customer_info": data.get('customer_info'),
        "payment_method": data.get('payment_method'),
        "verification": data.get('verification'),  # Store verification data (transaction ID and screenshot)
        "date": datetime.now().isoformat(),
        "status": "pending_verification"  # New status for pending verification
    }
    orders.append(order)

    return jsonify({"success": True, "order_id": order["id"]})

@app.route('/api/orders', methods=['GET'])
def get_orders():
    """Get all orders (for admin panel)"""
    return jsonify(orders)

@app.route('/api/orders/<int:order_id>', methods=['PUT'])
def update_order_status(order_id):
    """Update order status (for admin panel)"""
    global orders
    data = request.json
    status = data.get('status')
    
    # Find the order to update
    for order in orders:
        if order['id'] == order_id:
            order['status'] = status
            
            # If approved, you might want to send a notification to the customer
            if status == 'approved':
                print(f"Order {order_id} approved for customer {order['customer_info']['email']}")
            
            return jsonify({"success": True})
    
    return jsonify({"error": "Order not found"}), 404

if __name__ == '__main__':
    app.run(debug=False, port=5000)