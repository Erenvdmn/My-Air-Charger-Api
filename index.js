import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from './models/User.js';
import Device from './models/Device.js';
import Place from './models/Places.js';
import  { randomInt }  from 'crypto';
import authapp from './routes/auth.js';
import { verifyToken } from './routes/auth.js';
import { MONGO_URI } from "./helpers/config.js"



const app = express();
dotenv.config();


const PORT = 5000;


app.use(cors());
app.use(express.json());


app.use('/auth',authapp)

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('MongoDB connection error:', error); 
});


// showing all places
app.get('/places', verifyToken, async (request, response) => {
    try {
        const places = await Place.find({});
        response.status(200).json({places, is_listed: true});
    } catch (error) {
        console.error('Yer listeleme hatası:', error);
        response.status(200).json({ message: 'Yer listeleme işlemi sırasında bir hata oluştu', is_listed: false });
    }
});

//showing devices by place
app.get('/devices/:placeId', verifyToken, async (request, response) => {
    const { placeId } = request.params;

    try {
        const devices = await Device.find({ placeId});
        response.status(200).json({devices, is_listed: true});
    } catch (error) {
        console.error('Cihaz listeleme hatası:', error);
        response.status(200).json({ message: 'Cihaz listeleme işlemi sırasında bir hata oluştu', is_listed: false });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});