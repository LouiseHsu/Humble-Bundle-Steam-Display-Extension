// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let runButton = document.getElementById('run-button');
let settingsButton = document.getElementById("settings-button");
let namesOnPage = [];
let viableGameData = [];
let nameIdHash = [];
let currCountry = "CA";

const arrayColumn = (arr, n) => arr.map(x => x[n]);

$(function () {
    chrome.tabs.query({'active': true, 'currentWindow': true}, function (tabs) {
        let currURL = tabs[0].url;
        if (!currURL.includes("https://www.humblebundle.com/games")) {
            window.close();
        }
    });

    runButton.onclick = function () {
        $('#loading').css({"zIndex" : "5"});
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

function runApp() {
    chrome.tabs.query({'active': true, 'currentWindow': true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {greeting: "getGameNames"}, function (response) {
            namesOnPage = response.response;
            parseNameData();
        });
    })
}

function parseNameData() {
    $.getJSON('http://api.steampowered.com/ISteamApps/GetAppList/v2/', processAndInject);
}

function processAndInject(nameData) {
    let tableHeader = '<tr id="table-header"><th>Game Name</th><th>Price</th></tr>';
    let tableList = $('#game-list');
    let allSteamGames = nameData.applist.apps;

    settingsButton.remove();
    runButton.remove();
    tableList.append(tableHeader);

    for (let i = 0; i < allSteamGames.length; i++) {
        for (let j = 0; j < namesOnPage.length; j++) {
            if (allSteamGames[i].name === namesOnPage[j] || allSteamGames[i].name.replace(/[^a-zA-Z0-9]/g, '') === namesOnPage[j].replace(/[^a-zA-Z0-9]/g, '')) {
                let gameId = allSteamGames[i].appid;
                let newGameRow = '<tr class="entry"><td class="game-link-cell"><a class = game-link target="_blank" href="">' + namesOnPage[j].toString() + '</a></td><td class = "game-price"></td></tr>';
                nameIdHash.push([namesOnPage[j], gameId, namesOnPage[j].replace(/[^a-zA-Z0-9]/g, '')]);
                tableList.append(newGameRow);
                $(".game-link").get(nameIdHash.length - 1).href = "https://store.steampowered.com/app/" + gameId;
                break;
            }
        }
    }

    let unParsedGames = namesOnPage.filter(x => !arrayColumn(nameIdHash, 0).includes(x));
    document.getElementById("size-manager").insertAdjacentHTML('beforeend', '<hr><table id="failed-list"><tr id="failed-table-header"><th>Unparsed Games</th></tr></table>');
    for (let i = 0; i < unParsedGames.length; i++) {
        document.getElementById("failed-list").insertAdjacentHTML('beforeend', '<tr class="entry"><td class="failed-game">' + unParsedGames[i] + '</td></tr>')
    }

    getPrices();
}

function getPrices() {
    $.each(nameIdHash, function (index) {
        parsePrices(nameIdHash[index][1]);
    });
}

function parsePrices(gameId) {
    $.ajax({
        async: false,
        dataType: "json",
        url: 'https://store.steampowered.com/api/appdetails/?appids=' + gameId + '&cc=' + currCountry + '&filters=price_overview',
        success: processPriceData
    });
}

function processPriceData(data) {
    viableGameData.push(data);

    if (nameIdHash.length === viableGameData.length) {
        injectPrices();
    }
}

function injectPrices() {
    for (let j = 0; j < viableGameData.length; j++) {
        let key = Object.keys(viableGameData[j]);
        let price = viableGameData[j][key].data.price_overview.final;
        price = price / 100;
        nameIdHash[j].push(price);
        $(".game-price").get(j).textContent = "$" + price;
    }
    document.getElementById('loading').style.zIndex = "-1";
    document.getElementById("content").style.height = window.getComputedStyle(document.getElementById("size-manager")).height;

    sendDataToBackground();
}

function sendDataToBackground() {
    chrome.tabs.query({'active': true, 'currentWindow': true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            greeting: "injectLinks",
            datatable: nameIdHash
        });
    })
}


