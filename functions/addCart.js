function prodottoJSON(id, color, size, quantity = 1) {
    item = {
        id: id,
        color: color,
        size: size,
        quantity: quantity
    };
    return item;
}

// Recupera i parametri dall'URL
const params = new URLSearchParams(window.location.search);
id = params.getAll("id[]");
let cart = JSON.parse(localStorage.getItem("cart") || []);

console.log(cart);
console.log(id.length);
if (id.length === 1) {
    console.log("prodotto singolo");
    color = params.get(id + "-color");
    size = params.get(id + "-size");
    prodotto = prodottoJSON(id[0], color, size);
    const existingProduct = cart.find(item => item.id === id[0] && item.color === color && item.size === size);
    if (existingProduct) {
        // Se esiste, aumenta la quantità
        existingProduct.quantity += 1;
    }
    else {
        // Se non esiste, lo aggiunge
        cart.push(prodotto);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
} else {
    console.log("bundle");
    bundle_id = params.get("bundle");
    let bundle = {
        id: bundle_id,
        products: []
    };
    for (let i = 0; i < id.length; i++) {
        color = params.get(id[i] + "-color");
        size = params.get(id[i] + "-size");
        prodotto = prodottoJSON(id[i], color, size);
        bundle.products.push(prodotto);
    }
    cart.push(bundle);
    localStorage.setItem("cart", JSON.stringify(cart));
}

window.location.href="carrello.html";