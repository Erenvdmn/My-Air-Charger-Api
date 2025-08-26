import mongoose from 'mongoose';

const deviceReqSchema = new mongoose.Schema({
    outcomeReq: {
        type: Object
    }
});

export default mongoose.model('DeviceReq', deviceReqSchema)