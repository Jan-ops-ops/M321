
async function start() {
    while (true) {
        
        await move_to_station("Azura Station");

        let current_cockpit = await cockpit();
        let credits = current_cockpit.hold.credits;

        await buy("Azura Station", "IRON", Math.floor(credits/5))

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
    


async function move_to_station(station)
{
    await fetch('http://192.168.103.0:2009/set_target', {
                method: 'POST',
                body: JSON.stringify({ target: station })
            });
    let arrived = false;
    do {
        let res = await fetch('http://192.168.103.0:2011/stations_in_reach');
        let space = await res.json();
        if(space.stations && station in space.stations)
            arrived = true;
    }while (!arrived)
}
async function sell(station, resource, amount)
{
    await fetch('http://192.168.103.0:2011/sell', {
        method: 'POST',
        body: JSON.stringify({ station: station, what: resource, amount: amount })});
}
async function buy(station, resource, amount) {
    await fetch('http://192.168.103.0:2011/buy', {
        method: 'POST',
        body: JSON.stringify({ station: station, what: resource, amount: amount })});
}
async function cockpit() {
    res = await fetch('http://192.168.103.0:2012/hold');
    return await res.json();
}


start();