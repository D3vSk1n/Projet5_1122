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
        .then(function(consoleLog) {
            console.log(consoleLog);
        })
        .catch(function(error) {
            console.log(error);
        });
}