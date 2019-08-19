/* eslint-disable */
var validateClabe = require('../lib/index.js').validateClabe;
var getBankName = require('../lib/index.js').getBankName;
var computeControlDigit = require('../lib/index.js').computeControlDigit;
var assert = require('chai').assert;
var expect = require('chai').expect;


const VALID_CLABE = '002000000000000008';
const INVALID_CLABE_CONTROL_DIGIT = '002000000000000007';
const INVALID_CLABE_BANK_CODE = '000000000000000000';  // Control digit es valido


describe('computeControlDigit', function(){
  it('should compute control digit correct', function(){
    expect(computeControlDigit(VALID_CLABE.substring(0, 17))).to.equal(VALID_CLABE.substring(17));
  });
});

describe('validateClabe', function(){
  it('should return a boolean',  function(){
    expect(typeof validateClabe(VALID_CLABE)).to.equal("boolean");
  });
  it('should return true if clabe is valid',  function(){
    expect(validateClabe(VALID_CLABE)).to.be.true;
  });
  it("should return false if clabe is invalid and control digit is valid",  function(){
    expect(validateClabe(INVALID_CLABE_CONTROL_DIGIT)).to.be.false;
  });
  it('should return false if clabe is invalid and control digit exist',  function(){
    expect(validateClabe(INVALID_CLABE_BANK_CODE)).to.be.false;
  });
});
describe('getBankName', function(){
  it("Should return bank name if the first 3 digits belong to one", function(){
    expect(getBankName(VALID_CLABE)).to.equal('Banamex');
  });
  it('should give an error for invalid clabe', function(){
    expect(()=> new getBankName(INVALID_CLABE_BANK_CODE)).to.throw(Error);
  });
});
