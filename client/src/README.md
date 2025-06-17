# MERN E-commerce Application - Client

## Overview
This is the client-side implementation of a full-stack MERN (MongoDB, Express, React, Node.js) e-commerce application. The client interacts with the server to provide a seamless shopping experience for users and sellers.

## Features
- **User Authentication**: Users can register, log in, and reset their passwords.
- **Product Management**: Users can view, search, and filter products. Sellers can add and manage their products.
- **Seller Profiles**: Users can view detailed information about sellers and their products.
- **Payment Processing**: Users can initiate payments and check payment statuses.
- **Chatbot Integration**: An AI-powered chatbot is available for customer support.
- **Inventory Management**: Alerts for low stock items and inventory management features for sellers.

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

### Running the Client
To start the client application, run:
```
npm start
```
The client will run on `http://localhost:3000` by default.

### API Integration
The client communicates with the server-side API for data fetching and processing. Ensure the server is running to test the client functionalities.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.