var Promise = require('bluebird');
var uuid = require('uuid');

var transport = require('./transport');


/*
var transportRegister = function(service,name,cb) {
    var mockCode = 'SVC:' + service + '|||' + name;
    transport.on(mockCode, function(args, mockResponse) {
        var cmdPromise = Promise.resolve(cb(args));
        cmdPromise.then(function(val) { transport.emit(mockResponse,null,val) });
        cmdPromise.error(function(err) { transport.emit(mockResponse,err,null )});
    });
};

var transportSend = function(service, name, args) {
    var responseUUID = uuid.v1();

    var mockCode = 'SVC:' + service + '|||' + name;
    var mockResponse = 'SVC:' + service + '|||' + name + "|||" + responseUUID;

    return new Promise(function(resolve, reject) {
        transport.emit(mockCode, args, mockResponse);
        transport.once(mockResponse, function(err,result) {
            if(err) { return reject(err); }
            return resolve(result);
        })
    }).timeout(5000);
};
*/


var registerService = function(service, cb) {
    var icanSrv = {
        can: function(name,cb) {
            transport.listen(service, name, function(args, done) {
                var cmdPromise = Promise.resolve(cb(args)).timeout(5000);
                cmdPromise.then(function(result) { done(null, result) });
                cmdPromise.error(function(err) { done(err) });
            });
            //transportRegister(serviceName,name,cb);
        }
    };

    cb(icanSrv);

}; 

var service = function(service) {
    return {
        do: function(name, arg) {
            return new Promise(function(resolve, reject) {
                transport.send(service, name, arg, function(err, result) {
                    if(err) return reject(err);
                    return resolve(result);
                });
            });
            //return transportSend(serviceName, name, args);
        }
    }
};

module.exports = {
    registerService: registerService,
    service: service
};