let cartProducts = JSON.parse(localStorage.getItem("cart"));
const documentGeneralLocation = document.getElementById("cart__items");
const totalQuantityLocation = document.getElementById("totalQuantity");
const totalPriceLocation = document.getElementById("totalPrice");

async function fetching(theUrl) {
    const fetchData = await fetch(theUrl).then((response) => response.json());
    const arrayData = [fetchData];
    return arrayData;
};

async function aNicePage() {
    for (let sofa of cartProducts) {
        const productsInfo = await fetching(`http://localhost:3000/api/products/${sofa.sofaID}`);
        documentGeneralLocation.innerHTML += `
            <article class="cart__item" data-id="${sofa.sofaID}" data-color="${sofa.colorChosen}">
                <div class="cart__item__img">
                    <img src="${productsInfo[0].imageUrl}" alt="${productsInfo[0].altTxt}">
                </div>
                <div class="cart__item__content">
                    <div class="cart__item__content__description">
                        <h2>${productsInfo[0].name}</h2>
                        <p>${sofa.colorChosen}</p>
                        <p>${productsInfo[0].price} €</p>
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
            </article>`
    }
};

async function calculateIndividualCost(product) {
    const productsInfo = await fetching(`http://localhost:3000/api/products/${product.sofaID}`);
    let finalIndividualCost = product.quantityRequired * productsInfo[0].price;
    return finalIndividualCost;
};

async function calculateTotalPrice() {
    let totalPrice = 0;
    for (let sofa of cartProducts) {
        let individualCost = await calculateIndividualCost(sofa);
        totalPrice += individualCost;
    }
    totalPriceLocation.innerHTML = totalPrice;
};

function calculateTotalQuantity() {
    let totalQuantity = 0;
    for (let sofa of cartProducts) {
        totalQuantity += sofa.quantityRequired;
    }
    totalQuantityLocation.innerHTML = totalQuantity;
};

aNicePage();
calculateTotalPrice();
calculateTotalQuantity();

let deleteLocation = document.getElementsByClassName("deleteItem");
console.log(deleteLocation);

function creatingArray(collectionName) {
    let newArray = [];
    for (let i = 0; i < collectionName.length; i++) {
        newArray.push(collectionName[i])
    }
    return newArray;
};

let deleteArray = Array.from(deleteLocation);
console.log(deleteArray);

const quantityLocation = document.getElementsByClassName("itemQuantity");

for (let quantityModifier of quantityLocation) {
    quantityModifier.addEventListener('change', function() {
        console.log("yes");
    })
};

deleteLocation = [...deleteLocation];
deleteLocation = Array.prototype.slice.call(elements);