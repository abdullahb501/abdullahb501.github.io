// document.querySelectorAll('img').forEach(i => {
//     i.addEventListener('click', evt => {
//         if (i.classList.contains('zoomed'))
//             i.style.transform = ''
//         else {
//             const myScale = 500 / i.clientWidth
//             i.style.transform = `scale(${myScale})`
//         }
//         i.classList.toggle('zoomed')
//     })
// })

// document.getElementById('SummitSeekerGIF').style.width = 70%

async function loadCaps() {
    try {
        const response = await fetch("assets/Caps.csv");
        const text = await response.text();

        const result = Papa.parse(text, {
            header: true,
            skipEmptyLines: true,
        });

        return result.data;
    } catch (err) {
        console.error("Error loading Caps:", err);
    }
}

async function loadCapImages(search) {
    search = search.concat(".png");
    try {
        const response = await fetch(`assets/capImages/${search}`);
        return response.blob();
    } catch (err) {
        console.error("Error loading Caps:", err);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    let capContainer = document.getElementById("CapGrid");
    loadCaps().then((caps) => {
        caps.forEach((cap) => {
            let card = document.createElement("div");
            card.classList.add("CapCard");
            card.innerHTML = `
                <img class="capImage" src="assets/images/firstLoad.png" width="75" height="75" alt="capImage">
            `;
            const img = card.querySelector(".capImage");
            loadCapImages(cap.Name).then((blob) => {
                img.src = URL.createObjectURL(blob);
            });
            img.onerror = () => {
                card.style.display = "none";
            };

            capContainer.appendChild(card);
        });
    });
})


async function loadCoins() {
    try {
        const response = await fetch("assets/Coins.csv");
        const text = await response.text();

        const result = Papa.parse(text, {
            header: true,
            skipEmptyLines: true,
        });

        return result.data;
    } catch (err) {
        console.error("Error loading Coins:", err);
    }
}

async function loadCoinImages(search) {
    search = search.concat(".png");
    try {
        const response = await fetch(`assets/coinImages/${search}`);
        return await response.blob();
    } catch (err) {
        console.error("Error loading Coins:", err);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    let coinContainer = document.getElementById("CoinGrid");
    console.log(coinContainer);
    loadCoins().then((coins) => {
        coins.forEach((coin) => {
            let card = document.createElement("div");
            card.classList.add("CoinCard");
            card.innerHTML = `
                <img class="coinImage" src="assets/images/firstLoad.png" width="75" height="75" alt="coinImage">
            `;
            const img = card.querySelector(".coinImage");
            loadCoinImages(coin.ID).then((blob) => {
                img.src = URL.createObjectURL(blob);
            });
            img.onerror = () => {
                card.style.display = "none";
            };

            coinContainer.appendChild(card);
        });
    });
})

