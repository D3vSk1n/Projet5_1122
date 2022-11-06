fetch("http://localhost:3000/api/products") //requête serveur des données de tous les produits
.then(function(fetchAllData) {
    if (fetchAllData.ok) {
        return fetchAllData.json();
    } //conversion des données en json
})
.then(function(applyHomeData) {
    const startSection = document.getElementById('items'); //recherche et acquisition de la section à complêter 
    for (let sofa of applyHomeData) {
        startSection.innerHTML += `
        <a href="./product.html?id=${sofa._id}">
        <article>
        <img src="${sofa.imageUrl}" alt="${sofa.altTxt}">
        <h3 class="productName">"${sofa.name}"</h3>
        <p class="productDescription">"${sofa.description}"</p>
        </article>
        </a>
        `;
    }
}) /*
mise en place d'une boucle créant dynamiquement les éléments pour chaque canapé présent sur le serveur
utilisation de l'interpolation pour placer chaque donnée au bon endroit de façon dynamique également
*/