const LocalStrategy = require('passport-local').Strategy;
const prisma = require('../db/prismaClient');
const bcrypt = require('bcryptjs');

const localStrategy = new LocalStrategy(
    async (username, password, done) => {
        try {
            const user = await prisma.user.findUnique({
                where: { name: username },
            });
            console.log(user);
            if (!user) return done(null, false, { message: "Wrong username." });

            const match = await bcrypt.compare(password, user.password);
            if (!match) return done(null, false, { message: "Wrong password."});

            return done(null, user);
        } catch (err) {
            return done(err);
        } finally {
            await prisma.$disconnect();
        }
    }
)

const serialize = (user, done) => {
    return done(null, user.id);
}

const deserialize = async (id, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: id },
        });
        return done(null, user);
    } catch (err) {
        return done(err);
    } finally {
        await prisma.$disconnect;
    }
}

module.exports = {
    localStrategy,
    serialize,
    deserialize
}