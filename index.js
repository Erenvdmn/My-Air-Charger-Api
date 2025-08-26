import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import Device from './models/Device.js';
import Place from './models/Places.js';
import  { randomInt }  from 'crypto';
import authapp from './routes/auth.js';
import admin from './admin.js';
import { verifyToken } from './routes/auth.js';
import { MONGO_URI } from "./helpers/config.js"
import morgan from "morgan";
import { AuthMiddleware } from './helpers/middleware.js';




const app = express();
dotenv.config();


const PORT = 5000;


app.use(cors());
app.use(express.json());

morgan.token('time', () => {
  return new Date().toISOString();
});

app.use(morgan(':method :url :status - :response-time ms - Time: :time'));

app.use('/auth',authapp);
app.use('/admin', admin);

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('MongoDB connection error:', error); 
});


// Showing places nearby
app.post('/places/nearby', AuthMiddleware, async(request, response)  => {
    const { longitude, latitude, radius } = request.body;

    if (!longitude || !latitude || !radius) {
        return response.status(200).json({ message: 'Konum bilgileri eksik', done: false});
    }

    try {
        const places = await Place.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance: radius * 1000
                }
            }
        });

        response.status(200).json({ places, done: true});
    } catch (error) {
        console.error('Listeleme hatası', error);
        response.status(200).json({ message: 'yakın yerler alınamadı', done: false})
    }
});

