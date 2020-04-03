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
    const output = `\n${new Date().toLocaleTimeString()} - ${data.speeds.download} / ${
      data.speeds.upload
    }`;
    fs.appendFileSync(
      'speed.txt',
      output,
    );
    console.log(output);
  });
  test.on('error', error => {
    errorSpeedtests += 1;
    const output = `\n${new Date().toLocaleTimeString()} - ${JSON.stringify(error)}`;
    fs.appendFileSync(
      'speed.txt',
      output,
    );
    console.log(output)
  });
}, 1000 * 60 * 60);

const pingInterval = setInterval(async () => {
  try {
    const res = await ping.promise.probe('google.com');
    if (res.alive) {
      successfulPings += 1;
      cumulativePing += res.time;
      const output = `\n${new Date().toLocaleTimeString()} - ${res.time}ms`;
      fs.appendFileSync(
        'ping.txt',
        output,
      );
      console.log(output);
    } else {
      throw res;
    }
  } catch (e) {
    errorPings += 1;
    const output = `\n${new Date().toLocaleTimeString()} - ERROR! ${JSON.stringify(e)}`;
    fs.appendFileSync(
      'ping.txt',
      output,
    );
    console.log(output);
  }
}, 1000);

const reportInterval = setInterval(() => {
  const successRatePings = successfulPings / (successfulPings + errorPings);
  const successRateSpeedtests =
    successfulSpeedtests / (successfulSpeedtests + errorSpeedtests);
  const averageDownload = cumulativeDownload / successfulSpeedtests;
  const averageUpload = cumulativeUpload / successfulSpeedtests;
  const averagePing = cumulativePing / successfulPings;
  const output =     `\n${new Date().toLocaleTimeString()} - 
  Ping success rate: ${successRatePings}
  Speedtest success rate: ${successRateSpeedtests}
  Average Download: ${averageDownload}
  Average Upload = ${averageUpload}
  Average Ping = ${averagePing}
  `;
  fs.appendFileSync(
    'report.txt',
output,
  );
  console.log(output)
}, 1000 * 60 * 1);
