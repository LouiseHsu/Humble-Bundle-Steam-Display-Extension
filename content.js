// JavaScript source code
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.greeting == "getGameNames") {
            var gameNames = document.getElementsByClassName('dd-captions');
            for (var i = 0; i < gameNames.length; i++) {
                var item = gameNames[i];
                console.log(item.textContent);
            }
            sendResponse({farewell: "goodbye"});
        }
    });