'use strict';

const common = require('../common');

// Test https://hackerone.com/reports/735748 is fixed.

const assert = require('assert');
const http = require('http');
const net = require('net');

const REQUEST_BB = `POST / HTTP/1.1
Content-Type: text/plain; charset=utf-8
Host: hacker.exploit.com
Connection: keep-alive
Content-Length: 10
Transfer-Encoding: chunked, eee

HELLOWORLDPOST / HTTP/1.1
Content-Type: text/plain; charset=utf-8
Host: hacker.exploit.com
Connection: keep-alive
Content-Length: 28

I AM A SMUGGLED REQUEST!!!
`;

const server = http.createServer(common.mustNotCall());

server.on('clientError', common.mustCall((err) => {
  assert.strictEqual(err.code, 'HPE_UNEXPECTED_CONTENT_LENGTH');
  server.close();
}));

server.listen(0, common.mustCall(() => {
  const client = net.connect(
    server.address().port,
    common.mustCall(() => {
      client.end(REQUEST_BB.replace(/\n/g, '\r\n'));
    }));
}));
