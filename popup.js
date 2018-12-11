// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let button = document.getElementById('testbutton');
var allHumbleGameNames = [];
var allViableHumbleGameIds = [];
var allViableHumbleGameData = [];

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
    let allSteamGames = data.applist.apps;
    for (let i = 0; i < allSteamGames.length; i++) {
        for (let j = 0; j < allHumbleGameNames.length; j++) {
            if (allSteamGames[i].name === allHumbleGameNames[j]) {
                let gameId = allSteamGames[i].appid;
                allViableHumbleGameIds.unshift(gameId);
                let newGameRow = '<tr class="entry"><td><a class = game-link href="">' + allHumbleGameNames[j].toString() + '</a></td></tr>';
                document.getElementById("game-list").insertAdjacentHTML('beforeend', newGameRow);
                document.getElementsByClassName("game-link").item(allViableHumbleGameIds.length - 1).href = "https://store.steampowered.com/app/" + gameId;
                break;
            }

        }
    }

    getPrice();
}

function getPrice() {
    for (let i = 0; i < allViableHumbleGameIds.length; i++) {
        console.log(allViableHumbleGameIds[i]);
        setup2(allViableHumbleGameIds[i]);
        console.log("ran setup2");
    }
}

function injectPrices() {
    for (let j = 0; j < allViableHumbleGameData.length; j++) {
        let price = allViableHumbleGameData[j][allViableHumbleGameIds[j]].data.price_overview.final;
        console.log(price);
    }
}

function setup2(gameId) {
    console.log('https://store.steampowered.com/api/appdetails/?appids=' + gameId.toString() + '&cc=CA&filters=price_overview');
    $.getJSON('https://store.steampowered.com/api/appdetails/?appids=' + gameId + '&cc=CA&filters=price_overview', gotData2);
}

function gotData2(data) {
    allViableHumbleGameData.push(data);
    console.log(allViableHumbleGameIds.length);
    console.log(allViableHumbleGameData.length);

    if (allViableHumbleGameIds.length === allViableHumbleGameData.length) {
        injectPrices();
    }
}

// http://api.steampowered.com/ISteamApps/GetAppList/v0002/