//  server.js
const http = require('http');
const https = require('https');

const fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer(function handler(req, res) {
    getDatas(function(retour) {
        fs.readFile('index.html', 'utf8', function(err, data){
            res.write(data);
            res.write('<script>const data = ' + JSON.stringify(retour) + '</script></body></html>')
            res.end();
        });
    });
        
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

// Api
function getDatas(callback) {
    https.get("https://api.open-meteo.com/v1/meteofrance?latitude=52.52&longitude=13.41&hourly=wind_speed_10m,wind_direction_10m,wind_gusts_10m&timezone=auto", function (res) {
    
        if (res.statusCode == 200) {
            let rawData = '';

            res.on('data', function (chunk) { rawData += chunk; });
            res.on('end', function () {
                    try {
                        const parsedData = JSON.parse(rawData);
                        // console.log(parsedData);

                        let datas = [];

                        for (let i = 0; i <= 24; i++) {
                            // date format
                            let date = new Date(parsedData.hourly.time[i]);
                            let date_options = { hour: 'numeric', minute: 'numeric', hour12: false };
                            let dateFormatted = date.toLocaleString('fr-FR', date_options);

                            let wind_speed = parsedData.hourly.wind_speed_10m[i];

                            let beaufort = 0;

                            // get beaufort scale
                            switch (true) {
                                case (wind_speed < 1):
                                    beaufort = 0;
                                    break;
                                case (wind_speed >= 1 && wind_speed <= 5):
                                    beaufort = 1;
                                    break;
                                case (wind_speed >= 6 && wind_speed <= 11):
                                    beaufort = 2;
                                    break;
                                case (wind_speed >= 12 && wind_speed <= 19):
                                    beaufort = 3;
                                    break;
                                case (wind_speed >= 20 && wind_speed <= 28):
                                    beaufort = 4;
                                    break;
                                case (wind_speed >= 29 && wind_speed <= 38):
                                    beaufort = 5;
                                    break;
                                case (wind_speed >= 39 && wind_speed <= 49):
                                    beaufort = 6;
                                    break;
                                case (wind_speed >= 50 && wind_speed <= 61):
                                    beaufort = 7;
                                    break;
                                case (wind_speed >= 62 && wind_speed <= 74):
                                    beaufort = 8;
                                    break;
                                case (wind_speed >= 75 && wind_speed <= 88):
                                    beaufort = 9;
                                    break;
                                case (wind_speed >= 89 && wind_speed <= 102):
                                    beaufort = 10;
                                    break;
                                case (wind_speed >= 103 && wind_speed <= 117):
                                    beaufort = 11;
                                    break;
                                default:
                                    beaufort = 12;
                                    break;
                            }

                            datas.push({
                                time : dateFormatted,
                                wind_speed : wind_speed + ' ' + parsedData.hourly_units.wind_speed_10m,
                                wind_direction : parsedData.hourly.wind_direction_10m[i] + ' ' + parsedData.hourly_units.wind_direction_10m,
                                wind_gusts : parsedData.hourly.wind_gusts_10m[i] + ' ' + parsedData.hourly_units.wind_gusts_10m,
                                beaufort : beaufort,
                            },)
                        };

                        

                        callback(datas);
                    } catch (e) {
                        console.error(e.message);
                    }
                })
                .on('error', (e) => {
                console.error(`Got error: ${e.message}`);
            });
        };
    });
};