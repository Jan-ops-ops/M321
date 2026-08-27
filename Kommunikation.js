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

    const Stationws = new WebSocket("ws://192.168.103.0:2026/api");
    const Teamws = new WebSocket("ws://192.168.103.0:2026/api");

    Stationws.onmessage = (event) => {
        Teamws.onopen = () => {
    console.log("connected");
    {
        const data = { source: "Elyse Terminal", msg: event };
        console.log("client -> server: " + JSON.stringify(data));
        Teamws.send(JSON.stringify(data));
    }
    };
    };

    Teamws.onmessage = (event) => {
        Stationws.onopen = () => {
    console.log("connected");
    {
        const data = { source: "Jan Ship", msg: event };
        console.log("client -> server: " + JSON.stringify(data));
        Stationws.send(JSON.stringify(data));
    }
    };
    };


}

start();
