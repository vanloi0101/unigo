# 📸 Cloudinary Image Upload Integration - Setup Guide

## **1. Cloudinary Account Setup**

### Step 1: Create Cloudinary Account
1. Visit https://cloudinary.com/
2. Click "Sign Up Free"
3. Fill in your information and create account
4. Verify your email

### Step 2: Get API Credentials
1. Go to https://cloudinary.com/console/settings/api-keys
2. Copy the following credentials:
   - **Cloud Name** - Your unique identifier
   - **API Key** - For authentication
   - **API Secret** - Keep this secret, never share!

---

## **2. Backend Configuration**

### Update .env file
```bash
# Copy credentials from Cloudinary console
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

### Files Created/Updated
- ✅ `src/config/cloudinary.js` - Cloudinary SDK configuration
- ✅ `src/middlewares/uploadMiddleware.js` - Multer middleware for file handling
- ✅ `src/controllers/productController.js` - Image upload integration
- ✅ `src/routes/productRoutes.js` - Updated routes with upload middleware

---

## **3. API Usage**

### Create Product with Image

**Endpoint:** `POST /api/products`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data
```

**Body (form-data):**
| Key | Type | Value |
|-----|------|-------|
| name | text | Vòng tay đẹp |
| description | text | Mô tả sản phẩm |
| price | number | 50000 |
| stock | number | 10 |
| category | text | dihoc |
| image | file | image.jpg |

**Example with cURL:**
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -F "name=Vòng tay đẹp" \
  -F "description=Vòng tay handmade" \
  -F "price=50000" \
  -F "stock=10" \
  -F "category=dihoc" \
  -F "image=@/path/to/image.jpg"
```

**Response:**
```json
{
  "success": true,
  "message": "Sản phẩm tạo thành công",
  "product": {
    "id": 1,
    "name": "Vòng tay đẹp",
    "description": "Vòng tay handmade",
    "price": 50000,
    "imageUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/unigo/products/abc123.jpg",
    "stock": 10,
    "category": "dihoc",
    "createdAt": "2024-04-05T12:34:56.000Z",
    "updatedAt": "2024-04-05T12:34:56.000Z"
  }
}
```

---

### Update Product with Image

**Endpoint:** `PUT /api/products/:id`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data
```

**Body:** Same as create (all fields optional)

**Example:**
```bash
curl -X PUT http://localhost:5000/api/products/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -F "name=Vòng tay mới" \
  -F "price=55000" \
  -F "image=@/path/to/new-image.jpg"
```

---

### Get All Products with Search & Filter

**Endpoint:** `GET /api/products`

**Query Parameters:**
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| search | string | Search by name or description | `?search=vòng` |
| category | string | Filter by category | `?category=dihoc` |
| minPrice | number | Minimum price | `?minPrice=30000` |
| maxPrice | number | Maximum price | `?maxPrice=100000` |
| page | number | Page number (default: 1) | `?page=1` |
| limit | number | Items per page (default: 10) | `?limit=10` |

**Examples:**

```bash
# Get all products
curl http://localhost:5000/api/products

# Search by keyword
curl "http://localhost:5000/api/products?search=giỏ"

# Filter by category
curl "http://localhost:5000/api/products?category=dihoc"

# Price range
curl "http://localhost:5000/api/products?minPrice=30000&maxPrice=100000"

# Combined filtering
curl "http://localhost:5000/api/products?search=vòng&category=dihoc&minPrice=40000&maxPrice=80000&page=1&limit=5"
```

