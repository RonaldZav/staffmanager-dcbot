const fs = require('fs');
const yaml = require('js-yaml');

module.exports = class Settings {
	static Settings () {
        try {
            const contenidoYAML = fs.readFileSync('./src/settings.yml', 'utf8');
            const datosJSON = yaml.load(contenidoYAML);
            return datosJSON;
        } catch (error) {
            logger.log(`Error leyendo los datos de config.yml:`, "error");
            console.log(error);
        }
    }
    
    static Messages () {
        try {
            const contenidoYAML = fs.readFileSync('./src/settings.yml', 'utf8');
            const datosJSON = yaml.load(contenidoYAML);
            return datosJSON.messages;

        } catch (error) {
            logger.log(`Error leyendo los datos de config.yml:`, "error");
            console.log(error);
        }
    }
}