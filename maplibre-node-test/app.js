/*
 * Maplibre-gl-native Example
 */
let sharp = require('sharp');
let mlgl = require('@maplibre/maplibre-gl-native');
let request = require('request');

let options = {
    request: function (req, callback) {
        request({
            url: req.url,
            encoding: null,
            gzip: true
        }, function (err, res, body) {
            if (err) {
                callback(err);
            } else if (res.statusCode == 200) {
                var response = {};

                if (res.headers.modified) { response.modified = new Date(res.headers.modified); }
                if (res.headers.expires) { response.expires = new Date(res.headers.expires); }
                if (res.headers.etag) { response.etag = res.headers.etag; }

                response.data = body;

                callback(null, response);
            } else if (res.statusCode == 204) {
                callback();
            } else {
                callback(new Error(JSON.parse(body).message));
            }
        });
    }
};

var map = new mlgl.Map(options);

request('https://tiles.wifidb.net/styles/WDB_OSM/style.json', function (err, res, body) {
    if (err) throw err;
    if (res.statusCode == 200) {
        let style = JSON.parse(body);

        // MODIFY STYLE HERE if desired

        map.load(style);
        

        map.setCenter([-98.5795, 39.8282]);
        map.setZoom(13);

        map.render(function (err, buffer) {
            if (err) throw err;

            var image = sharp(buffer, {
                raw: {
                    width: 512,
                    height: 512,
                    channels: 4
                }
            });

            // Convert raw image buffer to PNG
            image.toFile('Z13.png', function (err) {
                if (err) throw err;
            });

            map.setZoom(10);

            map.render(function (err, buffer) {
                if (err) throw err;

                var image = sharp(buffer, {
                    raw: {
                        width: 512,
                        height: 512,
                        channels: 4
                    }
                });

                // Convert raw image buffer to PNG
                image.toFile('Z10.png', function (err) {
                    if (err) throw err;
                });

                map.setCenter([-88.5795, 39.8282]);

                map.render(function (err, buffer) {
                    if (err) throw err;

                    var image = sharp(buffer, {
                        raw: {
                            width: 512,
                            height: 512,
                            channels: 4
                        }
                    });

                    // Convert raw image buffer to PNG
                    image.toFile('Z10_2.png', function (err) {
                        if (err) throw err;
                    });

                });

            });

        });



    }
});