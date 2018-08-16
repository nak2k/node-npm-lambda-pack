const { depsThumbprint, packDeps } = require('pack-deps');
const packlist = require('npm-packlist');
const parallel = require('run-parallel');
const { readFile, stat } = require('fs');
const { join } = require('path');
const { createHash } = require('crypto');

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
  }, (err, result) => {
    if (err) {
      return callback(err);
    }

    let { cacheFile, thumbprint, zip } = result;

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
          files.map(f => addFileIntoZip.bind(null, zip, f, pkgDir)),
          (err, statsList) => {
            /*
             * Update thumbprint from statsList.
             */
            const md5 = createHash('md5');

            md5.update(thumbprint);

            statsList
              .sort(({ file: left }, { file: right }) =>
                left < right ? -1 : left === right ? 0 : 1
              )
              .forEach(({ stats: { mtime, size } }) =>
                md5.update(`${size};${mtime}`)
              );

            thumbprint = md5.digest('hex');

            callback(err, { thumbprint, zip });
          }
        )
      })
  })
}

function addFileIntoZip(zip, file, dir, callback) {
  const file2 = join(dir, file);

  stat(file2, (err, stats) => {
    if (err) {
      return callback(err);
    }

    readFile(file2, (err, data) => {
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

      callback(null, {
        file,
        stats,
      });
    });
  });
}

/*
 * Exports.
 */
exports.depsThumbprint = depsThumbprint;
exports.pack = pack;
