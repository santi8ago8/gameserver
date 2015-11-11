/**
 * Created by santi8ago8 on 11/11/15.
 */

let request = require('superagent');
var Plugin = require('./../plugin').Plugin;
let _ = require('lodash');

class Attack extends Plugin {
    constructor() {
        super();
    }

    enabled(gs) {
        this.logger.info('Attack plugin enabled');
        this.gs = gs;
        this.on('s:hit', this.hit.bind(this));
    }

    hit(data, socket) {
        //this.logger.info('hit', data);

        let to = _.find(this.gs._players, {_id: data.to});
        let from = _.find(this.gs._players, {_id: data.sender});

        to.health -= Math.floor(Math.random() * 10);

        if (to.health < 0) {
            to.health = 0;
            //TODO: dieeeee...
        }

        //TODO: send updates...

    }

}


Attack.version = 0.1;

module.exports.Attack = Attack;