# KenCommerce Development Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v5 or higher)
- Git

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd KenCommerce-MERN
```

2. **Run setup script**
```bash
# On Windows
setup.bat

# On macOS/Linux
chmod +x setup.sh
./setup.sh
```

3. **Configure environment variables**
Update `backend/.env` with your configurations:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/kencommerce
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=30d

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Email (NodeMailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=KenCommerce <noreply@kencommerce.com>

# Frontend URL
CLIENT_URL=http://localhost:3000
```

4. **Start development servers**
```bash
npm run dev
```

## 📁 Project Structure

```
KenCommerce-MERN/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── store/           # Redux store and slices
│   │   ├── hooks/           # Custom React hooks
│   │   ├── utils/           # Utility functions
│   │   └── styles/          # CSS and style files
│   ├── public/              # Static assets
│   └── package.json
├── backend/                 # Node.js backend
│   ├── controllers/         # Route controllers
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   ├── middleware/          # Express middleware
│   ├── utils/               # Utility functions
│   └── package.json
├── docs/                    # Documentation
└── package.json            # Root package.json
```

## 🎨 Frontend Architecture

### Tech Stack
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Framer Motion** - Animations
- **React Hook Form** - Form handling
- **React Query** - Server state management

### Key Components

#### Layout Components
- `Header` - Navigation and user menu
- `Footer` - Site footer with links
- `MobileMenu` - Mobile navigation
- `Sidebar` - Product filters and cart

#### Feature Components
- `ProductCard` - Product display card
- `ShoppingCart` - Cart functionality
- `SearchModal` - Product search
- `UserProfile` - User account management

### State Management
- **Auth Slice** - User authentication state
- **Cart Slice** - Shopping cart state
- **Product Slice** - Product data and filters
- **UI Slice** - UI state (modals, mobile menu, etc.)

## 🔧 Backend Architecture

### Tech Stack
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **Cloudinary** - Image storage
- **Stripe** - Payment processing
- **NodeMailer** - Email sending

### API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/forgot-password` - Forgot password
- `PUT /api/auth/reset-password/:token` - Reset password

#### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

#### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status (Admin)

#### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)

## 🎨 Design System

### Colors
- **Primary**: Blue shades for main actions
- **Secondary**: Gray shades for secondary elements
- **Success**: Green for positive actions
- **Danger**: Red for warnings and errors
- **Warning**: Yellow for notifications

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: Bold weights (600-900)
- **Body**: Regular weight (400)
- **Small text**: Light weight (300)

### Components
All components follow atomic design principles:
- **Atoms**: Buttons, inputs, icons
- **Molecules**: Form groups, card headers
- **Organisms**: Navigation, product grids
- **Templates**: Page layouts
- **Pages**: Complete pages

## 🔐 Security Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (User, Admin, Seller)
- Password hashing with bcrypt
- Email verification
- Password reset functionality

### Data Security
- Input validation and sanitization
- XSS protection
- CORS configuration
- Rate limiting
- Secure HTTP headers with Helmet

### Payment Security
- Stripe secure payment processing
- No sensitive payment data stored
- PCI compliance through Stripe

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Mobile-First Approach
All components are designed mobile-first with progressive enhancement for larger screens.

## 🧪 Testing Strategy

### Frontend Testing
- Unit tests with Jest and React Testing Library
- Component testing
- Integration testing for user flows
- E2E testing with Cypress

### Backend Testing
- Unit tests with Jest
- API testing with Supertest
- Database testing with MongoDB Memory Server
- Integration testing

## 🚀 Deployment

### Frontend Deployment
1. Build the production bundle: `npm run build`
2. Deploy to Vercel, Netlify, or similar platform
3. Configure environment variables

### Backend Deployment
1. Deploy to Heroku, Railway, or similar platform
2. Configure MongoDB Atlas
3. Set up environment variables
4. Configure Cloudinary for image storage

### Database
- Use MongoDB Atlas for production
- Set up proper indexes for performance
- Configure backups

## 📊 Performance Optimization

### Frontend
- Code splitting with React.lazy()
- Image optimization with Cloudinary
- Lazy loading for images
- Memoization with React.memo()
- Bundle analysis and optimization

### Backend
- Database query optimization
- Caching with Redis (planned)
- Image compression
- CDN for static assets
- Gzip compression

## 🔧 Development Commands

```bash
# Root commands
npm run dev              # Start both frontend and backend
npm run build           # Build frontend for production
npm run install-all     # Install all dependencies

# Backend commands
cd backend
npm run dev             # Start backend only
npm run seed            # Seed database with sample data

# Frontend commands
cd frontend
npm run dev             # Start frontend only
npm run build           # Build for production
npm run preview         # Preview production build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Style
- Use ESLint and Prettier for code formatting
- Follow React best practices
- Write meaningful commit messages
- Add comments for complex logic

## 📚 Additional Resources

### Documentation
- [React Documentation](https://react.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

### APIs
- [Stripe API Documentation](https://stripe.com/docs/api)
- [Cloudinary API Documentation](https://cloudinary.com/documentation)

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in .env

2. **Frontend Not Loading**
   - Check if backend is running on port 5000
   - Verify proxy configuration in vite.config.js

3. **Image Upload Failing**
   - Verify Cloudinary credentials
   - Check file size limits

4. **Payment Processing Issues**
   - Verify Stripe API keys
   - Check webhook endpoints

## 📧 Support

For support and questions:
- Create an issue on GitHub
- Email: support@kencommerce.com
- Documentation: [Project Wiki](link-to-wiki)

---

**Happy coding!** 🚀