//showing devices by place
app.get('/devices/:placeId', verifyToken, async (request, response) => {
    const { placeId } = request.params;

    try {
        const devices = await Device.find({ placeId });
        response.status(200).json({devices, is_listed: true});
    } catch (error) {
        console.error('Cihaz listeleme hatası:', error);
        response.status(200).json({ message: 'Cihaz listeleme işlemi sırasında bir hata oluştu', is_listed: false });
    }
});

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);

    /*
    try {
        const deviceExamples = await Device.find({});
        if (deviceExamples.length === 0) {
            await Device.insertMany([
                {
                placeId: "68824a791e95f97811dca78b",
                available: true,
                chargeLevel: 85,
                maxOutput: 150
            },
            {
                placeId: "68824a791e95f97811dca78b",
                available: true,
                chargeLevel: 92,
                maxOutput: 250
            },
            {
                placeId: "68824a791e95f97811dca78b",
                available: false,
                chargeLevel: 23,
                maxOutput: 100
            },
            {
                placeId: "68824a791e95f97811dca78b",
                available: true,
                chargeLevel: 78,
                maxOutput: 300
            },
            {
                placeId: "68824a791e95f97811dca78b",
                available: true,
                chargeLevel: 100,
                maxOutput: 200
            },
            {
                placeId: "68835d82edb3248213f623b3",
                available: true,
                chargeLevel: 67,
                maxOutput: 180
            },
            {
                placeId: "68835d82edb3248213f623b3",
                available: false,
                chargeLevel: 12,
                maxOutput: 120
            },
            {
                placeId: "68835d82edb3248213f623b3",
                available: true,
                chargeLevel: 89,
                maxOutput: 350
            },
            {
                placeId: "68835d82edb3248213f623b3",
                available: true,
                chargeLevel: 45,
                maxOutput: 220
            },
            {
                placeId: "68835d82edb3248213f623b3",
                available: true,
                chargeLevel: 73,
                maxOutput: 160
            },
            {
                placeId: "68835da2edb3248213f623b6",
                available: false,
                chargeLevel: 8,
                maxOutput: 80
            },
            {
                placeId: "68835da2edb3248213f623b6",
                available: true,
                chargeLevel: 96,
                maxOutput: 400
            },
            {
                placeId: "68835da2edb3248213f623b6",
                available: true,
                chargeLevel: 54,
                maxOutput: 275
            },
            {
                placeId: "68835da2edb3248213f623b6",
                available: true,
                chargeLevel: 81,
                maxOutput: 190
            },
            {
                placeId: "68835da2edb3248213f623b6",
                available: false,
                chargeLevel: 31,
                maxOutput: 140
            },
            {
                placeId: "68836caaedb3248213f623c6",
                available: true,
                chargeLevel: 88,
                maxOutput: 320
            },
            {
                placeId: "68836caaedb3248213f623c6",
                available: true,
                chargeLevel: 65,
                maxOutput: 240
            },
            {
                placeId: "68836caaedb3248213f623c6",
                available: true,
                chargeLevel: 91,
                maxOutput: 180
            },
            {
                placeId: "68836caaedb3248213f623c6",
                available: false,
                chargeLevel: 15,
                maxOutput: 110
            },
            {
                placeId: "68836caaedb3248213f623c6",
                available: true,
                chargeLevel: 77,
                maxOutput: 290
            }

            ]);
            console.log("Test mekanları başarıyla eklendi.");
        } else {
            console.log("Veritabanında zaten mekanlar var.");
        }
        
    } catch (error) {
        console.error("Mekan ekleme hatası:", error);
    }
        */

    /*
    try {
        const existingPlaces = await Place.find({});
        if (existingPlaces.length === 0) {
            // Test için mekan eklendi
            await Place.insertMany([
        {
            name: "Kadıköy Şarj Noktası",
            description: "Kadıköy sahilde hızlı şarj imkanı.",
            address: "Kadıköy, İstanbul",
            location: {
            type: "Point",
            coordinates: [29.0291, 40.9902]
            },
            workingHours: "08:00-22:00",
            deviceCount: 4,
            availableCount: 2
        },
        {
            name: "Beşiktaş Meydan",
            description: "Beşiktaş merkezde konum.",
            address: "Beşiktaş, İstanbul",
            location: {
            type: "Point",
            coordinates: [29.0255, 41.0438]
            },
            workingHours: "07:00-23:00",
            deviceCount: 6,
            availableCount: 4
        },
        {
            name: "Taksim Şarj Alanı",
            description: "Yoğun bölgede merkezi şarj.",
            address: "Taksim, İstanbul",
            location: {
            type: "Point",
            coordinates: [28.9855, 41.0369]
            },
            workingHours: "24 Saat",
            deviceCount: 8,
            availableCount: 7
        },
        {
            name: "Bakırköy Şarj Parkı",
            description: "Sessiz ve rahat ortam.",
            address: "Bakırköy, İstanbul",
            location: {
            type: "Point",
            coordinates: [28.8721, 40.9746]
            },
            workingHours: "09:00-21:00",
            deviceCount: 5,
            availableCount: 3
        },
        {
            name: "Üsküdar Sahil Şarj",
            description: "Manzaralı konum.",
            address: "Üsküdar, İstanbul",
            location: {
            type: "Point",
            coordinates: [29.0268, 41.0228]
            },
            workingHours: "06:00-00:00",
            deviceCount: 3,
            availableCount: 1
        },
        {
            name: "Maslak Teknokent",
            description: "İş yerlerine yakın.",
            address: "Maslak, İstanbul",
            location: {
            type: "Point",
            coordinates: [29.0122, 41.1095]
            },
            workingHours: "08:00-20:00",
            deviceCount: 10,
            availableCount: 9
        },
        {
            name: "Bostancı Şarj Noktası",
            description: "Metro yakınında kolay erişim.",
            address: "Bostancı, İstanbul",
            location: {
            type: "Point",
            coordinates: [29.0908, 40.9639]
            },
            workingHours: "07:00-22:00",
            deviceCount: 4,
            availableCount: 2
        },
        {
            name: "Zeytinburnu Şarj",
            description: "Kolay park alanı mevcut.",
            address: "Zeytinburnu, İstanbul",
            location: {
            type: "Point",
            coordinates: [28.9076, 40.9989]
            },
            workingHours: "08:00-20:00",
            deviceCount: 5,
            availableCount: 3
        },
        {
            name: "Şişli Merkez",
            description: "Hastane ve AVM yakınında.",
            address: "Şişli, İstanbul",
            location: {
            type: "Point",
            coordinates: [28.9846, 41.0600]
            },
            workingHours: "08:00-21:00",
            deviceCount: 6,
            availableCount: 4
        },
        {
            name: "Ataşehir Finans Merkezi",
            description: "Yeni nesil şarj istasyonu.",
            address: "Ataşehir, İstanbul",
            location: {
            type: "Point",
            coordinates: [29.1173, 40.9922]
            },
            workingHours: "09:00-19:00",
            deviceCount: 7,
            availableCount: 5
        }
        ]);
            console.log("Test mekanları başarıyla eklendi.");
        } else {
            console.log("Veritabanında zaten mekanlar var.");
        }
    } catch (error) {
        console.error("Mekan ekleme hatası:", error);
    }*/
});