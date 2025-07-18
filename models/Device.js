import mongoose from 'mongoose';

const deviceSchema = new mongoose.Schema({
    placeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place',
        required: true
    },
    available: {
        type: Boolean,
        default: true
    },
    chargeLevel: {
        type: Number,
        required: true
    },
    maxOutput: {
        type: Number,
        required: true
    }
});

export default mongoose.model('Device', deviceSchema);
