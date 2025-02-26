async function load(){
    const data = await fetchJSON("content/index.json");

    document.getElementById("hero-title").innerHTML = data.hero.title;
    document.getElementById("hero-description").innerHTML = data.hero.subtitle;
    document.getElementById("hero-explore").innerHTML = data.hero.explore;

    document.getElementById("collezioni-title").innerHTML = data.collections.title;

    data.collections.cards.forEach(element => {
        document.getElementById("collezioni").innerHTML += `<div class="col d-flex justify-content-center">
                    <div class="card h-100 shadow-sm">
                        <img src="${element.image}" class="card-img-top" alt="Orologi di Lusso">
                        <div class="card-body">
                            <h5 class="card-title">${element.title}</h5>
                            <p class="card-text">${element.description}</p>
                            <a href="${element.link}" class="btn btn-primary">${data.collections.discover}</a>
                        </div>
                    </div>
                </div>`;
    });
}

load();