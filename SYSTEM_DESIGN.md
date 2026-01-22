# Bodycon - Women's Fashion Dropshipping Platform - System Design

## Executive Summary
A scalable e-commerce platform for dropshipping women's fashion (bodycon dresses, tops, co-ord sets), designed to handle **1 crore (10M) monthly visitors** with peak concurrent users of ~100K.

---

## 1. Traffic & Load Analysis

| Metric | Value | Calculation |
|--------|-------|-------------|
| Monthly visitors | 10,000,000 | Given |
| Daily visitors (avg) | ~333,000 | 10M / 30 |
| Peak daily visitors | ~500,000 | 1.5x average |
| Peak concurrent users | ~100,000 | 20% of peak daily |
| Requests per second (avg) | ~400 RPS | 333K × 10 pages / 86400 |
| Peak RPS | ~2,000 RPS | 5x average |
| Orders per day (3% conversion) | ~10,000 | 333K × 0.03 (fashion has higher conversion) |

### Fashion-Specific Considerations:
- **Seasonal spikes**: Diwali, New Year, Valentine's Day (3-5x normal traffic)
- **Flash sales**: 10x traffic for 1-2 hours
- **Instagram/Influencer traffic**: Sudden bursts from reels/stories
- **Size availability checks**: High read load on inventory

---

## 2. High-Level Architecture

```
                                    ┌─────────────────┐
                                    │   CloudFlare    │
                                    │   (CDN + WAF)   │
                                    └────────┬────────┘
                                             │
                                    ┌────────▼────────┐
                                    │  Load Balancer  │
                                    │   (AWS ALB)     │
                                    └────────┬────────┘
                                             │
                    ┌────────────────────────┼────────────────────────┐
                    │                        │                        │
           ┌────────▼────────┐     ┌────────▼────────┐     ┌────────▼────────┐
           │   Web Servers   │     │   API Gateway   │     │  Admin Panel    │
           │   (Next.js)     │     │   (Kong/AWS)    │     │   (React)       │
           │   3-10 nodes    │     │                 │     │                 │
           └────────┬────────┘     └────────┬────────┘     └────────┬────────┘
                    │                        │                        │
                    └────────────────────────┼────────────────────────┘
                                             │
                    ┌────────────────────────┼────────────────────────┐
                    │                        │                        │
           ┌────────▼────────┐     ┌────────▼────────┐     ┌────────▼────────┐
           │ Product Service │     │  Order Service  │     │  User Service   │
           │   (FastAPI)     │     │   (FastAPI)     │     │   (FastAPI)     │
           └────────┬────────┘     └────────┬────────┘     └────────┬────────┘
                    │                        │                        │
                    │              ┌────────▼────────┐               │
                    │              │ Payment Service │               │
                    │              │ (Razorpay/UPI)  │               │
                    │              └────────┬────────┘               │
                    │                        │                        │
                    └────────────────────────┼────────────────────────┘
                                             │
        ┌───────────────┬───────────────┬────┴────┬───────────────┬───────────────┐
        │               │               │         │               │               │
┌───────▼───────┐ ┌─────▼─────┐ ┌───────▼───────┐ │       ┌───────▼───────┐ ┌─────▼─────┐
│  PostgreSQL   │ │   Redis   │ │ Elasticsearch │ │       │    Kafka      │ │    S3     │
│  (Primary DB) │ │  (Cache)  │ │   (Search)    │ │       │  (Events)     │ │  (Media)  │
│   2 replicas  │ │  Cluster  │ │   3 nodes     │ │       │   3 brokers   │ │           │
└───────────────┘ └───────────┘ └───────────────┘ │       └───────────────┘ └───────────┘
                                                  │
                                    ┌─────────────▼─────────────┐
                                    │    Supplier Integration   │
                                    │    (Async via Kafka)      │
                                    └───────────────────────────┘
```

---

## 3. Core Components

### 3.1 Frontend (Customer-Facing)
- **Framework**: Next.js 14 (SSR for SEO, ISR for product pages)
- **Styling**: TailwindCSS with custom Bodycon theme
- **Hosting**: Vercel or AWS ECS
- **Features**:
  - Product catalog with size/color filters
  - Visual search with image upload
  - Wishlist functionality
  - Size guide with body measurements
  - Cart with size validation
  - Checkout with Razorpay/UPI/COD
  - Order tracking
  - User accounts with style preferences

