import { basename, extname } from "path";

//Filter file type, APK only allowed
export const fileTypeFilter = (req, file, callback) => {
    if (file.mimetype !== 'application/octet-stream' && !file.originalname.match(/\.(apk|xapk)$/)) {
        return callback('Only APK files are allowed!', false);
    }
    callback(null, true);
};

//Just adding the extension to the file
export const editFileName = (req, file, callback) => {
    const name = basename(file.originalname);
    //file.originalname.split('.')[0];
    //const fileExtName = extname(file.originalname);

    callback(null, `${name}`);
};