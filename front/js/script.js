fetch("http://localhost:3000/api/products")
.then(function(fetchAllData) {
    if (fetchAllData.ok) {
        return fetchAllData.json();
    }
})
.then(function(allDataAPI) {
    const startSection = document.getElementById('items');
    for (let sofa of allDataAPI) {
        startSection.innerHTML += `
        <a href="./product.html">
        <article>
        <img src="${sofa.imageUrl}" alt="${sofa.altTxt}">
        <h3 class="productName">"${sofa.name}"</h3>
        <p class="productDescription">"${sofa.description}"</p>
        </article>
        </a>
        `;
    }
})