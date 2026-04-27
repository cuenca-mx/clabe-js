/* eslint-disable */
const clabe = require('../lib/index.js');
const {
  BANKS,
  BANK_NAMES,
  validateClabe,
  computeControlDigit,
  getBankName,
  getBankNameOrThrow,
  generateNewClabes,
  addBank,
  removeBank,
} = clabe;
const { expect } = require('chai');


const VALID_CLABE = '002000000000000008';
const INVALID_CLABE_CONTROL_DIGIT = '002000000000000007';
const INVALID_CLABE_BANK_CODE = '000000000000000000';  // Control digit es valido


describe('computeControlDigit', function () {
  it('should compute control digit correct', function () {
    expect(computeControlDigit(VALID_CLABE.substring(0, 17)))
      .to.equal(VALID_CLABE.substring(17));
  });
});

describe('validateClabe', function () {
  it('should return a boolean', function () {
    expect(typeof validateClabe(VALID_CLABE)).to.equal('boolean');
  });
  it('should return true if clabe is valid', function () {
    expect(validateClabe(VALID_CLABE)).to.be.true;
  });
  it('should return false if clabe is invalid and control digit is valid', function () {
    expect(validateClabe(INVALID_CLABE_CONTROL_DIGIT)).to.be.false;
  });
  it('should return false if clabe is invalid and control digit exist', function () {
    expect(validateClabe(INVALID_CLABE_BANK_CODE)).to.be.false;
  });
});

describe('getBankName', function () {
  it('should return bank name if the first 3 digits belong to one', function () {
    expect(getBankName(VALID_CLABE)).to.equal('Banamex');
  });
  it('returns null if CLABE is null', function () {
    expect(getBankName(null)).to.equal(null);
  });
  it('returns null if CLABE is undefined', function () {
    expect(getBankName(undefined)).to.equal(null);
  });
  it('returns null if CLABE is empty', function () {
    expect(getBankName('')).to.equal(null);
  });
  it('returns null if CLABE is shorter than 3 chars', function () {
    expect(getBankName('00')).to.equal(null);
  });
  it('returns null if CLABE is not a string', function () {
    expect(getBankName(123)).to.equal(null);
  });
  it('returns null if bank code is not registered', function () {
    expect(getBankName('999000000000000000')).to.equal(null);
  });
  it('resolves Cuenca for code 723', function () {
    expect(getBankName('723770415826867674')).to.equal('Cuenca');
  });
});

describe('getBankNameOrThrow', function () {
  it('returns bank name if code exists', function () {
    expect(getBankNameOrThrow(VALID_CLABE)).to.equal('Banamex');
  });
  it('throws when bank code is unknown', function () {
    expect(() => getBankNameOrThrow(INVALID_CLABE_BANK_CODE)).to.throw(Error);
  });
  it('throws when CLABE is null', function () {
    expect(() => getBankNameOrThrow(null)).to.throw(Error);
  });
  it('throws when CLABE is too short', function () {
    expect(() => getBankNameOrThrow('00')).to.throw(Error);
  });
});

describe('addBank / removeBank', function () {
  const TEST_CODE = '40999';
  const TEST_NAME = 'Test Bank';

  afterEach(function () {
    removeBank(TEST_CODE);
  });

  it('addBank registra el banco y getBankName lo encuentra', function () {
    addBank(TEST_CODE, TEST_NAME);
    expect(getBankName('999000000000000000')).to.equal(TEST_NAME);
    expect(BANKS['999']).to.equal(TEST_CODE);
    expect(BANK_NAMES[TEST_CODE]).to.equal(TEST_NAME);
  });

  it('addBank trim-ea el nombre del banco', function () {
    addBank(TEST_CODE, '   Spaced Bank   ');
    expect(BANK_NAMES[TEST_CODE]).to.equal('Spaced Bank');
  });

  it('addBank rechaza códigos que no son 5 dígitos', function () {
    expect(() => addBank('123', 'X')).to.throw(TypeError);
    expect(() => addBank('123456', 'X')).to.throw(TypeError);
    expect(() => addBank('abcde', 'X')).to.throw(TypeError);
    expect(() => addBank(40999, 'X')).to.throw(TypeError);
    expect(() => addBank(null, 'X')).to.throw(TypeError);
  });

  it('addBank rechaza nombres vacíos o no-string', function () {
    expect(() => addBank(TEST_CODE, '')).to.throw(TypeError);
    expect(() => addBank(TEST_CODE, '   ')).to.throw(TypeError);
    expect(() => addBank(TEST_CODE, null)).to.throw(TypeError);
    expect(() => addBank(TEST_CODE, 123)).to.throw(TypeError);
  });

  it('removeBank elimina el banco', function () {
    addBank(TEST_CODE, TEST_NAME);
    removeBank(TEST_CODE);
    expect(BANKS['999']).to.equal(undefined);
    expect(BANK_NAMES[TEST_CODE]).to.equal(undefined);
    expect(getBankName('999000000000000000')).to.equal(null);
  });

  it('removeBank elimina por código ABM de 3 dígitos', function () {
    addBank(TEST_CODE, TEST_NAME);
    removeBank('999');
    expect(BANKS['999']).to.equal(undefined);
    expect(BANK_NAMES[TEST_CODE]).to.equal(undefined);
  });

  it('removeBank no borra por sufijo si el código Banxico no está registrado', function () {
    addBank(TEST_CODE, TEST_NAME);
    removeBank('99999');
    expect(BANKS['999']).to.equal(TEST_CODE);
    expect(BANK_NAMES[TEST_CODE]).to.equal(TEST_NAME);
  });

  it('removeBank no borra el ABM si no coincide con el código Banxico de 5 dígitos', function () {
    addBank(TEST_CODE, TEST_NAME);
    try {
      BANKS['999'] = '50000';
      removeBank(TEST_CODE);
      expect(BANKS['999']).to.equal('50000');
      expect(BANK_NAMES[TEST_CODE]).to.equal(TEST_NAME);
    } finally {
      BANKS['999'] = TEST_CODE;
      removeBank(TEST_CODE);
    }
  });

  it('removeBank es idempotente cuando el banco no existe', function () {
    expect(() => removeBank('99999')).to.not.throw();
    expect(() => removeBank('')).to.not.throw();
    expect(() => removeBank(null)).to.not.throw();
  });
});

