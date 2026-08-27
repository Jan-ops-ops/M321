import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

export async function move_to_station(station) {
    await fetch(`http://${process.env.API_IP}:2009/set_target`, { 
        method: 'POST', 
        body: JSON.stringify({ target: station }) 
    });
    
    let arrived = false;
    do {
        let res = await fetch(`http://${process.env.API_IP}:2011/stations_in_reach`);
        let space = await res.json();
        if(space.stations && station in space.stations) arrived = true;
    } while (!arrived);
}

export async function sell(station, resource, amount) {
    await fetch(`http://${process.env.API_IP}:2011/sell`, { 
        method: 'POST', 
        body: JSON.stringify({ station: station, what: resource, amount: amount })
    });
}

export async function buy(station, resource, amount) {
    await fetch(`http://${process.env.API_IP}:2011/buy`, { 
        method: 'POST', 
        body: JSON.stringify({ station: station, what: resource, amount: amount })
    });
}

export async function cockpit() {
    let res = await fetch(`http://${process.env.API_IP}:2012/hold`);
    return await res.json();
}
