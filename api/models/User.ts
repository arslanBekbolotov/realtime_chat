import mongoose, {HydratedDocument, Model, Schema} from 'mongoose';
import bcrypt from 'bcrypt';
import {IUser} from '../types';
import {randomUUID} from 'crypto';

interface IUserMethods {
    checkPassword(password: string): Promise<boolean>;
    generateToken(): void;
}

type UserModel = Model<IUser, NonNullable<unknown>, IUserMethods>;

const SALT_WORK_FACTOR = 7;

const UserSchema = new Schema<IUser, UserModel, IUserMethods>({
    username: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: async function (this: HydratedDocument<IUser>, value: string) {
                if (!this.isModified('username')) return true;
                const user = await User.findOne({username: value});
                if (user) return false;
            },
            message: 'This user is already registered',
        },
    },
    displayName: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        default: 'user',
        enum: ['moderator', 'user'],
    },
    password: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
});

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

UserSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.password;
        return ret;
    },
});

UserSchema.methods.checkPassword = function (password) {
    return bcrypt.compare(password, this.password);
};

UserSchema.methods.generateToken = function () {
    this.token = randomUUID();
};

export const User = mongoose.model<IUser, UserModel>('User', UserSchema);
