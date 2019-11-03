/**
 * Update Social 2019
 * Written by Ben Vernazza
 */

import {Log} from './modules/logger.js';
import {Main} from './init.js';
import {apiUrl, loginUrl} from './config.api.js';
import {sessionCheck} from "./config.api.js";

function init() {
    Main();
    Log("LoginHandler is alive.");

    if (localStorage.getItem("token") !== null) {
        const token = localStorage.getItem("token");
        const userID = localStorage.getItem("userID");
        $.ajax({
            url: apiUrl + sessionCheck,
            method: "POST",
            context: this,
            dataType: "json",
            data: {
                session: token,
                userID: userID
            },
            success: function (data) {
                if (data.status) {
                    $.ajax({
                        url: "/gateway.php",
                        method: "POST",
                        context: this,
                        dataType: "json",
                        data: {
                            mode: "jsLogin",
                            userID: localStorage.getItem("userID"),
                            token: localStorage.getItem("token")
                        },
                        success: (data) => {
                            if (data.valid) {
                                window.location = "/";
                            }
                        }
                    });
                } else {
                    localStorage.clear();
                    window.location = "/login.php";
                }
            }
        });
    }
}

function onLoginPress(e) {
    let email = document.getElementById("inputEmail").value;
    let password = document.getElementById("inputPassword").value;

    if (email === "") {
        displayNotification("Please enter your email.", "warning");
    } else if (password === "") {
        displayNotification("Please enter your password.", "warning");
    } else {
        $.ajax({
            url: apiUrl + loginUrl,
            method: "POST",
            context: this,
            dataType: "json",
            data: {strEmail: email, strPassword: password},
            success: function (data) {
                if (data.status == true) {
                    if (typeof (Storage) !== "undefined") {
                        localStorage.setItem("token", data.sessionString);
                        localStorage.setItem("userID", data.userID);

                        // Logs in through web app
                        $.ajax({
                            url: "/gateway.php",
                            method: "POST",
                            context: this,
                            dataType: "json",
                            data: {
                                mode: "jsLogin",
                                userID: localStorage.getItem("userID"),
                                token: localStorage.getItem("token")
                            },
                            success: (data) => {
                                if (data.valid) {
                                    window.location = "/";
                                } else {
                                    displayNotification(data.message, "danger");
                                }
                            }
                        });
                    }
                } else {
                    displayNotification(data.message, "danger");
                }
            }
        });
    }

    e.preventDefault();
}

function displayNotification(msg, type) {
    let notificationDiv = document.getElementById("notifications");

    // Create a new Div Element
    let notifDiv = document.createElement("div");
    notifDiv.className = 'alert alert-' + type;
    notifDiv.innerText = msg;
    var divID = "us_" + Math.floor((Math.random() * 3000) + 1000);
    notifDiv.id = divID;

    notificationDiv.appendChild(notifDiv);
    $("#" + divID).hide();
    $("#" + divID).slideDown();
    setTimeout(() => {
        $("#" + divID).slideUp();
        setTimeout(() => notificationDiv.removeChild(notifDiv), 1000); // Deletes the element from the DOM providing the element has executed slideup
    }, 4000);
}

// Event Handlers
window.onload = () => init();
document.getElementById("loginBtn").onclick = (e) => onLoginPress(e);