var Promise = require('bluebird');
var uuid = require('uuid');

var transport = require('./transport');


/*
var transportRegister = function(service,name,cb) {
    var mockCode = 'SVC:' + service + '|||' + name;
 transport.on(mockCode, function(arg, mockResponse) {
 var cmdPromise = Promise.resolve(cb(arg));
        cmdPromise.then(function(val) { transport.emit(mockResponse,null,val) });
        cmdPromise.error(function(err) { transport.emit(mockResponse,err,null )});
    });
};

 var transportSend = function(service, name, arg) {
    var responseUUID = uuid.v1();

    var mockCode = 'SVC:' + service + '|||' + name;
    var mockResponse = 'SVC:' + service + '|||' + name + "|||" + responseUUID;

    return new Promise(function(resolve, reject) {
 transport.emit(mockCode, arg, mockResponse);
        transport.once(mockResponse, function(err,result) {
            if(err) { return reject(err); }
            return resolve(result);
        })
    }).timeout(5000);
};
*/


var registerService = function(service, cb) {
    var offerSrv = {
        to: function (name, cb) {
            transport.rpcListen(service, name, function (arg, done) {
                var cmdPromise = Promise.resolve(cb(arg)).timeout(5000);
                cmdPromise.then(function(result) { done(null, result) });
                cmdPromise.error(function(err) { done(err) });
            });
        },
        did: function (name, subname, arg) {
            transport.broadcastSend(service, name, subname, arg);
        }
    };

    cb(offerSrv);

}; 

var service = function(service) {
    return {
        do: function(name, arg) {
            return new Promise(function(resolve, reject) {
                transport.rpcSend(service, name, arg, function (err, result) {
                    if(err) return reject(err);
                    return resolve(result);
                });
            });
            //return transportSend(serviceName, name, arg);
        }
    }
};

module.exports = {
    registerService: registerService,
    service: service
};