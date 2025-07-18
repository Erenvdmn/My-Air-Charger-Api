import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    birthdate: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    attributes: {
        type: Object,
    },
    verification: {
        type: Object,
        default: {
            status: false,
            otpCode:"",
            otpLastSent: Date,
            verifiedAt: Date
        }
    }
});

export default mongoose.model('User', userSchema);
