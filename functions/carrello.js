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
  const bundleContainer = document.getElementById("bundles-container");
  cartBody.innerHTML = "";
  bundleContainer.innerHTML = "";
  total = await loadProducts(cart, cartBody);
  document.getElementById("total").innerHTML = "<strong>Totale parziale: </strong>€" + total.toFixed(2);
  total += await loadBundles(cart, bundleContainer);
  // Get applied discount
  const appliedDiscount = JSON.parse(
    localStorage.getItem("appliedDiscount")
  ) || { amount: 0 };

  // Update all totals
  provisionalTotal.textContent = total.toFixed(2);
  discountAmount.textContent = appliedDiscount.amount.toFixed(2);
  cartTotal.textContent = (total - appliedDiscount.amount).toFixed(2);
}

async function loadProducts(cart, cartBody, minimal = false) {
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

  // Populate cart items
  for (let item of cart) {
    const prodotto = await getProductDetails(item.id);
    if (!prodotto) continue;

    const row = document.createElement("tr");

    // Display individual product
    const itemTotal = parseFloat(prodotto.prezzo) * item.quantity;
    total += itemTotal
    row.innerHTML = `
                <td>${prodotto.marca} ${prodotto.modello}</td>
                <td>${item.color}</td>
                <td>${item.size ?? "Taglia Unica"}</td>
                ${!minimal ? "<td><input type=\"number\" min=\"1\" value=\"" + item.quantity + "\" \
                  class=\"form-control\" onchange=\"updateQuantity('" + item.id + "', this.value)\">" : ""}
                </td>
                <td>€${parseFloat(prodotto.prezzo).toFixed(2)}</td>
                ${!minimal ? "<td>€" + itemTotal.toFixed(2)+ "</td>" : ""}
                ${!minimal ? "<td><button class=\"btn btn-danger btn-sm\" onclick=\"\
                  removeItem('"+item.id+"')\">X</button></td>" : ""}
            `;

    cartBody.appendChild(row);
  }

  if (total == 0){
    cartBody.innerHTML += "<td colspan=\"7\" class=\"text-center\">Non ci sono prodotti in questa sezione</td>";
  }

  return total;
}

async function loadBundles(cart, bundleContainer){
  const response = await fetch(`data/bundles.json`);
  const data = await response.json();
  let totalPrice = 0;
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id.startsWith("b")) {
      let price = 0;
      const bundle = data.find((b) => b.id === cart[i].id);
      container = document.createElement("div");
      container.classList.add("my-4");
      container.innerHTML += `<h3>${bundle.name}</h3>`;
      container.innerHTML += `<p>${bundle.description}</p>`;
      container.innerHTML += `<table class="table">
            <thead>
                <tr>
                    <th>Prodotto</th>
                    <th>Colore</th>
                    <th>Taglia</th>
                    <th>Prezzo</th>
                </tr>
            </thead>
            <tbody id="${i}-cart-body"></tbody>
        </table>`;
      bundleContainer.appendChild(container);
      table = document.getElementById(`${i}-cart-body`);
      price += await loadProducts(cart[i].products, table, true);
      totalPrice += price;
      container.innerHTML += `<p class="text-end">
            <strong>Totale parziale: </strong><s>€${price.toFixed(2)}</s>
            €${bundle.price}
        </p>`;
    }
  }
  return totalPrice;
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