### 3.2 Backend Microservices

| Service | Responsibility | Tech Stack |
|---------|---------------|------------|
| **Product Service** | Catalog, inventory, size matrix | FastAPI, PostgreSQL, Elasticsearch |
| **Order Service** | Cart, checkout, order management | FastAPI, PostgreSQL, Kafka |
| **User Service** | Auth, profiles, addresses, wishlist | FastAPI, PostgreSQL, Redis |
| **Payment Service** | Razorpay/UPI/COD integration | FastAPI, PostgreSQL |
| **Notification Service** | Email, SMS, WhatsApp | FastAPI, Kafka, AWS SES |
| **Supplier Service** | Forward orders to suppliers | FastAPI, Kafka |
| **Review Service** | Product reviews with images | FastAPI, PostgreSQL, S3 |
| **Recommendation Service** | "You may also like" | FastAPI, Redis, ML model |

### 3.3 Data Stores

| Store | Purpose | Configuration |
|-------|---------|---------------|
| **PostgreSQL** | Primary data (users, orders, products) | 1 primary + 2 read replicas |
| **Redis Cluster** | Session, cart, wishlist, cache | 6 nodes (3 primary + 3 replica) |
| **Elasticsearch** | Product search, filters, autocomplete | 3 nodes |
| **Kafka** | Event streaming, async processing | 3 brokers |
| **S3** | Product images, review images, invoices | Single bucket with CloudFront |

---

## 4. Database Schema

### 4.1 Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(15) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    
    -- Fashion-specific
    preferred_size VARCHAR(10), -- XS, S, M, L, XL, XXL
    body_measurements JSONB, -- {"bust": 34, "waist": 28, "hips": 36}
    style_preferences JSONB, -- ["bodycon", "casual", "party"]
    
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
```

### 4.2 Addresses Table
```sql
CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    label VARCHAR(50), -- 'home', 'office'
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    line1 VARCHAR(255) NOT NULL,
    line2 VARCHAR(255),
    landmark VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_addresses_user ON addresses(user_id);
```

### 4.3 Products Table
```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    category_id UUID REFERENCES categories(id),
    
    -- Fashion-specific
    fabric VARCHAR(100), -- Cotton, Polyester, Lycra blend
    care_instructions TEXT,
    occasion JSONB, -- ["party", "casual", "office"]
    fit_type VARCHAR(50), -- bodycon, regular, loose
    pattern VARCHAR(50), -- solid, printed, striped
    color VARCHAR(50),
    color_hex VARCHAR(7),
    
    -- Pricing
    mrp DECIMAL(10,2) NOT NULL,
    selling_price DECIMAL(10,2) NOT NULL,
    cost_price DECIMAL(10,2) NOT NULL,
    
    -- Supplier info
    supplier_id UUID REFERENCES suppliers(id),
    supplier_sku VARCHAR(100),
    
    -- SEO
    meta_title VARCHAR(255),
    meta_description TEXT,
    
    -- Media
    images JSONB, -- ["url1", "url2", "url3", "url4"]
    video_url VARCHAR(500),
    
    -- Attributes
    weight_gm INT,
    
    -- Stats
    view_count INT DEFAULT 0,
    order_count INT DEFAULT 0,
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_supplier ON products(supplier_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = TRUE;
```

### 4.4 Product Variants (Size/Color)
```sql
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    
    size VARCHAR(10) NOT NULL, -- XS, S, M, L, XL, XXL
    color VARCHAR(50),
    color_hex VARCHAR(7),
    
    sku_variant VARCHAR(60) UNIQUE NOT NULL, -- BC-DRESS-001-M-RED
    
    mrp DECIMAL(10,2) NOT NULL,
    selling_price DECIMAL(10,2) NOT NULL,
    cost_price DECIMAL(10,2) NOT NULL,
    
    stock_quantity INT DEFAULT 0,
    low_stock_threshold INT DEFAULT 5,
    is_available BOOLEAN DEFAULT TRUE,
    
    -- Size chart reference
    size_chart JSONB, -- {"bust": "34-36", "waist": "28-30", "length": "36"}
    
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_variants_product ON product_variants(product_id);
CREATE INDEX idx_variants_available ON product_variants(is_available) WHERE is_available = TRUE;
CREATE INDEX idx_variants_size ON product_variants(size);
```

### 4.5 Categories Table
```sql
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    parent_id UUID REFERENCES categories(id),
    image_url VARCHAR(500),
    banner_url VARCHAR(500),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0
);

