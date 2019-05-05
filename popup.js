// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let runButton = document.getElementById('run-button');
let settingsButton = document.getElementById("settings-button");
let namesOnPage = [];
let gameDataArray = [];
let currCountry = "CA";

$(function () {
    chrome.tabs.query({'active': true, 'currentWindow': true}, function (tabs) {
        let currURL = tabs[0].url;
        if (!currURL.includes("https://www.humblebundle.com/games")) {
            window.close();
        }
    });

    runButton.onclick = function () {
        runApp();
    };

    settingsButton.onclick = function () {
        $('#settings').css({"zIndex" : "5", "display" : "block"});
        $('body').css({'width' : '150px'});

        document.getElementById("back-button").onclick = function () {
            $('#settings').css({"zIndex" : "-1", "display" : "none"});
            $('body').css({'width' : '100%'}).removeAttr('width');

        };

        let countryList = $("#country-list");
        countryList.onchange = function () {
            currCountry = countryList.options[countryList.selectedIndex].value;
        }
    }
});

function showLoadingScreen() {
    $('#loading').css({"zIndex" : "5"});
}

function removeLoadingScreen() {
    document.getElementById('loading').style.zIndex = "-1";
}

function smoothResize() {
    document.getElementById("content").style.height = window.getComputedStyle(document.getElementById("size-manager")).height;
    document.getElementById("content").style.width = window.getComputedStyle(document.getElementById("size-manager")).width;
}

function runApp() {
    showLoadingScreen();
    parseNames();
}

function parseNames() {
    chrome.tabs.query({'active': true, 'currentWindow': true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {greeting: "getGameNames"}, function (response) {
            namesOnPage = response.response;
            grabNameData();
        });
    })
}

function grabNameData() {
    $.getJSON('http://api.steampowered.com/ISteamApps/GetAppList/v2/', generateLinkTable);
}

function generateLinkTable(nameData) {
    processAndInject(nameData);
    handleUnparsedGames();

    removeLoadingScreen();
    smoothResize();
    sendDataToBackground();
}

function removeLandingPage() {
    settingsButton.remove();
    runButton.remove();
}

function processAndInject(nameData) {
    let tableHeader = '<tr id="table-header"><th>Game Name</th><th>Price</th></tr>';
    let tableList = $('#game-list');
    let allSteamGames = nameData.applist.apps;

    removeLandingPage();
    tableList.append(tableHeader);

    for (let i = 0; i < allSteamGames.length; i++) {
        for (let j = 0; j < namesOnPage.length; j++) {
            let normalizedGameName = normalizeString(namesOnPage[j]);
            if (allSteamGames[i].name === namesOnPage[j] || normalizeString(allSteamGames[i].name) === normalizedGameName) {
                console.log(namesOnPage[j]);
                let gameId = allSteamGames[i].appid;
                let gameObj =
                    {
                        name: namesOnPage[j],
                        id: gameId,
                        normalizedName : normalizedGameName,
                        price : getGamePrice(gameId)
                    };
                gameDataArray.push(gameObj);

                let newGameRow = createNewGameRow(gameObj);
                tableList.append(newGameRow);
                break;
            }
        }
    }
    console.log(gameDataArray);
    console.log(allSteamGames)
}

function getGamePrice(gameId) {
    let price = 0;
    $.ajax({
        async: false,
        dataType: "json",
        url: 'https://store.steampowered.com/api/appdetails/?appids=' + gameId + '&cc=' + currCountry + '&filters=price_overview',
        success: function (data) {
            let key = Object.keys(data);
            if (data[key].data.length === 0) {
                price = 0.00;
            } else {
                price = data[key].data.price_overview.final;
                price = price / 100;
            }
        }
    });
    return price;
}

function createNewGameRow(gameObj) {
    let rowElement = document.createElement("tr");
    rowElement.classList.add('entry');

    let gameLinkElement = document.createElement('td');
    gameLinkElement.classList.add('game-link-cell');

    let linkElement = document.createElement('a');
    linkElement.classList.add('game-link');
    linkElement.target = "_blank";
    linkElement.href = "https://store.steampowered.com/app/" + gameObj.id;
    linkElement.textContent = gameObj.name;

    let gamePriceElement = document.createElement('td');
    gamePriceElement.classList.add('game-price');
    gamePriceElement.textContent = "$" + gameObj.price;

    gameLinkElement.appendChild(linkElement);
    rowElement.appendChild(gameLinkElement);
    rowElement.appendChild(gamePriceElement);

    return rowElement;
}

function handleUnparsedGames() {
    let unParsedGames = namesOnPage.filter(x => !gameDataArray.map(game => game.name).includes(x));

    if (unParsedGames.length !== 0) {
        let tableElement = createFailedTable();
        for (let i = 0; i < unParsedGames.length; i++) {
            let failedRow = createFailedRow(unParsedGames[i]);
            tableElement.appendChild(failedRow);
        }
    }
}

function createFailedTable() {
    let hrElement = document.createElement('hr');

    let tableElement = document.createElement('table');
    tableElement.id = "failed-list";

    let trElement = document.createElement('tr');
    trElement.id = "failed-table-header";

    let thElement = document.createElement('th');
    thElement.textContent = "Unparsed Games";

    trElement.appendChild(thElement);
    tableElement.appendChild(trElement);

    let sizeManager = document.getElementById("size-manager");
    sizeManager.appendChild(hrElement);
    sizeManager.appendChild(tableElement);

    return tableElement;
}

function createFailedRow(failedGameName) {
    let failedRow = document.createElement('tr');
    failedRow.classList.add("entry");

    let failedCell = document.createElement('td');
    failedCell.classList.add("failed-game");
    failedCell.textContent = failedGameName;

    failedRow.appendChild(failedCell);
    return failedRow;
}

function sendDataToBackground() {
    chrome.tabs.query({'active': true, 'currentWindow': true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            greeting: "injectLinks",
            datatable: gameDataArray
        });
    })
}

function normalizeString(string) {
    return string.replace(/[^a-zA-Z0-9]/g, '');
}