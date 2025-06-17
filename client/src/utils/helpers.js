module.exports = {
    generateUniqueId: () => {
        return 'id-' + Math.random().toString(36).substr(2, 16);
    },

    formatCurrency: (amount) => {
        return `$${parseFloat(amount).toFixed(2)}`;
    },

    validateEmail: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    },

    isEmpty: (obj) => {
        return Object.keys(obj).length === 0;
    },

    lowStockAlert: (stockLevel, threshold) => {
        return stockLevel <= threshold;
    }
};