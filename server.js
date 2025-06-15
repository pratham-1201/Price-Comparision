// server.js - Backend API for Price Comparison App with Real APIs
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// API Configuration
const EBAY_APP_ID = process.env.EBAY_APP_ID || 'YOUR_EBAY_APP_ID_HERE';
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || 'c59361bd4emshb420653e75a4854p192fa2jsnafc1255f0c81';

// Helper function to clean price strings
function cleanPrice(priceStr) {
    if (!priceStr) return null;
    // Remove currency symbols and extract number
    const cleaned = priceStr.replace(/[₹$£€,]/g, '').trim();
    return parseFloat(cleaned) || 0;
}

// Helper function to format price to Indian Rupees
function formatPrice(price, currency = 'USD') {
    if (!price) return 'Price not available';
    
    // Convert USD to INR (approximate rate: 1 USD = 83 INR)
    let inrPrice = currency === 'USD' ? price * 83 : price;
    
    return `₹${Math.round(inrPrice).toLocaleString('en-IN')}`;
}

// eBay API Integration
async function searchEbayProducts(query) {
    try {
        const url = `https://svcs.ebay.com/services/search/FindingService/v1`;
        
        const params = {
            'OPERATION-NAME': 'findItemsByKeywords',
            'SERVICE-VERSION': '1.0.0',
            'SECURITY-APPNAME': EBAY_APP_ID,
            'RESPONSE-DATA-FORMAT': 'JSON',
            'REST-PAYLOAD': '',
            'keywords': query,
            'paginationInput.entriesPerPage': '10',
            'sortOrder': 'PricePlusShippingLowest'
        };

        const queryString = Object.keys(params)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&');

        const response = await axios.get(`${url}?${queryString}`, {
            timeout: 10000
        });

        const items = response.data.findItemsByKeywordsResponse?.[0]?.searchResult?.[0]?.item || [];
        
        return items.slice(0, 5).map(item => ({
            platform: "ebay",
            title: item.title?.[0] || 'No title',
            price: formatPrice(parseFloat(item.sellingStatus?.[0]?.currentPrice?.[0]?.__value__ || 0)),
            originalPrice: null,
            discount: null,
            rating: Math.random() * 1.5 + 3.5, // eBay doesn't provide ratings easily
            reviews: Math.floor(Math.random() * 1000) + 50,
            image: item.galleryURL?.[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop',
            url: item.viewItemURL?.[0] || '#',
            inStock: true,
            delivery: "Standard delivery 3-7 days"
        }));
    } catch (error) {
        console.error('eBay API Error:', error.message);
        return [];
    }
}

// RapidAPI Product Search Integration
async function searchRapidAPIProducts(query) {
    try {
        const options = {
            method: 'GET',
            url: 'https://real-time-product-search.p.rapidapi.com/search-v2',
            params: {
                q: query,
                country: 'us',
                language: 'en',
                page: '1',
                limit: '10',
                sort_by: 'BEST_MATCH',
                product_condition: 'ANY'
            },
            headers: {
                'X-RapidAPI-Key': RAPIDAPI_KEY,
                'x-rapidapi-host': 'real-time-product-search.p.rapidapi.com'
            },
            timeout: 15000
        };

        console.log('Calling RapidAPI with query:', query);
        const response = await axios.request(options);
        console.log('RapidAPI Response Status:', response.status);
        
        // Correct path based on your response structure
        const products = response.data?.data?.products || [];
        console.log(`Found ${products.length} products from RapidAPI`);
        
        if (!Array.isArray(products)) {
            console.log('Products is not an array:', typeof products);
            return [];
        }

        return products.slice(0, 5).map(product => {
            console.log('Processing product:', {
                title: product.product_title,
                price: product.product_price,
                photo: product.product_photo
            });
            
            return {
                platform: "rapidapi",
                title: product.product_title || product.title || 'No title available',
                price: formatPrice(cleanPrice(product.product_price || product.price), 'USD'),
                originalPrice: product.product_original_price ? formatPrice(cleanPrice(product.product_original_price), 'USD') : null,
                discount: product.product_discount || product.discount || null,
                rating: parseFloat(product.product_rating || product.rating || (Math.random() * 1.5 + 3.5).toFixed(1)),
                reviews: parseInt(product.product_num_reviews || product.reviews || Math.floor(Math.random() * 1000) + 50),
                image: product.product_photo || product.image || product.thumbnail || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop',
                url: product.product_url || product.url || '#',
                inStock: product.product_availability !== 'Out of stock',
                delivery: product.delivery || "Varies by seller"
            };
        });
    } catch (error) {
        console.error('RapidAPI Error:', error.response?.data || error.message);
        if (error.response?.status === 429) {
            console.log('Rate limit exceeded for RapidAPI');
        }
        return [];
    }
}

// Enhanced mock data for fallback
const mockData = {
    "iphone": [
        {
            platform: "amazon",
            title: "Apple iPhone 15 (128GB) - Natural Titanium",
            price: "₹79,900",
            originalPrice: "₹84,900",
            discount: "6%",
            rating: 4.5,
            reviews: 1234,
            image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=200&fit=crop",
            url: "#",
            inStock: true,
            delivery: "Free delivery by tomorrow"
        },
        {
            platform: "flipkart",
            title: "Apple iPhone 15 (Natural Titanium, 128GB)",
            price: "₹78,999",
            originalPrice: "₹84,900",
            discount: "7%",
            rating: 4.4,
            reviews: 892,
            image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=200&fit=crop",
            url: "#",
            inStock: true,
            delivery: "Free delivery in 2 days"
        }
    ],
    "laptop": [
        {
            platform: "amazon",
            title: "Dell Inspiron 15 3000 Laptop (Intel i5, 8GB RAM)",
            price: "₹45,990",
            originalPrice: "₹52,990",
            discount: "13%",
            rating: 4.2,
            reviews: 2156,
            image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=200&fit=crop",
            url: "#",
            inStock: true,
            delivery: "Free delivery in 2 days"
        }
    ],
    "headphones": [
        {
            platform: "amazon",
            title: "Sony WH-CH720N Noise Canceling Wireless Headphones",
            price: "₹8,990",
            originalPrice: "₹12,990",
            discount: "31%",
            rating: 4.3,
            reviews: 3421,
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop",
            url: "#",
            inStock: true,
            delivery: "Free delivery by tomorrow"
        }
    ]
};

// Main search endpoint
app.get('/api/search', async (req, res) => {
    try {
        const { q: query } = req.query;
        
        if (!query) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }

        console.log(`Searching for: ${query}`);
        
        // Search multiple sources concurrently
        const searchPromises = [];
        
        // Add eBay search if API key is configured
        if (EBAY_APP_ID && EBAY_APP_ID !== 'YOUR_EBAY_APP_ID_HERE') {
            searchPromises.push(searchEbayProducts(query));
        }
        
        // Add RapidAPI search if API key is configured
        if (RAPIDAPI_KEY && RAPIDAPI_KEY !== 'YOUR_RAPIDAPI_KEY_HERE') {
            searchPromises.push(searchRapidAPIProducts(query));
        }

        // Execute all searches
        const results = await Promise.allSettled(searchPromises);
        
        // Combine results
        let allProducts = [];
        results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                allProducts = allProducts.concat(result.value);
            } else {
                console.error(`Search ${index} failed:`, result.reason);
            }
        });

        // Add mock data as fallback or supplement
        const mockKey = Object.keys(mockData).find(key => 
            query.toLowerCase().includes(key)
        );
        
        if (mockKey) {
            allProducts = allProducts.concat(mockData[mockKey]);
        }

        // If no results from APIs and no mock data match, provide generic mock data
        if (allProducts.length === 0) {
            allProducts = [
                {
                    platform: "demo",
                    title: `${query} - Demo Product`,
                    price: "₹" + (Math.floor(Math.random() * 50000) + 5000).toLocaleString('en-IN'),
                    originalPrice: null,
                    discount: Math.floor(Math.random() * 30) + 5 + "%",
                    rating: Math.random() * 1.5 + 3.5,
                    reviews: Math.floor(Math.random() * 1000) + 50,
                    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop",
                    url: "#",
                    inStock: true,
                    delivery: "Demo product"
                }
            ];
        }

        // Sort by price (lowest first)
        allProducts.sort((a, b) => {
            const priceA = cleanPrice(a.price) || 0;
            const priceB = cleanPrice(b.price) || 0;
            return priceA - priceB;
        });

        res.json({
            query,
            totalResults: allProducts.length,
            products: allProducts.slice(0, 10), // Limit to 10 results
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        apis: {
            ebay: EBAY_APP_ID !== 'YOUR_EBAY_APP_ID_HERE',
            rapidapi: RAPIDAPI_KEY !== 'YOUR_RAPIDAPI_KEY_HERE'
        }
    });
});

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 API endpoints:`);
    console.log(`   GET /api/search?q=<query> - Search products`);
    console.log(`   GET /api/health - Health check`);
    console.log(`🔑 API Status:`);
    console.log(`   eBay API: ${EBAY_APP_ID !== 'YOUR_EBAY_APP_ID_HERE' ? '✅ Configured' : '❌ Need API key'}`);
    console.log(`   RapidAPI: ${RAPIDAPI_KEY !== 'YOUR_RAPIDAPI_KEY_HERE' ? '✅ Configured' : '❌ Need API key'}`);
});

module.exports = app;