const test = require('tape');
const { pack } = require('..');
const { dirname } = require('path');
const { tmpdir } = require('os');

test('test pack', t => {
  t.plan(2);

  pack({
    pkgJson: require('..'),
    pkgDir: dirname(__dirname),
    cacheBaseDir: tmpdir(),
  }, (err, zip) => {
    t.error(err);
    t.equal(Object.keys(zip.files).length, 4);
  });
});
