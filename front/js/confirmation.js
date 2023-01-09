let actualURL = new URL(window.location.href); 
let searchParams = new URLSearchParams(actualURL.search);
let orderId = searchParams.get("orderId");

document.getElementById("orderId").textContent = orderId;