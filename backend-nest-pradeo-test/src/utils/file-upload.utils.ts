import * as fs from 'fs/promises';

//Filter file type, APK only allowed
export const fileTypeFilter = (req, file, callback) => {
    if (file.mimetype !== 'application/octet-stream' && !file.originalname.match(/\.(apk)$/)) {
        return callback('Only APK files are allowed!', false);
    }
    callback(null, true);
};

export const renameAppwithHash = async (fileHashedName: string): Promise<string> => {
    const oldPath = './upload/' + fileHashedName;
    const newPath = './upload/' + fileHashedName + ".apk";
    await fs.rename(oldPath, newPath);
    return newPath;
}