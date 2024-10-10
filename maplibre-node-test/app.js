/*
 * Maplibre-gl-native Example
 */
let sharp = require('sharp');
let mlgl = require('@maplibre/maplibre-gl-native');
let request = require('request');


var map = new mlgl.Map();

request('https://tiles.wifidb.net/styles/WDB_OSM/style.json', async (err, res, body) => {
    if (err) throw err;
    if (res.statusCode == 200) {
        let style = JSON.parse(body);

        // MODIFY STYLE HERE if desired

        map.load(style);

        const renderImage = async filename => {
            await new Promise((resolve, reject) => {
                map.render(async (err, buffer) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    let image = sharp(buffer, {
                        raw: {
                            width: 512,
                            height: 512,
                            channels: 4
                        }
                    });

                    await new Promise((resolve, reject) => {
                        // Convert raw image buffer to PNG
                        image.toFile(filename, function (err) {
                            if (err) {
                                reject(err);
                                return;
                            }

                            resolve();
                        });
                    });

                    resolve();
                });
            });
        }
		
		for(var i=0;i<100;i++){
			let filename=i+'.png';
			map.setCenter([-98.5795, 39.8282]);
			map.setZoom(13);
			await renderImage(filename);
		}
    }
});
