//main features:
//dark mode or light mode
//shopping cart (add, + and -, remove, clear, total)
//order confirm
//order reciept
//dropdown menu responsive because in pc you hover to open and in phone you tap

const themeBtn = document.getElementById('themeBtn');

const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const clearCartBtn = document.getElementById('clearCartBtn');

const addButtons = document.querySelectorAll('.add-btn');

const orderForm = document.getElementById('orderForm');
const orderSummary = document.getElementById('orderSummary');
const orderTotal = document.getElementById('orderTotal');
const orderConfirmation = document.getElementById('orderConfirmation');
const customerName = document.getElementById('customer-name');

const revealItems = document.querySelectorAll(
    '.card, .featured-menu, .menu-preview-card, .section-title, .booking-box, .grocery-box, .map-wrap'
);

/*shopping cart feature
cart is an array of name, price, image, quantity.
it will save in localstarage so it save when go into a different file*/
let cart = JSON.parse(localStorage.getItem('levelone-cart')) || [];

//cart saver
function saveCart() {
    localStorage.setItem('levelone-cart', JSON.stringify(cart));
}

//auto show number as php
function formatPeso(amount) {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP'
    }).format(amount);
}

//add and minus order
function getCartCount() {
    return cart.reduce(function (sum, item) {
        return sum + item.qty;
    }, 0);
}

//all total of all items in the cart
function getCartTotal() {
    return cart.reduce(function (sum, item) {
        return sum + item.price * item.qty;
    }, 0);
}

//numbers of items in cart notification
function updateCartCount() {
    const count = getCartCount();

    cartCount.textContent = count;
    cartCount.classList.toggle('zero', count === 0);
}

function renderCart() {
    cartItems.innerHTML = '';

    //show message when theres noting in cart
    if (cart.length === 0) {
        const empty = document.createElement('li');
        empty.className = 'empty';
        empty.textContent = 'Your cart is empty.';
        cartItems.appendChild(empty);
    }

    //picture,name,price,add and minus,line total,Remove
    cart.forEach(function (item) {
        const li = document.createElement('li');
        li.className = 'cart-item';

        const img = document.createElement('img');
        img.className = 'cart-img';
        img.src = item.image;
        img.alt = item.name;

        const info = document.createElement('div');
        info.className = 'cart-info';

        const title = document.createElement('strong');
        title.textContent = item.name;

        const meta = document.createElement('span');
        meta.className = 'meta';
        meta.textContent = formatPeso(item.price) + ' each';

        info.append(title, meta);

        const minusBtn = document.createElement('button');
        minusBtn.className = 'qty-btn qty-minus';
        minusBtn.dataset.name = item.name;
        minusBtn.textContent = '-';
        minusBtn.type = 'button';

        const qty = document.createElement('span');
        qty.className = 'qty';
        qty.textContent = item.qty;

        const plusBtn = document.createElement('button');
        plusBtn.className = 'qty-btn qty-plus';
        plusBtn.dataset.name = item.name;
        plusBtn.textContent = '+';
        plusBtn.type = 'button';

        const lineTotal = document.createElement('span');
        lineTotal.className = 'line-total';
        lineTotal.textContent = formatPeso(item.price * item.qty);

        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.dataset.name = item.name;
        removeBtn.textContent = 'Remove';
        removeBtn.type = 'button';

        li.append(img, info, minusBtn, qty, plusBtn, lineTotal, removeBtn);
        cartItems.appendChild(li);
    });

    cartTotal.textContent = formatPeso(getCartTotal());

    //checkout and clear is disabled while the cart is empty
    checkoutBtn.disabled = cart.length === 0;
    clearCartBtn.disabled = cart.length === 0;
}

//confirm order
function renderOrderSummary() {
    if (!orderSummary) return;

    orderSummary.innerHTML = '';

    if (cart.length === 0) {
        const empty = document.createElement('li');
        empty.className = 'empty';
        empty.textContent = 'Your cart is empty. Add items from Foods or Drinks first.';
        orderSummary.appendChild(empty);
    }

    cart.forEach(function (item) {
        const li = document.createElement('li');
        li.className = 'summary-item';

        const name = document.createElement('span');
        name.textContent = item.name + ' x ' + item.qty;

        const price = document.createElement('strong');
        price.textContent = formatPeso(item.price * item.qty);

        li.append(name, price);
        orderSummary.appendChild(li);
    });

    orderTotal.textContent = formatPeso(getCartTotal());
}

function refreshCart() {
    saveCart();
    updateCartCount();
    renderCart();
    renderOrderSummary();
}

//this adds the items and it will do +1 if its already in the cart
function addToCart(name, price, image) {
    const existing = cart.find(function (item) {
        return item.name === name;
    });

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            image: image,
            qty: 1
        });
    }

    refreshCart();

    cartCount.classList.add('bump');

    setTimeout(function () {
        cartCount.classList.remove('bump');
    }, 300);
}

//add and minus the items if below zero remove the item
function changeQuantity(name, amount) {
    cart = cart.map(function (item) {
        if (item.name === name) {
            return {
                name: item.name,
                price: item.price,
                image: item.image,
                qty: item.qty + amount
            };
        }

        return item;
    });

    cart = cart.filter(function (item) {
        return item.qty > 0;
    });

    refreshCart();
}

//remove an item at once even when many
function removeFromCart(name) {
    cart = cart.filter(function (item) {
        return item.name !== name;
    });

    refreshCart();
}

//cart slider
function openCart() {
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('show');
}

function closeCart() {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('show');
}

