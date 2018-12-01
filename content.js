// JavaScript source code
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.greeting == "getGameNames") {
            var gameNames = document.getElementsByClassName('dd-image-box-text');
            var trimmedName = [];
            for (var i = 0; i < gameNames.length; i++) {
                var item = gameNames[i].textContent.toString().trim();
                console.log(item);
                trimmedName.push(item);
            }
            sendResponse({ trimmedName });
        }
    });