-- Categories: Bodycon Dresses, Crop Tops, Co-ord Sets, Party Wear, Skirts, Bottoms
```

### 4.6 Orders Table
```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(20) UNIQUE NOT NULL, -- BC-20260122-001234
    user_id UUID REFERENCES users(id),
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending',
    -- pending -> confirmed -> processing -> shipped -> out_for_delivery -> delivered
    -- pending -> cancelled
    -- delivered -> return_requested -> return_picked -> refunded
    
    -- Amounts (in INR)
    subtotal DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0,
    coupon_code VARCHAR(50),
    shipping_fee DECIMAL(10,2) DEFAULT 0,
    cod_fee DECIMAL(10,2) DEFAULT 0, -- extra for COD
    tax DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    
    -- Shipping
    shipping_address JSONB NOT NULL,
    
    -- Payment
    payment_status VARCHAR(50) DEFAULT 'pending',
    payment_method VARCHAR(50), -- upi, card, cod, netbanking, wallet
    payment_id VARCHAR(100), -- Razorpay payment ID
    
    -- Supplier
    supplier_order_id VARCHAR(100),
    supplier_status VARCHAR(50),
    
    -- Tracking
    tracking_number VARCHAR(100),
    courier_partner VARCHAR(100), -- Delhivery, BlueDart, Shiprocket
    estimated_delivery DATE,
    
    -- Timestamps
    confirmed_at TIMESTAMP,
    shipped_at TIMESTAMP,
    delivered_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    cancel_reason TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
```

### 4.7 Order Items Table
```sql
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    variant_id UUID REFERENCES product_variants(id),
    
    -- Snapshot at time of order
    product_name VARCHAR(255) NOT NULL,
    product_sku VARCHAR(50) NOT NULL,
    product_image VARCHAR(500),
    size VARCHAR(10) NOT NULL,
    color VARCHAR(50),
    
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    
    -- Supplier details
    supplier_id UUID,
    cost_price DECIMAL(10,2) NOT NULL
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
```

### 4.8 Wishlist Table
```sql
CREATE TABLE wishlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id),
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(user_id, product_id, variant_id)
);

CREATE INDEX idx_wishlist_user ON wishlist(user_id);
```

### 4.9 Reviews Table
```sql
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    order_id UUID REFERENCES orders(id),
    
    rating INT CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    body TEXT,
    images JSONB, -- ["url1", "url2"]
    
    -- Fashion-specific
    fit_feedback VARCHAR(20), -- "runs_small", "true_to_size", "runs_large"
    size_purchased VARCHAR(10),
    
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_approved ON reviews(is_approved) WHERE is_approved = TRUE;
```

### 4.10 Suppliers Table
```sql
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    
    -- Contact
    email VARCHAR(255),
    phone VARCHAR(20),
    whatsapp VARCHAR(20),
    
    -- Location
    city VARCHAR(100),
    state VARCHAR(100),
    
    -- Integration
    api_endpoint VARCHAR(500),
    api_key_encrypted VARCHAR(500),
    integration_type VARCHAR(50), -- api, whatsapp, email, manual
    
    -- Settings
    auto_forward_orders BOOLEAN DEFAULT FALSE,
    default_shipping_days INT DEFAULT 5,
    return_address JSONB,
    
    -- Performance
    avg_processing_days DECIMAL(3,1),
    return_rate DECIMAL(5,2),
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 4.11 Cart (Redis Structure)
```
Key: cart:{user_id} or cart:{session_id}
Type: Hash
TTL: 7 days

Fields:
{
    "items": [
        {
            "product_id": "uuid",
            "variant_id": "uuid",
            "size": "M",
            "color": "Black",
            "quantity": 1,
            "added_at": "timestamp"
        }
    ],
    "coupon": "FLAT200",
    "updated_at": "timestamp"
}
```

---

## 5. API Design

### 5.1 Product APIs

```
GET  /api/v1/products                         # List products (paginated)
GET  /api/v1/products/{slug}                  # Get product details
GET  /api/v1/products/search?q=bodycon+dress  # Search products
GET  /api/v1/products/{id}/variants           # Get size/color variants
GET  /api/v1/products/{id}/reviews            # Get reviews
GET  /api/v1/categories                       # List categories
GET  /api/v1/categories/{slug}/products       # Products by category
```

