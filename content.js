// JavaScript source code
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.greeting == "getGameNames") {
            var gameNames = document.getElementsByClassName('dd-image-box-text');
            for (var i = 0; i < gameNames.length; i++) {
                var item = gameNames[i].textContent.trim;
                console.log(item);
            }
            sendResponse({farewell: "goodbye"});
        }
    });