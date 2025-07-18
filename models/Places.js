import mongoose from 'mongoose';

const placeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    },
    workingHours: {
        type: String,
        required: true
    },
    deviceCount: {
        type: Number,
        required: true
    },
    availableCount: {
        type: Number,
        required: true
    }
});

// 2dsphere index tanımı
placeSchema.index({ location: '2dsphere' });

export default mongoose.model('Place', placeSchema);