**Example: List Products**
```http
GET /api/v1/products?page=1&limit=20&category=bodycon-dresses&size=M&color=black&sort=newest&min_price=500&max_price=2000

Response:
{
    "data": [
        {
            "id": "uuid",
            "name": "Black Ribbed Bodycon Dress",
            "slug": "black-ribbed-bodycon-dress",
            "mrp": 1999,
            "selling_price": 1299,
            "discount_percent": 35,
            "image": "https://cdn.bodycon.in/products/black-ribbed-dress.jpg",
            "images": ["url1", "url2", "url3"],
            "rating": 4.3,
            "review_count": 89,
            "sizes_available": ["S", "M", "L"],
            "colors": [
                {"name": "Black", "hex": "#000000", "available": true},
                {"name": "Wine", "hex": "#722f37", "available": true}
            ],
            "is_new": true,
            "is_bestseller": false
        }
    ],
    "filters": {
        "sizes": [
            {"value": "XS", "count": 12},
            {"value": "S", "count": 45},
            {"value": "M", "count": 52}
        ],
        "colors": [
            {"value": "Black", "hex": "#000000", "count": 34},
            {"value": "Red", "hex": "#FF0000", "count": 28}
        ],
        "price_range": {"min": 499, "max": 4999}
    },
    "pagination": {
        "page": 1,
        "limit": 20,
        "total": 156,
        "total_pages": 8
    }
}
```

### 5.2 Cart APIs

```
GET    /api/v1/cart                           # Get cart
POST   /api/v1/cart/items                     # Add item to cart
PATCH  /api/v1/cart/items/{variant_id}        # Update quantity/size
DELETE /api/v1/cart/items/{variant_id}        # Remove item
DELETE /api/v1/cart                           # Clear cart
POST   /api/v1/cart/apply-coupon              # Apply coupon code
DELETE /api/v1/cart/coupon                    # Remove coupon
```

### 5.3 Wishlist APIs

```
GET    /api/v1/wishlist                       # Get wishlist
POST   /api/v1/wishlist                       # Add to wishlist
DELETE /api/v1/wishlist/{product_id}          # Remove from wishlist
POST   /api/v1/wishlist/{product_id}/move-to-cart  # Move to cart
```

### 5.4 Order APIs

```
POST   /api/v1/orders                         # Create order (checkout)
GET    /api/v1/orders                         # List user's orders
GET    /api/v1/orders/{order_number}          # Get order details
GET    /api/v1/orders/{order_number}/track    # Track order
POST   /api/v1/orders/{order_number}/cancel   # Cancel order
POST   /api/v1/orders/{order_number}/return   # Request return
```

**Example: Create Order**
```http
POST /api/v1/orders

Request:
{
    "address_id": "uuid",
    "payment_method": "razorpay",
    "coupon_code": "FLAT200"
}

Response:
{
    "order": {
        "order_number": "BC-20260122-001234",
        "total": 1599,
        "items_count": 2,
        "status": "pending"
    },
    "payment": {
        "razorpay_order_id": "order_abc123",
        "amount": 159900,
        "currency": "INR",
        "key": "rzp_live_xxx"
    }
}
```

### 5.5 Payment APIs

```
POST   /api/v1/payments/verify                # Verify Razorpay payment
POST   /api/v1/payments/webhook               # Razorpay webhook
GET    /api/v1/payments/cod-availability      # Check COD for pincode
```

### 5.6 User APIs

```
POST   /api/v1/auth/register                  # Register
POST   /api/v1/auth/login                     # Login (returns JWT)
POST   /api/v1/auth/otp/send                  # Send OTP
POST   /api/v1/auth/otp/verify                # Verify OTP
POST   /api/v1/auth/forgot-password           # Forgot password
GET    /api/v1/users/me                       # Get profile
PATCH  /api/v1/users/me                       # Update profile
PATCH  /api/v1/users/me/measurements          # Update body measurements
GET    /api/v1/users/me/addresses             # List addresses
POST   /api/v1/users/me/addresses             # Add address
```

---

## 6. Scaling Strategy

### 6.1 Caching Layers

