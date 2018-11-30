// JavaScript source code
chrome.tabs.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.greeting == 'getGameNames') {
            var gameNames = document.getElementsByClassName('dd-captions');
            var listOfNames = [];
            for (var i = 0; i < gameNames.length; i++) {
                var item = gameNames[i].toString.trim();
                listOfNames.push(item);
            }
        }
        sendResponse({ matches: listOfNames });
        return true;
    });