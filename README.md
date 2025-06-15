# 🛍️ PriceCompare - Product Price Comparison Web App

A full-stack web application that compares product prices across multiple e-commerce platforms including real-time data from RapidAPI and mock data from popular platforms.

![PriceCompare Demo](https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop&auto=format)

## ✨ Features

- 🔍 **Real-time Product Search** - Search across multiple platforms
- 💰 **Price Comparison** - Compare prices from different sources
- 📱 **Responsive Design** - Works on desktop and mobile
- ⚡ **Fast API Integration** - Real data from RapidAPI
- 🎨 **Modern UI** - Clean, gradient-based design
- 📊 **Product Details** - Ratings, reviews, stock status
- 🚀 **Live Demo** - Mix of real and mock data

## 🛠️ Tech Stack

**Frontend:**
- HTML5, CSS3, JavaScript
- Responsive Grid Layout
- Modern CSS (Gradients, Animations)

**Backend:**
- Node.js
- Express.js
- Axios for API calls
- CORS enabled

**APIs:**
- RapidAPI (Real-Time Product Search)
- eBay API (optional)
- Mock data for demonstration

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- RapidAPI account (free)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/price-compare-app.git
cd price-compare-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Create .env file
cp .env.example .env

# Edit .env with your API keys
RAPIDAPI_KEY=your_rapidapi_key_here
EBAY_APP_ID=your_ebay_key_here (optional)
```

4. **Create project structure**
```
price-compare-app/
├── server.js
├── package.json
├── .env
├── README.md
└── public/
    └── index.html
```

5. **Move HTML file**
```bash
mkdir public
# Move the index.html to public/ folder
```

### 🔑 Getting API Keys

#### RapidAPI (Required - Free Tier Available)

1. Go to [RapidAPI](https://rapidapi.com/)
2. Sign up for free account
3. Subscribe to [Real-Time Product Search API](https://rapidapi.com/letscrape-6bRBa3QguO5/api/real-time-product-search/)
4. Choose "Basic" plan (FREE - 100 requests/month)
5. Copy your X-RapidAPI-Key
6. Add to `.env` file

#### eBay API (Optional)

1. Go to [eBay Developers](https://developer.ebay.com/)
2. Create application
3. Get Application ID
4. Add to `.env` file

### 🏃‍♂️ Running the Application

1. **Start the server**
```bash
npm start
# Or for development with auto-restart
npm run dev
```

2. **Open your browser**
```
http://localhost:3000
```

3. **Test the search**
- Try searching: "iPhone", "laptop", "headphones", "Nike shoes"
- You'll see real products from RapidAPI + mock data

## 📁 Project Structure

```
price-compare-app/
├── 📄 server.js              # Backend API server
├── 📦 package.json           # Dependencies and scripts
├── 🔐 .env                   # Environment variables
├── 📖 README.md              # This file
└── 📁 public/
    └── 🌐 index.html         # Frontend application
```

## 🔧 Configuration

### Environment Variables

```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# API Keys
RAPIDAPI_KEY=your_rapidapi_key_here
EBAY_APP_ID=your_ebay_key_here
```

### Package.json Scripts

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Serve frontend |
| GET | `/api/search?q=query` | Search products |
| GET | `/api/health` | API health check |

### Example API Usage

```bash
# Search for products
curl "http://localhost:3000/api/search?q=iPhone"

# Health check
curl "http://localhost:3000/api/health"
```

## 📱 Usage

1. **Search Products**: Enter product name in search box
2. **Compare Prices**: View results from multiple platforms
3. **Check Details**: See ratings, reviews, stock status
4. **Visit Store**: Click "View on [Platform]" to go to product page

## 🎨 Features Showcase

- **Real-time Search**: Fetches live product data
- **Price Formatting**: Converts USD to INR
- **Responsive Design**: Mobile-friendly interface
- **Error Handling**: Graceful fallbacks for API failures
- **Loading States**: Smooth user experience
- **Image Fallbacks**: Backup images if API images fail

## 🔍 Supported Platforms

| Platform | Status | Data Source |
|----------|--------|-------------|
| RapidAPI | ✅ Live | Real-Time Product Search API |
| Amazon | 🎭 Mock | Demo data for comparison |
| Flipkart | 🎭 Mock | Demo data for comparison |
| eBay | ⚠️ Optional | eBay API (requires setup) |

## 🐛 Troubleshooting

### Common Issues

**1. "RapidAPI: ❌ Need API key"**
- Check your `.env` file exists
- Verify `RAPIDAPI_KEY` is correct
- Restart the server

**2. "No results found"**
- Check API key is valid
- Try different search terms
- Check console for error messages

**3. "Images not loading"**
- Normal with free APIs (CORS/rate limiting)
- Fallback images will display automatically

**4. "Port already in use"**
```bash
# Kill process on port 3000
npx kill-port 3000
# Or use different port
PORT=3001 npm start
```

## 📈 Future Enhancements

- [ ] Add more e-commerce APIs
- [ ] Price history tracking
- [ ] User favorites/wishlist
- [ ] Price alerts
- [ ] Product reviews aggregation
- [ ] Advanced filtering options
- [ ] User authentication
- [ ] Database integration

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Your Name**
- Portfolio: [your-portfolio.com](https://your-portfolio.com)
- LinkedIn: [linkedin.com/in/yourname](https://linkedin.com/in/yourname)
- GitHub: [github.com/yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- [RapidAPI](https://rapidapi.com/) for providing product search API
- [Unsplash](https://unsplash.com/) for fallback images
- [Express.js](https://expressjs.com/) for the backend framework

---
