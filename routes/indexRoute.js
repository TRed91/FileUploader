const { Router } = require('express');
const multer = require('multer');
const indexController = require('../controllers/indexController');
const signupController = require('../controllers/signUpController');

const router = Router();
const upload = multer({ dest: 'uploads/' })

router.get('/', indexController.indexGet);

router.post('/login', indexController.authentication);
router.get('/logout', indexController.logout);

router.get('/upload', indexController.uploadGet);
router.post('/upload', upload.single('file'), indexController.uploadPost);
router.get('/download/:fileId', indexController.downloadGet);
router.post('/file/delete/:fileId', indexController.deleteFile);
router.post('/file/update/:fileId', indexController.updateFile);

router.post('/createFolder', indexController.createFolder);

router.get('/folder/:folderId', indexController.openFolder);
router.post('/folder/:folderId', indexController.renameFolder);
router.post('/folder/delete/:folderId', indexController.deleteFolder);

router.get('/details/:fileId', indexController.detailsGet);

router.get('/signup', signupController.signupGet);
router.post('/signup', signupController.signupPost);

module.exports = router;