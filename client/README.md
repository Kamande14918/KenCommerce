# MERN E-commerce Application - Client

## Overview
This is the client-side implementation of a full-stack MERN (MongoDB, Express, React, Node.js) e-commerce application. The application allows users to browse products, manage their accounts, and interact with sellers, while also providing an integrated payment system and AI-powered chatbot for customer support.

## Features
- **User Authentication**: Users can register, log in, and reset their passwords.
- **Product Management**: Users can view, search, and filter products, as well as view detailed product information.
- **Seller Management**: Sellers can create and manage their profiles and products.
- **Payment Processing**: Users can initiate payments and check payment statuses.
- **Chatbot Integration**: An AI-powered chatbot is available for customer support.
- **Responsive Design**: The application is designed to be responsive and user-friendly across devices.

## Project Structure
```
kencommerce-client
├── public
│   └── index.html          # Main HTML file for the React application
├── src
│   ├── api                 # API calls for authentication, products, sellers, payments, and chatbot
│   ├── components          # Reusable components for different functionalities
│   ├── contexts            # Contexts for managing global state
│   ├── hooks               # Custom hooks for reusable logic
│   ├── pages               # Page components for routing
│   ├── styles              # CSS styles for the application
│   ├── utils               # Utility functions
│   ├── App.js              # Main application component
│   ├── index.js            # Entry point for the React application
└── package.json            # Project dependencies and scripts
```

## Getting Started

### Prerequisites
- Node.js
- npm or yarn

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   cd kencommerce-client
   ```

2. Install dependencies:
   ```
   npm install
   ```

### Running the Application
To start the application, run:
```
npm start
```
The application will run on `http://localhost:3000` by default.

### API Documentation
Refer to the individual API files in the `src/api` directory for detailed API documentation.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.