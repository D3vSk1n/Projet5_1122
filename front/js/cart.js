async function fetching(theUrl) {
    const fetchData = await fetch(theUrl).then((response) => response.json());
    const arrayData = [fetchData];
    return arrayData;
};

async function addProductToCardDOM(cartProducts) {
    const cartItemsContainer = document.getElementById("cart__items");

    for (let sofa of cartProducts) {

        const productsInfo = await fetching(`http://localhost:3000/api/products/${sofa.sofaID}`);

        cartItemsContainer.innerHTML += `
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
            </article>`;
    }
};

async function calculateIndividualCost(product) {
    const productsInfo = await fetching(`http://localhost:3000/api/products/${product.sofaID}`);
    let finalIndividualCost = product.quantityRequired * productsInfo[0].price;
    return finalIndividualCost;
};

async function calculateTotalPrice(cartProducts) {
    const totalPriceLocation = document.getElementById("totalPrice");
    let totalPrice = 0;
    for (let sofa of cartProducts) {
        let individualCost = await calculateIndividualCost(sofa);
        totalPrice += individualCost;
    }
    totalPriceLocation.innerHTML = totalPrice;
};

function calculateTotalQuantity(cartProducts) {
    const totalQuantityLocation = document.getElementById("totalQuantity");
    let totalQuantity = 0;
    for (let sofa of cartProducts) {
        totalQuantity += sofa.quantityRequired;
    }
    totalQuantityLocation.innerHTML = totalQuantity;
};

/* function creatingArray(collectionName) {
    let newArray = [];
    for (let i = 0; i < collectionName.length; i++) {
        newArray.push(collectionName[i])
    }
    return newArray;
};

function setListenerToDeleteButons(){
    let deleteLocationbuttons = document.getElementsByClassName("deleteItem");

    for (deleteLocationbutton of deleteLocationbuttons) {
        deleteLocationbutton.addEventListener("click", deleteItem);
    }
}

function deleteItem(){
    console.log("!!! FUNCTION deleteItem !!!")
} */

function getDeleteButtons() {
    let deleteButtonsCollection = document.getElementsByClassName("deleteItem");
    return deleteButtonsCollection;
}

function getQuantityFields() {
    let quantityFieldsCollection = document.getElementsByClassName("itemQuantity");
    return quantityFieldsCollection;
}

function quantityModification() {
    let quantityFields = getQuantityFields();
    
        for (let quantity of quantityFields) {
            quantity.addEventListener('change', function() {
                let cartProducts = JSON.parse(localStorage.getItem("cart"));
                let product = quantity.closest('article');
                let productActualID = product.dataset.id;
                let productActualColor = product.dataset.color;

                for (let sofa of cartProducts) {
                    if (sofa.sofaID == productActualID && sofa.colorChosen == productActualColor) {
                        sofa.quantityRequired = parseInt(quantity.value, 10);
                    }
                }

                localStorage["cart"] = JSON.stringify(cartProducts);

                calculateTotalQuantity(cartProducts);
                calculateTotalPrice(cartProducts);
            })
        }
}

function deleteItem() {
    const cartItemsContainer = document.getElementById("cart__items");
    let deleteButtons = getDeleteButtons();
    
        for (let deleteButton of deleteButtons) {
            deleteButton.addEventListener('click', function() {
                let productToDelete = deleteButton.closest('article');
                cartItemsContainer.removeChild(productToDelete);
                
                let quantityFields = getQuantityFields();
                let cartProducts = [];
                for (let quantity of quantityFields) {
                    let product = quantity.closest('article');
                    let sofaID = product.dataset.id;
                    let colorChosen = product.dataset.color;
                    let quantityRequired = parseInt(quantity.value, 10);
                    let craftingCart = { sofaID, colorChosen, quantityRequired};
                    
                    cartProducts.push(craftingCart);
                }
                
                localStorage["cart"] = JSON.stringify(cartProducts);

                calculateTotalQuantity(cartProducts);
                calculateTotalPrice(cartProducts);
            })
        }
}

async function main() {
    let cartProducts = JSON.parse(localStorage.getItem("cart"));

    await addProductToCardDOM(cartProducts);
    calculateTotalPrice(cartProducts);
    calculateTotalQuantity(cartProducts);
    quantityModification();
    deleteItem();
}

main();

let basicMask = /[A-Za-z-_]/g;
let cityMask = /[\w -]/g;