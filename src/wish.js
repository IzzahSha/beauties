document.addEventListener('DOMContentLoaded', () => {
    displayWishlist();

    window.addEventListener('storage', (event) => {
      if (event.key === 'wishlist') {
        displayWishlist();
      }
  });
});
  
  // Function to display wishlist items from local storage
  function displayWishlist() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    console.log("Wishlist items from localStorage:", wishlist); 

    const wishlistContainer = document.getElementById('wishlistContainer');
    wishlistContainer.innerHTML = ''; // Clear current items
  
    if (wishlist.length === 0) {
      wishlistContainer.innerHTML = '<p>Your wishlist is empty.</p>';
      return;
    }
  
    wishlist.forEach((item) => {
      const itemElement = document.createElement('div');
      itemElement.classList.add('wishlist-item');
      itemElement.innerHTML = `
        <center><img src="${item.image_link || 'placeholder.jpg'}" alt="${item.name || 'Product'}" class="product-image" /></center>
        <h3>${item.name}</h3>
        <p><strong>Brand:</strong> ${item.brand}</p>
        <p><strong>Price:</strong> $${item.price || 'N/A'}</p>
        <label for="quantity-${item.id}">Quantity:</label>
        <input type="number" id="quantity-${item.id}" value="${item.quantity}" min="1" />
        <button class="remove-btn" data-product-id="${item.id}">Remove</button>
      `;
      wishlistContainer.appendChild(itemElement);

      const removeButton = itemElement.querySelector('.remove-btn');
        removeButton.addEventListener('click', () => {
            removeFromWishlist(item.id);
        });

        // Add event listener for quantity change
        const quantityInput = itemElement.querySelector(`input[id="quantity-${item.id}"]`);
        quantityInput.addEventListener('change', () => {
            updateQuantity(item.id, parseInt(quantityInput.value));
        });
    })
  }

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

  }

function removeFromWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlist = wishlist.filter(item => item.id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    displayWishlist(); // Refresh the wishlist display
    showNotification("You have remove the item!");
}

// Function to update the quantity of a product in the wishlist
function updateQuantity(productId, quantity) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const product = wishlist.find(item => item.id === productId);
    if (product) {
        product.quantity = quantity;
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
}
  