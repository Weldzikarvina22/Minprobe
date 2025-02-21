const mongoose = require('mongoose');
mongoose.set('debug', true); // Debug logs for all mongoose queries
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    referralCode: { type: String, unique: true }, // Unique identifier for referrals
    referrer: { type: String }, // Referral code of the user who referred this user
    points: { type: Number, default: 0 }, // Total referral points
    photo: { type: String } //path to the user profile picture

});

// Hash password before saving, but only if the password has been modified
userSchema.pre('save', async function (next) {
    console.log('Pre-save hook triggered...');
    console.log('Password before hashing:', this.password);

    // Check if the field is modified AND if the password is not already hashed
    if (this.isModified('password') && !this.password.startsWith('$2b$')) {
        console.log('Password was modified, hashing password...');
        this.password = await bcrypt.hash(String(this.password), 10);
        console.log('Password after hashing:', this.password);
    } else {
        console.log('Password hashing skipped (already hashed or not modified).');
    }

    next();
});

// Method to compare password
// Compares provided plaintext password with stored hash
userSchema.methods.comparePassword = async function(candidatePassword) {
    console.log("passwe ", await  bcrypt.compare(String(candidatePassword), this.password));
    return await bcrypt.compare(String(candidatePassword), this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;