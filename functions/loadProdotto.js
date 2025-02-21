const colorPicker = document.getElementById('color-picker');

async function loadProdotto(){
    const params = new URLSearchParams(window.location.search);
    const idElement = document.getElementById('id');
    const id = params.get('id') || params.get('bundle');
    idElement.value = id;
    
    let data, isBundle = false;
    if (id.startsWith('b')) {
        const response = await fetch('data/bundles.json');
        data = await response.json();
        isBundle = true;
    } else {
        const file = id.startsWith('s') ? 'sport.json' : 'lusso.json';
        const response = await fetch(`data/${file}`);
        data = await response.json();
    }

    const prodotto = data.find(p => p.id === id);
    if (!prodotto) {
        console.error('Prodotto/Bundle non trovato');
        return;
    }

    if (isBundle) {
        updateCarousel([prodotto.image]);
    } else {
        updateCarousel(prodotto.colori[0].immagini);
    }

    const productTitle = document.getElementById('product-title');
    const description = document.getElementById('description');
    const price = document.getElementById('price');

    if (isBundle) {
        productTitle.innerText = prodotto.name;
        description.innerText = prodotto.description;
        price.innerText = prodotto.price + " €";
    } else {
        productTitle.innerText = prodotto.marca + " " + prodotto.modello;
        description.innerText = prodotto.descrizione;
        price.innerText = prodotto.prezzo + " €";
    }

    const size = document.getElementById('size');
    const colorPickerContainer = document.getElementById('color-picker');

    if (!isBundle) {
        prodotto.colori.forEach((colore, i) => {
            colorPickerContainer.innerHTML += `<div class="color-box">
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

        colorPickerContainer.addEventListener('change', (e) => {
            const selectedColor = prodotto.colori.find(colore => colore.nome === e.target.value);
            updateCarousel(selectedColor.immagini);
        });
    } else {
        // Hide color and size selectors for bundles
        colorPickerContainer.parentElement.classList.add('d-none');
        size.parentElement.classList.add('d-none');
    }
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
