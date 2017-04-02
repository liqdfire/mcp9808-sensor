"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const I2C = require("i2c-bus");
var Registers;
(function (Registers) {
    Registers[Registers["Config"] = 1] = "Config";
    Registers[Registers["Alert_Upper"] = 2] = "Alert_Upper";
    Registers[Registers["Alert_Lower"] = 3] = "Alert_Lower";
    Registers[Registers["Alert_Critical"] = 4] = "Alert_Critical";
    Registers[Registers["Temp"] = 5] = "Temp";
    Registers[Registers["Manufacturer_Id"] = 6] = "Manufacturer_Id";
    Registers[Registers["Device_Id"] = 7] = "Device_Id";
    Registers[Registers["Resolution"] = 8] = "Resolution";
})(Registers || (Registers = {}));
var MCP9808_Configuration;
(function (MCP9808_Configuration) {
    MCP9808_Configuration[MCP9808_Configuration["Alert_Mode"] = 1] = "Alert_Mode";
    MCP9808_Configuration[MCP9808_Configuration["Alert_Polarity"] = 2] = "Alert_Polarity";
    MCP9808_Configuration[MCP9808_Configuration["Alert_Output_Select"] = 4] = "Alert_Output_Select";
    MCP9808_Configuration[MCP9808_Configuration["Alert_Control"] = 8] = "Alert_Control";
    MCP9808_Configuration[MCP9808_Configuration["Alert_Status"] = 16] = "Alert_Status";
    MCP9808_Configuration[MCP9808_Configuration["Interrupt_Clear"] = 32] = "Interrupt_Clear";
    MCP9808_Configuration[MCP9808_Configuration["Windows_Lock"] = 64] = "Windows_Lock";
    MCP9808_Configuration[MCP9808_Configuration["Critical_Lock"] = 128] = "Critical_Lock";
    MCP9808_Configuration[MCP9808_Configuration["Shutdown"] = 256] = "Shutdown";
})(MCP9808_Configuration = exports.MCP9808_Configuration || (exports.MCP9808_Configuration = {}));
class MCP9808 {
    /**
     * Create a new instance of the MCP9808 class.
     *
     * @param {number} i2cbus
     *     The number i2c bus number on your microcontroller.
     * @param {number} address
     *     I2C device address.
     */
    constructor(i2cbus = 1, address = MCP9808.DEFAULT_I2C_ADDR) {
        this.i2cbus = i2cbus;
        this.address = address;
        this.i2c = I2C.openSync(i2cbus);
    }
    /*readConfig(): number {
        let buffer = new Buffer(2);
        this.i2c.readI2cBlockSync(this.address, Registers.Config, 2, buffer);
        let config = this.uint16(buffer[0], buffer[1]);
        return config;

       this.i2c.readI2cBlock(this.address, Registers.Config, 2, new Buffer(2), (err, bytesread, result) => {
                if(err) {
                    return reject(err);
                }

                let config: MCP9808_Configuration = this.uint16(buffer[0], buffer[1]);
                resolve(config);
            });
    }*/
    readConfig() {
        return new Promise((resolve, reject) => {
            this.i2c.readI2cBlock(this.address, Registers.Config, 2, new Buffer(2), (err, bytesread, result) => {
                if (err) {
                    return reject(err);
                }
                let config = this.uint16(result[0], result[1]);
                resolve(config);
            });
        });
    }
    readTemp() {
        return new Promise((resolve, reject) => {
            this.i2c.readI2cBlock(this.address, Registers.Temp, 2, new Buffer(2), (err, bytesread, result) => {
                if (err) {
                    return reject(err);
                }
                let rawValue = this.uint16(result[0], result[1]);
                let temp = rawValue & 0x0FFF;
                temp /= 16.0;
                if (rawValue & 0x1000)
                    temp -= 256;
                resolve(temp);
            });
        });
    }
    wake() {
        return __awaiter(this, void 0, void 0, function* () {
            let config = yield this.readConfig();
            config = config ^ MCP9808_Configuration.Shutdown;
            return new Promise((resolve, reject) => {
                this.i2c.i2cWrite(this.address, 2, new Buffer([Registers.Config, config]), (err, bytesWritten) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                });
            });
        });
    }
    shutdown() {
        return __awaiter(this, void 0, void 0, function* () {
            let config = yield this.readConfig();
            config = config | MCP9808_Configuration.Shutdown;
            return new Promise((resolve, reject) => {
                this.i2c.i2cWrite(this.address, 2, new Buffer([Registers.Config, config]), (err, bytesWritten) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                });
            });
        });
    }
    uint16(msb, lsb) {
        return msb << 8 | lsb;
    }
}
MCP9808.DEFAULT_I2C_ADDR = 0x18;
MCP9808.BUFFER_SIZE = 2;
exports.MCP9808 = MCP9808;
//# sourceMappingURL=index.js.map