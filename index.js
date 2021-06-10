const net = require('net');

const server = net.createServer(connection => {

  connection.on('data', data => {
    const txtData = data.toString();
    process.stdout.write(txtData + '\n\n\n')

    connection.write(`HTTP/1.1 200 OK\n\n${txtData}`)
    connection.end();
  })

})

server.on('error', error => {
  process.stdout.write(`[ERROR]: ${error.message}`);
})

server.listen(process.env.PORT || 3000, 'localhost')
