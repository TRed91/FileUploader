const passport = require('passport');
const db = require('../db/queries');
const { decode } = require('base64-arraybuffer');
const storage = require('../storageAPI/supabase');
const { unlink, writeFile } = require('node:fs/promises');
const fs = require('fs');
const path = require('node:path');

exports.indexGet = async(req, res) => {
    const user = req.user || null;
    let files;
    let folders;
    if (user) {
        files = await db.getFiles(user.id, null);
        folders = await db.getFolders(user.id); 
    }
    const errs = req.session.messages || [];
    const err = errs[errs.length - 1];
    res.render('index', { user: user, err: err, files: files, folders: folders });
}

exports.authentication = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/',
    failureMessage: true
});

exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
}

exports.uploadGet = async(req, res) => {
    if (!req.user) {
        return res.status(401).redirect('/');
    }
    const folders = await db.getFolders(req.user.id);
    res.render('uploadForm', { folders: folders });
}

exports.uploadPost = async(req, res) => {
    try {
        // save to db
        const originalname = req.file.originalname;
        const type = req.file.mimetype;
        //const path = req.file.path;
        const size = req.file.size;
        const folderId = (req.body.folder !== 'none' ? req.body.folder : null);
    
        const file = await db.createFile(req.user.id, folderId, { originalname: originalname, 
                                                                type: type, 
                                                                size: size });
        console.log(`Added to files for user ${req.user.name}: `, file);

        // decode file buffer
        const decodedFile = decode(req.file.buffer.toString('base64'));

        // upload to supabase
        const storedFile = await storage.uploadFile('files', originalname, decodedFile, type);
        console.log("Storage: ", storedFile);
    } catch (err) {
        console.error(err.message);
    } finally {
        res.redirect('/');
    }

    //await storage.uploadFile('files', req.file.path, req.file);
}

exports.downloadGet = async(req, res) => {
    try {
        const fileId = parseInt(req.params.fileId);
        const file = await db.getFile(fileId);

        const filePath = 'files/' + file.originalname;

        const blob = await storage.downloadFile('files', file.originalname);
        const buffer = Buffer.from(await blob.arrayBuffer());
        
        // temporarely store file in file folder
        await writeFile(filePath, buffer);
       
        res.download(filePath, (err) => {
            if (err) {
                throw new Error(err.message)
            }
            // delete file from file folder after download
            unlink(filePath)
        });

    } catch (err) {
        console.error('Download Error: ', err.message);
        res.redirect('/');
    }
}

exports.deleteFile = async(req, res) => {
    try{
        const fileId = parseInt(req.params.fileId);
        const file = await db.getFile(fileId);
        await db.deleteFile(fileId);
        await storage.deleteFile('files', file.originalname);
        console.log('Delete from storage: success');
    } catch (err) {
        console.error("File deletion error: ", err.message);
    } finally {
        res.redirect('/');
    }
}

exports.detailsGet = async(req, res) => {
    try {
        const fileId = parseInt(req.params.fileId);
        const file = await db.getFile(fileId);
        const folders = await db.getFolders(req.user.id);
        const size = parseFloat(file.size) / 1000;
        res.render('details', { file: file, size: size, folders: folders });
    } catch(err) {
        console.error(err.message);
        res.redirect('/');
    } 
}

exports.updateFile = async(req, res) => {
    try {
        const fileId = parseInt(req.params.fileId);
        const folderId = (req.body.folder !== 'none' ? parseInt(req.body.folder) : null);
        const file = await db.updateFile(fileId, { folderId: folderId });
        console.log('Updated file: ', file)
    } catch (err) {
        console.error('File update error: ', err.message)
    } finally {
        res.redirect('/details/' + req.params.fileId);
    }
}

exports.createFolder = async(req, res) => {
    try {
        const folder = await db.createFolder(req.user.id, req.body.folder);
        console.log("Folder created: ", folder);
    } catch (err) {
        console.error(err.message);
    } finally {
        res.redirect('/');
    }
}

exports.openFolder = async(req, res) => {
    const user = req.user || null;
    const folderId = parseInt(req.params.folderId);
    let files;
    if (user) {
        files = await db.getFiles(user.id, folderId);
    }
    const folderName = await db.getFolderName(folderId);
    const errs = req.session.messages || [];
    const err = errs[errs.length - 1];
    res.render('index', { user: user, err: err, files: files, foldername: folderName.name });
}

exports.renameFolder = async(req, res) => {
    try{
        const folderId = parseInt(req.params.folderId);
        const folder = await db.updateFolder(folderId, req.body.name);
        console.log("Updated folder: ", folder.id);
    } catch (err) {
        console.error("Folder update error: ", err.message);
    } finally {
        res.redirect('/');
    }
}

exports.deleteFolder = async(req, res) => {
    try{
        const folderId = parseInt(req.params.folderId);
        const folder = await db.deleteFolder(folderId);
        console.log("Deleted folder: ", folder.id);
    } catch (err) {
        console.error("Folder deletion error: ", err.message);
    } finally {
        res.redirect('/');
    }
}