document.addEventListener("DOMContentLoaded", function () {
    setupThemeToggle();
    updateNavbar();
    updateCartCount();
    renderCart();
});

function setupThemeToggle() {
    const themeToggle = document.getElementById("theme-toggle");
    const body = document.body;

    function applyTheme(theme) {
        if (theme === "dark") {
            body.classList.add("dark-theme");
            themeToggle.classList.replace("fa-moon", "fa-sun");
        } else {
            body.classList.remove("dark-theme");
            themeToggle.classList.replace("fa-sun", "fa-moon");
        }
    }

    let savedTheme = localStorage.getItem("theme") || "light";
    applyTheme(savedTheme);

    themeToggle.addEventListener("click", function () {
        let newTheme = body.classList.contains("dark-theme") ? "light" : "dark";
        localStorage.setItem("theme", newTheme);
        applyTheme(newTheme);
    });
}

function updateNavbar() {
    let loggedInUser = localStorage.getItem("loggedInUser");
    let userNameSpan = document.getElementById("user-name");
    let loginBtn = document.getElementById("login-btn");
    let signupBtn = document.getElementById("signup-btn");
    let logoutBtn = document.getElementById("logout-btn");

    if (loggedInUser) {
        userNameSpan.textContent = loggedInUser.split('@')[0];
        loginBtn.style.display = "none";
        signupBtn.style.display = "none";
        logoutBtn.style.display = "block";
    } else {
        userNameSpan.textContent = "Guest";
        loginBtn.style.display = "block";
        signupBtn.style.display = "block";
        logoutBtn.style.display = "none";
    }

    logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("loggedInUser");
        updateNavbar();
    });
}

function addToCart(name, price, image) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];


    let imgSrc = image.startsWith("http") ? image : window.location.origin + "/" + image.replace("../", "");

    let existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, image: imgSrc, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    let cartCountElement = document.getElementById("cart-count");
    if (cartCountElement) {
        cartCountElement.innerText = totalItems;
    }
}

function increaseQuantity(name) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let item = cart.find(item => item.name === name);
    if (item) {
        item.quantity += 1;
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
    }
}

function decreaseQuantity(name) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let itemIndex = cart.findIndex(item => item.name === name);
    if (itemIndex !== -1) {
        if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity -= 1;
        } else {
            cart.splice(itemIndex, 1);
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
    }
}

function removeFromCart(name) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(item => item.name !== name);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

function renderCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartContainer = document.getElementById("cart-items");

    if (!cartContainer) return;

    cartContainer.innerHTML = "";

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    } else {
        cart.forEach(item => {
            let itemElement = document.createElement("div");
            itemElement.classList.add("cart-item");
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" onerror="this.onerror=null; this.src='../images/placeholder.png';">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p>Price: $${item.price.toFixed(2)}</p>
                    <div class="quantity-controls">
                        <button onclick="decreaseQuantity('${item.name}')">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="increaseQuantity('${item.name}')">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart('${item.name}')">Remove</button>
                </div>
            `;
            cartContainer.appendChild(itemElement);
        });
    }

    updateCartCount();
}

function checkout() {
    alert("Proceeding to checkout...");
    setTimeout(() => {
        localStorage.removeItem("cart");
        window.location.href = "checkout.html";
    }, 500);
}
