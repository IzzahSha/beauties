document.addEventListener('DOMContentLoaded', () => {
  const brandInput = document.getElementById('brand');
  const fetchButton = document.getElementById('fetch-btn');
  const productList = document.getElementById('product-list');
  let products = [];  // Define products here to make it accessible in all inner functions

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

    // Save the brand and price range to localStorage
    localStorage.setItem('brand', brand);
    localStorage.setItem('minPrice', minPrice);
    localStorage.setItem('maxPrice', maxPrice);

    try {
      products = await window.api.fetchProducts(brand, { min: minPrice, max: maxPrice });  // Assign to products
      console.log(products);  // Debugging: Check the response here

      productList.innerHTML = '';

      if (products.length === 0) {
        productList.innerHTML = '<p>No products found in this range.</p>';
      } else {
        products.forEach(product => {
          const productElement = document.createElement('div');
          productElement.classList.add('product');

          const price = parseFloat(product.price);

          productElement.innerHTML = `
            <center><img src="${product.image_link || 'placeholder.jpg'}" alt="${product.name || 'Product'}" class="product-image" /></center>
            <h4>${product.name}</h4>
            <p><strong>Brand:</strong> ${product.brand}</p>
            <p><strong>Price:</strong> $${isNaN(price) ? 'N/A' : price.toFixed(2)}</p>
            <p><strong>Rating:</strong> ${product.rating ? product.rating + ' ⭐' : 'No rating available'}</p>
            <p><strong>Product Type:</strong> ${product.product_type || 'Not specified'}</p>
            <p class="description"><strong>Description:</strong> ${product.description || 'No description available'}</p>
            <div class="product-links">
              <a href="${product.product_link}" target="_blank" class="buy-link">Buy here</a>
              <a href="${product.website_link}" target="_blank" class="website-link">${product.website_link}</a>
            </div>
            <button class="wish-btn" data-product-id="${product.id}">Add to Wish List</button>
          `;

          productList.appendChild(productElement);
        });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      productList.innerHTML = '<p>Error fetching products. Please try again later.</p>';
    }
  });

  // Listen for click events on the wishlist button
  productList.addEventListener('click', (event) => {
    if (event.target.classList.contains('wish-btn')) {
      const productId = event.target.getAttribute('data-product-id');
      const product = products.find(p => p.id == productId);  // Use products array from the outer scope
      if (product) {
        AddToWishList(product);
      }
    }
  });
});

function showNotification(message) {
  // Create the notification element
  const notification = document.createElement('div');
  notification.classList.add('notification');

  // Add the notification message and close button
  notification.innerHTML = `
    <span>${message}</span>
    <button class="close-btn">&times;</button>
  `;

  // Append it to the body
  document.body.appendChild(notification);

  // Show the notification with the "show" class
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);

  // Remove the notification automatically after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300); // Wait for animation to complete
  }, 3000);

  // Close the notification when the close button is clicked
  notification.querySelector('.close-btn').addEventListener('click', () => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  });
}

function AddToWishList(product) {
  let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

  const existingProduct = wishlist.find(item => item.id === product.id);
  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    wishlist.push({ ...product, quantity: 1 });
  }

  // Save the updated wishlist back to local storage
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  showNotification("Product added to your wish list!");
}
