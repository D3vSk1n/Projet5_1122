let actualURL = new URL(window.location.href); 
let searchParams = new URLSearchParams(actualURL.search);           //création d'une variable contenant l'URL actuel (actualURL) et activation du search params 

if (searchParams.has("id")) {
    let productID = searchParams.get("id");
    let adressToFetch = `http://localhost:3000/api/products/${productID}`;
    /*utilisation de search params pour rechercher l'id du produit et l'inclure via interpolation 
    dans une variable contenant l'adresse à fetch (requête de données au serveur)
    */
    fetch(adressToFetch)
        .then(function(fetchProductData) {
            if (fetchProductData.ok) {
                return fetchProductData.json();
            } //création du json contenant les données du fetch 
        })
        .then(function(applyData) {
            const arrayData = [applyData];          //création d'un tableau contenant les données de la promesse

            const imgSection = document.getElementsByClassName('item__img')[0];
            imgSection.innerHTML = `<img src="${arrayData[0].imageUrl}" alt="${arrayData[0].altTxt}"></img>`;

            const titleSection = document.getElementById('title');
            titleSection.textContent = `${arrayData[0].name}`;

            const priceSection = document.getElementById('price');
            priceSection.textContent = `${arrayData[0].price}`;

            const descriptionSection = document.getElementById('description');
            descriptionSection.textContent = `${arrayData[0].description}`;         //remplissage des quatre sections grâce aux données du tableau

            for (let color of arrayData[0].colors) { 
                let colorSection = document.getElementById('colors');
                let optionElement = document.createElement('option');

                colorSection.appendChild(optionElement);
                optionElement.setAttribute("value", color);
                optionElement.textContent = color;
            }
                /*mise en place d'une boucle créant des éléments option de façon dynamique et les remplissant 
                avec les couleurs adéquates
                */
        })
        .catch(function(error) {
            console.log(error);
        })
}

const buttonAddToCart = document.getElementById('addToCart');       //récupération de l'élément qu'on va écouter, ici le bouton "ajouter au panier"
const sofaID = searchParams.get("id"); 

function getColorChosen() {
    return document.querySelector("#colors").value;
}

function getQuantityRequired() {
   return document.querySelector("#quantity").value;
}  

buttonAddToCart.addEventListener('click', function(eventInfo) {
    let actualBuy = {
        id: sofaID,
        color: getColorChosen(),
        quantity: getQuantityRequired(),
    };
    
    let cart = [];
    console.log(actualBuy)
    window.alert("Canapé dans le panier, bien joué les Bulls !")
})