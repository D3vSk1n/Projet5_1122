fetch("http://localhost:3000/api/products")
.then(function(fetchAllData) {
    if (fetchAllData.ok) {
        return fetchAllData.json();
    }
})
.then(function(applyHomeData) {
    const startSection = document.getElementById('items');
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
})