/**
 * Created by santi8ago8 on 27/02/15.
 */

var EventEmitter3 = require('./').EventEmitter3,
    util = require('util');


function User(e) {
    EventEmitter3.prototype.constructor.apply(this, arguments);
}

util.inherits(User, EventEmitter3);

User.prototype.playGuitar = function () {

    this.emitpre('play', this, function (err, res) {
        if (!err) {

            console.log('user is playing guitar');
            this.emit('play', res);

        }
    });

    return this;
};

function playEvent() {

    console.log('user is playing Event!!!')

}

var u = new User({
    maxListeners: 0
})
    .on('play', playEvent)
    .playGuitar()
    .pre('play', function (data, next) {
        console.log('pre executed');
        next(null, data);
    })
    .playGuitar();