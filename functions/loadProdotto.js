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

    const carousel = document.getElementById('carousel');
    prodotto.images.forEach((element, i) => {
        carousel.innerHTML += `<div class="carousel-item ${i == 0 ? 'active' : ''}">
            <img src="${element}" class="d-block product-image" alt="Garmin Fenix 7">
        </div>`
    });

    const productTitle = document.getElementById('product-title');
    productTitle.innerText += prodotto.marca + " " + prodotto.modello;

    const description = document.getElementById('description');
    description.innerText = prodotto.descrizione;

    const price = document.getElementById('price');
    price.innerText = prodotto.prezzo + " €";

    const colorPicker = document.getElementById('color-picker');
    const size = document.getElementById('size');
    prodotto.varianti.forEach((variante, i) => {
        variante.valori.forEach((valore, j) => {
            if (variante.tipo == 'colore') {
                colorPicker.innerHTML += `<div class="color-box">
                    <input type="radio" id="${valore[0]}" name="color" value="${valore[0]}" class="d-none" ${j == '0' ? 'checked' : ''}/>
                    <label for="${valore[0]}">
                    <div class="color-element" style="background-color: ${valore[1]};" title="${valore[0]}"></div>
                    ${valore[0]}
                    </label>
                </div>`
                colorPicker.parentElement.classList.remove('d-none');
                
            }
            else if (variante.tipo == 'taglia') {
                size.innerHTML += `<option value="${valore[0]}">${valore[0]}</option>`
                size.parentElement.classList.remove('d-none');
            }
        });
    });
}

loadProdotto();