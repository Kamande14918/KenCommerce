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

const sampleProducts = [
  {
    name: 'iPhone 15 Pro',
    description: 'Latest iPhone with advanced features and A17 Pro chip',
    price: 999.99,
    stock: 50,
    brand: 'Apple',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800',
        alt: 'iPhone 15 Pro'
      }
    ],
    tags: ['smartphone', 'apple', 'ios', 'mobile'],
    specifications: {
      'Display': '6.1-inch Super Retina XDR',
      'Chip': 'A17 Pro',
      'Camera': '48MP Main camera',
      'Storage': '128GB'
    },
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Samsung Galaxy S24',
    description: 'Powerful Android smartphone with AI features',
    price: 899.99,
    stock: 30,
    brand: 'Samsung',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800',
        alt: 'Samsung Galaxy S24'
      }
    ],
    tags: ['smartphone', 'samsung', 'android', 'mobile'],
    specifications: {
      'Display': '6.2-inch Dynamic AMOLED',
      'Processor': 'Snapdragon 8 Gen 3',
      'Camera': '50MP Triple camera',
      'Storage': '256GB'
    },
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Nike Air Max 270',
    description: 'Comfortable running shoes with Air Max technology',
    price: 129.99,
    stock: 100,
    brand: 'Nike',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
        alt: 'Nike Air Max 270'
      }
    ],
    tags: ['shoes', 'nike', 'running', 'sports'],
    specifications: {
      'Material': 'Mesh and synthetic leather',
      'Technology': 'Air Max cushioning',
      'Type': 'Running shoes'
    },
    isActive: true,
    isFeatured: false
  },
  {
    name: 'MacBook Pro 16"',
    description: 'Professional laptop with M3 chip for demanding tasks',
    price: 2499.99,
    stock: 20,
    brand: 'Apple',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800',
        alt: 'MacBook Pro 16 inch'
      }
    ],
    tags: ['laptop', 'apple', 'macbook', 'professional'],
    specifications: {
      'Processor': 'Apple M3 Pro',
      'Display': '16.2-inch Liquid Retina XDR',
      'Memory': '18GB unified memory',
      'Storage': '512GB SSD'
    },
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Sony WH-1000XM5',
    description: 'Premium noise-canceling wireless headphones',
    price: 349.99,
    stock: 75,
    brand: 'Sony',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800',
        alt: 'Sony WH-1000XM5 Headphones'
      }
    ],
    tags: ['headphones', 'sony', 'wireless', 'noise-canceling'],
    specifications: {
      'Type': 'Over-ear wireless',
      'Battery': '30 hours',
      'Features': 'Active Noise Canceling',
      'Connectivity': 'Bluetooth 5.2'
    },
    isActive: true,
    isFeatured: true
  }
];

// Ensure every image has a public_id for seeding
sampleProducts.forEach(product => {
  if (Array.isArray(product.images)) {
    product.images.forEach((img, idx) => {
      if (!img.public_id) {
        img.public_id = `seeded-image-${product.name.toLowerCase().replace(/\s+/g, '-')}-${idx}`;
      }
    });
  }
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
