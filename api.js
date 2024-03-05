
const https = require('https');

function getDatas(callback) {
    https.get("https://api.open-meteo.com/v1/meteofrance?latitude=49.5&longitude=0.13333&current=wind_speed_10m,wind_direction_10m,wind_gusts_10m&timezone=auto", function (res) {
    
        if (res.statusCode == 200) {
            let rawData = '';

            res.on('data', function (chunk) { rawData += chunk; });
            res.on('end', function () {
                    try {
                        const parsedData = JSON.parse(rawData);
                        // console.log(parsedData);

                        // date format
                        let date = new Date(parsedData.current.time);
                        let date_options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false };
                        var dateFormatted = date.toLocaleString('fr-FR', date_options);

                        let datas = {
                            time : dateFormatted,
                            wind_speed : parsedData.current.wind_speed_10m + ' ' + parsedData.current_units.wind_speed_10m,
                            wind_direction : parsedData.current.wind_direction_10m + ' ' + parsedData.current_units.wind_direction_10m,
                            wind_gusts : parsedData.current.wind_gusts_10m + ' ' + parsedData.current_units.wind_gusts_10m,
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
getDatas(function(retour) {console.log(retour);});