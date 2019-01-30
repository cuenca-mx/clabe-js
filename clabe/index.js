import (BANKS, BANK_NAMES) from ./banks.js

const CLABE_LENGTH = 18;
const CLABE_WEIGHTS = [3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7];

computeControlDigit=(clabe)=>{

  let clabeList = String(clabe).split("");
  let clabeInt = clabeList.map((i) => Number(i))
  let weighted = [];

  for(var i = 0; i < CLABE_LENGTH - 1; i++) {
    weighted.push(clabeInt[i] * CLABE_WEIGHTS[i] % 10);
  }
  let summed = weighted.reduce((curr, next) => curr + next) % 10;
  let controlDigit = (10 - summed) % 10;
    return controlDigit.toString();
}

validateClabe=(clabe)=>{

  return(Boolean(typeof( Number(clabe))==="number" &&
  clabe.length === CLABE_LENGTH &&
  BANKS.hasOwnProperty(clabe.substring(0, 3)) &&
  clabe.substring(CLABE_LENGTH - 1) == computeControlDigit(clabe)))
}

getBankName=(clabe)=>{
  let code = clabe.substring(0,3);
  let bankName = BANK_NAMES[BANKS[code]];

  if (bankName === null){
    return ('Ningún banco tiene código ${code}');
  }
  else{
    return bank;
  }
}
