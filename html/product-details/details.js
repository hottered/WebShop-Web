document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (productId) {
        fetchProductDetails(productId);
        fetchProductReviews(productId);
    }

    const addToCartBtn = document.getElementById('add-to-cart');
    addToCartBtn.addEventListener('click', () => {
        addToCart(productId);
    });

    const submitReviewBtn = document.getElementById('submit-review');
    submitReviewBtn.addEventListener('click', async () => {
        submitReview(productId);
    });
});

async function submitReview(productId) {
    const comment = document.getElementById('review-comment').value;
    const rating = document.getElementById('review-rating').value;

    const reviewData = {
        rating: parseInt(rating, 10),
        comment: comment
    };

    try {
        const response = await fetch(`http://burp.local:5291/api/Review/${productId}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reviewData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        alert('Review added successfully!');
        fetchProductReviews(productId);
    } catch (error) {
        console.error('Error adding review:', error);
        alert('Failed to add review: ' + error.message);
    }
}

function fetchProductReviews(productId) {
    const reviewsUrl = `http://burp.local:5291/api/Review/${productId}/reviews`;

    fetch(reviewsUrl)
        .then(response => response.json())
        .then(reviews => {
            displayProductReviews(reviews);
        })
        .catch(error => {
            console.error('Error fetching product reviews:', error);
        });
}

function displayProductReviews(reviews) {
    const reviewList = document.getElementById('review-list');

    // Očisti listu pre nego što dodaš nove komentare
    reviewList.innerHTML = '';

    if (reviews.length === 0) {
        reviewList.innerHTML = '<li>No reviews available for this product.</li>';
        return;
    }

    reviews.forEach(review => {
        const listItem = document.createElement('li');

        // Kreiraj HTML za zvezdice
        const stars = generateStars(review.rating);

        listItem.innerHTML = `
            <div class="review-stars">${stars}</div>
            <p><strong>Comment:</strong> ${review.comment}</p>
            <hr>
        `;
        reviewList.appendChild(listItem);
    });
}

function generateStars(rating) {
    let starsHtml = '';
    for (let i = 0; i < 5; i++) {
        if (i < rating) {
            starsHtml += '★';  // Puna zvezda
        } else {
            starsHtml += '☆';  // Prazna zvezda
        }
    }
    return starsHtml;
}

function fetchProductDetails(productId) {
    const productUrl = `http://burp.local:5291/api/Product/${productId}`;

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
    productPrice.textContent = `$${product.price}`;
    originalPrice.textContent = `$${product.price - 200}`;
    productDescription.textContent = product.description;
}

function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingProduct = cart.find(product => product.id == productId);

    console.log(productId)

    if (!existingProduct) {
        const productUrl = `http://burp.local:5291/api/Product/${productId}`;

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
