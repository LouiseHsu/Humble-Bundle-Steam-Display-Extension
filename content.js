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
            let counter = 0;
            let gameNames = request.gameNames;
            let gameIds = request.gameIds;
            console.log(gameNames);
            let gamesOnPage = document.getElementsByClassName('dd-image-box-text');
            for (let i = 0; i < gamesOnPage.length; i++) {
                if (gameNames.includes(gamesOnPage[i].textContent.replace(/[^a-zA-Z0-9]/g, ''))) {
                    let url = 'https://store.steampowered.com/app/' + gameIds[counter];
                    let urlElement = document.createElement("a");
                    urlElement.href = url;
                    urlElement.textContent = "Steam Link";
                    gamesOnPage[i].parentNode.insertBefore(urlElement, gamesOnPage[i].nextSibling);
                    counter++;
                }
            }
        }

    });
// hash mao?
