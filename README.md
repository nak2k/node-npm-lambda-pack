# npm-lambda-pack

`npm pack` for Lambda.

## Installation

```
npm i npm-lambda-pack
```

## Usage

``` javascript
const { pack } = require('npm-lambda-pack');

pack({
  pkgJson: require('path/to/lambda/package.json'),
  pkgDir: 'path/to/lambda',
}), (err, esult) => {
  // ...
});
```

## pack(options, callback)

- `options.pkgJson`
  - `package.json` that dependencies are packed.
- `options.pkgDir`
  - A path that the `package.json` is located.
- `options.cacheBaseDir`
  - A path of a base directory that cache a packed package on.
- `options.exclude`
  - A glob pattern of files that are not add into the zip file.
- `callback(err, result)`
  - A function that is callback when packing is completed.
  - `err` - An Error object when an error is occured.
  - `result.zip` - An instance of the [JSZip](http://stuk.github.io/jszip/documentation/api_jszip/constructor.html).

## Related

- [npm-lambda](https://github.com/nak2k/node-npm-lambda)

## License

MIT
