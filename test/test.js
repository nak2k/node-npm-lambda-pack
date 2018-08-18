const test = require('tape');
const { pack } = require('..');
const { dirname } = require('path');
const { tmpdir } = require('os');

test('test pack', t => {
  t.plan(3);

  pack({
    pkgJson: require('..'),
    pkgDir: dirname(__dirname),
    cacheBaseDir: tmpdir(),
  }, (err, result) => {
    const { thumbprint, zip } = result;

    t.error(err);
    t.equal(Object.keys(zip.files).length, 4);
    t.equal(thumbprint.length, 32);
  });
});
