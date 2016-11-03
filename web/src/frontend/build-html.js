var fs = require("fs");
var Mustache = require("mustache");

front = process.argv[2];
env = process.argv[3];

var timestamp = Date.now().toString();

var dev = {
    timestamp: timestamp,
    buildRoot: 'http://localhost:8080/assets',
    restRoot: 'http://localhost:8084/modiasyforest/rest',
    moteAdminRestRoot: 'http://localhost:8185/mote/rest',
    bundleFileName: 'bundle.js',
    decoratorRoot: 'https://modapp-t1.adeo.no',
    websocketProtocol: 'ws',
    contextholderRoot: 'http://localhost:8090/eventdistributer'
};

var prod = {
    timestamp: timestamp,
    buildRoot: '/sykefravaer/js',
    restRoot: '/modiasyforest/rest',
    moteAdminRestRoot: '/mote/rest',
    bundleFileName: 'bundle-prod.js',
    decoratorRoot: '',
    websocketProtocol: 'wss',
    contextholderRoot: '/eventdistributer'
};

fs.readFile(front, function (err, data) {
    if (err) throw err;
    const html = Mustache.render(data.toString(), env === 'prod' ? prod : dev);
    fs.writeFile('../main/webapp/syfofront.html', html, 'utf-8', (err) => {
        if (err) throw err;
    });
});