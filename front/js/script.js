fetch("http://localhost:3000/api/products")
.then(function(fetchAllData) {
    if (fetchAllData.ok) {
        return fetchAllData.json();
    }
})
.then(function(allDataAPI) {
    for (let sofa of allDataAPI) {
        const sofaName = sofa.name;
        const sofaDescription = sofa.description;
        const sofaALT = sofa.altTxt;
        const sofaImgUrl = sofa.imageUrl;

        const startSection = document.getElementById('items');
        startSection.innerHTML = "<a href="./product.html"><article><img src="`${sofaImgUrl}`" alt="`${sofaALT}`"><h3 class="productName">`${sofaName}`</h3><p class="productDescription">`${sofaDescription}`</p></article></a>";
    }
})