[![Build Status](https://travis-ci.com/cuenca-mx/clabe-js.svg?branch=master)](https://travis-ci.com/cuenca-mx/clabe-js)
[![Coverage Status](https://coveralls.io/repos/github/cuenca-mx/clabe-js/badge.svg?branch=validate)](https://coveralls.io/github/cuenca-mx/clabe-js?branch=validate)
# clabe.js

Librería para validar y calcular un número CLABE basado en https://es.wikipedia.org/wiki/CLABE

## Instalación

```
npm install
```

## Pruebas

Para ejecutar las pruebas

```
$ npm test
```

## Uso básico

Obtener el dígito de control de un número CLABE

```JavaScript
import clabe
clabe.computeControlDigit('00200000000000000')
```

Para validar si un número CLABE es válido

```JavaScript
import clabe
clabe.validateClabe('002000000000000008')
```

Para obtener el banco a partir de 3 dígitos

```JavaScript
import clabe
clabe.getBankName('002000000000000008')
```
