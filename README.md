# mcp9808-sensor

[<img src="https://cdn-shop.adafruit.com/1200x900/1782-00.jpg" width="150" align="right">](https://www.adafruit.com/product/1782)

Welcome to mcp9808-sensor, a Node.js I2C module for the Microchip MCP98089 digital thermometer. Adafruit sells a [MCP9808 breakout board](https://www.adafruit.com/product/1782) and [here is the datasheet](http://ww1.microchip.com/downloads/en/DeviceDoc/25095A.pdf).

This module uses [i2c-bus](https://github.com/fivdi/i2c-bus) which should provide access with Node.js on Linux boards like the Raspberry Pi Zero, 1, 2, or 3, BeagleBone, BeagleBone Black, or Intel Edison.

## I2C Address

The default I2C address is ```0x18```. You can change the address by tying a conbination of the ```A0 A1 A2``` pins to VDD. Each pin of the ```A0 A1 A2``` set adds an offset to the base address of ```0x18```

| Pin  | Offset  | 
|---|---|
| ```A0```  | ```1```  |
| ```A1```  | ```2```  |
| ```A2```  | ```4```  |