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
    
    await fetch('http://192.168.103.0:2009/set_target', { 
        method: 'POST', 
        body: JSON.stringify({ target: {x: 7000, y: 7000} }) 
    });
}

start();
