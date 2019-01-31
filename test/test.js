var index = require('../clabe/index.js')
var assert = require('assert');
var assert = require('chai').assert;
var expect = require('chai').expect;


let VALID_CLABE = '002000000000000008';
let INVALID_CLABE_CONTROL_DIGIT = '002000000000000007';
let INVALID_CLABE_BANK_CODE = '000000000000000000';  // Control digit es valido



describe('validateClabe', function(){
  it('should return a boolean',  function(){
    expect(typeof validateClabe(VALID_CLABE)).to.equal("boolean");
  });
  it('should return true if clabe  is valid',  function(){
    expect(validateClabe(VALID_CLABE)).to.be.true;
  });
  it('should return false if clabe is not valid',  function(){
    expect(validateClabe(INVALID_CLABE_CONTROL_DIGIT)).to.be.false;
  });
  it('should return false if clabe is invalid and control digit exist',  function(){
    expect(validateClabe(INVALID_CLABE_BANK_CODE)).to.be.false;
  });
});
