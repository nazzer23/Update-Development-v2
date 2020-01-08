import { webSocketUrl } from './config.api.js';

var ws = new WebSocket(webSocketUrl);

ws.onopen = () => {
    console.log("Connected");
}

ws.onerror = error => {
    console.log(`WebSocket error: ${error}`)
}

connection.onmessage = e => {
    console.log(e.data)
}