const arrayColumn = (arr, n) => arr.map(x => x[n]);

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.greeting === "getGameNames") {
            let gameNames = document.getElementsByClassName('dd-image-box-text');
            let trimmedName = [];
            for (let i = 0; i < gameNames.length; i++) {
                let item = gameNames[i].textContent.toString().trim();
                trimmedName.push(item);
            }
            sendResponse({response: trimmedName});
        }

        if (request.greeting === "injectLinks") {
            if (document.getElementsByClassName('injectLinks').length > 0) {
                return;
            }
            let nameIdHash = request.datatable;
            let gamesOnPage = document.getElementsByClassName('dd-image-box-text');
            for (let i = 0; i < gamesOnPage.length; i++) {
                let index = arrayColumn(nameIdHash, 2).indexOf(gamesOnPage[i].textContent.replace(/[^a-zA-Z0-9]/g, ''));
                if (index !== -1) {
                    let url = 'https://store.steampowered.com/app/' + arrayColumn(nameIdHash, 1)[index];
                    let urlElement = document.createElement("a");
                    urlElement.href = url;
                    urlElement.textContent = "Steam Link";
                    urlElement.classList.add('injectedLink');
                    urlElement.rel = "stylesheet";

                    gamesOnPage[i].parentNode.insertBefore(urlElement, gamesOnPage[i]);
                }
            }
        }
    });
