// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let button = document.getElementById('testbutton');

button.onclick = function (element) {
    setup();
};

function setup() {
  //  $.getJSON('https://store.steampowered.com/api/appdetails/?appids=582010&cc=CA&filters=price_overview', gotData);
    $.ajax({
        url: 'https://store.steampowered.com/api/appdetails/?appids=582010&cc=CA&filters=price_overview',
        dataType: 'jsonp',
        jsonp: 'callback',
        jsonpCallback: 'gotData',
        success: function () {
            alert("success");
        }
    });
}

function gotData(data) {
    console.log(data);
}