| Layer | What to Cache | TTL | Invalidation |
|-------|--------------|-----|--------------|
| **CDN (CloudFlare)** | Product images, static assets | 1 year | Versioned URLs |
| **Page Cache** | Category pages, homepage | 5 min | On product update |
| **API Cache (Redis)** | Product details, size availability | 2 min | On inventory update |
| **Session Cache** | User sessions, cart, wishlist | 7 days | On logout |
| **Search Cache** | Popular search results | 5 min | On product index |

### 6.2 Read/Write Splitting

```
┌─────────────────┐
│  Application    │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌───▼───┐
│ Write │ │ Read  │
│Primary│ │Replica│
└───────┘ └───────┘
```

- **Writes**: Primary PostgreSQL
- **Reads**: 2 read replicas (load balanced)
- **Ratio**: ~95% reads, ~5% writes

### 6.3 Horizontal Scaling

| Component | Scaling Trigger | Min | Max |
|-----------|----------------|-----|-----|
| Web servers | CPU > 70% | 3 | 15 |
| API servers | CPU > 70% | 4 | 25 |
| Workers | Queue depth > 1000 | 2 | 10 |

### 6.4 Flash Sale Handling

```
┌─────────────┐
│ Pre-warming │ ← 30 min before sale
│   Cache     │
└──────┬──────┘
       │
┌──────▼──────┐
│  Queue for  │ ← Rate limit checkout
│  Checkout   │
└──────┬──────┘
       │
┌──────▼──────┐
│  Inventory  │ ← Redis atomic decrement
│    Lock     │
└─────────────┘
```

---

## 7. Dropshipping Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│ Customer │────▶│  Order   │────▶│  Kafka   │────▶│ Supplier │
│ Checkout │     │ Service  │     │  Event   │     │ Service  │
└──────────┘     └──────────┘     └──────────┘     └────┬─────┘
                                                        │
                      ┌─────────────────────────────────┘
                      │
                      ▼
              ┌──────────────┐
              │   Supplier   │
              │ API/WhatsApp │
              └──────┬───────┘
                     │
                     ▼
              ┌──────────────┐
              │  Shiprocket  │◀──── Auto-pickup, tracking
              │     API      │
              └──────────────┘
```

### Order Lifecycle:

1. **Customer places order** → Order created with `status: pending`
2. **Payment confirmed** → `status: confirmed`, Kafka event emitted
3. **Supplier service** → Forwards order via API/WhatsApp
4. **Supplier accepts** → `status: processing`
5. **Pickup scheduled** → Shiprocket API creates shipment
6. **Shipped** → `status: shipped`, tracking number saved
7. **Out for delivery** → `status: out_for_delivery`
8. **Delivered** → `status: delivered`, review request sent

### Supplier Integration Types:

| Type | Flow | Example |
|------|------|---------|
| **API** | Auto-forward via REST | Large manufacturers |
| **WhatsApp** | Auto-send order via WhatsApp Business API | Small suppliers |
| **Email** | Auto-generate PO email | Medium suppliers |
| **Manual** | Admin dashboard alert | New suppliers |

---

## 8. Infrastructure Cost Estimate (AWS Mumbai)

### Monthly Costs (10M visitors/month):

| Service | Specification | Monthly Cost (₹) |
|---------|--------------|------------------|
| **EC2 (API)** | 4× t3.large (auto-scale to 12) | ₹28,000 |
| **EC2 (Workers)** | 2× t3.medium | ₹6,000 |
| **RDS PostgreSQL** | db.r6g.xlarge + 2 replicas | ₹48,000 |
| **ElastiCache Redis** | 6-node cluster (r6g.large) | ₹38,000 |
| **Elasticsearch** | 3× t3.medium.search | ₹22,000 |
| **MSK (Kafka)** | 3 brokers (kafka.m5.large) | ₹32,000 |
| **S3 + CloudFront** | 1TB storage + 5TB transfer (images) | ₹12,000 |
| **ALB** | Application Load Balancer | ₹5,000 |
| **CloudFlare** | Pro plan | ₹1,500 |
| **Vercel** | Pro plan (frontend) | ₹1,500 |
| **Shiprocket** | Shipping aggregator | ₹15,000 |
| **Misc** | Monitoring, backups, SMS | ₹12,000 |

**Total: ~₹2,21,000/month (~$2,650)**

### Cost Optimization:

1. **Reserved instances** → 40% savings on EC2/RDS
2. **Spot instances** for workers → 70% savings
3. **Image optimization** → WebP format, lazy loading
4. **Start smaller** → Scale up as traffic grows

**Realistic start (1M visitors/month): ~₹55,000/month**

---

## 9. Tech Stack Summary

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14, TailwindCSS, Zustand |
| **Backend** | FastAPI (Python), Pydantic |
| **Database** | PostgreSQL 15, Redis 7 |
| **Search** | Elasticsearch 8 |
| **Queue** | Apache Kafka |
| **Payments** | Razorpay (UPI, Cards, Wallets) |
| **Shipping** | Shiprocket (Delhivery, BlueDart) |
| **CDN** | CloudFlare |
| **Cloud** | AWS (Mumbai region) |
| **CI/CD** | GitHub Actions |
| **Monitoring** | Prometheus, Grafana, Sentry |
| **Analytics** | Mixpanel, Google Analytics |

---

## 10. Security Checklist

- [ ] HTTPS everywhere (CloudFlare SSL)
- [ ] JWT with short expiry (15 min) + refresh tokens
- [ ] Rate limiting (100 req/min per IP, 10 orders/min per user)
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (Content-Security-Policy)
- [ ] CORS configured for specific domains
- [ ] PCI-DSS compliance (Razorpay handles card data)
- [ ] Secrets in AWS Secrets Manager
- [ ] WAF rules for common attacks
- [ ] Bot protection for flash sales
- [ ] Regular security audits
- [ ] GDPR/Privacy compliance

---

## 11. Fashion-Specific Features

### 11.1 Size Recommendation Engine

```
Input: User measurements + Product size chart
Output: Recommended size + fit prediction

