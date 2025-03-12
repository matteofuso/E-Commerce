async function fetchPromoCodes() {
    return await fetchJSON("data/promocodes.json");
}

function updateQuantity(id, element) {
    if (element.tagName === "INPUT") {
        input = element;
        value = element.value;
    } else {
        const sign = element.textContent[0] == "+" ? 1 : -1;
        input = element.parentElement.querySelector("input");
        value = sign + parseInt(input.value);
    }

    input.value = value;
    if (value < 1) {
        input.value = 1;
        removeItem(id);
        return
    }

    const formData = new URLSearchParams();
    formData.append('id', id);
    formData.append('quantity', value);

    // Send POST request to update quantity in the database
    fetch('action/editquantity.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData.toString()
    }).then(response => {
        if (!response.ok) {
            throw new Error('Failed to update quantity');
        }
    })
    window.location.reload();
}

function removeItem(id) {
    modal = new bootstrap.Modal(document.getElementById("deleteForm"));
    modal.show();
    document.getElementById("deleteFormId").value = id;
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
            JSON.stringify({percentage: promo.discount})
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

// async function loadBundles(cart, bundleContainer) {
//     const data = await fetchJSON("data/bundles.json");
//     let totalPrice = 0;
//
//     // Verifica se ci sono bundle nel carrello
//     const hasBundles = cart.some((item) => item.id.startsWith("b"));
//
//     if (hasBundles) {
//         // Aggiungi un header per la sezione bundle
//         bundleContainer.innerHTML = `
//       <div class="card mb-4 w-100 px-0">
//         <div class="card-header bg-primary text-white">
//           <h4 class="mb-0">I tuoi Bundle</h4>
//         </div>
//         <div class="card-body" id="bundles-list"></div>
//       </div>
//     `;
//
//         const bundlesList = document.getElementById("bundles-list");
//
//         for (let i = 0; i < cart.length; i++) {
//             if (cart[i].id.startsWith("b")) {
//                 const bundle = data.find((b) => b.id === cart[i].id);
//
//                 // Crea una card per ogni bundle
//                 const bundleCard = document.createElement("div");
//                 bundleCard.classList.add("card", "mb-3", "shadow-sm");
//
//                 // Intestazione del bundle con nome e pulsante di rimozione
//                 bundleCard.innerHTML = `
//           <div class="card-header d-flex justify-content-between align-items-center">
//             <h5 class="mb-0">${bundle.name}</h5>
//             <button class="btn btn-outline-danger btn-sm" onclick="removeItem('${
//                     cart[i].id
//                 }')">
//               <i class="bi bi-trash"></i> Rimuovi
//             </button>
//           </div>
//           <div class="card-body">
//             <p class="card-text mb-3">${bundle.description}</p>
//             <div class="table-responsive">
//               <table class="table table-striped table-hover">
//                 <thead>
//                   <tr>
//                     <th>Prodotto</th>
//                     <th>Colore</th>
//                     <th>Taglia</th>
//                     <th class="text-end">Prezzo</th>
//                   </tr>
//                 </thead>
//                 <tbody id="bundle-${i}-products"></tbody>
//               </table>
//             </div>
//             <div class="d-flex justify-content-end align-items-center gap-2 mt-3">
//               <div class="badge bg-success p-2 fs-6">Risparmi ${(
//                     (await loadProducts(
//                         cart[i].products,
//                         document.createElement("div"),
//                         true
//                     )) - parseFloat(bundle.price)
//                 ).toFixed(2)}€</div>
//               <div class="fs-5 fw-bold ms-2">€${parseFloat(
//                     bundle.price
//                 ).toFixed(2)}</div>
//             </div>
//           </div>
//         `;
//
//                 bundlesList.appendChild(bundleCard);
//
//                 // Carica i prodotti all'interno del bundle
//                 const bundleProductsTable = document.getElementById(
//                     `bundle-${i}-products`
//                 );
//                 await loadProducts(cart[i].products, bundleProductsTable, true);
//
//                 totalPrice += parseFloat(bundle.price);
//             }
//         }
//     } else {
//         bundleContainer.innerHTML = "";
//     }
//
//     return totalPrice;
// }

function checkout() {
    alert("Grazie per il tuo acquisto!");
}