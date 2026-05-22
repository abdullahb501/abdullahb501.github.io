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
        coins.forEach(coin => coinContainer.appendChild(createCoinCard(coin)));
    }
    if(capContainer){
        caps.forEach(cap => capContainer.appendChild(createCapCard(cap)));
    }

    // Check for text and display appropriate info
    let coinSearch = document.getElementById("coinSearch");
    let capSearch = document.getElementById("capSearch");

    const displaySearch = (data, display, type, search) => {
        const container = document.getElementById(display);
        container.innerHTML = "";
        let found = false;
        data.forEach(item => {
            if (Object.values(item).some(v => v?.toString().toLowerCase().includes(search.toLowerCase()))) {
                found = true;
                const card = type === "coin" ? createCoinCard(item) : createCapCard(item);
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

    // Calculate total value of coins
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
    totalContainer.innerHTML = `<p style="margin:1em; padding:1em; border:.1em solid #000; width:25%;">Estimated Total Value: £${total.toFixed(2)} GBP</p>`;
})

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
    search = search.concat(".png");
    try {
        const response = await fetch(`assets/${itemImages}/${search}`);
        return await response.blob();
    } catch (err) {
        console.error("Error loading Coins:", err);
    }
}

function coinTitle(card, coin){
    card.title = "Name: " + coin.ID + "\n" + 
    "Year: " + coin.Year + "\n" +
    "Quantity: " + coin.Quantity
}

function capTitle(card, cap){
    return card.title = "Name: " + cap.Name + "\n" +
    "Country of Origin: " + cap.CountryOrigin + "\n" + 
    "Beverage Type: " + cap.BeverageType + "\n" + 
    "Quantity: " + cap.Quantity
}

function createCapCard(cap){
    let card = document.createElement("div");
    card.classList.add("CapCard");
    card.innerHTML = `
        <img loading="lazy" class="capImage" src="assets/images/firstLoad.png" width="75" height="75" alt="capImage">
    `;
    const img = card.querySelector(".capImage");
    loadItemImages(cap.Name, "capImages", "Caps").then((blob) => {
        img.src = URL.createObjectURL(blob);
        capTitle(card, cap);
    });
    img.onerror = () => {
        card.style.display = "none";
    };
    return card;
}

function createCoinCard(coin){
    let card = document.createElement("div");
    card.classList.add("CoinCard");
    card.innerHTML = `
        <img loading="lazy" class="coinImage" src="assets/images/firstLoad.png" width="75" height="75" alt="coinImage">
    `;
    const img = card.querySelector(".coinImage");
    loadItemImages(coin.ID, "coinImages", "Coins").then((blob) => {
        img.src = URL.createObjectURL(blob);
        coinTitle(card, coin);
    });
    img.onerror = () => {
        card.style.display = "none";
    };
    return card;
}