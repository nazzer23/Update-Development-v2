import { webSocketUrl } from './config.api.js';

var ws = new WebSocket(webSocketUrl);

ws.onopen = () => {
    console.log("Connected");
}

ws.onerror = error => {
    console.log(`WebSocket error: ${error}`)
}

ws.onmessage = e => {
    console.log(e.data)

    let socketData = JSON.parse(e.data);

    console.log(socketData.cmd);

    switch (socketData.cmd) {
        case "sessionRequest":
            let resp = {
                "cmd": "authUser",
                "data": {
                    "userid": localStorage.getItem("userID"),
                    "token": localStorage.getItem("token")
                }
            };
            ws.send(JSON.parse(resp))
            break;
        case "auth":
            if (socketData.success) {
                this.authenticated = true;
            } else {
                this.authenticated = false;
                // TODO: Logout

                //localStorage.removeItem("userID");
                //localStorage.removeItem("token");
            }
            break;
        case "updateNotifications":
            const {notifCount, msgCount, friendCount} = socketData.data;

            $("#requestCount").text(friendCount);
            $("#messageCount").text(msgCount);
            $("#notifCount").text(notifCount);
            break;
    }
}

export function sendWebsocketMsg (msg) {
    waitForSocketConnection(ws, function(){
        ws.send(msg);
    });
}

function waitForSocketConnection(socket, callback){
    setTimeout(
        function () {
            if (socket.readyState === 1) {
                console.log("Connection is made")
                if (callback != null){
                    callback();
                }
            } else {
                console.log("wait for connection...")
                waitForSocketConnection(socket, callback);
            }

        }, 5); // wait 5 milisecond for the connection...
}

