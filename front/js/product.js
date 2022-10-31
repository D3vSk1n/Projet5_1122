let actualURL = new URL(window.location.href);
let search_params = new URLSearchParams(actualURL.search);

if(search_params.has("id")) {
    let productID = search_params.get("id");
    console.log(productID);
}