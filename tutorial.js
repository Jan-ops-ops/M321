import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

import { move_to_station, sell, buy, cockpit } from './utils.js';

async function start() {
    while (true) {
        await move_to_station("Azura Station");
        
        let current_cockpit = await cockpit();
        let credits = current_cockpit.hold.credits;
        
        await buy("Azura Station", "IRON", Math.floor(credits/5));
        
        current_cockpit = await cockpit();
        let cargo = current_cockpit.hold.resources.IRON;
        
        if(cargo >= 12) break;
        
        await move_to_station("Core Station");
        await sell("Core Station", "IRON", cargo);
    }
    
    await fetch(`http://${process.env.API_IP}:2009/set_target`, { 
        method: 'POST', 
        body: JSON.stringify({ target: {x: 7000, y: 7000} }) 
    });
}

start();
