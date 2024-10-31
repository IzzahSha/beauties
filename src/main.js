document.addEventListener('DOMContentLoaded', () => {
  const brandInput = document.getElementById('brand');
  const fetchButton = document.getElementById('fetch-btn');
  const productList = document.getElementById('product-list');

  // Load previously searched brand from localStorage
  const brand = localStorage.getItem('brand');
  if (brand) {
    brandInput.value = brand;
  }

  // Fetch products when the button is clicked
  fetchButton.addEventListener('click', async () => {
    const brand = brandInput.value;
    const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
    const maxPrice = parseFloat(document.getElementById('max-price').value) || Infinity;

    if (!brand) {
      productList.innerHTML = '<p>Please enter a brand name.</p>';
      return;
    }

    // Save the brand to localStorage
    localStorage.setItem('brand', brand);

    try {
      const products = await window.api.fetchProducts(brand, { min: minPrice, max: maxPrice });
      console.log(products); // Debugging: Check the response here

      productList.innerHTML = '';

      if (products.length === 0) {
        productList.innerHTML = '<p>No products found in this range.</p>';
      } else {
        products.forEach(product => {
          const productElement = document.createElement('div');
          productElement.classList.add('product');
          productElement.innerHTML = `
            <h3>${product.name}</h3>
            <p><strong>Brand:</strong> ${product.brand}</p>
            <p><strong>Price:</strong> $${product.price}</p>
            <p><strong>Rating:</strong> ${product.rating || 'No rating available'}</p>
            <p><strong>Product Type:</strong> ${product.product_type || 'Not specified'}</p>
            <img src="${product.image_link || ''}" alt="${product.name || 'Product'}" style="max-width: 200px; display: block;" />
            <p><strong>Description:</strong> ${product.description || 'No description available'}</p>
            <p><strong>Product Link:</strong> <a href="${product.product_link}" target="_blank">Buy here</a></p>
            <p><strong>Website Link:</strong> <a href="${product.website_link}" target="_blank">${product.website_link}</a></p>
          `;
          productList.appendChild(productElement);
        });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      productList.innerHTML = '<p>Error fetching products. Please try again later.</p>';
    }
  });
});
