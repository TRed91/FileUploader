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