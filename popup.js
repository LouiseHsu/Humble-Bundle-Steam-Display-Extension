// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let button = document.getElementById('testbutton');

button.onclick = function (element) {
    // for each dd caption w/ 20 px height....
    chrome.tabs.query({ 'active': true, 'currentWindow': true }, function (tabs) {
        var currURL = tabs[0].url;
        if (!currURL.includes("https://www.humblebundle.com/games")) {
            button.textContent = "Sorry, this is not a valid humble bundle games page!";
            return false;
        } else {
            chrome.tabs.sendMessage(tabs[0].id, { greeting: "getGameNames" }, function (response) {
                console.log(response.matches);
            })
        }
    })
  

    setup();
};

function setup() {
    $.getJSON('https://store.steampowered.com/api/appdetails/?appids=582010&cc=CA&filters=price_overview', gotData);
}

function gotData(data) {
    console.log(data);
}