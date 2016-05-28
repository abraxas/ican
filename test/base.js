var chai = require('chai');
var expect = chai.expect;
var Promise = require('bluebird');


var Offer = require('../offer');

describe('simple test', function() {
    it('can and do just work', function() {
        Offer.registerService('test1', function (offer) {
            offer.to('hello', function () {
                return new Promise(function(resolve) {
                    setTimeout(function() {
                        resolve('world');
                    });
                });
            });
        });

        return Offer.service('test1').do('hello').then(function (result) {
            expect(result).to.exist;
            expect(result).to.equal('world');
        });

    });
});