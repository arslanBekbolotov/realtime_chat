import {User} from '../models/User';

const auth = async (token:string) => {
    if (!token) {
        return {error: 'No token present'}
    }

    const user = await User.findOne({token}).select('displayName');

    if (!user) {
        return {error: 'Wrong token!'}
    }

    return {id:user._id,displayName:user.displayName};
};

export default auth;