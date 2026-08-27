import dotenv from 'dotenv';
dotenv.config();
import { move_to_station, sell, buy, cockpit } from './utils.js';  

import websocket from "websocket";
const WebSocket = websocket.w3cwebsocket;

async function start() {
    await fetch(`http://${process.env.API_IP}:2009/set_target`, { 
        method: 'POST', 
        body: JSON.stringify({ target: {x: -70565, y: 72811} }) // -70565/72811 : 4446/4340
    });

    const Stationws = new WebSocket(`ws://${process.env.API_IP}:2026/api`);
    const Teamws = new WebSocket(`ws://${process.env.API_IP}:5000/api`);

    Stationws.onopen = () => {
        console.log("Verbunden mit Stationws (Port 2026)");
    };
    Teamws.onopen = () => {
        console.log("Verbunden mit Teamws (Port 5000)");
    };

    Stationws.onmessage = (event) => {
        console.log("Stationws empfangen: " + event.data);

        if (Teamws.readyState === WebSocket.OPEN) {
            const data = { source: "Elyse Terminal", msg: event.data }; 
            console.log("Leite weiter an Teamws: " + JSON.stringify(data));
            Teamws.send(JSON.stringify(data));
        }
    };

    Teamws.onmessage = (event) => {
        console.log("Teamws empfangen: " + event.data);

        if (Stationws.readyState === WebSocket.OPEN) {
            const data = { source: "Jan Ship", msg: event.data }; 
            console.log("Leite weiter an Stationws: " + JSON.stringify(data));
            Stationws.send(JSON.stringify(data));
        }
    };


}

start();
