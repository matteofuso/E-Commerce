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
    formData.append('resource', 'orologio');

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
    document.getElementById('resource').value = 'orologio';
    document.getElementById('deleteFormTitle').innerHTML = 'Vuoi rimuovere l\'orologio?';
    document.getElementById('deleteFormText').innerHTML = 'Sei sicuro di voler rimuovere l\'oggetto dal carrello?';
}

function removeBundle(id) {
    modal = new bootstrap.Modal(document.getElementById("deleteForm"));
    modal.show();
    document.getElementById("deleteFormId").value = id;
    document.getElementById('resource').value = 'bundle';
    document.getElementById('deleteFormTitle').innerHTML = 'Vuoi rimuovere il bundle?';
    document.getElementById('deleteFormText').innerHTML = 'Sei sicuro di voler rimuovere il bundle dal carrello?';
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

function checkout() {
    alert("Grazie per il tuo acquisto!");
}