document.addEventListener("DOMContentLoaded", async () => {
    // Get NavBar for all pages
    fetch('header.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('navbar').innerHTML = html;
        });

    // Containers
    let coinContainer = document.getElementById("CoinGrid");
    let capContainer = document.getElementById("CapGrid");
    let totalContainer = document.getElementById("TotalContainer");

    // Load Items
    const coins = await loadItems("Coins.csv", "Coins");
    const caps = await loadItems("Caps.csv", "Caps");

    // Render all coins and caps
    if(coinContainer){
        coins.forEach(coin => coinContainer.appendChild(createCard(coin, "coin", "CoinCard", "coinImage", "Coins")));
    }
    if(capContainer){
        caps.forEach(cap => capContainer.appendChild(createCard(cap, "cap", "CapCard", "capImage", "Caps")));
    }

    let coinCountry = [
        "UK", "Germany", "Italy", "Spain", "Qatar", "USA", "Israel",
        "Pakistan", "Norway", "Saudi Arabia", "Morocco", "Mexico",
        "Switzerland", "Japan", "Romania", "Poland", "Thailand"
    ];

    let coinDenomination = ["1", "2", "5", "10", "20", "25", "50"];

    let coinCurrency = [
        "Pence", "Pound", "Euro", "Euro Cent", "Fils",
        "Dirhams", "Dime", "New Sheqalim", "Pakistani Rupee", "Krone",
        "Riyals", "Halalas", "New Pesos", "Swiss Franc", "Yen", "Romanian Leu",
        "Zloty", "Thai Baht"
    ];

    let capCountry = [
        "England", "Scotland", "Canada", "Italy", "Spain", "France",
        "Germany", "China", "Dubai", "United States", "Switzerland",
        "Algeria"
    ];

    let coinCountrySection = document.getElementById("coinCountry");
    let coinDenominationSection = document.getElementById("coinDenomination");
    let coinCurrencySection = document.getElementById("coinCurrency");
    let capCountrySection = document.getElementById("capCountry");

    if(coinCountrySection){
        document.getElementById("coinCountry").innerHTML +=
        coinCountry.map(c => `<a href="#">${c}</a>`).join("");
    }
    if(coinDenominationSection){
        document.getElementById("coinDenomination").innerHTML +=
        coinDenomination.map(c => `<a href="#">${c}</a>`).join(""); 
    }
    if(coinCurrencySection){
        document.getElementById("coinCurrency").innerHTML +=
        coinCurrency.map(c => `<a href="#">${c}</a>`).join("");
    
    }
    if(capCountrySection){
        document.getElementById("capCountry").innerHTML +=
        capCountry.map(c => `<a href="#">${c}</a>`).join(""); 
    }

    // Check for text and display appropriate info
    let coinSearch = document.getElementById("coinSearch");
    let capSearch = document.getElementById("capSearch");

    let displaySearch = (data, display, type, search) => {
        let container = document.getElementById(display);
        container.innerHTML = "";
        let found = false;
        data.forEach(item => {
            if (Object.values(item).some(v => v?.toString().toLowerCase().includes(search.toLowerCase()))) {
                found = true;
                let card = type === "coin" ? createCard(item, "coin", "CoinCard", "coinImage", "Coins") : createCard(item, "cap", "CapCard", "capImage", "Caps");
                container.appendChild(card);
            }
        });
        document.getElementById(type === "coin" ? "CoinSearchDisplaySeperation" : "CapSearchDisplaySeperation").style.display = found ? "block" : "none";
    };

    if(coinSearch){
        coinSearch.addEventListener("keyup", () => {
            displaySearch(coins, "CoinSearchDisplay", "coin", coinSearch.value);
        });
    }
    if (capSearch){
        capSearch.addEventListener("keyup", () => {
            displaySearch(caps, "CapSearchDisplay", "cap", capSearch.value);
        });
    }

    document.querySelectorAll(".CoinInfoSection").forEach(section => {
        section.addEventListener("click", (e) => {
            if (e.target.tagName === "A") {
                document.getElementById('coinSearch').value = e.target.textContent;
                displaySearch(coins, "CoinSearchDisplay", "coin", coinSearch.value);
            }
        })
    });
    document.querySelectorAll("div.CapInfoSection, div.InfoSection").forEach(section => {
        section.addEventListener("click", (e) => {
            if (e.target.tagName === "A") {
                document.getElementById('capSearch').value = e.target.textContent;
                displaySearch(caps, "CapSearchDisplay", "cap", capSearch.value);
             }
        })
    });

    // Calculate estimated total value of coins
    let pence = 0; pounds = 0; euroCents = 0; euros = 0;
    coins.forEach(c => {
        let val = Number(c.Denomination) * Number(c.Quantity);
        switch(c.Currency){
            case "Pence": pence += val; break;
            case "Pound": pounds += val; break;
            case "Euro Cent": euroCents += val; break;
            case "Euro": euros += val; break;
        }
    });
    let totalPounds = pounds + pence/100;
    let totalEuros = euros + euroCents/100;
    let total = totalPounds + totalEuros*0.87;
    if(totalContainer){
        totalContainer.innerHTML = `<p>Estimated Total Value: £${total.toFixed(2)} GBP</p>`;
    }
});

// loadItems("Coins.csv", "Coins");
// loadItems("Caps.csv", "Caps");
async function loadItems(csvFile, errorMsg){
    try {
        const response = await fetch("assets/" + csvFile);
        const text = await response.text();

        const result = Papa.parse(text, {
            header: true,
            skipEmptyLines: true,
        });

        return result.data;
    } catch (err) {
        console.error("Error loading " + errorMsg + ":", err);
    }
}

// loadItemImages(coin.ID, "coinImages", "Coins");
// loadItemImages(cap.Name, "capImages", "Caps");
async function loadItemImages(search, itemImages, errorMsg) {
    search += ".png"
    // search = search.concat(".png");
    try {
        const response = await fetch(`assets/${itemImages}/${search}`);
        return await response.blob();
    } catch (err) {
        console.error("Error loading Coins:", err);
    }
}

function coinTitle(card, coin){
    card.title = "Name: " + coin.ID + "\n" + 
    "Year: " + coin.Year + " | " + "Quantity: " + coin.Quantity
}

function capTitle(card, cap){
    return card.title = "Name: " + cap.Name + "\n" +
    "Country of Origin: " + cap.CountryOrigin + "\n" + 
    "Beverage Type: " + cap.BeverageType + "\n" + 
    "Quantity: " + cap.Quantity
}

// createCard(coin, "coin", "CoinCard", "coinImage", "Coins")
// createCard(cap, "cap", "CapCard", "capImage", "Caps")
function createCard(item, type, cardName, itemImage, errorMsg){
    let card = document.createElement("div");
    card.classList.add(cardName);
    card.innerHTML = `
        <img loading="lazy" class="${itemImage}" alt="${itemImage}" src="assets/images/firstLoad.png" width="75" height="75">
    `;
    const img = card.querySelector("." + itemImage);
    loadItemImages(type === "coin" ? item.ID : item.Name, itemImage + "s", errorMsg).then((blob) => {
        img.src = URL.createObjectURL(blob);
        type === "coin" ? coinTitle(card, item) : capTitle(card, item)
    });
    img.onerror = () => {
        card.style.display = "none";
    };
    return card;
}