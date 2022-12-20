let cartProducts = JSON.parse(localStorage.getItem("cart"));
const domToModify = document.getElementById("cart__items");

async function fetching(theUrl) {
    const fetchData = await fetch(theUrl).then((response) => response.json());
    const arrayData = [fetchData];
    return arrayData;
}

async function fillDOMWithCart() {
    for (let sofa of cartProducts) {
        const productsInfo = await fetching(`http://localhost:3000/api/products/${sofa.sofaID}`);
        domToModify.innerHTML += `
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
}

async function calculateIndividualCost(product) {
    const productsInfo = await fetching(`http://localhost:3000/api/products/${product.sofaID}`);
    let finalIndividualCost = product.quantityRequired * productsInfo[0].price;
    return finalIndividualCost;
}

async function calculateTotalPrice() {
    let totalPrice = 0;
    for (let sofa of cartProducts) {
        let individualCost = await calculateIndividualCost(sofa);
        totalPrice += individualCost;
    }
    const totalPriceLocation = document.getElementById("totalPrice");
    totalPriceLocation.innerHTML = totalPrice;
}

function calculateTotalQuantity() {
    let totalQuantity = 0;
    for (let sofa of cartProducts) {
        totalQuantity += sofa.quantityRequired;
    }
    const totalQuantityLocation = document.getElementById("totalQuantity");
    totalQuantityLocation.innerHTML = totalQuantity;
}

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
                let product = quantity.closest('article');
                let productActualID = product.dataset.id;
                let productActualColor = product.dataset.color;

                for (let sofa of cartProducts) {
                    if (sofa.sofaID == productActualID && sofa.colorChosen == productActualColor) {
                        sofa.quantityRequired = parseInt(quantity.value, 10);
                    }
                }

                calculateTotalQuantity();
                calculateTotalPrice();

                localStorage["cart"] = JSON.stringify(cartProducts);
            })
        }
}

/* function getQuantity() {
    let quantityCollection = document.getElementsByClassName("itemQuantity");
        for (let quantity of quantityCollection) {
            let productActualQuantity = quantity.value;
        }
} */

async function main() {
    fillDOMWithCart();
    calculateTotalQuantity();
    calculateTotalPrice();
    
    await new Promise(resolve => setTimeout(resolve, 500))

    quantityModification();

    let deleteButtons = getDeleteButtons();

    for (let deleteButton of deleteButtons) {
        deleteButton.addEventListener('click', function() {
            let productToDelete = deleteButton.closest('article');
            domToModify.removeChild(productToDelete);

            /*let productsLocation = document.getElementsByClassName("cart__item");
            
            for (let product of productsLocation) {
                let productActualID = product.dataset.id;
                let productActualColor = product.dataset.color;
                let productActualQuantity = getQuantity();
            }
            
            cart = [];
            let actualBuy = { productActualID, productActualColor, productActualQuantity }; */

            calculateTotalQuantity();
            calculateTotalPrice();
        })    
    }
}

main();