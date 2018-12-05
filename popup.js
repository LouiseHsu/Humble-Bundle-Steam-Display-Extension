// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let button = document.getElementById('testbutton');
var games = [];
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
                games = response;
            })
        }
    });
  

    setup();
};

function setup() {
    $.getJSON('http://api.steampowered.com/ISteamApps/GetAppList/v2/', gotData);
}

function gotData(data) {
    let gameList = data.applist.apps;
    for (let i = 0; i < gameList.length; i++) {
        if (gameList[i].name === "Far Cry 5 - Deluxe Pack") {
            gameId = gameList[i].appid;
        }
    }
    document.getElementById("gameLink").href="https://store.steampowered.com/app/" + gameId;
    document.getElementById("gameLink").textContent="Far Cry 5 - Deluxe Pack";


    setup2();
}

function setup2() {
    $.getJSON('https://store.steampowered.com/api/appdetails/?appids=' + gameId + '&cc=CA&filters=price_overview', gotData2);
}

function gotData2(gameData) {
    console.log(gameData[gameId].data.price_overview.final);
}

// http://api.steampowered.com/ISteamApps/GetAppList/v0002/