// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let button = document.getElementById('testbutton');
var allHumbleGameNames = [];
var gameId = "";

button.onclick = function () {
    // for each dd caption w/ 20 px height....
    chrome.tabs.query({ 'active': true, 'currentWindow': true }, function (tabs) {
        let currURL = tabs[0].url;
        if (!currURL.includes("https://www.humblebundle.com/games")) {
            button.textContent = "Sorry, this is not a valid humble bundle games page!";
            return false;
        } else {
            chrome.tabs.sendMessage(tabs[0].id, { greeting: "getGameNames" }, function (response) {
                allHumbleGameNames = response.response;
            })
        }
    });
  

    setup();
};

function setup() {
    $.getJSON('http://api.steampowered.com/ISteamApps/GetAppList/v2/', gotData);
}

function gotData(data) {
    const allSteamGames = data.applist.apps;
    for (let i = 0; i < allSteamGames.length; i++) {
        for (let j = 0; j < allHumbleGameNames.length; j++) {
            let gameName = allSteamGames[i].name.toString();
            if (gameName === allHumbleGameNames[j]) {
                gameId = allSteamGames[i].appid;
                const newElement = '<span class="entry"><a class = game-link href=""></a></span>';
                document.getElementById("game-list").insertAdjacentHTML('beforeend', newElement);
                document.getElementById("game-list").lastChild.firstChild.href = "https://store.steampowered.com/app/" + gameId;
                document.getElementById("game-list").lastChild.firstChild.textContent = allHumbleGameNames[j].toString();
                break;
            }

        }
    }
    //
    // document.getElementById("game-link").href="https://store.steampowered.com/app/" + gameId;
    // document.getElementById("game-link").textContent="Far Cry 5 - Deluxe Pack";


    setup2();
}

function setup2() {
    $.getJSON('https://store.steampowered.com/api/appdetails/?appids=' + gameId.toString() + '&cc=CA&filters=price_overview', gotData2);
}

function gotData2(gameData) {
    console.log(gameData[gameId].data.price_overview.final);
}

// http://api.steampowered.com/ISteamApps/GetAppList/v0002/