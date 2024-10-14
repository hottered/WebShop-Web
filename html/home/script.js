// script.js

const apiUrl = 'http://localhost:5291/api/Product'; 

function fetchCategories() {
    fetch('http://localhost:5291/api/Category')
        .then(response => response.json())
        .then(categories => {
            const activeCategories = categories.filter(cat => !cat.deletedAtUtc);
            displayCategories(activeCategories); 
        })
        .catch(error => {
            console.error('Error fetching categories:', error);
        });
}
function fetchProducts() {
    fetch(apiUrl)  
        .then(response => { 
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            return response.json(); 
        })
        .then(products => {
            console.log(products);
            displayProducts(products);  
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });
}

function displayCategories(categories) {
    const categoryContainer = document.querySelector('.categories');
    categoryContainer.innerHTML = ''; 

    categories.forEach(category => {
        const button = document.createElement('button');
        button.classList.add('filter-btn');
        button.textContent = category.name;
        button.dataset.categoryId = category.id; 
        button.addEventListener('click', async () => {
            const categoryId = category.id;
            const url = `http://localhost:5291/api/Product/category/${categoryId}/products`;

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const products = await response.json();
                displayProducts(products); 
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        });

        categoryContainer.appendChild(button);
    });
}

function displayProducts(products) {
    const productGrid = document.querySelector('.product-grid');
    productGrid.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        const base64Image = `data:*;base64,${product.imageUrl}`;

        productCard.innerHTML = `
            <img src="${base64Image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Price: $${product.price}</p>
            <a href="../product-details/productDetails.html?id=${product.id}">
                <button>View details</button>
            </a>
        `;
        productGrid.appendChild(productCard);
    });
}

document.addEventListener("DOMContentLoaded", () => {

    fetchProducts();
    fetchCategories();
});
