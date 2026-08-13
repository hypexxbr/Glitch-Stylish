/*
  Glitch Stylish — Sacola (carrinho)
  Projeto acadêmico: não há checkout real, os dados ficam salvos
  apenas no localStorage do navegador de quem está acessando.
*/
(function (window) {
  var CART_KEY = 'glitch-stylish-cart';

  function getCart() {
    try {
      var raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (e) { /* localStorage indisponível */ }
    updateCartBadge();
  }

  function addToCart(item) {
    var cart = getCart();
    var existing = null;
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === item.id) { existing = cart[i]; break; }
    }
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        id: item.id,
        name: item.name,
        brand: item.brand,
        price: item.price,
        image: item.image,
        qty: 1
      });
    }
    saveCart(cart);
    return cart;
  }

  function removeFromCart(id) {
    var cart = getCart().filter(function (i) { return i.id !== id; });
    saveCart(cart);
    return cart;
  }

  function setQty(id, qty) {
    var cart = getCart();
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === id) {
        cart[i].qty = Math.max(1, qty);
        break;
      }
    }
    saveCart(cart);
    return cart;
  }

  function clearCart() {
    saveCart([]);
  }

  function cartCount() {
    return getCart().reduce(function (sum, i) { return sum + i.qty; }, 0);
  }

  function cartTotal() {
    return getCart().reduce(function (sum, i) { return sum + (i.price * i.qty); }, 0);
  }

  function formatBRL(value) {
    try {
      return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    } catch (e) {
      return 'R$ ' + value.toFixed(2).replace('.', ',');
    }
  }

  function updateCartBadge() {
    var count = cartCount();
    var badges = document.querySelectorAll('.cart-count');
    for (var i = 0; i < badges.length; i++) {
      badges[i].textContent = count;
    }
  }

  function initAddToCartButtons() {
    var buttons = document.querySelectorAll('.hg-add-btn');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        var item = {
          id: btn.getAttribute('data-id'),
          name: btn.getAttribute('data-name'),
          brand: btn.getAttribute('data-brand'),
          price: parseFloat(btn.getAttribute('data-price')),
          image: btn.getAttribute('data-image')
        };
        addToCart(item);

        var original = btn.textContent;
        btn.classList.add('added');
        btn.textContent = 'Adicionado ✓';
        window.clearTimeout(btn._resetTimeout);
        btn._resetTimeout = window.setTimeout(function () {
          btn.textContent = original;
          btn.classList.remove('added');
        }, 1400);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    updateCartBadge();
    initAddToCartButtons();
  });

  window.GlitchCart = {
    getCart: getCart,
    addToCart: addToCart,
    removeFromCart: removeFromCart,
    setQty: setQty,
    clearCart: clearCart,
    cartCount: cartCount,
    cartTotal: cartTotal,
    formatBRL: formatBRL,
    updateCartBadge: updateCartBadge
  };
})(window);
