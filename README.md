# statsd-csv-backend

A statsd backend to output selected metrics to a CSV file.

# Installation

Copy csv_backend.js file to the backends/ folder of your statsd installation.

# Configuration

```
{
    backends: [ "./backends/csv_backend" ],
    csv: {
	outputFilePathPrefix: "/path/to/folder/file-prefix",
	includeMetrics: [
	    [ "counter_rates", "mycounter" ],
	    [ "timer_data", "mytimer", "mean" ],
	    [ "timer_data", "mytimer", "mean_90" ]
	]
    }
}
```

Statsd will then write its output to `/path/to/folder/file-prefix<startup timestamp>.csv`.
