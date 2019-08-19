const BANKS = require('./banks.js').BANKS;
const BANK_NAMES = require('./banks.js').BANK_NAMES;

const CLABE_LENGTH = 18;
const CLABE_WEIGHTS = [3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7];

let computeControlDigit=(clabe)=>{
  /*
  Compute CLABE control digit according to
    https://es.wikipedia.org/wiki/CLABE#D.C3.ADgito_control
  */
  let clabeList = String(clabe).split("");
  let clabeInt = clabeList.map((i) => Number(i));
  let weighted = [];

  for(var i = 0; i < CLABE_LENGTH - 1; i++) {
    weighted.push(clabeInt[i] * CLABE_WEIGHTS[i] % 10);
  }
  let summed = weighted.reduce((curr, next) => curr + next) % 10;
  let controlDigit = (10 - summed) % 10;
    return controlDigit.toString();
};

let validateClabe=(clabe)=>{
  /*
  Validate CLABE according to
    https://es.wikipedia.org/wiki/CLABE#D.C3.ADgito_control
  */
  return(isANumber(clabe) &&
  clabe.length === CLABE_LENGTH &&
  {}.hasOwnProperty.call(BANKS, clabe.substring(0, 3))&&
  clabe.substring(CLABE_LENGTH - 1) == computeControlDigit(clabe));
};

let getBankName=(clabe)=>{
  /*
  Regresa el nombre del banco basado en los primeros 3 digitos
    https://es.wikipedia.org/wiki/CLABE#D.C3.ADgito_control
  */
  let code = clabe.substring(0, 3);
  let bankName = BANK_NAMES[BANKS[code]];

  return bankName === undefined?'Ningún banco tiene este código '+ code:bankName;
};
// will return true only if characters in a string are digits
function isANumber(str){
 return !/\D/.test(str);
}

module.exports.BANKS = BANKS;
module.exports.BANK_NAMES = BANK_NAMES;
module.exports.validateClabe = validateClabe;
module.exports.getBankName = getBankName;
module.exports.computeControlDigit =computeControlDigit;
