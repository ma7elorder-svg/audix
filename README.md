# Audix - Online Store

A stunning, modern online store for Audix featuring premium design with blue and black theme colors. Built with HTML, CSS, and JavaScript with full Arabic language support (RTL layout).

## 🎨 Features

- **Premium Modern Design**: Glassmorphism effects, smooth animations, and vibrant gradients
- **Arabic Language**: Full RTL (right-to-left) support with Arabic text
- **Shopping Cart**: Fully functional cart with localStorage persistence
- **Responsive**: Works beautifully on all devices
- **Two Products**:
  1. Earphone Headband for Sports & Work (299 SAR)
  2. Small Keyboard Gadget with LED lights (199 SAR)

## 📁 Project Structure

```
audix/
├── index.html      # Main HTML file
├── index.css       # Styles and design system
├── script.js       # JavaScript functionality
└── README.md       # This file
```

## 🖼️ How to Add Product Images

### Option 1: Using Local Images

1. Create an `images` folder in the audix directory
2. Add your product images (e.g., `earphone-headband.jpg` and `keyboard-gadget.jpg`)
3. In `index.html`, replace the placeholder divs:

**For Product 1 (Earphone Headband):**
Find this code (around line 87):
```html
<div class="product-image-placeholder">
    <!-- placeholder content -->
</div>
```

Replace with:
```html
<img src="images/earphone-headband.jpg" alt="حزام سماعات الأذن الرياضي" style="width: 100%; height: 100%; object-fit: cover; border-radius: var(--radius-lg);">
```

**For Product 2 (Keyboard Gadget):**
Find the second product placeholder (around line 125) and replace similarly:
```html
<img src="images/keyboard-gadget.jpg" alt="لوحة مفاتيح مضيئة صغيرة" style="width: 100%; height: 100%; object-fit: cover; border-radius: var(--radius-lg);">
```

### Option 2: Using External URLs

If you have images hosted online, use the URL directly:
```html
<img src="https://your-image-url.com/image.jpg" alt="Product name" style="width: 100%; height: 100%; object-fit: cover; border-radius: var(--radius-lg);">
```

## 🚀 How to Run

Simply open `index.html` in any modern web browser. No build process or server required!

## 🎯 Customization

### Changing Prices
Edit the prices in `index.html` in two places for each product:
1. The displayed price (e.g., `<span class="price">299 ريال</span>`)
2. The data attribute (e.g., `data-product='{"id": 1, "name": "...", "price": 299}'`)

### Changing Product Names or Descriptions
Edit the text directly in `index.html` for each product card.

### Changing Colors
Modify the CSS variables in `index.css` (lines 9-15) to change the color scheme.

## 📱 Sections

1. **Hero Section**: Welcome message and brand introduction
2. **Products Section**: Showcase of the two products with cart functionality
3. **About Section**: Information about Audix brand
4. **Contact Section**: Contact form for customer inquiries
5. **Footer**: Links and contact information

## 🛒 Shopping Cart Features

- Add/remove products
- Adjust quantities
- Persistent cart (saves to browser localStorage)
- Total price calculation
- Checkout functionality

## 🌐 Browser Support

Works on all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## 📝 Notes

- All text is in Arabic except for the "Audix" brand name
- RTL (right-to-left) layout is properly implemented
- The site uses the Cairo font from Google Fonts for beautiful Arabic typography
- Smooth animations and hover effects throughout

---

Made with ❤️ for Audix
