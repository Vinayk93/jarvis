'use strict';

var express = require('express');
var kraken = require('kraken-js');
	
var cookieParser       =    require('cookie-parser'),
	session            =    require('cookie-session'),
	bodyParser         =    require('body-parser'),
	errorHandler       =    require('errorhandler'),
	lusca              =    require('lusca');
    
var options, app;

/*
 * Create and configure application. Also exports application instance for use by tests.
 * See https://github.com/krakenjs/kraken-js#options for additional configuration options.
 */
options = {
    onconfig: function (config, next) {
        //db connect
        /*
         * Add any additional config setup or overrides here. `config` is an initialized
         * `confit` (https://github.com/krakenjs/confit/) configuration object.
         */
        next(null, config);
    }
};

app = module.exports = express();

app.use(kraken(options));

app.use(cookieParser());
app.use(session({
    secret: 'abc'
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(lusca.csrf());
//app.use(lusca.csp({ }));
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.p3p('ABCDEF'));
app.use(lusca.hsts({ maxAge: 31536000 }));
app.use(lusca.xssProtection(true));
app.use(lusca.nosniff());
app.use(errorHandler());

/*
app.get('/', function(req, res) {
    res.status(200).send(res.locals._csrf + "<br>");
});
*/

app.on('start', function () {
    console.log('Application ready to serve requests.');
    console.log('Environment: %s', app.kraken.get('env:env'));
});
