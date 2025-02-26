async function fetchPromoCodes() {
  return await fetchJSON("data/promocodes.json");
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

  if (promo) {
    // Save applied discount percentage
    localStorage.setItem(
      "appliedDiscount",
      JSON.stringify({ percentage: promo.discount })
    );
    // Save used code
    usedCodes.push(discountCode);
    localStorage.setItem("usedCodes", JSON.stringify(usedCodes));

    alert(
      `Codice sconto applicato! Sconto del ${promo.discount}% applicato al totale.`
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
  document.getElementById("total").innerHTML =
    "<strong>Totale parziale: </strong>€" + total.toFixed(2);
  total += await loadBundles(cart, bundleContainer);

  // Get applied discount percentage
  const appliedDiscount = JSON.parse(
    localStorage.getItem("appliedDiscount")
  ) || { percentage: 0 };

  // Calculate discount amount based on current total
  const discountValue = (total * appliedDiscount.percentage) / 100;

  // Update all totals
  provisionalTotal.textContent = total.toFixed(2);
  discountAmount.textContent = discountValue.toFixed(2);
  cartTotal.textContent = (total - discountValue).toFixed(2);
}

async function loadProducts(cart, cartBody, minimal = false) {
  let total = 0;
  
  // Funzione per recuperare i dettagli del prodotto
  async function getProductDetails(id) {
    const file = id.startsWith("s")
      ? "sport.json"
      : id.startsWith("l")
      ? "lusso.json"
      : null;
    if (!file) return null;
    const data = await fetchJSON(`data/${file}`);
    return data.find((p) => p.id === id);
  }
  
  // Se non ci sono prodotti nel carrello
  if (cart.length === 0) {
    cartBody.innerHTML = `
      <tr>
        <td colspan="${minimal ? 4 : 7}" class="text-center py-4">
          <div class="alert alert-info mb-0">
            <i class="bi bi-cart-x me-2"></i>Non ci sono prodotti in questa sezione
          </div>
        </td>
      </tr>`;
    return total;
  }

  // Popola gli elementi del carrello
  for (let item of cart) {
    const prodotto = await getProductDetails(item.id);
    if (!prodotto) continue;

    const itemTotal = parseFloat(prodotto.prezzo) * item.quantity;
    total += itemTotal;
    
    // Trova i dettagli del colore selezionato
    const colorDetails = prodotto.colori.find(c => c.nome.toLowerCase() === item.color.toLowerCase());
    const colorCode = colorDetails ? colorDetails.codice : "#cccccc";
    const productImage = colorDetails && colorDetails.immagini && colorDetails.immagini.length > 0 
      ? colorDetails.immagini[0] 
      : null;
    
    const row = document.createElement("tr");
    
    // Aggiungi classe hover per effetto al passaggio del mouse
    row.classList.add("align-middle");
    
    // Costruisci la cella per il prodotto con immagine se disponibile
    let productCell = `<td>
      <div class="d-flex align-items-center">`;
    
    // Se il prodotto ha un'immagine
    if (productImage) {
      productCell += `<img src="${productImage}" alt="${prodotto.marca} ${prodotto.modello}" class="me-3" width="60" height="60" style="object-fit: cover; border-radius: 4px;">`;
    } else {
      // Icona placeholder se non c'è un'immagine
      productCell += `<div class="bg-light d-flex align-items-center justify-content-center me-3" style="width: 60px; height: 60px; border-radius: 4px;">
        <i class="bi bi-box text-secondary"></i>
      </div>`;
    }
    
    // Nome del prodotto
    productCell += `<div>
        <span class="fw-medium">${prodotto.marca}</span>
        <div class="small text-secondary">${prodotto.modello}</div>
      </div>
    </div></td>`;
    
    // Cella per il colore con il codice colore effettivo
    const colorCell = `<td>
      <div class="d-flex align-items-center">
        <div style="width: 18px; height: 18px; background-color: ${colorCode}; border-radius: 50%; border: 1px solid #ddd; margin-right: 8px;"></div>
        ${item.color}
      </div>
    </td>`;
    
    // Cella per la taglia
    const sizeCell = `<td><span class="badge bg-light text-dark">${item.size ?? "Taglia Unica"}</span></td>`;
    
    // Celle aggiuntive se non in modalità minimal
    let quantityCell = "";
    let priceCell = "";
    let totalCell = "";
    let actionCell = "";
    
    if (!minimal) {
      // Cella per la quantità
      quantityCell = `<td>
        <div class="input-group input-group-sm" style="max-width: 120px;">
          <button class="btn btn-outline-secondary" type="button" onclick="updateQuantity('${item.id}', Math.max(1, ${item.quantity - 1}))">-</button>
          <input type="number" min="1" value="${item.quantity}" class="form-control text-center" 
            onchange="updateQuantity('${item.id}', this.value)">
          <button class="btn btn-outline-secondary" type="button" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
        </div>
      </td>`;
      
      // Cella per il prezzo unitario
      priceCell = `<td class="text-end">€${parseFloat(prodotto.prezzo).toFixed(2)}</td>`;
      
      // Cella per il prezzo totale
      totalCell = `<td class="text-end fw-bold">€${itemTotal.toFixed(2)}</td>`;
      
      // Cella per le azioni
      actionCell = `<td class="text-center">
        <button class="btn btn-outline-danger btn-sm" onclick="removeItem('${item.id}')">
          <i class="bi bi-trash"></i>
        </button>
      </td>`;
    } else {
      // In modalità minimal, mostra solo il prezzo
      priceCell = `<td class="text-end">€${parseFloat(prodotto.prezzo).toFixed(2)}</td>`;
    }
    
    // Combina tutte le celle
    row.innerHTML = productCell + colorCell + sizeCell;
    
    if (!minimal) {
      row.innerHTML += quantityCell + priceCell + totalCell + actionCell;
    } else {
      row.innerHTML += priceCell;
    }
    
    cartBody.appendChild(row);
  }

  return total;
}

async function loadBundles(cart, bundleContainer) {
  const data = await fetchJSON("data/bundles.json");
  let totalPrice = 0;
  
  // Verifica se ci sono bundle nel carrello
  const hasBundles = cart.some(item => item.id.startsWith("b"));
  
  if (hasBundles) {
    // Aggiungi un header per la sezione bundle
    bundleContainer.innerHTML = `
      <div class="card mb-4 w-100 px-0">
        <div class="card-header bg-primary text-white">
          <h4 class="mb-0">I tuoi Bundle</h4>
        </div>
        <div class="card-body" id="bundles-list"></div>
      </div>
    `;
    
    const bundlesList = document.getElementById("bundles-list");
    
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].id.startsWith("b")) {
        const bundle = data.find((b) => b.id === cart[i].id);
        
        // Crea una card per ogni bundle
        const bundleCard = document.createElement("div");
        bundleCard.classList.add("card", "mb-3", "shadow-sm");
        
        // Intestazione del bundle con nome e pulsante di rimozione
        bundleCard.innerHTML = `
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">${bundle.name}</h5>
            <button class="btn btn-outline-danger btn-sm" onclick="removeItem('${cart[i].id}')">
              <i class="bi bi-trash"></i> Rimuovi
            </button>
          </div>
          <div class="card-body">
            <p class="card-text mb-3">${bundle.description}</p>
            <div class="table-responsive">
              <table class="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Prodotto</th>
                    <th>Colore</th>
                    <th>Taglia</th>
                    <th class="text-end">Prezzo</th>
                  </tr>
                </thead>
                <tbody id="bundle-${i}-products"></tbody>
              </table>
            </div>
            <div class="d-flex justify-content-end align-items-center gap-2 mt-3">
              <div class="badge bg-success p-2 fs-6">Risparmi ${((await loadProducts(cart[i].products, document.createElement('div'), true) - parseFloat(bundle.price)).toFixed(2))}€</div>
              <div class="fs-5 fw-bold ms-2">€${parseFloat(bundle.price).toFixed(2)}</div>
            </div>
          </div>
        `;
        
        bundlesList.appendChild(bundleCard);
        
        // Carica i prodotti all'interno del bundle
        const bundleProductsTable = document.getElementById(`bundle-${i}-products`);
        await loadProducts(cart[i].products, bundleProductsTable, true);
        
        totalPrice += parseFloat(bundle.price);
      }
    }
  } else {
    bundleContainer.innerHTML = "";
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

function checkout(){
  alert("Grazie per il tuo acquisto!");
}

// Initialize cart on page load
loadCart();