//dark or and light mode
function applyTheme(isDark) {
    document.body.classList.toggle('dark', isDark);
    themeBtn.textContent = isDark ? 'Light Mode' : 'Dark Mode';
}

function revealOnScroll() {
    revealItems.forEach(function (item) {
        const top = item.getBoundingClientRect().top;

        if (top < window.innerHeight - 40) {
            item.classList.add('show');
        }
    });
}

//it displays the green success on screen after the form is done
function renderConfirmation(container, heading, message, linkHref, linkText) {
    container.innerHTML = '';

    const icon = document.createElement('div');
    icon.className = 'confirmation-icon';
    icon.textContent = '✓';

    const title = document.createElement('h2');
    title.textContent = heading;

    const text = document.createElement('p');
    text.textContent = message;

    const link = document.createElement('a');
    link.className = 'btn';
    link.href = linkHref;
    link.textContent = linkText;

    container.append(icon, title, text, link);
}

//replace the finish form with confirmation box
function finishForm(form, heading, message, linkHref, linkText) {
    const box = document.createElement('div');
    box.className = 'confirmation-box';

    renderConfirmation(box, heading, message, linkHref, linkText);

    form.classList.add('hidden');
    form.insertAdjacentElement('afterend', box);
    box.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

//if form passes every rule, since there is no server in my project, the success screen in the browser
function handleValidForm(form) {
    const type = form.dataset.validate;

    if (type === 'register') {
        const name = form.querySelector('#fullname').value.trim();

        finishForm(
            form,
            'Welcome, ' + name + '!',
            'Your account details were accepted. You can now sign in.',
            'login.html',
            'Go to Login'
        );
    }

    if (type === 'contact') {
        const name = form.querySelector('#name').value.trim();

        finishForm(
            form,
            'Thank you, ' + name + '!',
            'Your message was received. We will get back to you soon.',
            'index.html',
            'Back to Home'
        );
    }

    if (type === 'login') {
        window.location.href = 'index.html';
    }

    if (type === 'order') {
        completeOrder();
    }
}

//when finish order show the thank you box and then empty cart after
function completeOrder() {
    const name = customerName.value.trim();
    const total = getCartTotal();
    const typeInput = document.querySelector('input[name="order-type"]:checked');

    let message = 'Your order total is ' + formatPeso(total) + '.';

    if (typeInput) {
        message = message + ' Order type: ' + typeInput.value + '.';
    }

    renderConfirmation(orderConfirmation, 'Thank you, ' + name + '!', message, 'index.html', 'Back to Home');

    cart = [];
    refreshCart();

    orderForm.classList.add('hidden');
    orderConfirmation.classList.remove('hidden');
}

document.querySelectorAll('form[data-validate]').forEach(function (form) {
    form.addEventListener('submit', function (event) {

        event.preventDefault();

        handleValidForm(form);
    });
});

//tap support for dropdown menus in tablet and mobile
document.querySelectorAll('.dropbtn').forEach(function (button) {
    button.addEventListener('click', function (event) {
        const dropdown = button.closest('.dropdown');
        const willOpen = !dropdown.classList.contains('open');

        //it closes others so only one dropdown open at a time
        document.querySelectorAll('.dropdown.open').forEach(function (other) {
            other.classList.remove('open');
        });

        dropdown.classList.toggle('open', willOpen);
        event.stopPropagation();
    });
});

//tapping anywhere closes open dropdowns
document.addEventListener('click', function () {
    document.querySelectorAll('.dropdown.open').forEach(function (dropdown) {
        dropdown.classList.remove('open');
    });
});

//buttons for add to cart
addButtons.forEach(function (button) {
    button.addEventListener('click', function () {
        const card = button.closest('.product-card');
        const typeSelect = card.querySelector('.drink-type');

        let name = button.dataset.name;
        let price = Number(button.dataset.price);

        if (typeSelect) {
            const chosen = typeSelect.options[typeSelect.selectedIndex];

            name = name + ' (' + chosen.dataset.label + ')';
            price = Number(chosen.value);
        }

        addToCart(name, price, button.dataset.image);

        button.textContent = 'Added!';
        button.classList.add('added');

        setTimeout(function () {
            button.textContent = 'Add to Cart';
            button.classList.remove('added');
        }, 800);
    });
});


cartItems.addEventListener('click', function (event) {
    const target = event.target;
    const name = target.dataset.name;

    if (target.classList.contains('qty-plus')) {
        changeQuantity(name, 1);
    }

    if (target.classList.contains('qty-minus')) {
        changeQuantity(name, -1);
    }

    if (target.classList.contains('remove-btn')) {
        removeFromCart(name);
    }
});

//open and close the cart drawer
cartBtn.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        closeCart();
    }
});

//the one that asks for confirmation in clear cart
clearCartBtn.addEventListener('click', function () {
    if (cart.length === 0) return;

    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        refreshCart();
    }
});

//checkout goes to the order page
checkoutBtn.addEventListener('click', function () {
    if (cart.length === 0) return;

    window.location.href = 'order.html';
});

//dark mode button switch (this always remember even when closed)
themeBtn.addEventListener('click', function () {
    const isDark = !document.body.classList.contains('dark');

    applyTheme(isDark);

    localStorage.setItem('levelone-theme', isDark ? 'dark' : 'light');
});

window.addEventListener('scroll', revealOnScroll);

revealItems.forEach(function (item, index) {
    item.classList.add('reveal');
    item.style.animationDelay = (index % 3) * 0.12 + 's';
});

applyTheme(localStorage.getItem('levelone-theme') === 'dark');
refreshCart();
revealOnScroll();