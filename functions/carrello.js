async function fetchPromoCodes() {
  const response = await fetch("data/promocodes.json");
  return await response.json();
}

async function applyDiscount() {
  const discountCode = document.getElementById("discount-code").value;
  const promoCodes = await fetchPromoCodes();
  const promo = promoCodes.promocodes.find((p) => p.code === discountCode);

  // Get used codes
  const usedCodes = JSON.parse(localStorage.getItem("usedCodes")) || [];

  if (usedCodes.includes(discountCode)) {
    alert("Questo codice sconto è già stato utilizzato.");
    return;
  }

  const provisionalTotal = parseFloat(
    document.getElementById("provisional-total").textContent
  );

  if (promo) {
    const discountAmount = (provisionalTotal * promo.discount) / 100;
    // Save applied discount
    localStorage.setItem(
      "appliedDiscount",
      JSON.stringify({ amount: discountAmount })
    );
    // Save used code
    usedCodes.push(discountCode);
    localStorage.setItem("usedCodes", JSON.stringify(usedCodes));

    alert(
      `Codice sconto applicato! Hai risparmiato €${discountAmount.toFixed(2)}`
    );
    loadCart(); // Refresh totals
  } else {
    alert("Codice sconto non valido.");
  }
}

async function loadCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartBody = document.getElementById("cart-body");
  const provisionalTotal = document.getElementById("provisional-total");
  const discountAmount = document.getElementById("discount-amount");
  const cartTotal = document.getElementById("cart-total");
  cartBody.innerHTML = "";
  let total = 0;

  // Function to fetch product details
  async function getProductDetails(id) {
    const file = id.startsWith("s")
      ? "sport.json"
      : id.startsWith("l")
      ? "lusso.json"
      : null;
    if (!file) return null;
    const response = await fetch(`data/${file}`);
    const data = await response.json();
    return data.find((p) => p.id === id);
  }

  // Calculate provisional total
  for (let item of cart) {
    const prodotto = await getProductDetails(item.id);
    if (!prodotto) continue;

    // Handle individual product
    const itemTotal = parseFloat(prodotto.prezzo) * item.quantity;
    total += itemTotal;
  }

  // Get applied discount
  const appliedDiscount = JSON.parse(
    localStorage.getItem("appliedDiscount")
  ) || { amount: 0 };

  // Update all totals
  provisionalTotal.textContent = total.toFixed(2);
  discountAmount.textContent = appliedDiscount.amount.toFixed(2);
  cartTotal.textContent = (total - appliedDiscount.amount).toFixed(2);

  // Populate cart items
  for (let item of cart) {
    const prodotto = await getProductDetails(item.id);
    if (!prodotto) continue;

    const row = document.createElement("tr");

    // Display individual product
    const itemTotal = parseFloat(prodotto.prezzo) * item.quantity;

    row.innerHTML = `
                <td>${prodotto.marca} ${prodotto.modello}</td>
                <td>${item.color}</td>
                <td>${item.size ?? "Taglia Unica"}</td>
                <td>
                    <input type="number" min="1" value="${
                      item.quantity
                    }" class="form-control" onchange="updateQuantity('${
      item.id
    }', this.value)">
                </td>
                <td>€${parseFloat(prodotto.prezzo).toFixed(2)}</td>
                <td>€${itemTotal.toFixed(2)}</td>
                <td><button class="btn btn-danger btn-sm" onclick="removeItem('${
                  item.id
                }')">X</button></td>
            `;

    cartBody.appendChild(row);
  }
}

function updateQuantity(id, quantity) {
  let cart = JSON.parse(localStorage.getItem("cart"));
  let item = cart.find((item) => item.id === id);
  if (item) {
    item.quantity = parseInt(quantity);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
  }
}

function removeItem(id) {
  let cart = JSON.parse(localStorage.getItem("cart"));
  cart = cart.filter((item) => item.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

// Initialize cart on page load
loadCart();
