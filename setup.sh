#!/bin/bash

echo "🚀 Setting up KenCommerce MERN Stack eCommerce Platform..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Create environment files if they don't exist
echo "⚙️ Setting up environment files..."

if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env from example file"
    echo "⚠️  Please update the environment variables in backend/.env"
fi

# Create uploads directory
mkdir -p backend/uploads

echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Update environment variables in backend/.env"
echo "2. Make sure MongoDB is running on your system"
echo "3. Run 'npm run dev' to start both frontend and backend"
echo ""
echo "🔗 URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000"
echo "   API Health Check: http://localhost:5000/api/health"
echo ""
echo "💡 Available commands:"
echo "   npm run dev          - Start both frontend and backend"
echo "   npm run server       - Start only backend"
echo "   npm run client       - Start only frontend"
echo "   npm run build        - Build frontend for production"
echo ""
echo "Happy coding! 🚀"
