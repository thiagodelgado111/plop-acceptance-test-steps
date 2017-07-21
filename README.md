# plop - acceptance test steps
A generator to create step definitions for automated acceptance tests.

## Usage
1. Install plop globally:

`yarn global add plop` or `npm install -g plop`

2. Install `plop-acceptance-test-steps` in your project:

`yarn add --dev plop-acceptance-test-steps` or `npm install --save-dev plop-acceptance-test-steps`

3. Create a `plopfile.js` in the root folder of your project, and require `plop-acceptance-test-steps`:

```javascript
  module.exports = require('plop-acceptance-test-steps');
```

  or

```javascript
  const acceptanceTestsGenerator = require('plop-acceptance-test-steps');
  
  module.exports = function (plop) {
    ...
    acceptanceTestsGenerator(plop);
    ...
  };
```

## Contributing
To contribute, please open an issue or directly file a PR :)

## License
MIT
