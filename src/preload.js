const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
  fetchProducts: async (brand, priceRange) => {
    const url = `http://makeup-api.herokuapp.com/api/v1/products.json?brand=${brand}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error('Network response was not ok:', response.statusText);
      }

      const products = await response.json();

      // Filter based on price range
      return products.filter(product => {
        const productPrice = parseFloat(product.price);
        return productPrice >= priceRange.min && productPrice <= priceRange.max;
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }
});

//nyx, l'oreal, maybelline, 