import { webSocketUrl, userAuthenticated } from './config.api.js';

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

    switch(socketData.cmd) {
        case "sessionRequest":
            let resp = {
                "cmd": "authUser",
                "data": {
                    "userid" : localStorage.getItem("userID"),
                    "token" : localStorage.getItem("token")
                }
            };
            ws.send(JSON.stringify(resp));
            break;
        case "auth":
            if(socketData.success) {
                userAuthenticated = true;
                console.log(userAuthenticated)
            } else {
                // TODO: Logout

                //localStorage.removeItem("userID");
                //localStorage.removeItem("token");
            }
    }

}