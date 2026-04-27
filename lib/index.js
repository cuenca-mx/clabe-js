const { BANKS, BANK_NAMES } = require('./banks.js');

const CLABE_LENGTH = 18;
const CLABE_WEIGHTS = [3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7];
const BANXICO_CODE_REGEX = /^\d{5}$/;

function isANumber(str) {
  return typeof str === 'string' && str.length > 0 && !/\D/.test(str);
}

function computeControlDigit(clabe) {
  /*
  Compute CLABE control digit according to
    https://es.wikipedia.org/wiki/CLABE#D.C3.ADgito_control
  */
  const clabeInt = clabe.split('').map((i) => Number(i));
  const weighted = [];

  for (let i = 0; i < CLABE_LENGTH - 1; i++) {
    weighted.push(clabeInt[i] * CLABE_WEIGHTS[i] % 10);
  }
  const summed = weighted.reduce((curr, next) => curr + next) % 10;
  const controlDigit = (10 - summed) % 10;
  return controlDigit.toString();
}

function validateClabe(clabe) {
  /*
  Validate CLABE according to
    https://es.wikipedia.org/wiki/CLABE#D.C3.ADgito_control
  */
  return isANumber(clabe) &&
    clabe.length === CLABE_LENGTH &&
    {}.hasOwnProperty.call(BANKS, clabe.substring(0, 3)) &&
    clabe.substring(CLABE_LENGTH - 1) === computeControlDigit(clabe);
}

function getBankName(clabe) {
  /*
  Devuelve el nombre del banco basado en los primeros 3 dígitos.
  Devuelve null si la entrada es nula/vacía o si el código no está registrado.
  Para mantener el comportamiento previo (lanzar excepción), usar getBankNameOrThrow.
  */
  if (typeof clabe !== 'string' || clabe.length < 3) return null;
  const code = clabe.substring(0, 3);
  const bankName = BANK_NAMES[BANKS[code]];
  return bankName === undefined ? null : bankName;
}

function getBankNameOrThrow(clabe) {
  /*
  Versión estricta de getBankName. Lanza Error si la CLABE es inválida o si el
  código no está registrado. Equivalente al comportamiento de getBankName antes
  de la versión 1.3.0.
  */
  if (typeof clabe !== 'string' || clabe.length < 3) {
    throw new Error('CLABE inválida: debe ser un string de al menos 3 caracteres');
  }
  const code = clabe.substring(0, 3);
  const bankName = BANK_NAMES[BANKS[code]];
  if (bankName === undefined) {
    throw new Error('Ningún banco tiene este código ' + code);
  }
  return bankName;
}

function generateNewClabes(numberOfClabes, prefix) {
  /*
  Port de clabe-python.generate_new_clabes. Genera `numberOfClabes` CLABEs
  válidas usando el `prefix` indicado. El prefix incluye el código de banco
  (3 dígitos) y, opcionalmente, dígitos adicionales de cuenta.
  */
  if (!Number.isInteger(numberOfClabes) || numberOfClabes <= 0) {
    throw new TypeError('numberOfClabes debe ser un entero positivo');
  }
  if (typeof prefix !== 'string' || !isANumber(prefix)) {
    throw new TypeError('prefix debe ser un string numérico');
  }
  const missing = CLABE_LENGTH - prefix.length - 1;
  if (missing < 0) {
    throw new RangeError('prefix demasiado largo: no queda espacio para generar la CLABE');
  }
  const totalCount = Math.pow(10, missing);
  if (totalCount < numberOfClabes) {
    throw new RangeError('No hay suficientes combinaciones únicas para el prefix dado');
  }

  const seen = new Set();
  const clabes = [];
  while (clabes.length < numberOfClabes) {
    const section = Math.floor(Math.random() * totalCount);
    const padded = missing === 0 ? '' : String(section).padStart(missing, '0');
    if (seen.has(padded)) continue;
    seen.add(padded);
    const partial = prefix + padded;
    clabes.push(partial + computeControlDigit(partial));
  }
  return clabes;
}

function addBank(bankCodeBanxico, bankName) {
  /*
  Port de clabe-python.add_bank. Registra dinámicamente un nuevo banco.
  Lanza TypeError si el código no es un string de 5 dígitos o si el nombre
  está vacío.
  */
  if (typeof bankCodeBanxico !== 'string' || !BANXICO_CODE_REGEX.test(bankCodeBanxico)) {
    throw new TypeError('bankCodeBanxico debe ser un string de exactamente 5 dígitos');
  }
  if (typeof bankName !== 'string') {
    throw new TypeError('bankName debe ser un string no vacío');
  }
  const trimmed = bankName.trim();
  if (trimmed.length === 0) {
    throw new TypeError('bankName debe ser un string no vacío');
  }
  BANKS[bankCodeBanxico.slice(-3)] = bankCodeBanxico;
  BANK_NAMES[bankCodeBanxico] = trimmed;
}

function removeBank(bankCodeBanxico) {
  /*
  Port de clabe-python.remove_bank. Idempotente: silencioso si no existe.
  Con código Banxico de 5 dígitos, solo borra si BANK_NAMES y BANKS coinciden.
  */
  if (typeof bankCodeBanxico !== 'string' || bankCodeBanxico.length < 3) return;

  if (bankCodeBanxico.length === 3) {
    if (!isANumber(bankCodeBanxico)) return;
    const key3 = bankCodeBanxico;
    if (!{}.hasOwnProperty.call(BANKS, key3)) return;
    const full = BANKS[key3];
    delete BANKS[key3];
    delete BANK_NAMES[full];
    return;
  }

  if (!{}.hasOwnProperty.call(BANK_NAMES, bankCodeBanxico)) return;
  const key3 = bankCodeBanxico.slice(-3);
  if (!{}.hasOwnProperty.call(BANKS, key3) || BANKS[key3] !== bankCodeBanxico) {
    return;
  }
  delete BANKS[key3];
  delete BANK_NAMES[bankCodeBanxico];
}

module.exports = {
  BANKS,
  BANK_NAMES,
  validateClabe,
  computeControlDigit,
  getBankName,
  getBankNameOrThrow,
  generateNewClabes,
  addBank,
  removeBank,
};
