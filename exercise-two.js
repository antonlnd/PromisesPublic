'use strict';

var Promise = require('bluebird'),
    async = require('async'),
    exerciseUtils = require('./utils');

var readFile = exerciseUtils.readFile,
    promisifiedReadFile = exerciseUtils.promisifiedReadFile,
    blue = exerciseUtils.blue,
    magenta = exerciseUtils.magenta;

var args = process.argv.slice(2).map(function(st){ return st.toUpperCase(); });

module.exports = {
  problemA: problemA,
  problemB: problemB,
  problemC: problemC,
  problemD: problemD,
  problemE: problemE
};

// runs every problem given as command-line argument to process
args.forEach(function(arg){
  var problem = module.exports['problem' + arg];
  if (problem) problem();
});

function problemA () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * A. log poem two stanza one and stanza two, in any order
   *    but log 'done' when both are done
   *    (ignore errors)
   *    note: reads are occurring in parallel (simultaneously)
   *
   */

  // // callback version
  // async.each(['poem-two/stanza-01.txt', 'poem-two/stanza-02.txt'],
  //   function (filename, eachDone) {
  //     readFile(filename, function (err, stanza) {
  //       console.log('-- A. callback version --');
  //       blue(stanza);
  //       eachDone();
  //     });
  //   },
  //   function (err) {
  //     console.log('-- A. callback version done --');
  //   }
  // );

  // promise version
  var promiseA = promisifiedReadFile('poem-two/stanza-01.txt').then(blue);
  var promiseB = promisifiedReadFile('poem-two/stanza-02.txt').then(blue);
  Promise.all([
    promiseA,
    promiseB
  ])
  .then(function () {
    console.log('done');
  });

}

function problemB () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * B. log all the stanzas in poem two, in any order
   *    and log 'done' when they're all done
   *    (ignore errors)
   *    note: reads are occurring in parallel (simultaneously)
   *
   */

  var filenames = [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
    return 'poem-two/' + 'stanza-0' + n + '.txt';
  });

  // // callback version
  // async.each(filenames,
  //   function (filename, eachDone) {
  //     readFile(filename, function (err, stanza) {
  //       console.log('-- B. callback version --');
  //       blue(stanza);
  //       eachDone();
  //     });
  //   },
  //   function (err) {
  //     console.log('-- B. callback version done --');
  //   }
  // );

  // // promise version
  // var arrayOfPromises = filenames.map(function (name) {
  //   return promisifiedReadFile(name).then(blue);
  // });
  // Promise.all(arrayOfPromises)
  // .then(function () {
  //   console.log('done');
  // });

  // bluebird Promise.map version
  Promise.map(filenames, function(fileName) {
    return promisifiedReadFile(fileName).then(blue)
  })
  .then(function () {
    console.log('done');
  });

}

function problemC () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * C. read & log all the stanzas in poem two, *in order*
   *    and log 'done' when they're all done
   *    (ignore errors)
   *    note: reads are occurring in series (only when previous finishes)
   *
   */

  var filenames = [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
    return 'poem-two/' + 'stanza-0' + n + '.txt';
  });

  // // callback version
  // async.eachSeries(filenames,
  //   function (filename, eachDone) {
  //     readFile(filename, function (err, stanza) {
  //       console.log('-- C. callback version --');
  //       blue(stanza);
  //       eachDone();
  //     });
  //   },
  //   function (err) {
  //     console.log('-- C. callback version done --');
  //   }
  // );

  // bluebird promise version
  Promise.each(filenames, function (fileName) {
    return promisifiedReadFile(fileName).then(blue);
  })
  .then(function () {
    console.log('done');
  });

}

function problemD () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * D. log all the stanzas in poem two, *in order*
   *    making sure to fail for any error and log it out
   *    and log 'done' when they're all done
   *    note: reads are occurring in series (only when previous finishes)
   *
   */

  var filenames = [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
    return 'poem-two/' + 'stanza-0' + n + '.txt';
  });
  var randIdx = Math.floor(Math.random() * filenames.length);
  filenames[randIdx] = 'wrong-file-name-' + (randIdx + 1) + '.txt';

  // // callback version
  // async.eachSeries(filenames,
  //   function (filename, eachDone) {
  //     readFile(filename, function (err, stanza) {
  //       console.log('-- D. callback version --');
  //       if (err) return eachDone(err);
  //       blue(stanza);
  //       eachDone();
  //     });
  //   },
  //   function (err) {
  //     if (err) magenta(err);
  //     console.log('-- D. callback version done --');
  //   }
  // );

  // // build promise chain immediately, each step waits for previous to complete
  // // each step starts next read-then-green cycle
  // var chain = Promise.resolve();
  // filenames.forEach(function(fileName) {
  //   chain = chain.then(function(){
  //     return promisifiedReadFile(fileName).then(green);
  //   });
  // });
  // chain.catch(red).then(done);

  // // compact answer
  // Promise.reduce(filenames, function (total, item) {
  //   return promisifiedReadFile(item).then(green);
  // }, null).catch(red).then(done);

  // bluebird Promise.each version
  Promise.each(filenames, function (fileName) {
    return promisifiedReadFile(fileName).then(blue);
  })
  .catch(magenta)
  .then(function () {
    console.log('done');
  })

// All below are  DIFFERENT from question but WORTH EXAMINING:

  // // (different from question): read in parallel, wait until all done, log
  // // results in order, skip entirely if any errors, log done as last bit
  // // this is a very typical use case

  // // Try to understand this:
  // Promise.all(filenames.map(promisifiedReadFile)).then(function(results){
  //   results.forEach(green);
  // })
  // .catch(red)
  // .then(done);

  // // (simpler version of previous)
  // Promise.map(filenames, promisifiedReadFile).each(green).catch(red).then(done);

  // // really fancy: all start in parallel;
  // // log results in order as fast as possible.
  // var promises = filenames.map(promisifiedReadFile);
  // var chain = Promise.resolve();
  // promises.forEach(function(promise){
  //   chain = chain.then(function(){
  //     return promise.then(green);
  //   });
  // });
  // chain.catch(red).then(done);

  // // even better version of above
  // Promise.reduce(filenames.map(promisifiedReadFile), function(chain, stanza){
  //   green(stanza);
  // }, null).catch(red).finally(done);

  // // maybe as good as it gets?
  // Promise.each(filenames.map(promisifiedReadFile), green).catch(red).then(done);

}

function problemE () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * E. make a promisifed version of fs.writeFile
   *
   */

  // promisifiedWriteFile returns a promise
  // the promise is resolved if the async writefile succeeds
  // the promise is rejected if the async writefile fails

  var fs = require('fs');
  function promisifiedWriteFile (filename, str) {
    return new Promise(function completer (resolve, reject) {
      fs.writeFile(filename, str, function (err, data) {
        if (err) reject('otherthing');
        else resolve('foobar');
      });
    });
  }

    // example: should show 'I ❤ Promises' in green, stored in written.txt
  promisifiedWriteFile('written.txt', 'I ❤ Promises')
  .then(function(){
    return promisifiedReadFile('written.txt');
  })
  .then(green)
  .catch(red);
}
