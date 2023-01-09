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
                    if (sofa.sofaID === productActualID && sofa.colorChosen === productActualColor) {
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

function basicFieldRegex(fieldValue) {
    let basicMask = /^[a-z][a-z-_]*[a-z]$/i;
    return basicMask.test(fieldValue);
}

function lastNameRegex(nameValue) {
    let lastNameMask = /^[a-z][a-z- _]*[a-z]$/i;
    return lastNameMask.test(nameValue);
}

function addressRegex(address) {
    let addressMask = /^[\d]{1,4}\s[a-z]+\s[a-z _-]*[a-z]$/i;
    return addressMask.test(address);
}

function emailRegex(email) {
    let mailMask = /^[a-z\d]+[\w-]*\.?[\w-]*@[\w-]+\.[a-z]{2,}$/i;
    return mailMask.test(email);
}

function noAccentInRegex(valueToSimplify) {
    let noAccent = valueToSimplify.normalize('NFKD').replace(/[\u0300-\u036F\u1DC0-\u1DFF\u1AB0-\u1AFF]+/g, '');
    return noAccent;
}

function verifyFields() {
    let firstNameField = document.getElementById("firstName");
    let lastNameField = document.getElementById("lastName");
    let addressField = document.getElementById("address");
    let cityField = document.getElementById("city");
    let emailField = document.getElementById("email");

    firstNameField.addEventListener('change', function(event) {
        document.getElementById("firstNameErrorMsg").textContent = "";
        firstName = noAccentInRegex(event.target.value);

        if (basicFieldRegex(firstName) === false) {
            document.getElementById("firstNameErrorMsg").textContent = "Nos gobelins ne trouvent pas votre prénom dans les registres; Seuls les lettres et tirets sont acceptés, deux lettres minimum";
        }
        if (event.target.value === "") {
            document.getElementById("firstNameErrorMsg").textContent = "N'oubliez-pas de remplir ce champ pour commander";
        }
    });

    lastNameField.addEventListener('change', function(event) {
        document.getElementById("lastNameErrorMsg").textContent = "";
        lastName = noAccentInRegex(event.target.value);

        if (lastNameRegex(lastName) === false) {
            document.getElementById("lastNameErrorMsg").textContent = "Quel est votre joli nom ? Seuls les lettres, espaces et tirets sont acceptés, deux lettres minimum";
        }
        if (event.target.value === "") {
            document.getElementById("lastNameErrorMsg").textContent = "N'oubliez-pas de remplir ce champ pour commander";
        }
    });

    addressField.addEventListener('change', function(event) {
        document.getElementById("addressErrorMsg").textContent = "";
        address = noAccentInRegex(event.target.value);

        if (addressRegex(address) === false) {
            document.getElementById("addressErrorMsg").textContent = "Où est ta tanière ? Un chiffre minimum séparé de lettres ou/et espaces et tirets";
        }
        if (event.target.value === "") {
            document.getElementById("addressErrorMsg").textContent = "N'oubliez-pas de remplir ce champ pour commander";
        }
    });

    cityField.addEventListener('change', function(event) {
        document.getElementById("cityErrorMsg").textContent = "";
        city = noAccentInRegex(event.target.value);

        if (basicFieldRegex(city) === false) {
            document.getElementById("cityErrorMsg").textContent = "Dans quelle contrée habitez-vous ? Seuls les lettres et tirets sont acceptés, deux lettres minimum";
        }
        if (event.target.value === "") {
            document.getElementById("cityErrorMsg").textContent = "N'oubliez-pas de remplir ce champ pour commander";
        }
    });

    emailField.addEventListener('change', function(event) {
        document.getElementById("emailErrorMsg").textContent = "";
        email = noAccentInRegex(event.target.value);

        if (emailRegex(email) === false) {
            document.getElementById("emailErrorMsg").textContent = "Miam c'est délicieux le mail mais le tien n'est pas valide; Format autorisé: X@X.X";
        }
        if (event.target.value === "") {
            document.getElementById("emailErrorMsg").textContent = "N'oubliez-pas de remplir ce champ pour commander";
        }
    });
}

function craftProductsArray(cartProducts) {
    let productsArray = [];
    for (let sofa of cartProducts) {
        productsArray.push(sofa.sofaID);
    }

    return productsArray;
}

function craftContactObject() {
    let contactObject = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        email: document.getElementById("email").value,
    }

    return contactObject;
}

async function postDataToApi(dataToSend) {
    const postAndGetResult = await fetch("http://localhost:3000/api/products/order", {
	    method: "POST",
	    headers: { 
            'Accept': 'application/json', 
            'Content-Type': 'application/json' 
        },
	    body: JSON.stringify(dataToSend)
    })
    .then((response) => response.json());

    let postResponse = [postAndGetResult];
    return postResponse;
}

async function redirecting(response) {
    let orderId = response[0].orderId;

    window.location.href=`./confirmation.html?orderId=${orderId}`;
}

function orderProducts(cartProducts) {
    let firstNameField = document.getElementById("firstName");
    let lastNameField = document.getElementById("lastName");
    let addressField = document.getElementById("address");
    let cityField = document.getElementById("city");
    let emailField = document.getElementById("email");
    let firstNameError = document.getElementById("firstNameErrorMsg");
    let lastNameError = document.getElementById("lastNameErrorMsg");
    let addressError = document.getElementById("addressErrorMsg");
    let cityError = document.getElementById("cityErrorMsg");
    let emailError = document.getElementById("emailErrorMsg");
    let orderButton = document.getElementById("order");
    

    orderButton.addEventListener('click', async function(event) {
        event.preventDefault();

        if (firstNameField.value === "" || lastNameField.value === "" || addressField.value === "" || cityField.value === "" || emailField.value === "") {
            window.alert('Veuillez remplir tous les champs pour commander');
        } else if (firstNameError.textContent != "" || lastNameError.textContent != "" || addressError.textContent != "" || cityError.textContent != "" || emailError.textContent != "") {
            window.alert('Veuillez remplir les champs du formulaire de façon adéquat pour valider votre commande');
        } else {
            let contactToSend = craftContactObject();
            let arrayProductsToSend = craftProductsArray(cartProducts);
            let dataToSend = {
              contact: contactToSend,
              products: arrayProductsToSend
            }

            let apiResponse = await postDataToApi(dataToSend);
            
            redirecting(apiResponse); 
        }
    })
}

async function main() {
    let cartProducts = JSON.parse(localStorage.getItem("cart"));

    await addProductToCardDOM(cartProducts);
    calculateTotalPrice(cartProducts);
    calculateTotalQuantity(cartProducts);
    quantityModification();
    deleteItem();
    verifyFields();
    orderProducts(cartProducts);
}

main();