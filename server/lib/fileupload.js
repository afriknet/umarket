/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/formidable/formidable.d.ts" />
/// <reference path="../../typings/fs-extra/fs-extra.d.ts" />
/// <reference path="../../typings/lodash/lodash.d.ts" />
var root = require('root-path');
var formidable = require('formidable');
var fs = require('fs-extra');
var util = require('util');
var path = require('path');
exports.upload_file = function (req, res, next) {
    var uploadOptions = {
        dirname: root('/assets/images'),
        saveAs: function (__newFileStream, cb) {
            cb(null, path.basename(__newFileStream.filename));
        },
    };
    req['file']('file').upload(uploadOptions, function (err, files) {
        if (err) {
            console.log('error');
        }
        else {
            console.log(files);
        }
        res.send(files[0]);
    });
};
exports.upload = function (req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        //res.writeHead(200, { 'content-type': 'text/plain' });
        //res.write('received upload:\n\n');
        //res.end( util.inspect({ fields: fields, files: files }));
    });
    form.on('progress', function (bytesReceived, bytesExpected) {
        var percent_complete = (bytesReceived / bytesExpected) * 100;
        console.log(percent_complete.toFixed(2));
    });
    form.on('error', function (err) {
        console.error(err);
    });
    form.on('end', function (fields, files) {
        /* Temporary location of our uploaded file */
        var temp_path = this.openedFiles[0].path;
        /* The file name of the uploaded file */
        var file_name = this.openedFiles[0].name;
        /* Location where we want to copy the uploaded file */
        var new_location = root('/assets/images/');
        fs.copy(temp_path, new_location + file_name, function (err) {
            if (err) {
                console.error(err);
            }
            else {
                console.log("success!");
            }
        });
        var rst = {
            file: file_name,
            path: '/images/' + file_name
        };
        res.send(rst);
    });
};
//# sourceMappingURL=fileupload.js.map