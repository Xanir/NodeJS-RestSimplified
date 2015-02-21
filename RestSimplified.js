var Q = require('q');
var url = require('url');
var extend = require('util')._extend;

var RestfulServices = function(connection, headers) {

	if (typeof connection === 'string') {
		connection = url.parse(connection);
	}
	if (!connection.headers) {
		connection.headers = {};
	}
	extend(connection.headers, headers);

	var doRequest = function(myConnection, data) {
		var deferedHttp = Q.defer();
		try {
			if (data) {
				if (typeof data === 'object') {
					data = JSON.stringify(data);
				}
				myConnection.headers['Content-Length'] = data.length;
			}
			var req = http.request(myConnection, function(res) {
				res.setEncoding('utf-8');

				var responseString = '';
				res.on('connect', function(data) {
					responseString = "";
				});
				res.on('data', function(data) {
					responseString += data;
				});

				res.on('end', function() {
					deferedHttp.resolve(res.statusCode, responseString, res.headers);
				});
			});
			if (data) {
				req.write(data);
			}
			req.end();
		} catch (e) {
			console.log(e);
			deferedHttp.reject(e);
		}

		return deferedHttp.promise;
	};

	this.get = function(path, headers) {
		var myConnection = extend({}, connection);
		myConnection.method = 'GET';
		myConnection.path += path;
		if (headers) {
			extend(myConnection.headers, headers);
		}

		return doRequest(myConnection);
	};

	this.post = function(path, headers, data) {
		var myConnection = extend({}, connection);
		myConnection.method = 'POST';
		myConnection.path += path;
		if (headers) {
			extend(myConnection.headers, headers);
		}

		return doRequest(myConnection, data);
	};

};
