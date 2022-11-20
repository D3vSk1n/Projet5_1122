let cartProducts = JSON.parse(localStorage.getItem("cart"));
const documentGeneralLocation = document.getElementById("cart__items");
const totalQuantityLocation = document.getElementById("totalQuantity");
const totalPriceLocation = document.getElementById("totalPrice");
let quantityIncrement = 0;
let priceAddition = 0;

for (let sofa of cartProducts) {
    const adressToFetch = `http://localhost:3000/api/products/${sofa.sofaID}`;
    fetch(adressToFetch)
    .then(function(fetchProductData) {
        if (fetchProductData.ok) {
            return fetchProductData.json();
        }
    })
    .then(function(applyData) {
        const arrayData = [applyData]; 
        console.log(arrayData);

        documentGeneralLocation.innerHTML += `
            <article class="cart__item" data-id="${sofa.sofaID}" data-color="${sofa.colorChosen}">
                <div class="cart__item__img">
                    <img src="${arrayData[0].imageUrl}" alt="${arrayData[0].altTxt}">
                </div>
                <div class="cart__item__content">
                    <div class="cart__item__content__description">
                        <h2>${arrayData[0].name}</h2>
                        <p>${sofa.colorChosen}</p>
                        <p>${arrayData[0].price} €</p>
                    </div>
                <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                        <p>Qté : </p>
                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${sofa.quantityRequired}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                        <p class="deleteItem">Supprimer</p>
                    </div>
                </div>
                </div>
            </article>
        `
        function getQuantityRequired() {
            return parseInt(sofa.quantityRequired, 10);
        }  

        let quantityTyped = getQuantityRequired();
        quantityIncrement += quantityTyped;
        totalQuantityLocation.textContent = quantityIncrement;
        priceAddition += sofa.quantityRequired * arrayData[0].price;
        totalPriceLocation.textContent = priceAddition; 
    })
    .catch(function(error) {
        console.log(error);
    })
}