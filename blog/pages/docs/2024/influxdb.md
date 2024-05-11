## install influxdb-cli

wget https://dl.influxdata.com/influxdb/releases/influxdb2-client-2.7.2-linux-amd64.tar.gz

tar xvzf ./influxdb2-client-2.7.1-linux-amd64.tar.gz 

```shell
tree .
.
|-- influx
|-- LICENSE
`-- README.md

1 directory, 3 files
```

cp influx /usr/local/bin/

## xxxxx

Useful InfluxDB CLI commands
To invoke a command, use the following format in the command line:

influx [command]

|xx|xx|
|:--:|:--:|
|bucket |	Bucket management commands|
|export |	Export resources as a template|
|help |	List all commands|
|query |	Execute a query|
|write |	Write points to InfluxDB|

influx 分为 v1 和 v2 版

## Reference

- https://jasper-zhang1.gitbooks.io/influxdb/content/Concepts/key_concepts.html