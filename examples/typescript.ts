import { MCP9808, MCP9808_Configuration } from './../index'

let sensor = new MCP9808();
let config: MCP9808_Configuration;

startLoop();

async function startLoop() {
    sensor.readConfig().then((result) => {
        console.log("config " + result);
    });
    
    while (true){
        sensor.readTemp()
        .then((temp) => {
            console.log("temp " + temp);
        })
        .catch((reason) => {
            console.log("error " + reason);
        });

        await delay(1000);
    }
}


function delay(ms: number) {
    return new Promise<void>(function(resolve) {
        setTimeout(resolve, ms);
    });
}