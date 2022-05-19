import * as fs from 'fs/promises';

//Filter file type, APK only allowed
export const fileTypeFilter = (req, file, callback) => {
    if (file.mimetype !== 'application/octet-stream' && !file.originalname.match(/\.(apk)$/)) {
        return callback('Only APK files are allowed!', false);
    }
    callback(null, true);
};

export const renameAppwithHash = async (fileHashedName: string): Promise<boolean> => {
    const oldPath = './upload/' + fileHashedName;
    const newPath = './upload/' + fileHashedName + ".apk";

    const result = await fs.rename(oldPath, newPath);

    if(result === undefined) {
        return true;
    } else {
        return false;
    }
}

export const deleteAppFromHash = async (fileHashedName: string): Promise<boolean> => {
    // Prepare file path from hash
    const filePath = './upload/' + fileHashedName + ".apk";

    //Check if file exist in the upload directory
    const isFileExist = await fs.access(filePath)
        .then(() => { return true })
        .catch(() => { return false });

    if (isFileExist) {
        await fs.unlink(filePath);
        return true;
    } else {
        return false;
    }
}