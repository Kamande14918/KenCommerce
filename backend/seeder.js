const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Sample data
const sampleUsers = [
  {
    firstName: 'Kennedy',
    lastName: 'Kamande',
    email: 'kamandemungai841@gmail.com',
    password: 'Ken@14918',
    role: 'admin',
    isEmailVerified: true,
    isActive: true
  }]
  
  

const sampleCategories = [
  {
    name: 'Electronics',
    description: 'Electronic devices and gadgets',
    slug: 'electronics',
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Fashion',
    description: 'Clothing and accessories',
    slug: 'fashion',
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Home & Garden',
    description: 'Home improvement and garden supplies',
    slug: 'home-garden',
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Books',
    description: 'Books and educational materials',
    slug: 'books',
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Sports',
    description: 'Sports equipment and accessories',
    slug: 'sports',
    isActive: true,
    isFeatured: true
  },
  // Additional common e-commerce categories
  {
    name: 'Beauty & Personal Care',
    description: 'Cosmetics, skincare, and personal care products',
    slug: 'beauty-personal-care',
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Health & Wellness',
    description: 'Health products and supplements',
    slug: 'health-wellness',
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Toys & Games',
    description: 'Toys, games, and entertainment for children',
    slug: 'toys-games',
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Automotive',
    description: 'Car parts and automotive accessories',
    slug: 'automotive',
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Office Supplies',
    description: 'Office equipment and supplies',
    slug: 'office-supplies',
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Jewelry & Watches',
    description: 'Jewelry, watches, and accessories',
    slug: 'jewelry-watches',
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Baby & Kids',
    description: 'Baby products and kids accessories',
    slug: 'baby-kids',
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Pet Supplies',
    description: 'Products for pets and animals',
    slug: 'pet-supplies',
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Groceries',
    description: 'Food and grocery items',
    slug: 'groceries',
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Music & Movies',
    description: 'Music, movies, and entertainment media',
    slug: 'music-movies',
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Tools & Home Improvement',
    description: 'Tools and home improvement supplies',
    slug: 'tools-home-improvement',
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Appliances',
    description: 'Home and kitchen appliances',
    slug: 'appliances',
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Shoes',
    description: 'Footwear for men, women, and kids',
    slug: 'shoes',
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Bags & Luggage',
    description: 'Bags, backpacks, and luggage',
    slug: 'bags-luggage',
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Art & Craft',
    description: 'Art supplies and craft materials',
    slug: 'art-craft',
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Stationery',
    description: 'Stationery and writing supplies',
    slug: 'stationery',
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Gift Items',
    description: 'Gifts and special occasion items',
    slug: 'gift-items',
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Travel',
    description: 'Travel accessories and essentials',
    slug: 'travel',
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Industrial & Scientific',
    description: 'Industrial and scientific products',
    slug: 'industrial-scientific',
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Musical Instruments',
    description: 'Instruments and music gear',
    slug: 'musical-instruments',
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Outdoor & Adventure',
    description: 'Outdoor gear and adventure equipment',
    slug: 'outdoor-adventure',
    isActive: true,
    isFeatured: false
  }
];

// Helper functions for random data
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomPrice() {
  // Ksh 500 to Ksh 200,000
  return getRandomInt(500, 200000);
}

// Product names and images for each category
const categoryProductData = {
  electronics: {
    names: [
      "iPhone 15 Pro", "Samsung Galaxy S24", "Dell XPS 13", "Sony WH-1000XM5",
      "MacBook Pro 16", "Canon EOS R5", "GoPro Hero 12", "Apple Watch Series 9",
      "Bose QuietComfort Earbuds", "Nintendo Switch OLED", "DJI Mini 3 Pro",
      "HP Spectre x360", "Logitech MX Master 3S", "Samsung QLED TV", "Kindle Paperwhite",
      "Raspberry Pi 5", "Anker PowerCore 20000", "Google Pixel 8", "OnePlus 12", "JBL Flip 6"
    ],
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800",
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800",
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800",
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=800",
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800",
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=800",
      "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=800",
      "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=800",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
      "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?w=800",
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800",
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800",
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=800",
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800"
    ]
  },
  fashion: {
    names: [
      "Classic Blue Jeans", "Summer Floral Dress", "Men's Leather Jacket", "Women's Blazer",
      "Unisex Hoodie", "Sports Sneakers", "Silk Scarf", "Woolen Beanie", "Cotton T-Shirt",
      "Denim Shorts", "Formal Trousers", "Maxi Skirt", "Polo Shirt", "Ankle Boots",
      "Raincoat", "Graphic Tee", "Cargo Pants", "Bomber Jacket", "Sun Hat", "Running Shorts"
    ],
    images: [
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800",
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800",
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800",
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800",
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800",
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800",
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800",
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800",
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800",
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800"
    ]
  },
  // ...repeat for all other categories with unique names and images
};