Algorithm:
1. Match user bust/waist/hips to size chart
2. Check fit_feedback from reviews (runs_small, true_to_size)
3. Weight by verified purchase reviews
4. Return: "M - True to size" or "L - This runs small"
```

### 11.2 Visual Search (Future)

```
Upload image → Extract features (CNN) → Find similar products
```

### 11.3 Outfit Recommendations

```
"Complete the look" suggestions:
- Viewing bodycon dress → Suggest heels, clutch, earrings
- Based on collaborative filtering + style tags
```

### 11.4 Instagram Integration

```
- Shoppable Instagram feed on homepage
- Auto-sync product tags
- Track UTM for influencer campaigns
```

---

## 12. MVP Phase 1 — Ship Fast (0 → 1M users)

### 12.1 MVP Architecture (Simple Monolith)

```
┌─────────────────┐
│   CloudFlare    │  ← Free tier works
└────────┬────────┘
         │
┌────────▼────────┐
│    Vercel       │  ← Next.js frontend (free/pro)
│   (Frontend)    │
└────────┬────────┘
         │
┌────────▼────────┐
│  Single FastAPI │  ← 1 EC2 t3.medium ($30/mo)
│    Monolith     │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌───▼───┐
│Postgres│ │ Redis │  ← RDS db.t3.small + ElastiCache
└───────┘ └───────┘
```

### 12.2 MVP Tech Stack

| Layer | MVP Choice | Why |
|-------|-----------|-----|
| Frontend | Next.js on Vercel | Free hosting, fast deploys |
| Backend | FastAPI monolith | Simple, fast to build |
| Database | PostgreSQL (RDS) | Reliable, handles 1M easy |
| Cache | Redis (ElastiCache) | Sessions, cart, basic cache |
| Search | PostgreSQL `ILIKE` + `tsvector` | Good enough for <10K products |
| Queue | None (or Celery + Redis) | Avoid Kafka complexity |
| Payments | Razorpay | Standard |
| Shipping | Shiprocket | Multi-courier, easy API |
| Email | Resend or AWS SES | Cheap, simple |
| Media | S3 + CloudFront | Standard |

### 12.3 MVP Cost Estimate

| Service | Spec | Monthly Cost |
|---------|------|-------------|
| Vercel Pro | Frontend | ₹1,500 |
| EC2 t3.medium | Backend | ₹2,500 |
| RDS db.t3.small | PostgreSQL | ₹3,000 |
| ElastiCache t3.micro | Redis | ₹1,500 |
| S3 + CloudFront | Media | ₹2,000 |
| Shiprocket | Shipping | ₹3,000 |
| CloudFlare Free | CDN | ₹0 |
| **Total** | | **~₹14,000/month** |

### 12.4 What to Skip in MVP

| Skip This | Do This Instead |
|-----------|-----------------|
| Kafka | Direct DB writes + Celery for async |
| Elasticsearch | PostgreSQL full-text search |
| Microservices | Single FastAPI app with routers |
| Read replicas | Single DB (add replica at 500K users) |
| Size recommendation AI | Simple size chart display |
| Visual search | Manual tagging |

### 12.5 MVP API Structure (Monolith)

```
bodycon-api/
├── app/
│   ├── main.py              # FastAPI app
│   ├── config.py            # Settings
│   ├── database.py          # DB connection
│   ├── models/              # SQLAlchemy models
│   │   ├── user.py
│   │   ├── product.py
│   │   ├── order.py
│   │   └── review.py
│   ├── routers/             # API routes
│   │   ├── products.py
│   │   ├── orders.py
│   │   ├── users.py
│   │   ├── cart.py
│   │   ├── wishlist.py
│   │   └── payments.py
│   ├── services/            # Business logic
│   │   ├── cart_service.py
│   │   ├── order_service.py
│   │   ├── shipping_service.py  # Shiprocket integration
│   │   └── supplier_service.py
│   └── tasks/               # Celery tasks
│       ├── email.py
│       ├── sms.py
│       └── supplier_notify.py
├── requirements.txt
└── Dockerfile
```

### 12.6 When to Upgrade

| Signal | Action |
|--------|--------|
| DB CPU > 70% consistently | Add read replica |
| Search queries > 500ms | Add Elasticsearch |
| Background jobs backing up | Add more Celery workers |
| Order processing delays | Consider Kafka |
| 1M+ monthly users | Start splitting services |
| 10K+ products | Implement proper search |

### 12.7 MVP Timeline

| Week | Deliverable |
|------|-------------|
| 1-2 | Product catalog, search, filters, basic UI |
| 3 | User auth, cart, wishlist, addresses |
| 4 | Checkout, Razorpay integration, COD |
| 5 | Order management, Shiprocket integration |
| 6 | Admin panel, supplier WhatsApp flow |
| 7 | Reviews, size guide, testing |
| 8 | Deploy, monitoring setup |

**8 weeks to live product** vs 4-5 months for full architecture.

---

## 13. Evolution Path

```
Phase 1 (MVP)           Phase 2 (Growth)         Phase 3 (Scale)
─────────────────────   ─────────────────────   ─────────────────────
Monolith FastAPI    →   + Read replicas      →   Microservices
PostgreSQL search   →   + Elasticsearch      →   + Kafka
Celery + Redis      →   + More workers       →   + Event sourcing
Single EC2          →   + Auto-scaling       →   + Kubernetes
WhatsApp supplier   →   + API integration    →   + Real-time sync
Manual size chart   →   + Size recommend     →   + AI-powered
~₹14K/month         →   ~₹55K/month          →   ~₹2.2L/month
0-1M users              1M-5M users              10M+ users
```

---

## 14. Interview-Ready Summary (2 mins)

> "For Bodycon, a women's fashion dropshipping platform handling 10M monthly visitors:
>
> **Traffic**: 10M monthly, ~2000 peak RPS, 100K concurrent users, with 3-5x spikes during sales.
>
> **Architecture**: Microservices with FastAPI, Next.js frontend on Vercel. API Gateway for routing and rate limiting.
>
> **Data layer**: PostgreSQL with read replicas for transactional data, Redis cluster for caching, cart, and wishlist, Elasticsearch for product search with filters (size, color, price), Kafka for async order processing.
>
> **Fashion-specific**: Product variants table for size/color matrix, inventory tracking per variant, size recommendation based on user measurements and review feedback.
>
> **Key flows**: Customer adds to cart → Checkout with size validation → Razorpay payment → Order confirmed → Kafka event → Supplier notified (API/WhatsApp) → Shiprocket creates shipment → Tracking updates via webhooks.
>
> **Scaling**: CDN for product images, Redis for hot data, read replicas for 95% read traffic, horizontal auto-scaling, flash sale queue management.
>
> **Cost**: ~₹2.2L/month at full scale on AWS Mumbai.
>
> **But realistically**, I'd start with a monolith, single DB, Redis, and Shiprocket — handles 1M users for ₹14K/month. Then evolve into this architecture as traffic grows."

---

*Document Version: 1.0*  
*Last Updated: January 2026*
*Platform: Bodycon - Women's Fashion Dropshipping*
