import * as I2C from 'i2c-bus'

enum Registers {
    Config = 0x01,
    Alert_Upper = 0x2,
    Alert_Lower = 0x3,
    Alert_Critical = 0x4,
    Temp = 0x5,
    Manufacturer_Id = 0x6,
    Device_Id = 0x7,
    Resolution = 0x8
}

export enum MCP9808_Configuration{
    Alert_Mode = 0x001,
    Alert_Polarity = 0x002,
    Alert_Output_Select = 0x004,
    Alert_Control = 0x008,
    Alert_Status = 0x0010,
    Interrupt_Clear = 0x0020,
    Windows_Lock = 0x0040,
    Critical_Lock = 0x0080,
    Shutdown = 0x0100
}
export class MCP9808 {
    static readonly DEFAULT_I2C_ADDR: number = 0x18;
    static readonly BUFFER_SIZE: number = 2;
    //
    private i2c: I2C.I2cBus;

    /**
     * Create a new instance of the MCP9808 class.
     *
     * @param {number} i2cbus
     *     The number i2c bus number on your microcontroller.
     * @param {number} address
     *     I2C device address.
     */
    public constructor(private i2cbus: number = 1, private address: number = MCP9808.DEFAULT_I2C_ADDR){
        this.i2c = I2C.openSync(i2cbus);
    }

    readConfig(): Promise<MCP9808_Configuration> {
        return new Promise<MCP9808_Configuration>((resolve, reject) => {
            this.i2c.readI2cBlock(this.address, Registers.Config, 2, new Buffer(2), (err, bytesread, result) => {
                if(err) {
                    return reject(err);
                }

                let config: MCP9808_Configuration = this.uint16(result[0], result[1]);
                resolve(config);
            });
        });
    }

    readTemp(): Promise<string> {
        return new Promise((resolve, reject) =>{
            this.i2c.readI2cBlock(this.address, Registers.Temp, 2, new Buffer(2), (err, bytesread, result) => {
                if(err) {
                    return reject(err);
                }

                let rawValue = this.uint16(result[0], result[1]);

                let temp = rawValue & 0x0FFF;
                temp /= 16.0;
                if (rawValue & 0x1000) temp -= 256;

                resolve(temp);
            });
            
        });
    }

    async wake(): Promise<any> {
        let config = await this.readConfig();
        config = config ^ MCP9808_Configuration.Shutdown;

        return new Promise((resolve, reject) =>{
            this.i2c.i2cWrite(this.address, 2, new Buffer([Registers.Config, config]), (err, bytesWritten) => {
                if(err) {
                    return reject(err);
                }

                resolve();
            });
        });
    }

    async shutdown(): Promise<any> {
        let config = await this.readConfig();
        config = config | MCP9808_Configuration.Shutdown;

        return new Promise((resolve, reject) =>{
            this.i2c.i2cWrite(this.address, 2, new Buffer([Registers.Config, config]), (err, bytesWritten) =>{
                if(err) {
                    return reject(err);
                }

                resolve();
            });            
        });
    }

    private uint16(msb, lsb) {
        return msb << 8 | lsb;
    }
}