const sampleProducts = [];
sampleCategories.forEach((cat) => {
  const data = categoryProductData[cat.slug] || { names: [], images: [] };
  for (let i = 0; i < data.names.length; i++) {
    sampleProducts.push({
      name: data.names[i],
      description: `High quality ${cat.name} item: ${data.names[i]}`,
      price: getRandomPrice(),
      stock: getRandomInt(10, 200),
      brand: `Brand${getRandomInt(1, 20)}`,
      images: [{
        url: data.images[i % data.images.length],
        alt: data.names[i],
        public_id: `seeded-image-${cat.slug}-${i}`
      }],
      tags: [cat.slug, 'sale', 'popular'],
      specifications: {
        Feature: `Special feature ${i + 1}`,
        Warranty: `${getRandomInt(1, 3)} year(s)`
      },
      status: 'active',
      featured: i % 5 === 0 // every 5th product is featured
    });
  }
});

// Ensure every image has a public_id for seeding
sampleProducts.forEach(product => {
  if (Array.isArray(product.images)) {
    product.images.forEach((img, idx) => {
      if (!img.public_id) {
        img.public_id = `seeded-image-${product.name.toLowerCase().replace(/\s+/g, '-')}-${idx}`;
      }
    });
  }
  // Set status to 'active' for all products
  product.status = 'active';
  // Set inventory.stock to a random value between 10 and 200
  product.inventory = product.inventory || {};
  product.inventory.stock = getRandomInt(10, 200);
  product.inventory.trackStock = true;
  product.inventory.lowStockThreshold = 10;
  product.inventory.allowBackorder = false;
  product.inventory.stockStatus = 'in_stock';
  // Remove isFeatured if present
  if ('isFeatured' in product) delete product.isFeatured;
});

const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();

    console.log('Existing data cleared');

    // Create admin user only
    const users = await User.create(sampleUsers);
    console.log('Admin user created');

    // Create categories
    const categories = await Category.create(sampleCategories);
    console.log('Sample categories created');

    // Find reference categories
    const electronicsCategory = categories.find(cat => cat.slug === 'electronics');
    const fashionCategory = categories.find(cat => cat.slug === 'fashion');
    const admin = users.find(user => user.role === 'admin');
    const fallbackCategory = categories[0];
    const fallbackAdmin = admin || users[0];

    // Assign categories and admin as seller to products
    const productsWithRefs = sampleProducts.map((product, index) => {
      // Assign categories
      if (index < 2 || index === 3 || index === 4) {
        product.category = (electronicsCategory && electronicsCategory._id) || (fallbackCategory && fallbackCategory._id);
      } else {
        product.category = (fashionCategory && fashionCategory._id) || (fallbackCategory && fallbackCategory._id);
      }
      // Assign admin as seller
      product.seller = fallbackAdmin ? fallbackAdmin._id : undefined;
      return product;
    });

    await Product.create(productsWithRefs);
    console.log('Sample products created');

    console.log('Sample data imported successfully!');
    console.log('\nDefault admin credentials:');
    console.log(`Admin: ${sampleUsers[0].email} / ${sampleUsers[0].password}`);
    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();

    console.log('All data destroyed!');
    process.exit();
  } catch (error) {
    console.error('Error destroying data:', error);
    process.exit(1);
  }
};

// Command line usage
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
