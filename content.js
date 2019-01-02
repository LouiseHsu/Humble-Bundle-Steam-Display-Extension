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
    });