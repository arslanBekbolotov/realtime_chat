import express from 'express';
import {Error} from 'mongoose';
import {User} from "../models/User";
const usersRouter = express.Router();

usersRouter.post('/', async (req, res, next) => {
    try {
        const {username,password,displayName} = req.body;
        const user = new User({username, password, displayName});

        user.generateToken();

        await user.save();
        return res.send({user, message: 'Success'});
    } catch (error) {
        if (error instanceof Error.ValidationError) {
            return res.status(400).send(error);
        }

        return next(error);
    }
});

usersRouter.post('/sessions', async (req, res, next) => {
    try {
        const user = await User.findOne({username: req.body.username});

        if (!user) {
            return res.status(400).send({error: 'Wrong password or username!'});
        }

        const isMatch = await user.checkPassword(req.body.password);

        if (!isMatch) {
            return res.status(400).send({error: 'Wrong password or username!'});
        }

        user.generateToken();
        await user.save();

        res.send({
            message: 'Username and password correct!',
            user,
        });
    } catch (e) {
        next(e);
    }
});

usersRouter.delete('/sessions', async (req, res, next) => {
    try {
        const token = req.get('Authorization');
        const success = {message: 'Success'};
        if (!token) {
            return res.status(204).send(success);
        }
        const user = await User.findOne({token});

        if (!user) return res.status(204).send(success);

        user.generateToken();
        await user.save();

        return res.status(204).send(success);
    } catch (e) {
        return next(e);
    }
});

export default usersRouter;