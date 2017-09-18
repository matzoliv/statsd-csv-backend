var util = require('util');
var fs = require('fs');
var path = require('path');

function CsvBackend(startupTime, config, emitter){
    var self = this;
    this.lastFlush = startupTime;
    this.lastException = startupTime;
    this.config = config.csv || {};

    var outputFilePath = this.config.outputFilePathPrefix + startupTime + ".csv";
    this.outputFile = fs.createWriteStream(outputFilePath)

    var columns = ["Timestamp"]
    for (var i = 0; i < this.config.includeMetrics.length; i ++) {
	columns.push(this.config.includeMetrics[i].join("."))
    }

    this.outputFile.write(columns.join(",") + "\n")
    
    // attach
    emitter.on('flush', function(timestamp, metrics) { self.flush(timestamp, metrics); });
    emitter.on('status', function(callback) { self.status(callback); });
}

function getIn(x, ks) {
    for (var i = 0, n = ks.length; x != null && i < n; i++) x = x[ks[i]];
    return x;
}

CsvBackend.prototype.flush = function(timestamp, metrics) {
    var values = [timestamp]

    for (var i = 0; i < this.config.includeMetrics.length; i ++) {
	var path = this.config.includeMetrics[i]
	values.push(getIn(metrics, path))
    }

    this.outputFile.write(values.join(",") + "\n")
};

CsvBackend.prototype.status = function(write) {
    ['lastFlush', 'lastException'].forEach(function(key) {
	write(null, 'console', key, this[key]);
    }, this);
};

exports.init = function(startupTime, config, events) {
    var instance = new CsvBackend(startupTime, config, events);
    return true;
};
