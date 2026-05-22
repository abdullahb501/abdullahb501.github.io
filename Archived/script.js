'use strict';
document.addEventListener("DOMContentLoaded", loadListeners);

function loadListeners() {
    document.getElementById("CoinForm").addEventListener("submit", handleCoinForm);
    document.getElementById("ContactForm").addEventListener("submit", handleContactForm);

    fetch("header.html")
        .then(response => response.text())
        .then(data => {
            document.querySelector("header").innerHTML = data;
        })
        .catch(error => console.error('Error loading header:', error));

    fetch("Collections.html")
        .then(response => response.text())
        .then(data => {
            document.querySelector("header").innerHTML = data;
        })
        .catch(error => console.error('Error loading header:', error));
}



function searchTable() {
    let input, filter, table, tr, td, i, txtValue, strictMode;
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("coinTable");
    tr = table.getElementsByTagName("tr");
    strictMode = document.getElementById("strictCheckbox").checked;

    // document.querySelector("tableizer-firstrow").addEventListener()

    for (i = 1; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (strictMode) {
                if (txtValue.toUpperCase() === filter) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            } else {
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }
}

function handleCoinForm(e) {
    e.preventDefault();
    let coinDenomination = document.getElementById("coinDenomination").value;
    let coinCurrency = document.getElementById("coinCurrency").value;

    if(coinCurrency && coinDenomination){
        window.alert("both");
        // TODO: search coin database
    } else if(coinDenomination){
        // TODO: search coin database
        window.alert("number");
    } else if (coinCurrency){
        // TODO: search coin database
        window.alert("symbol");
    } else {
        alert("Please Enter a Coin Currency or Denomination")
    }
}

function handleContactForm(e) {
    e.preventDefault();
    let name = document.getElementById("ContactName").value;
    let email = document.getElementById("ContactEmail").value;
    let message = document.getElementById("ContactMessage").value;

    if(name && message){
        alert("123456")
        let container = document.createElement("p");
        container.innerText = message;
        document.getElementById("ContactCommentsContainer").appendChild(container);

        //TODO: Create new container with name and message then make it appear in container below
        //document.getElementById("ContactCommentsContainer")
    }
    if(email){
        //TODO: Save this in database with name and message?
    }
}

