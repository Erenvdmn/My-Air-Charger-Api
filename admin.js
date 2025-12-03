import express, { request, response } from 'express';
import jwt from 'jsonwebtoken';
import Places from './models/Places.js';
import User from './models/User.js';
import Device from './models/Device.js';
import DeviceReq from './models/DeviceReq.js';
import { verifyToken } from './routes/auth.js';
import { getAddressFromCoordinates } from './helpers/geocode.js';
import { AuthMiddleware } from './helpers/middleware.js';


const admin = express.Router();


// Get address from coordinates
admin.post('/get-address', AuthMiddleware, async(request, response) => {
    const { lat, lng } = request.body;

    if (!lat || !lng) {
        return response.status(200).json({ message: 'Koordinatlar eksik', done: false});
    }

    try {
        const address = await getAddressFromCoordinates(lat, lng);
        
        if (!address) {
            return response.status(200).json({ message: 'Adres alınamadı', done: false});
        }

        return response.status(200).json({ address, done: true });
    } catch (error) {
        console.error('Adres alma hatası:', error);
        response.status(200).json({ message: 'Adres alma sırasında hata oluştu', done: false});
    }
});

// add new place
admin.post('/add-places', AuthMiddleware, async(request, response) => {
    const { name, description, location, workingHours, deviceCount, availableCount} = request.body;

    if (!name || !description || !location || !workingHours || !deviceCount || !availableCount) {
        return response.status(200).json({ message: 'bilgiler eksik', done: false});
    }

    try {

        const address = await getAddressFromCoordinates(location.coordinates[1], location.coordinates[0]);

        if (!address) {
            return response.status(200).json({ message: 'Seçilen konum için adres alınamadı', done: false});
        }


        const newPlace = new Places({
            name,
            description,
            address,
            location: {
                type: "Point",
                coordinates: location.coordinates
            },
            workingHours,
            deviceCount,
            availableCount
        });


        await newPlace.save();
        response.status(200).json({ message: 'Mekan başarıyla kaydedildi', done: true });
    } catch (error) {
        console.error('Kayıt hatası:', error);
        response.status(200).json({ message: 'Kayıt işlemi sırasında bir hata oluştu', done: false});
    }
});


// update places
admin.post('/update-places', AuthMiddleware, async (request, response) => {
    const { name, description, location, workingHours, deviceCount, availableCount, id } = request.body;

    if (!name || !description || !location || !workingHours || !deviceCount || !availableCount) {
        return response.status(200).json({ message: 'bilgiler eksik', done: false });
    }

    try {

        const address = await getAddressFromCoordinates(location.coordinates[1], location.coordinates[0]);
        
        if (!address) {
            return response.status(200).json({ message: 'Seçilen konum için adres alınamadı', done: false});
        }

        const updatedPlace = await Places.findOneAndUpdate(
            { _id: id },
            {
                name,
                description,
                address,
                location: {
                    type: "Point",
                    coordinates: location.coordinates
                },
                workingHours,
                deviceCount: parseInt(deviceCount),
                availableCount: parseInt(availableCount)
            },
            { new: true }
        );

        if (!updatedPlace) {
            return response.status(200).json({ message: 'Mekan bulunamadı', done: false });
        }

        response.status(200).json({ message: 'Mekan başarıyla güncellendi', done: true });
    } catch (error) {
        console.error('Kayıt hatası:', error);
        response.status(200).json({ message: 'Kayıt işlemi sırasında bir hata oluştu', done: false });
    }
});


// creating places table
admin.get('/places-table', AuthMiddleware, async(request, response) => {
    try {
        const places = await Places.find().sort({ createdAt: -1});
        response.status(200).json({places, done:true})
    } catch (error) {
        console.error('Error fetching objects:', error);
        return res.status(200).json({ message: 'Sunucu hatası', done:false });
    }
});


// creating users table
admin.get('/users-table', AuthMiddleware, async(request, response) => {
    try {
        const users = await User.find().sort({ createdAt: -1});
        response.status(200).json({users, done:true})
    } catch (error) {
        console.error('Error fetching objects:', error);
        return res.status(200).json({ message: 'Sunucu hatası', done: false });
    }
});

// creating devices table
admin.get('/device-table', AuthMiddleware, async(request, response) => {
    try {
        const devices = await Device.find().sort({sort: -1});
        response.status(200).json({devices, done:true})
    } catch (error) {
        console.error('Error fetching devices: ', error);
        return response.status(200).json({ message: 'sunucu hatası', done: false})
    }
});

// Post devices info
admin.post('/devices-info', async (request, response) => {
    try {
        const deviceReq = new DeviceReq({
            outcomeReq: request.body
        });

        const saved = await deviceReq.save();
        response.status(200).json({ message: 'device infos saved',saved, done: true})
    } catch (error) {
        response.status(200).json({ message: 'db error', done: false})
    }
});

// Get devices info
admin.get('/devices-info', async (request, response) => {
    try {
        const all = await DeviceReq.find();
        response.status(200).json({ all, done: true})
    } catch (error) {
        response.status(200).json({ message: 'db error', error})
    }
});


export default admin;