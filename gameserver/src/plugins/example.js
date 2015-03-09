/**
 * Created by santi8ago8 on 09/03/15.
 */

var Plugin = require('./../plugin').Plugin;

class ExamplePlug extends Plugin {
    constructor() {
        super();
        this.on('enabled', this.enabled);
    }

    enabled() {
        this.logger.info('I was enabled');
    }
}

ExamplePlug.version = 0.1;

module.exports.ExamplePlug = ExamplePlug;