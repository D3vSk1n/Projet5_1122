let actualURL = new URL(window.location.href);
let searchParams = new URLSearchParams(actualURL.search);

if (searchParams.has("id")) {
    let productID = searchParams.get("id");
    let adressToFetch = `http://localhost:3000/api/products/${productID}`;

    fetch(adressToFetch)
        .then(function(fetchProductData) {
            if (fetchProductData.ok) {
                return fetchProductData.json();
            }
        })
        .then(function(applyData) {
            const arrayData = [applyData];
            const imgSection = document.getElementsByClassName('item__img')[0];
            imgSection.innerHTML = `<img src="${arrayData[0].imageUrl}" alt="${arrayData[0].altTxt}"></img>`;
            const titleSection = document.getElementById('title');
            titleSection.textContent = `${arrayData[0].name}`;
            const priceSection = document.getElementById('price');
            priceSection.textContent = `${arrayData[0].price}`;
            const descriptionSection = document.getElementById('description');
            descriptionSection.textContent = `${arrayData[0].description}`;

            for (let color of arrayData[0].colors) {
                let colorSection = document.getElementById('colors');
                let optionElement = document.createElement('option');

                colorSection.appendChild(optionElement);
                optionElement.setAttribute("value", `"${color}"`);
                optionElement.textContent = `${color}`;
            }
        })
        .catch(function(error) {
            console.log(error);
        })
}