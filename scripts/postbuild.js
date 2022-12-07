import {readFile, writeFile} from "fs";

run()

function run() {
    // umami 访问监测脚本
    let traces = [
        '<script async defer data-website-id="8f9a338f-b2d4-47d9-ab92-f46d6e054d0e" src="https://umami.alomerry.com/umami.js"></script>'
    ]
    addTraceScript(traces)
}

function addTraceScript(traces) {
    let traceScript = ""
    traces.forEach(function (trace) {
        traceScript += "\r\n    " + trace
    })

    readFile('./blog/.vuepress/dist/index.html', 'utf-8', function (err, contents) {
        if (err) {
            console.log(err);
            return;
        }

        const replaced = contents.replace(/<head>/g, '<head>' + traceScript);

        writeFile('./blog/.vuepress/dist/index.html', replaced, 'utf-8', function (err) {
            if (err) {
                console.log(err);
                return;
            }
        });
    });
}