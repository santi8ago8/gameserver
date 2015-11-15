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
        let multiply = 1;
        if (data.skill) {
            multiply = data.skill;
        }

        if (to && from) {

            to.data.health -= Math.floor(1 + Math.random() * 10 * multiply);

            if (to.data.health < 0) {
                to.data.health = 0;
                //TODO: dieeeee...
            }

            this.gs.plugins.Player.syncHealth(to);
        }
    }

}


Attack.version = 0.1; 

module.exports.Attack = Attack;