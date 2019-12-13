import mongoose from 'mongoose';
import mongoosePass from 'mongoose-pass';

const userSchema = new mongoose.Schema({
    username: String,
    role: String
});

userSchema.plugin(mongoosePass);
userSchema.static('authenticate', (username, password) => {
    return User.findOne({username}).exec().then(user => {
        if (!user) {
            return false;
        }
        return user.authenticate(password);
    });
});

const User = mongoose.model('User', userSchema);

// ['manager', 'engineer'].forEach(username => {
//     User.findOne({username}).exec().then(user => {
//         user.password = username;
//         user.save();
//     });
// });

export default User;