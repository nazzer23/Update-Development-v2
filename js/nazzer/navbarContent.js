/**
 * Update Social 2019
 * Written by Ben Vernazza
 */

import { Log } from './modules/logger.js';
import { Main } from './init.js';

import * as websocket from './websocketConnect.js';

import { apiUrl, getNotifications } from './config.api.js';

function init() {
    Main();
    Log("NavbarContent is alive.");
}

function checkNotifications() {
    let req = {
        "cmd": "getNotifications"
    }
    websocket.sendWebsocketMsg(JSON.stringify(req));
}

websocket.addEventHandler("message", function(event)) {
    if(websocket.authenticated) {
        checkNotifications();
    }
}

/*
function checkNotifications() {
    $.ajax({
        url: apiUrl + getNotifications,
        method: "POST",
        context: this,
        dataType: "json",
        data: {
            sessionString: localStorage.getItem("token"),
            userID: localStorage.getItem("userID")
        },
        success: function (data) {
            const {notifCount, msgCount, friendCount} = data;
            $("#requestCount").text(friendCount);
            $("#messageCount").text(msgCount);
            $("#notifCount").text(notifCount);
        }
    });
}*/

// Event Handlers
window.onload = () => init();

//setInterval(() => checkNotifications(), 5000);