describe('generateNewClabes', function () {
  it('genera N CLABEs válidas con el prefijo dado', function () {
    const prefix = '002000';
    const clabes = generateNewClabes(5, prefix);
    expect(clabes).to.have.lengthOf(5);
    clabes.forEach(function (c) {
      expect(c).to.have.lengthOf(18);
      expect(c.startsWith(prefix)).to.be.true;
      expect(validateClabe(c)).to.be.true;
    });
  });

  it('regresa CLABEs únicas', function () {
    const clabes = generateNewClabes(50, '002000');
    expect(new Set(clabes).size).to.equal(50);
  });

  it('rechaza numberOfClabes inválido', function () {
    expect(() => generateNewClabes(0, '002000')).to.throw(TypeError);
    expect(() => generateNewClabes(-1, '002000')).to.throw(TypeError);
    expect(() => generateNewClabes(1.5, '002000')).to.throw(TypeError);
    expect(() => generateNewClabes('5', '002000')).to.throw(TypeError);
  });

  it('rechaza prefix no numérico', function () {
    expect(() => generateNewClabes(1, 'abc')).to.throw(TypeError);
    expect(() => generateNewClabes(1, 123)).to.throw(TypeError);
  });

  it('rechaza prefix demasiado largo', function () {
    expect(() => generateNewClabes(1, '123456789012345678')).to.throw(RangeError);
  });

  it('acepta prefix de 17 dígitos (un solo hueco para dígito de control)', function () {
    const prefix = '00200000000000000';
    const clabes = generateNewClabes(1, prefix);
    expect(clabes).to.have.lengthOf(1);
    expect(validateClabe(clabes[0])).to.be.true;
  });

  it('rechaza pedir más CLABEs de las posibles', function () {
    expect(() => generateNewClabes(100, '00200000000000000')).to.throw(RangeError);
  });
});

describe('bancos sincronizados con clabe-python', function () {
  const NEW_BANKS = [
    ['124', '40124', 'Citi Mexico'],
    ['167', '40167', 'Hey Banco'],
    ['714', '90714', 'PPBALANCEMX'],
    ['715', '90715', 'Cashi Cuenta'],
    ['720', '90720', 'MexPago'],
    ['721', '90721', 'Albo'],
    ['722', '90722', 'Mercado Pago W'],
    ['725', '90725', 'COOPDESARROLLO'],
    ['727', '90727', 'Transfer directo'],
    ['728', '90728', 'Spin by OXXO'],
    ['729', '90729', 'Dep y Pag Dig'],
    ['730', '90730', 'Swap'],
    ['732', '90732', 'Peibo'],
    ['734', '90734', 'Finco Pay'],
    ['738', '90738', 'Fintoc'],
  ];

  NEW_BANKS.forEach(function ([abm, banxico, name]) {
    it(`incluye ${name} (${banxico})`, function () {
      expect(BANKS[abm]).to.equal(banxico);
      expect(BANK_NAMES[banxico]).to.equal(name);
    });
  });

  it('40138 ya no es ABC Capital sino Uala', function () {
    expect(BANK_NAMES['40138']).to.equal('Uala');
  });

  it('90661 ya no es ALTERNATIVOS sino KLAR', function () {
    expect(BANK_NAMES['90661']).to.equal('KLAR');
  });

  it('90706 ya no es Arcus sino Arcus Fi', function () {
    expect(BANK_NAMES['90706']).to.equal('Arcus Fi');
  });

  it('40143 ya no es CI Banco sino CIBanco', function () {
    expect(BANK_NAMES['40143']).to.equal('CIBanco');
  });

  it('37166 ya no es Babien sino BaBien', function () {
    expect(BANK_NAMES['37166']).to.equal('BaBien');
  });

  it('90684 ya no es Opm sino Transfer', function () {
    expect(BANK_NAMES['90684']).to.equal('Transfer');
  });

  it('90608 (Vector) fue removido', function () {
    expect(BANKS['608']).to.equal(undefined);
    expect(BANK_NAMES['90608']).to.equal(undefined);
  });
});
