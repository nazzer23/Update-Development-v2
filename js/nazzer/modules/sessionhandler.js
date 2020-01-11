import { Log } from "./logger.js";
import { apiUrl, sessionCheck } from "../config.api.js";

export function checkIfSessionValid() {
    Log("Checking if token is valid.");

    if (localStorage.getItem("token") == null) {
        Log("Token isn't set.");
    } else {
        Log("Token is set. Validating...");
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
            success: function(data) {
                if (data.status) {
                    Log("Token is valid.");
                } else {
                    localStorage.clear();
                    window.location = "/login.php";
                }
            }
        });
    }
}
