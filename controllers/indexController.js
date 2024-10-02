const passport = require('passport');
const db = require('../db/queries');

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
        const originalname = req.file.originalname;
        const filename = req.file.filename;
        const type = req.file.mimetype;
        const path = req.file.path;
        const folderId = (req.body.folder !== 'none' ? req.body.folder : null);
    
        const file = await db.createFile(req.user.id, folderId, { originalname: originalname, 
                                                                filename: filename, 
                                                                type: type, 
                                                                path: path });
        console.log(`Added to files for user ${req.user.name}: `, file);
    } catch (err) {
        console.error(err.message);
    } finally {
        res.redirect('/');
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
    let files;
    if (user) {
        files = await db.getFiles(user.id, parseInt(req.params.folderId));
    }
    const errs = req.session.messages || [];
    const err = errs[errs.length - 1];
    res.render('index', { user: user, err: err, files: files });
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