document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (productId) {
        fetchProductDetails(productId);
    }

    // Add event listener to "Add to Cart" button
    const addToCartBtn = document.getElementById('add-to-cart');
    addToCartBtn.addEventListener('click', () => {
        addToCart(productId);
    });
});

function fetchProductDetails(productId) {
    const productUrl = `http://localhost:5291/api/Product/${productId}`;

    fetch(productUrl)
        .then(response => response.json())
        .then(product => {
            displayProductDetails(product);
        })
        .catch(error => {
            console.error('Error fetching product details:', error);
        });
}

function displayProductDetails(product) {
    const productImage = document.getElementById('product-image');
    const productName = document.getElementById('product-name');
    const productPrice = document.getElementById('product-price');
    const originalPrice = document.getElementById('original-price');
    const productDescription = document.getElementById('product-description');
    
    const base64Image = `data:image/png;base64,${product.imageUrl}`;

    productImage.src = base64Image;
    productName.textContent = product.name;
    productPrice.textContent = `$${product.discountedPrice}`;
    originalPrice.textContent = `$${product.originalPrice}`;
    productDescription.textContent = product.description;
}

function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingProduct = cart.find(product => product.id == productId);

    console.log(productId)

    if (!existingProduct) {
        const productUrl = `http://localhost:5291/api/Product/${productId}`;

        fetch(productUrl)
            .then(response => response.json())
            .then(product => {
                cart.push({
                    id: product.id, // Sačuvaj samo ID i detalje proizvoda
                    name: product.name,
                    quantity: 1, // Dodaj inicijalnu količinu
                    imageUrl: product.imageUrl, // Dodaj sliku proizvoda,
                    price:product.price
                });

                localStorage.setItem('cart', JSON.stringify(cart));

                alert('Product added to cart!');
            })
            .catch(error => {
                console.error('Error fetching product for cart:', error);
            });
    } else {
        alert('Product is already in the cart.');
    }
}
