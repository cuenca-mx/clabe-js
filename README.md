[![Build Status](https://travis-ci.com/cuenca-mx/clabe-js.svg?branch=master)](https://travis-ci.com/cuenca-mx/clabe-js)
[![Coverage Status](https://coveralls.io/repos/github/cuenca-mx/clabe-js/badge.svg?branch=validate)](https://coveralls.io/github/cuenca-mx/clabe-js?branch=validate)

# clabe-js

Librería para validar, generar y resolver el banco de un número CLABE en
México (https://es.wikipedia.org/wiki/CLABE). Mantiene paridad funcional con
[clabe-python](https://github.com/cuenca-mx/clabe-python).

Incluye tipos TypeScript publicados en `lib/index.d.ts`.

## Instalación

```
npm install clabe-js
```

## Uso

```js
const clabe = require('clabe-js');

clabe.computeControlDigit('00200000000000000');
// => '8'

clabe.validateClabe('002000000000000008');
// => true

clabe.getBankName('002000000000000008');
// => 'Banamex'

clabe.getBankName('999000000000000000');
// => null  (código no registrado)

clabe.getBankName(null);
// => null  (entrada inválida)
```

### `getBankName` vs `getBankNameOrThrow`

A partir de la versión `1.3.0`, `getBankName` **no lanza excepciones**:
devuelve `null` si la CLABE es nula/vacía/no-string o si el código de banco
no está registrado. Esto simplifica el caso muy común de renderizar UI a
partir de campos opcionales.

Si necesitas el comportamiento estricto previo (lanzar `Error` cuando el
código no existe), usa `getBankNameOrThrow`:

```js
try {
  clabe.getBankNameOrThrow('999000000000000000');
} catch (err) {
  // Error: Ningún banco tiene este código 999
}
```

### Generar CLABEs

```js
const clabes = clabe.generateNewClabes(5, '002000');
// => 5 CLABEs válidas que empiezan con '002000'
```

### Registrar / remover bancos en runtime

```js
clabe.addBank('40999', 'Test Bank');
clabe.getBankName('999000000000000000'); // => 'Test Bank'

clabe.removeBank('40999');
clabe.getBankName('999000000000000000'); // => null
```

`addBank` valida que `bankCodeBanxico` sea un string de exactamente 5
dígitos y que `bankName` no sea vacío después de `trim()`.

## Desarrollo

```
npm install
npm test
npm run lint
```
