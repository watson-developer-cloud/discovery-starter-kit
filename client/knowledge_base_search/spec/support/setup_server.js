import { spawn } from 'child_process';

// child_process.kill() doesn't kill children processes
// so let's monkey patch a method to kill our server
casper.kill_server = (callback) => {
  let ppid = casper.server.pid;
  let killer = spawn('pkill', ['-9', '-P', ppid]);

  killer.on('exit', (code, signal) => {
    casper.log(`PPID ${ppid} killed`, 'debug');

    if (callback) {
      callback();
    }
  });
}

// monkey patch a screenshots directory
casper.screenshots_dir = 'tmp/screenshots';
// print output to console
casper.options.verbose = true;
// set this to 'debug' or 'info' if you want more info printed
casper.options.logLevel = 'error';
// increase the timeout
casper.options.waitTimeout = 10000;
// add array.find polyfill
casper.options.clientScripts.push('./node_modules/phantomjs-polyfill-find/find-polyfill.js');
// add array.findIndex polyfill
casper.options.clientScripts.push('./node_modules/phantomjs-polyfill-find-index/findIndex-polyfill.js');

casper.test.setUp((done) => {
  let server = spawn('python', [ '../../server/python/server.py' ]);
  casper.log(`spawning server with ppid [${server.pid}]`, 'debug');
  casper.server = server;
  // make sure the server exits when this process exits
  casper.on('exit', (code) => {
    casper.log(`casper exiting with code [${code}]`, 'debug');
    casper.kill_server();
  });

  // log messages from browser console
  casper.on('remote.message', (message) => {
    casper.log(message, 'debug');
  });

  server.stdout.on('data', (data) => {
    casper.log(`[server][out] ${data}`, 'debug');
  });

  server.stderr.on('data', (data) => {
    casper.log(`[server][err] ${data}`, 'debug');
    const match = /Running on (.+) \(/.exec(data);
    if (match) {
      const url = match[1].trim();
      casper.log(`Server started on ${url}, ending setup`, 'debug');
      // when the server is running, set the URL to connect to
      casper.server_url = url;
      done();
    }
  });
});

casper.test.tearDown((done) => {
  casper.kill_server(done);
});
