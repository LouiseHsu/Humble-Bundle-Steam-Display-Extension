// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let button = document.getElementById('testbutton');
var games = [];

button.onclick = function () {
    // for each dd caption w/ 20 px height....
    let games = [];
    chrome.tabs.query({ 'active': true, 'currentWindow': true }, function (tabs) {
        let currURL = tabs[0].url;
        if (!currURL.includes("https://www.humblebundle.com/games")) {
            button.textContent = "Sorry, this is not a valid humble bundle games page!";
            return false;
        } else {
            chrome.tabs.sendMessage(tabs[0].id, { greeting: "getGameNames" }, function (response) {
                console.log(response);
                games = response;
            })
        }
    });
  

    setup();
};

function setup() {
    $.getJSON('http://api.steampowered.com/ISteamApps/GetAppList/v2/', gotData);
}

// function getGameIdByName(gameName, data) {
//     return data.apps.filter(function (data) {
//         return data.apps.name === gameName;
//     })
// }

function gotData(data) {
    let gameList = data.applist.apps;
    let gameId = "";
    let t1 = new Date().getTime();
    for (let i = 0; i < gameList.length; i++) {
        if (gameList[i].name === "Monster Clicker : Idle Halloween Strategy") {
            gameId = gameList[i].appid;
        }
    }
    let t2 = new Date().getTime();
    alert(t2 - t1);
    document.getElementById("timeTaken").innerHTML=t2 - t1;
    document.getElementById("gameLink").innerHTML="https://store.steampowered.com/app/" + gameId;

    setup2();
}

function setup2() {
    $.getJSON('https://store.steampowered.com/api/appdetails/?appids=582010&cc=CA&filters=price_overview', gotData2);
}

function gotData2(data) {
    alert(data);
}

// http://api.steampowered.com/ISteamApps/GetAppList/v0002/