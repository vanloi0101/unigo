# 🔍 Advanced Product Search & Filtering API Guide

## **Overview**

The `/api/products` endpoint now supports advanced search, filtering, and pagination with the following capabilities:

- 🔎 **Full-Text Search** (name & description)
- 📂 **Category Filtering**
- 💰 **Price Range Filtering**
- 📄 **Pagination**
- 🎯 **Case-Insensitive Search**
- 🚀 **Efficient Database Queries**

---

## **API Endpoint**

### `GET /api/products`

**No Authentication Required** ✅

---

## **Query Parameters**

### Core Filters

| Parameter | Type | Default | Description | Example |
|-----------|------|---------|-------------|---------|
| `search` | string | "" | Search in product name and description (case-insensitive) | `search=vòng tay` |
| `category` | string | "" | Filter by product category | `category=dihoc` |
| `minPrice` | number | 0 | Minimum price filter (>=) | `minPrice=30000` |
| `maxPrice` | number | 999999999 | Maximum price filter (<=) | `maxPrice=100000` |
| `page` | number | 1 | Page number for pagination | `page=2` |
| `limit` | number | 10 | Items per page | `limit=20` |

---

## **Request Examples**

### 1. **Get All Products (No Filters)**
```bash
curl http://localhost:5000/api/products
```

### 2. **Search by Keyword**
```bash
curl "http://localhost:5000/api/products?search=giỏ"
curl "http://localhost:5000/api/products?search=handmade"
```

### 3. **Filter by Category**
```bash
curl "http://localhost:5000/api/products?category=dihoc"
curl "http://localhost:5000/api/products?category=tinhban"
curl "http://localhost:5000/api/products?category=pastel"
```

### 4. **Filter by Price Range**
```bash
# Products between 30k and 100k
curl "http://localhost:5000/api/products?minPrice=30000&maxPrice=100000"

# Products under 50k
curl "http://localhost:5000/api/products?maxPrice=50000"

# Products over 80k
curl "http://localhost:5000/api/products?minPrice=80000"
```

### 5. **Pagination**
```bash
# Get page 1 (first 10 items)
curl "http://localhost:5000/api/products?page=1&limit=10"

# Get page 2 with 20 items per page
curl "http://localhost:5000/api/products?page=2&limit=20"

# Get 5 items per page
curl "http://localhost:5000/api/products?limit=5"
```

### 6. **Combined Filters** ⭐
```bash
# Search + Category + Price + Pagination
curl "http://localhost:5000/api/products?search=vòng&category=dihoc&minPrice=40000&maxPrice=80000&page=1&limit=10"

# Case-insensitive search for "VÒNG"
curl "http://localhost:5000/api/products?search=VÒNG"

# Search "handmade" products under 60k
curl "http://localhost:5000/api/products?search=handmade&maxPrice=60000"
```

---

## **Response Format**

### Success Response (200 OK)
```json
{
  "success": true,
  "products": [
    {
      "id": 1,
      "name": "Vòng tay Thanh Lịch",
      "description": "Vòng tay handmade từ hạt gỗ tự nhiên",
      "price": 50000,
      "imageUrl": "https://res.cloudinary.com/...",
      "stock": 10,
      "category": "dihoc",
      "createdAt": "2024-04-05T10:30:00.000Z",
      "updatedAt": "2024-04-05T10:30:00.000Z"
    },
    {
      "id": 2,
      "name": "Vòng tay Tình Bạn",
      "description": "Vòng tay cặp cho bạn bè",
      "price": 45000,
      "imageUrl": "https://res.cloudinary.com/...",
      "stock": 15,
      "category": "tinhban",
      "createdAt": "2024-04-04T15:20:00.000Z",
      "updatedAt": "2024-04-04T15:20:00.000Z"
    }
  ],
  "pagination": {
    "totalItems": 25,
    "totalPages": 3,
    "currentPage": 1,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Pagination Metadata Explained

| Field | Type | Description |
|-------|------|-------------|
| `totalItems` | number | Total products matching filters |
| `totalPages` | number | Total page count |
| `currentPage` | number | Current page number |
| `itemsPerPage` | number | Items per page (limit) |
| `hasNextPage` | boolean | Whether next page exists |
| `hasPrevPage` | boolean | Whether previous page exists |

---

## **Backend Implementation Details**

### Search Logic
- **Case-Insensitive:** Uses `mode: 'insensitive'` in Prisma
- **Searches both fields:**
  - Product name (`contains`)
  - Product description (`contains`)
- **OR relationship:** Matches if name OR description contains search term

### Price Filter
- **Min Price:** `price >= minPrice` (default: 0)
- **Max Price:** `price <= maxPrice` (default: 999,999,999)
- **Range:** Both can be combined for price range

### Pagination
- **Default limit:** 10 items per page
- **Default page:** 1
- **Skip formula:** `(page - 1) * limit`
- **No maximum limit enforcement** (can request 1000+ but use responsibly)

### Performance
- ✅ Efficient Prisma queries with proper indexed fields
- ✅ Only returns necessary fields (no passwords, etc.)
- ✅ Ordered by newest first (`createdAt desc`)

---

## **Frontend Integration Examples**

### React Hook with Fetch
```javascript
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(false);
const [filters, setFilters] = useState({
  search: '',
  category: '',
  minPrice: 0,
  maxPrice: 999999999,
  page: 1,
  limit: 10
});

