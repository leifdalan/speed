# Speed report

This is a basic script that will take a ping test every second, and run a speedtest every hour for the duration of the process. It will append a report, (`report.txt`) every hour with the results of the last hour, taking in ping/failure averages.

## Usage
Required: Node v8 or higher

Run `yarn` or `npm i`

Run `node .`

Output in stdout is slient, check `ping.txt` and `speed.txt` for periodic output.