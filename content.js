const arrayColumn = (arr, n) => arr.map(x => x[n]);

function normalizeString(string) {
    return string.replace(/[^a-zA-Z0-9]/g, '');
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.greeting === "getGameNames") {
                let gameNames = $('.dd-image-box-text');
                let trimmedName = [];
                for (let i = 0; i < gameNames.length; i++) {
                    let item = gameNames[i].textContent.toString().trim();
                    trimmedName.push(item);
                }
                sendResponse({response: trimmedName});
        }

        if (request.greeting === "injectLinks") {
            if ($('.injectedLink').length > 0) {
                return;
            }
            let nameIdHash = request.datatable;
            console.log(nameIdHash);
            let gamesOnPage = $('.dd-image-box-text');
            let tooltipsOnPage = $('.dd-tooltiptext');
            for (let i = 0; i < tooltipsOnPage.length; i++) {
                tooltipsOnPage[i].style.zIndex = "2";
            }
            let counter = 0;
            for (let i = 0; i < gamesOnPage.length; i++) {
                let index = arrayColumn(nameIdHash, 2).indexOf(normalizeString(gamesOnPage[i].textContent));
                if (index !== -1) {
                    let url = 'https://store.steampowered.com/app/' + arrayColumn(nameIdHash, 1)[index];
                    let urlElement = document.createElement("a");
                    urlElement.href = url;
                    urlElement.textContent = "Current Steam Price: $" + arrayColumn(nameIdHash, 3)[index];
                    urlElement.classList.add('injectedLink');
                    urlElement.rel = "stylesheet";
                    gamesOnPage[i].parentNode.insertBefore(urlElement, gamesOnPage[i]);
                    counter++;
                }
            }
        }
    });
