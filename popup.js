// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let button = document.getElementById('test-button');
let allHumbleGameNames = [];
let allViableHumbleGameIds = [];
let allViableHumbleGameData = [];

button.onclick = function () {
    // for each dd caption w/ 20 px height....
    chrome.tabs.query({'active': true, 'currentWindow': true}, function (tabs) {
        let currURL = tabs[0].url;
        if (!currURL.includes("https://www.humblebundle.com/games")) {
            button.textContent = "Sorry, this is not a valid humble bundle games page!";
            return false;
        } else {
            chrome.tabs.sendMessage(tabs[0].id, {greeting: "getGameNames"}, function (response) {
                allHumbleGameNames = response.response;
            })
        }
        button.remove();
        let tableHeader = '<tr><th>Game</th><th>Current Price</th></tr>';
        document.getElementById("game-list").insertAdjacentHTML('beforeend', tableHeader);
        parseNameData();

    });
};

function parseNameData() {
    $.getJSON('http://api.steampowered.com/ISteamApps/GetAppList/v2/', processNameData);
}

function processNameData(data) {
    let allSteamGames = data.applist.apps;
    for (let i = 0; i < allSteamGames.length; i++) {
        for (let j = 0; j < allHumbleGameNames.length; j++) {
            if (allSteamGames[i].name === allHumbleGameNames[j]) {
                let gameId = allSteamGames[i].appid;
                allViableHumbleGameIds.push(gameId);
                let newGameRow = '<tr class="entry"><td class="game-link-cell"><a class = game-link target="_blank" href="">' + allHumbleGameNames[j].toString() + '</a></td><td class = "game-price"></td></tr>';
                document.getElementById("game-list").insertAdjacentHTML('beforeend', newGameRow);
                document.getElementsByClassName("game-link").item(allViableHumbleGameIds.length - 1).href = "https://store.steampowered.com/app/" + gameId;
                break;
            }
        }
    }
    getPrices();
}

function getPrices() {
    for (let i = 0; i < allViableHumbleGameIds.length; i++) {
        parsePrices(allViableHumbleGameIds[i]);
    }
}

function injectPrices() {
    for (let j = 0; j < allViableHumbleGameData.length; j++) {
        let price = allViableHumbleGameData[j][allViableHumbleGameIds[j]].data.price_overview.final;
        price = price / 100;
        document.getElementsByClassName("game-price").item(j).textContent = "$" + price;
}
}

function parsePrices(gameId) {
    $.getJSON('https://store.steampowered.com/api/appdetails/?appids=' + gameId + '&cc=CA&filters=price_overview', processPriceData);
}

function processPriceData(data) {
    allViableHumbleGameData.push(data);

    if (allViableHumbleGameIds.length === allViableHumbleGameData.length) {
        injectPrices();
    }
}
