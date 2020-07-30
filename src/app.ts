import * as prometheusClient from "prom-client";
const registry = new prometheusClient.Registry();
import * as util from 'util';

// prometheusClient.collectDefaultMetrics();  // デフォルトで組み込まれているメトリクスを、デフォルト10秒間隔で取得
// prometheusClient.collectDefaultMetrics({ timeout: 5000 });  // デフォルトで組み込まれているメトリクスを、5秒おきに取得

const gauge = new prometheusClient.Gauge({
  name: "aaa",
  help: "bbb",
  registers: [registry],
});

const gateway = new prometheusClient.Pushgateway('http://localhost:9091', {}, registry);
function getRandomInt(max: number = 100, min: number = 1): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

(async()=>{
  const random = getRandomInt();
  console.log(random);
  gauge.set(random);

  await util.promisify(gateway.pushAdd).bind(gateway)({ jobName: 'nodejs-client-job' });
  // await util.promisify(gateway.push).bind(gateway)({ jobName: 'nodejs-client-job' });
  // await util.promisify(gateway.delete).bind(gateway)({ jobName: 'nodejs-client-job' });

  process.exit(0);
})()
