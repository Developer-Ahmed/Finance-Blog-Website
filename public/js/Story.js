// import * as FilePond from 'filepond';
// import FilePondPluginFileEncode from 'filepond-plugin-file-encode'
// import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
// import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';

// const FilePond = require("filepond");
// const FilePondPluginImageExifOrientation = require("filepond-plugin-image-exif-orientation");
// const FilePondPluginFileValidateSize = require("filepond-plugin-file-validate-size");
// const FilePondPluginFileEncode = require("filepond-plugin-image-exif-orientation");

FilePond.registerPlugin(
    FilePondPluginImageExifOrientation,
    FilePondPluginFileValidateSize,
    FilePondPluginFileEncode,
    FilePondPluginImageResize,
    FilePondPluginImageTransform,
);

FilePond.parse(document.body);
