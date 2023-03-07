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

        map.load(style);
        

        map.setCenter([-63.8298, 42.5512]);
        map.setZoom(13);

        let render_options = {};
        map.render(render_options, function (err, buffer) {
            if (err) throw err;

            map.release();

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

        });



    }
});