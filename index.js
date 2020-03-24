const fs = require('fs');

const speedTest = require('speedtest-net');
const ping = require('ping');

let successfulSpeedtests = 0;
let errorSpeedtests = 0;
let successfulPings = 0;
let errorPings = 0;

let cumulativeDownload = 0;
let cumulativeUpload = 0;
let cumulativePing = 0;

const speedInterval = setInterval(() => {
  const test = speedTest();
  test.on('data', data => {
    successfulSpeedtests += 1;
    cumulativeDownload += data.speeds.download;
    cumulativeUpload += data.speeds.upload;
    fs.appendFileSync(
      'speed.txt',
      `\n${new Date().toLocaleTimeString()} - ${data.speeds.download} / ${
        data.speeds.upload
      }`,
    );
  });
  test.on('error', error => {
    errorSpeedtests += 1;
    fs.appendFileSync(
      'speed.txt',
      `\n${new Date().toLocaleTimeString()} - ${JSON.stringify(error)}`,
    );
  });
}, 1000 * 60);

const pingInterval = setInterval(async () => {
  try {
    const res = await ping.promise.probe('google.com');
    if (res.alive) {
      successfulPings += 1;
      cumulativePing += res.time;
      fs.appendFileSync(
        'ping.txt',
        `\n${new Date().toLocaleTimeString()} - ${res.time}ms`,
      );
    } else {
      throw res;
    }
  } catch (e) {
    errorPings += 1;
    fs.appendFileSync(
      'ping.txt',
      `\n${new Date().toLocaleTimeString()} - ERROR! ${JSON.stringify(e)}`,
    );
  }
}, 1000);

const reportInterval = setInterval(() => {
  const successRatePings = successfulPings / (successfulPings + errorPings);
  const successRateSpeedtests =
    successfulSpeedtests / (successfulSpeedtests + errorSpeedtests);
  const averageDownload = cumulativeDownload / successfulSpeedtests;
  const averageUpload = cumulativeUpload / successfulSpeedtests;
  const averagePing = cumulativePing / successfulPings;
  fs.appendFileSync(
    'report.txt',
    `\n${new Date().toLocaleTimeString()} - 
Ping success rate: ${successRatePings}
Speedtest success rate: ${successRateSpeedtests}
Average Download: ${averageDownload}
Average Upload = ${averageUpload}
Average Ping = ${averagePing}
`,
  );
}, 1000 * 60 * 1);
