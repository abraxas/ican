var uuid = require('uuid');

var EventEmitter = require('events').EventEmitter;
var transportEmitter = new EventEmitter();

module.exports = {
    listen: function(service, name, callback) {
        var mockCode = 'SVC:' + service + '|||' + name;
        transportEmitter.on(mockCode, function(args, mockResponse) {
            callback(args, function(err, result) {
                transportEmitter.emit(mockResponse, err, result);
            })
        });
    },
    send: function(service, name, arg, cb) {
        var responseUUID = uuid.v1();

        var mockCode = 'SVC:' + service + '|||' + name;
        var mockResponse = 'SVC:' + service + '|||' + name + "|||" + responseUUID;

        transportEmitter.emit(mockCode, arg, mockResponse);
        transportEmitter.once(mockResponse, cb);
    }
};