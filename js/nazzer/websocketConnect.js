import { webSocketUrl } from "./config.api.js";

export var ws = new WebSocket(webSocketUrl);
export let authenticated = false;

ws.onopen = () => {
    console.log("Connected");
};

window.onclose = () => {
    ws.close();
};

ws.onerror = error => {
    console.log(`WebSocket error: ${error}`);
};

ws.onmessage = e => {
    console.log(e.data);

    if (typeof e.data === "undefined") {
        return;
    }

    let socketData = JSON.parse(e.data);

    console.log(socketData.cmd);

    switch (socketData.cmd) {
        case "sessionRequest":
            let resp = {
                cmd: "authUser",
                data: {
                    userid: localStorage.getItem("userID"),
                    token: localStorage.getItem("token")
                }
            };
            ws.send(JSON.stringify(resp));
            break;
        case "auth":
            if (socketData.success) {
                authenticated = true;
                console.log("Success");
            } else {
                authenticated = false;
                // TODO: Logout

                //localStorage.removeItem("userID");
                //localStorage.removeItem("token");
            }
            break;
        case "updateNotifications":
            const { notifCount, msgCount, friendCount } = socketData.data;

            $("#requestCount").text(friendCount);
            $("#messageCount").text(msgCount);
            $("#notifCount").text(notifCount);
            break;
    }
};

export function sendWebsocketMsg(msg) {
    waitForSocketConnection(ws, function() {
        ws.send(msg);
    });
}

function waitForSocketConnection(socket, callback) {
    setTimeout(function() {
        if (socket.readyState === 1) {
            if (callback != null) {
                callback();
            }
        } else {
            waitForSocketConnection(socket, callback);
        }
    }, 10);
}