**Response:**
```json
{
  "success": true,
  "products": [
    {
      "id": 1,
      "name": "Vòng tay đẹp",
      "description": "Vòng tay handmade",
      "price": 50000,
      "imageUrl": "https://res.cloudinary.com/...",
      "stock": 10,
      "category": "dihoc",
      "createdAt": "2024-04-05T12:34:56.000Z",
      "updatedAt": "2024-04-05T12:34:56.000Z"
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

---

## **4. Image Upload Features**

### Supported Formats
- JPEG
- PNG
- GIF
- WebP

### File Size Limit
- Maximum: **5MB**

### Cloudinary Optimizations
- Automatic quality optimization
- Modern format conversion (WebP)
- Responsive image serving

### Storage Structure
Images are organized as:
```
unigo/products/
  ├── product_1.jpg
  ├── product_2.jpg
  └── ...
```

---

## **5. Error Handling**

### Common Errors

**File Too Large**
```json
{
  "success": false,
  "message": "Kích thước tệp quá lớn (tối đa 5MB)"
}
```

**Invalid File Format**
```json
{
  "success": false,
  "message": "Chỉ có thể upload hình ảnh (JPEG, PNG, GIF, WebP)"
}
```

**Cloudinary Upload Error**
```json
{
  "success": false,
  "message": "Lỗi upload hình ảnh: [error details]"
}
```

**Admin Permission Denied**
```json
{
  "success": false,
  "message": "Chỉ admin mới có thể tạo sản phẩm"
}
```

---

## **6. Frontend Integration Example (React)**

### Using Fetch API
```javascript
const createProduct = async (formData) => {
  const response = await fetch('http://localhost:5000/api/products', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData, // FormData object with image
  });

  return response.json();
};

// Usage
const form = document.querySelector('form');
const formData = new FormData(form);
const result = await createProduct(formData);
```

### Using Axios
```javascript
const createProduct = async (name, price, imageFile) => {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('price', price);
  formData.append('image', imageFile);

  const response = await axiosClient.post('/products', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response;
};
```

---

## **7. Best Practices**

### Security
1. ✅ Always validate file type on backend
2. ✅ Always validate file size on backend
3. ✅ Use HTTPS in production
4. ✅ Keep API_SECRET secure (never expose in frontend)
5. ✅ Validate user permissions (admin only)

### Performance
1. ✅ Compress images before upload
2. ✅ Use responsive images
3. ✅ Cache CloudinaryTransformation results
4. ✅ Use CDN for image delivery (built-in with Cloudinary)

### User Experience
1. ✅ Show upload progress
2. ✅ Display clear error messages
3. ✅ Provide image preview before upload
4. ✅ Support drag-and-drop file upload

---

## **8. Troubleshooting**

### "CLOUDINARY_CLOUD_NAME is undefined"
- Solution: Check .env file has all three credentials
- Ensure server restarted after .env changes

### "401 Unauthorized" from Cloudinary
- Solution: Check API_KEY and API_SECRET are correct
- Regenerate credentials if needed

### "Image not saving to database"
- Solution: Check Cloudinary upload succeeds first
- Verify Prisma database connection
- Check user has ADMIN role

### Upload takes too long
- Solution: Compress image before upload
- Check internet connection
- Verify Cloudinary API isn't throttled

---

## **9. Advanced Features (Optional)**

### Add Image Transformations
```javascript
// In Cloudinary URL
https://res.cloudinary.com/your-cloud/image/upload/
  w_400,h_300,c_crop/v123/unigo/products/image.jpg
  // width: 400px, height: 300px, crop to fill
```

### Generate Thumbnails
```javascript
// Cloudinary generates thumbnails on-the-fly
const thumbnailUrl = imageUrl.replace('/upload/', '/upload/w_150,h_150,c_crop/');
```

### Delete Product with Images
- Automatic deletion of old images when updating
- Automatic deletion when product is deleted

---

## **Useful Links**
- 📚 Cloudinary Docs: https://cloudinary.com/documentation
- 🔧 Cloudinary Console: https://cloudinary.com/console
- 📦 Multer Docs: https://github.com/expressjs/multer
- 🚀 Prisma Docs: https://www.prisma.io/docs

---

**Setup Complete!** Your product upload API is now ready. 🎉
