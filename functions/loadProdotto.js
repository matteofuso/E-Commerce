const colorPicker = document.getElementById('color-picker');

async function loadProdotto(){
    const params = new URLSearchParams(window.location.search);
    const idElement = document.getElementById('id');
    const id = params.get('id');
    idElement.value = id;
    
    const file = id.startsWith('s') ? 'sport.json' : 'lusso.json';
    const response = await fetch(`data/${file}`);
    const data = await response.json();

    const prodotto = data.find(p => p.id === id);
    if (!prodotto) {
        console.error('Prodotto non trovato');
        return;
    }

    updateCarousel(prodotto.colori[0].immagini);

    const productTitle = document.getElementById('product-title');
    productTitle.innerText += prodotto.marca + " " + prodotto.modello;

    const description = document.getElementById('description');
    description.innerText = prodotto.descrizione;

    const price = document.getElementById('price');
    price.innerText = prodotto.prezzo + " €";

    const size = document.getElementById('size');

    prodotto.colori.forEach((colore, i) => {
        console.log(colore);
        colorPicker.innerHTML += `<div class="color-box">
                    <input type="radio" id="${colore.nome}" name="color" value="${colore.nome}" class="d-none" ${i == '0' ? 'checked' : ''}/>
                    <label for="${colore.nome}">
                    <div class="color-element" style="background-color: ${colore.codice};" title="${colore.nome}"></div>
                    ${colore.nome}
                    </label>
                </div>`
    });

    prodotto.taglie.forEach((taglia, i) => {
        size.innerHTML += `<option value="${taglia}">${taglia}</option>`
        size.parentElement.classList.remove('d-none');
    });

    colorPicker.addEventListener('change', (e) => {
        const selectedColor = prodotto.colori.find(colore => colore.nome === e.target.value);
        updateCarousel(selectedColor.immagini);
    });
}

function updateCarousel(images) {
    const carousel = document.getElementById('carousel');
    carousel.innerHTML = images.map((img, i) => `
        <div class="carousel-item ${i === 0 ? 'active' : ''}">
            <img src="${img}" class="d-block product-image" alt="Product Image">
        </div>
    `).join('');
}

loadProdotto();