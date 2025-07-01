@echo off
echo 🚀 Setting up KenCommerce MERN Stack eCommerce Platform...

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Install root dependencies
echo 📦 Installing root dependencies...
call npm install

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
call npm install
cd ..

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd frontend
call npm install
cd ..

REM Create environment files if they don't exist
echo ⚙️ Setting up environment files...

if not exist backend\.env (
    copy backend\.env.example backend\.env
    echo ✅ Created backend\.env from example file
    echo ⚠️  Please update the environment variables in backend\.env
)

REM Create uploads directory
if not exist backend\uploads mkdir backend\uploads

echo 🎉 Setup completed successfully!
echo.
echo 📋 Next steps:
echo 1. Update environment variables in backend\.env
echo 2. Make sure MongoDB is running on your system
echo 3. Run 'npm run dev' to start both frontend and backend
echo.
echo 🔗 URLs:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:5000
echo    API Health Check: http://localhost:5000/api/health
echo.
echo 💡 Available commands:
echo    npm run dev          - Start both frontend and backend
echo    npm run server       - Start only backend
echo    npm run client       - Start only frontend
echo    npm run build        - Build frontend for production
echo.
echo Happy coding! 🚀
pause
