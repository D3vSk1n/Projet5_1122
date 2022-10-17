let moi = 'gros noob';
let salut = `bonjour ${moi}!`;
console.log(salut);

fetch("http://localhost:3000/api/products")
.then(function(fetchAllData) {
    if (fetchAllData.ok) {
        return fetchAllData.json();
    }
})
.then(function(allDataAPI) {
    console.log(allDataAPI);
});

console.log(allDataAPI[0].colors[1])