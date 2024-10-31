contextBridge.exposeInMainWorld('api', {
  fetchProducts: async (brand, priceRange) => {
    const url = `https://makeup-api.herokuapp.com/api/v1/products.json?brand=${brand}`;
    console.log(`Fetching products from: ${url}`);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error('Network response was not ok:', response.statusText);
        throw new Error('Network response was not ok');
      }

      const products = await response.json();
      console.log('Fetched products:', products);

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
