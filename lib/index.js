const { packDeps } = require('pack-deps');
const packlist = require('npm-packlist');
const parallel = require('run-parallel');
const { readFile, stat } = require('fs');

function pack(options, callback) {
  const {
    pkgJson,
    pkgDir,
    cacheBaseDir,
    exclude,
  } = options;

  /*
   * Pack deps
   */
  packDeps({
    pkgJson,
    pkgDir,
    production: true,
    cacheBaseDir,
    compression: 'DEFLATE',
    compressionOptions: {
      level: 9,
    },
    exclude,
  }, (err, { cacheFile, zip }) => {
    if (err) {
      return callback(err);
    }

    /*
     * Find files to add into the zip. 
     */
    packlist({ path: pkgDir })
      .catch(err => callback(err))
      .then(files => {
        /*
         * Add the files into the zip. 
         */
        parallel(
          files.map(f => addFileIntoZip.bind(null, zip, f)),
          (err, result) => callback(err, zip));
      })
  })
}

function addFileIntoZip(zip, file, callback) {
  stat(file, (err, stats) => {
    if (err) {
      return callback(err);
    }

    readFile(file, (err, data) => {
      if (err) {
        return callback(err);
      }

      zip.file(file, data, {
        mode: stats.mode,
        date: new Date(stats.mtime),
        compression: 'DEFLATE',
        compressionOptions: {
          level: 9,
        },
      });

      callback(null);
    });
  });
}

/*
 * Exports.
 */
exports.pack = pack;
