var chai = require('chai');
var expect = chai.expect;
var Promise = require('bluebird');



var ican = require('../ican');

describe('simple test', function() {
    it('can and do just work', function() {
        ican.registerService('test1', function(i) {
            i.can('hello', function() {
                return new Promise(function(resolve) {
                    setTimeout(function() {
                        resolve('world');
                    });
                });
            });
        });

        return ican.service('test1').do('hello').then(function(result) {
            expect(result).to.exist;
            expect(result).to.equal('world');
        });

    });
});