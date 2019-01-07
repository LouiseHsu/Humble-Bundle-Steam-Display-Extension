chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.greeting === "getGameNames") {
            let gameNames = document.getElementsByClassName('dd-image-box-text');
            let trimmedName = [];
            for (let i = 0; i < gameNames.length; i++) {
                let item = gameNames[i].textContent.toString().trim();
                trimmedName.push(item);
            }
            console.log("first msg content");
            sendResponse({response: trimmedName});
        }

        if (request.greeting === "injectLinks") {
            console.log("second msg content");
            for (let i = 0; i < document.getElementsByClassName('dd-image-box-text').length; i++) {
                console.log("sssssssss");
                document.getElementsByClassName('dd-image-box-text')[i].textContent = "changed";
                sendResponse({response: "worked"});
            }
        }

    });