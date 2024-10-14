document.addEventListener('DOMContentLoaded', () => {
    displayCartItems();

    const checkoutButton = document.querySelector('.cart-total button');
    checkoutButton.addEventListener('click', handleCheckout);
});

function handleCheckout() {
    // Učitaj korisnika i korpu iz localStorage-a
    const user = JSON.parse(localStorage.getItem('user'));
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (!user || cart.length === 0) {
        alert('No user logged in or the cart is empty.');
        return;
    }

    // Kreiraj orderItems iz korpe
    const orderItems = cart.map(item => ({
        productId: item.id,  // Pretpostavljam da proizvod ima 'id'
        quantity: item.quantity
    }));

    // Kreiraj objekat request-a
    const requestData = {
        userId: user.id,  // Pretpostavljam da korisnik ima 'id'
        orderItems: orderItems
    };

    // Pošalji POST zahtev na backend
    fetch(`https://localhost:7276/api/Order`, {  // Zameni sa URL-om API-ja
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Order successful:', data);
        alert('Order placed successfully!');
        localStorage.removeItem('cart'); // Isprazni korpu nakon uspešnog checkout-a
        displayCartItems(); // Osveži UI nakon narudžbine
    })
    .catch(error => {
        console.error('Error placing order:', error);
        alert('There was an error placing the order.');
    });
}

function displayCartItems() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Očisti prethodni sadržaj
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'Your cart is empty.';
        cartItemsContainer.appendChild(emptyMessage);
    } else {
        cart.forEach((item, index) => {
            // Kreiraj elemente za svaki proizvod
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');

            // Slika proizvoda
            const productImg = document.createElement('img');
            productImg.src = `data:image/jpg;base64,${item.imageUrl}`;
            productImg.alt = 'Product Image';
            productImg.height = 100;
            productImg.width = 100;

            // Detalji proizvoda
            const itemDetails = document.createElement('div');
            itemDetails.classList.add('item-details');

            const productName = document.createElement('p');
            productName.textContent = item.name;

            const productPrice = document.createElement('p');
            productPrice.textContent = `Price: $${item.price.toFixed(2)}`;

            // Količina proizvoda sa dugmadima
            const quantityContainer = document.createElement('div');
            const decreaseBtn = document.createElement('button');
            decreaseBtn.classList.add('quantity-btn');
            decreaseBtn.textContent = '-';
            decreaseBtn.onclick = () => decreaseQuantity(index);

            const quantityText = document.createElement('span');
            quantityText.id = `quantity-${index}`;
            quantityText.textContent = item.quantity;

            const increaseBtn = document.createElement('button');
            increaseBtn.classList.add('quantity-btn');
            increaseBtn.textContent = '+';
            increaseBtn.onclick = () => increaseQuantity(index);

            // Dodaj dugmad i količinu u kontejner
            quantityContainer.appendChild(decreaseBtn);
            quantityContainer.appendChild(quantityText);
            quantityContainer.appendChild(increaseBtn);

            // Ukupna cena za proizvod
            const itemTotal = document.createElement('div');
            itemTotal.classList.add('item-total');
            itemTotal.id = `total-price-${index}`;
            const itemTotalPrice = item.price * item.quantity;
            itemTotal.textContent = `$${itemTotalPrice.toFixed(2)}`;

            // Složite sve u glavni kontejner proizvoda
            itemDetails.appendChild(productName);
            itemDetails.appendChild(productPrice);
            itemDetails.appendChild(quantityContainer);

            cartItem.appendChild(productImg);
            cartItem.appendChild(itemDetails);
            cartItem.appendChild(itemTotal);

            // Dodaj proizvod u kontejner korpe
            cartItemsContainer.appendChild(cartItem);
        });
    }

    updateCartSummary();
}

function updateCartSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let subtotal = 0;

    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });

    const subtotalElement = document.querySelector('.cart-total span');
    if (subtotalElement) {
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    }
}

function decreaseQuantity(index) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems(); // Update UI after change
    }
}

function increaseQuantity(index) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart[index].quantity += 1;
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems(); // Update UI after change
}
