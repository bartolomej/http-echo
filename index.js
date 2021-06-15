const net = require('net');

const PORT = process.env.PORT || 3000;
const MAX_HISTORY = process.env.MAX_HISTORY || 20;

const history = [];

const server = net.createServer(connection => {

  function sendHttpResponse(strData) {
    connection.write(`HTTP/1.1 200 OK\n\n${strData}`)
    connection.end();
  }

  function logHistory(data) {
    if (history.length > MAX_HISTORY) {
      history.splice(0, 1);
    }
    history.push(data);
  }

  connection.on('data', data => {
    const strData = data.toString();

    // log every incoming message to stdout
    process.stdout.write(strData + '\n\n')

    const httpReq = parseHttpMessage(strData);

    if (httpReq && httpReq.path === '/history') {
      sendHttpResponse(history.reverse().join("\n\n"));
    } else {
      sendHttpResponse(strData);
    }

    // store current request data to history
    logHistory(strData);
  })

  connection.on('error', error => {
    process.stderr.write(`[ERROR]: ${error}\n`);
  })

})

server.on('error', error => {
  process.stdout.write(`[ERROR]: ${error.message}`);
})

server.listen(PORT);

function parseHttpMessage(strData) {
  const httpMatch = strData.match(/ HTTP/);
  if (!httpMatch) {
    return null;
  }
  const req = strData.substring(0, httpMatch.index);
  const [method, path] = req.split(" ");
  return {method, path};
}
