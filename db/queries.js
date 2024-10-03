const prisma = require('./prismaClient');

exports.getUser = async(id) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: id },
        });
        return user;
    } catch (err) {
        console.error('User Get Error: ', err.message);
    } finally {
        prisma.$disconnect();
    }
}

exports.getFiles = async(userId, folderId) => {
    const files = await prisma.file.findMany({
        where: { AND: [
                    { userId: userId },
                    { folderId: folderId },
                ],
        },
    });
    return files;
}

exports.getFolders = async(userId) => {
    const folders = await prisma.folder.findMany({
        where: {
            userId: userId
        },
    });
    return folders;
}

exports.createUser = async(user) => {
    try {
        const { name, pw } = user;
        const newUser = await prisma.user.create({
            data: {
                name: name,
                password: pw
            },
        });
        return newUser;
    } catch (err) {
        return err;
    } finally {
        prisma.$disconnect();
    }
}

exports.createFile = async(userId, folderId, file) => {
    try {
        const { originalname, filename, type, path, size } = file;
        const fileData = await prisma.file.create({
            data: {
                originalname: originalname,
                filename: filename,
                type: type,
                path: path,
                size: size,
                userId: userId,
                folderId: parseInt(folderId)
            },
        });
        return fileData;
    } catch (err) {
        return err;
    } finally {
        prisma.$disconnect();
    }
    
}

exports.createFolder = async(userId, name) => {
    try {
        const folder = await prisma.folder.create({
            data: {
                name: name,
                userId: userId
            }
        });
        return folder;
    } catch (err) {
        return err;
    } finally {
        prisma.$disconnect();
    }
}

exports.updateFolder = async(folderId, name) => {
    try {
        const folder = await prisma.folder.update({
            where: { id: folderId },
            data: { name: name }
        })
        return folder;
    } catch (err) {
        return err
    } finally {
        prisma.$disconnect();
    }
}

exports.deleteFolder = async(folderId) => {
    try {
        const folder = await prisma.folder.delete({
            where: { id: folderId },
        });
        return folder;
    } catch (err) {
        return err;
    } finally {
        prisma.$disconnect();
    }
    
}