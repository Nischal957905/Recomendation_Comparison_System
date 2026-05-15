import handleAsync from 'express-async-handler'
import User from '../../models/User.js'
import Role from '../../models/Role.js'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import dotenv from "dotenv"

const loginAttempts = new Map();
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 10;
const MAX_TRACKED_LOGIN_KEYS = 1000;

const pruneLoginAttempts = () => {
    const now = Date.now();
    for (const [key, value] of loginAttempts.entries()) {
        if (now - value.firstAttempt > LOGIN_WINDOW_MS) {
            loginAttempts.delete(key);
        }
    }
    while (loginAttempts.size > MAX_TRACKED_LOGIN_KEYS) {
        const oldestKey = loginAttempts.keys().next().value;
        loginAttempts.delete(oldestKey);
    }
};

const isPasswordHash = (password) => /^\$2[aby]\$/.test(password);

const publicUser = (user) => ({
    _id: user._id,
    username: user.username,
    status: user.status,
    role_id: user.role_id,
});

const verifyUser = handleAsync(async (req,res) => {
    dotenv.config();

    pruneLoginAttempts();
    const filter = req.body && Object.keys(req.body).length ? req.body : req.query
    const username = String(filter.username || '').trim();
    const password = String(filter.password || '');
    const attemptKey = `${req.ip}:${username}`;
    const now = Date.now();
    const attempts = loginAttempts.get(attemptKey) || { count: 0, firstAttempt: now };

    if (attempts.count >= MAX_LOGIN_ATTEMPTS && now - attempts.firstAttempt <= LOGIN_WINDOW_MS) {
        return res.status(429).json({ message: 'Too many login attempts. Try again later.' });
    }

    if(username && password){
        const user = await User.findOne({username, status:"Active"}).select().lean();
        const userVerify = user
            ? isPasswordHash(user.password)
                ? await bcrypt.compare(password, user.password)
                : user.password === password
            : false
        if(userVerify){
            loginAttempts.delete(attemptKey);
            if (!isPasswordHash(user.password)) {
                await User.updateOne(
                    { _id: user._id },
                    { password: await bcrypt.hash(password, 12) }
                );
            }
            const roles = await Role.findOne({_id: user.role_id}).select({role_name: 1}).lean();
            const tokenForAccess = jwt.sign({
                'username': user.username
            }, process.env.ACCESS_TOKEN_SECRET , 
            {expiresIn: '15m'})

            const tokenForRefresh = jwt.sign({
                'username': user.username
            }, process.env.REFRESH_TOKEN_SECRET , 
            {expiresIn: '1d'})
            res.cookie('jwt', tokenForRefresh, {
                httpOnly: true,
                sameSite: 'strict',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 24 * 60 * 60 * 1000
            })
            return res.json({tokenForAccess, userVerify, user: publicUser(user), roles})
        }
        else{
            loginAttempts.set(attemptKey, {
                count: attempts.count + 1,
                firstAttempt: attempts.firstAttempt
            });
            res.sendStatus(401);
        }
    }
    else {
        res.status(400).json({ message: 'Username and password are required.' });
    }
})


const createUser = handleAsync(async (req,res) => {
    
    const data = req.body && Object.keys(req.body).length ? req.body : req.query;
    if(data.location){
        const role = await Role.findOne({role_name: 'non-admin'}).select({_id: 1}).lean()
        const username = String(data.username || '').trim();
        const password = String(data.password || '');
        const findUser = await User.findOne({username}).select().lean()
        if(!findUser && role){
            const newUser = await User.create({
                role_id: role._id,
                latitude: data.latitude,
                longitude: data.longitude,
                username,
                password: await bcrypt.hash(password, 12),
                status: 'Active'
            })

            return res.status(201).json(publicUser(newUser))
        }
        return res.status(409).json({ message: 'Username already exists.' })
    }
    return res.status(400).json({ message: 'Location consent is required.' })
})

const verifyUserOnEmail = handleAsync(async (req,res) => {
    return res.sendStatus(204)
})

export default { verifyUser, createUser, verifyUserOnEmail };
