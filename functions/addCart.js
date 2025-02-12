// Recupera i parametri dall'URL
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");
const color = params.get("color");
const size = params.get("size");

// Recupera il carrello dal localStorage o crea un array vuoto
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Crea l'oggetto prodotto
const product = {
    id: productId,
    color: color,
    size: size,
    quantity: 1
};

// Controlla se il prodotto esiste già nel carrello
const existingProduct = cart.find(item => item.id === productId && item.color === color && item.size === size);

if (existingProduct) {
    // Se esiste, aumenta la quantità
    existingProduct.quantity += 1;
} else {
    // Se non esiste, lo aggiunge
    cart.push(product);
}

// Salva nel localStorage
localStorage.setItem("cart", JSON.stringify(cart));

console.log("Prodotto aggiunto al carrello:", product);
window.location.href = "carrello.html";