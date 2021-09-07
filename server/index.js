const net = require('net');

const PORT = process.env.PORT || 3000;
const MAX_HISTORY = process.env.MAX_HISTORY || 20;

const history = [];

const server = net.createServer(connection => {

  connection.on('data', data => {
    const req = decodeHttpRequest(data);
    const res = sendHttpResponse(connection, {
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    });
    if (!req) return;

    switch (req.endpoint) {
      case "/history":
        return onHistoryRequest(req, res);
      default:
        onDefaultRequest(req, res);
    }

    onRequest(req, res)
  })

  connection.on('error', error => logError(error.message))

})

server.on('error', error => logError(error.message))

server.listen(PORT);

logInfo(`tcp-echo server started on port ${PORT}`);

// REQUEST HANDLERS

function onHistoryRequest (req, res) {
  const searchQuery = req.query.search;
  const body = history
    .filter(e => searchQuery ? new RegExp(searchQuery).test(e.rawData) : true);
  if (acceptsJson(req)) {
    res({ json: body })
  } else {
    res({ text: body.map(e => e.rawData).join("\n\n\n") })
  }
}

function onDefaultRequest (req, res) {
  if (acceptsJson(req)) {
    res({ json: req })
  } else {
    res({ text: req.rawData })
  }
  // store current request data to history
  logHistory(req);
}

function onRequest (req, res) {
  // log every incoming message to stdout
  process.stdout.write(req.rawData + '\n\n')
}

// UTILITY FUNCTIONS

function logHistory (data) {
  if (history.length > MAX_HISTORY) {
    history.splice(0, 1);
  }
  history.push(data);
}

function sendHttpResponse (connection, defaultOptions) {
  return function (options) {
  const merge = key => ({...defaultOptions[key], ...options[key]});
    const mergedOptions = {
      headers: merge("headers"),
      ...options
    }
    connection.write(encodeHttpRequest(mergedOptions))
    connection.end();
  }
}

function encodeHttpRequest ({ text = '', json, code = 200, headers = {} }) {
  const headersStr = Object.keys(headers)
    .map(e => `${e}: ${headers[e]}`)
    .join("\n");
  const body = json ? JSON.stringify(json) : text;
  return `HTTP/1.1 ${code} OK` +
    (headersStr.length > 0 ? `\n${headersStr}` : '') +
    "\n\n" +
    body;
}

function decodeHttpRequest (data) {
  const strData = data.toString();
  const httpMatch = strData.match(/ HTTP/);
  if (!httpMatch) {
    // not a valid HTTP request
    return null;
  }

  const bodySeparatorIndex = strData.indexOf("\n\n");
  const [initialLine, ...headerLines] = strData
    // take whole string if body separator isn't found (there is no body)
    .substring(0, bodySeparatorIndex < 0 ? strData.length : bodySeparatorIndex)
    .split("\n");
  const [method, path, protocol] = initialLine.split(" ");
  const headers = headerLines
    .map(e => {
      const [key, value] = e.split(": ");
      if (!(key && value)) return null;
      return { key, value: parseKeyValue(value) };
    })
    .filter(e => !!e)
    .reduce((p, c) => ({ ...p, [c.key]: c.value }), {});
  const [endpoint, queryStr] = path.split("?")
  const query = queryStr
    ? queryStr
      .split("&")
      .filter(e => !!e) // include only non-empty values
      .map(e => {
        const [key, value] = e.split("=");
        return { key, value: parseKeyValue(value) }
      })
      .reduce((p, c) => ({ ...p, [c.key]: c.value }), {})
    : {};
  return { method, path, endpoint, query, protocol, headers, rawData: strData };
}

function parseKeyValue (value) {
  const strValue = value.trim();
  const numberValue = parseFloat(strValue);
  const isNumber = !Number.isNaN(numberValue);
  const parsedStrValue = strValue.includes(",")
    ? strValue.split(",").map(e => e.trim()).filter(e => !!e)
    : strValue;
  return isNumber ? numberValue : parsedStrValue;
}

function acceptsJson (req) {
  // may have multiple values seperated by comma
  // text/html,application/xhtml+xml,application/xml
  const accept = req.headers["Accept"];
  return accept instanceof Array
    ? accept.findIndex(e => equalsIgnoreCase(e, "application/json"))
    : accept === '*/*';
}

function equalsIgnoreCase (a, b) {
  return a.toLowerCase() === b.toLowerCase();
}

// LOGGER FUNCTIONS

function logInfo (message) {
  process.stdout.write(`[INFO]: ${message}\n`);
}

function logError (message) {
  process.stderr.write(`[ERROR]: ${message}\n`);
}
