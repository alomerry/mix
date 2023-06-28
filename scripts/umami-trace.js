import { readFile, writeFile } from "fs";

function run() {
  // umami 访问监测脚本
  let traces = [
    '<script async src="https://umami.alomerry.com/script.js" data-website-id="a8bf962b-84f3-4ad7-9231-a76361e264c1"></script>'
  ]
  addTraceScript(traces)
}

function addTraceScript(traces) {
  let traceScript = ""
  traces.forEach(function (trace) {
    traceScript += "\r\n    " + trace
  })

  readFile('./src/.vuepress/dist/index.html', 'utf-8', function (err, contents) {
    if (err) {
      console.log(err);
      return;
    }

    const replaced = contents.replace(/<head>/g, '<head>' + traceScript);

    writeFile('./src/.vuepress/dist/index.html', replaced, 'utf-8', function (err) {
      if (err) {
        console.log(err);
        return;
      }
    });
  });
}

export default {
  run
}