'use strict';

const Promise = require('bluebird'),
    async = require('async'),
    exerciseUtils = require('./utils');

const readFile = exerciseUtils.readFile,
    promisifiedReadFile = exerciseUtils.promisifiedReadFile,
    blue = exerciseUtils.blue,
    magenta = exerciseUtils.magenta;

const args = process.argv.slice(2).map(function(st){ return st.toUpperCase(); });

module.exports = {
  problemA: problemA,
  problemB: problemB,
  problemC: problemC,
  problemD: problemD,
  problemE: problemE
};

// runs every problem given as command-line argument to process
args.forEach(function(arg){
  const problem = module.exports['problem' + arg];
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
  const promiseA = promisifiedReadFile('poem-two/stanza-01.txt').then(blue);
  const promiseB = promisifiedReadFile('poem-two/stanza-02.txt').then(blue);
  Promise.all([
    promiseA,
    promiseB
  ])
  .then(() => {
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

  const filenames = [1, 2, 3, 4, 5, 6, 7, 8]
  .map(n => `poem-two/stanza-0${n}.txt`);

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

  // promise version
  const arrayOfPromises = filenames
  .map(name => promisifiedReadFile(name).then(blue));
  
  Promise.all(arrayOfPromises)
  .then(() => console.log('done'));

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

  const filenames = [1, 2, 3, 4, 5, 6, 7, 8]
  .map(n => `poem-two/stanza-0${n}.txt`);

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

  // promise version
  const masterPromise = Promise
  .each(filenames, name => promisifiedReadFile(name).then(blue));
  
  masterPromise
  .then(() => console.log('done'));

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

  const filenames = [1, 2, 3, 4, 5, 6, 7, 8]
  .map(n => `poem-two/stanza-0${n}.txt`);
  
  const randIdx = Math.floor(Math.random() * filenames.length);
  filenames[randIdx] = `wrong-file-name-${randIdx + 1}.txt`;

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

  // promise version
  const masterPromise = Promise
  .each(filenames, name => promisifiedReadFile(name).then(blue));
  
  masterPromise
  .catch(magenta)
  .then(() => console.log('done'));

}

function problemE () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * E. make a promisifed version of fs.writeFile
   *
   */

  const fs = require('fs');
  function promisifiedWriteFile (filename, str) {
    return new Promise(function completer (resolve, reject) {
      fs.writeFile(
        filename,
        str,
        (err, data) => err ? reject(err) : resolve(data)
      );
    });
  }
}