const fetchProducts = async () => {
  setLoading(true);
  try {
    const params = new URLSearchParams(filters).toString();
    const response = await fetch(`http://localhost:5000/api/products?${params}`);
    const data = await response.json();
    
    if (data.success) {
      setProducts(data.products);
    }
  } catch (error) {
    console.error('Error fetching products:', error);
  } finally {
    setLoading(false);
  }
};

// Usage
useEffect(() => {
  fetchProducts();
}, [filters]);
```

### React with Axios
```javascript
import axiosClient from '../api/axiosClient';
import useProductStore from '../store/useProductStore';

const { fetchProducts } = useProductStore();

const handleSearch = (searchTerm) => {
  fetchProducts(1, 10, null, searchTerm);
};

const handlePriceFilter = (minPrice, maxPrice) => {
  // Custom API call with extended params
  axiosClient.get('/products', {
    params: {
      minPrice,
      maxPrice,
      page: 1,
      limit: 10
    }
  });
};
```

### Advanced Search Component
```javascript
function ProductSearch() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 200000]);

  const handleSearch = () => {
    const query = new URLSearchParams({
      search,
      category,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      page: 1,
      limit: 20
    });

    fetch(`/api/products?${query}`)
      .then(res => res.json())
      .then(data => {
        console.log(`Found ${data.pagination.totalItems} products`);
      });
  };

  return (
    <div>
      <input 
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Tìm kiếm sản phẩm..."
      />
      
      <select value={category} onChange={e => setCategory(e.target.value)}>
        <option value="">Tất cả danh mục</option>
        <option value="dihoc">Đi Học</option>
        <option value="tinhban">Tình Bạn</option>
        <option value="pastel">Pastel</option>
      </select>

      <input 
        type="range"
        min="0"
        max="200000"
        value={priceRange[0]}
        onChange={e => setPriceRange([+e.target.value, priceRange[1]])}
      />
      <input 
        type="range"
        min="0"
        max="200000"
        value={priceRange[1]}
        onChange={e => setPriceRange([priceRange[0], +e.target.value])}
      />

      <button onClick={handleSearch}>Tìm kiếm</button>
    </div>
  );
}
```

---

## **Best Practices**

### 1. **Optimize Frontend Requests**
```javascript
// ❌ Don't: Make request on every keystroke
<input onChange={e => searchProducts(e.target.value)} />

// ✅ Do: Debounce search requests
const [searchTerm, setSearchTerm] = useState('');

useEffect(() => {
  const timer = setTimeout(() => {
    fetchProducts(1, 10, null, searchTerm);
  }, 500); // Wait 500ms after user stops typing

  return () => clearTimeout(timer);
}, [searchTerm]);
```

### 2. **Cache Results**
```javascript
// Use React Query or similar for automatic caching
const query = `search=${search}&category=${category}&minPrice=${minPrice}`;
const { data } = useQuery(['products', query], () => fetchProducts());
```

### 3. **Handle Empty Results**
```javascript
if (data.pagination.totalItems === 0) {
  return <div>Không tìm thấy sản phẩm nào</div>;
}
```

### 4. **Implement Pagination UI**
```javascript
<div>
  {pagination.hasNextPage && (
    <button onClick={() => goToPage(page + 1)}>Tiếp theo</button>
  )}
  {pagination.hasPrevPage && (
    <button onClick={() => goToPage(page - 1)}>Trước đó</button>
  )}
  <span>Trang {currentPage} / {pagination.totalPages}</span>
</div>
```

---

## **API Query Limits**

Currently, there are **no strict limits**, but best practices:

| Aspect | Recommended | Never Exceed |
|--------|-------------|--------------|
| Page size (limit) | 10-20 | 1000 |
| Search term length | <100 chars | <500 chars |
| Request frequency | 1 req/second | System dependent |

---

## **Error Handling**

### Invalid Page Number
```bash
curl "http://localhost:5000/api/products?page=0"
# Automatically converts to page=1
```

### Invalid Limit
```bash
curl "http://localhost:5000/api/products?limit=-5"
# Automatically converts to limit=1
```

### Invalid Price Range
```bash
curl "http://localhost:5000/api/products?minPrice=100000&maxPrice=50000"
# Returns empty results (min > max)
```

### Server Error Response
```json
{
  "success": false,
  "message": "Lỗi server",
  "error": "Error details here"
}
```

---

## **Common Use Cases**

### 1. **E-commerce Filter Sidebar**
```
Search box → Name/Description
Category dropdown → category param
Price slider → minPrice & maxPrice
```

### 2. **Infinite Scroll**
```
Fetch page 1 → Display 10 items
User scrolls → Fetch page 2 → Append items
Repeat until hasNextPage: false
```

### 3. **Product Discovery Feed**
```
Random category → category = random select
Limit = 5 (show 5 items)
Auto-refresh every 5 minutes
```

### 4. **Sale Search**
```
minPrice = previous_price
maxPrice = sale_price
search = "sale" (optional)
```

---

## **Performance Tips**

1. ✅ Use page size of 10-20 (good UX + performance)
2. ✅ Implement search debouncing (wait 300-500ms)
3. ✅ Cache results with React Query or SWR
4. ✅ Lazy load images from Cloudinary
5. ✅ Prefetch next page on scroll
6. ✅ Use 'contains' search (Prisma optimized)

---

**API is Production-Ready!** 🚀
