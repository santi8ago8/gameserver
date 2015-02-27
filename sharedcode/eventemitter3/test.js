/**
 * Created by santi8ago8 on 27/02/15.
 */

var EventEmitter3 = require('./').EventEmitter3;


var emitter = new EventEmitter3();

emitter
    .on('data', function (obj) {
        console.log('event data executed', obj);
    })
    .pre('data', function (data, next) {

        console.log('pre one executed');
        data.pre = 0;
        next(null, data);

    })
    .pre('data', function (data, next) {
        console.log('pre two executed (async test)');
        data.pre++;
        setTimeout(function () {
            console.log('end pre two');
            next(null, data);
        }, 300);


    })
    .pre('data', function (data, next) {
        console.log('pre three executed');
        next(null, data);
    });
preError = function (data, next) {
    console.log('pre with error (intercept event)');
    next(new Error('Error in data!'), data);
};
emitter.pre('data', preError);
var dataEvent = {name: 'Alycia'};

emitter.emitpre('data', dataEvent, function (err, result) {
    console.log('emitpre end', arguments);
    if (!err) {

        //do actions like write in db.

        emitter.emit('data', result);
    } else {
        console.log(err.toString());
    }
});

//remove error
emitter.removePreListener('data', preError);

emitter.emitpre('data', dataEvent, function (err, result) {
    console.log('emitpre end', arguments);
    if (!err) {

        //do actions like write in db.

        emitter.emit('data', result);
    } else {
        console.log(err.toString());
    }
});

