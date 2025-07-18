import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import  { randomInt }  from 'crypto';


const router = express.Router();


function generateToken(user) {
    return jwt.sign({ id: user._id, phone: user.phone }, process.env.JWT_SECRET, { expiresIn: '1y' });
}

function verifyToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    }
    catch (error) {
        console.error('Token verification error:', error);
        return false;
    }
}

export { verifyToken };

// Token verification middleware
router.post('/verify-token', async (request, response) => {
    const {attributes} = request.body;
    const authHeader = request.headers.authorization;
    console.log(request.headers);
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    console.log(`Token: ${token}`);
    if (!token) {
        return response.status(200).json({ message: 'Token gerekli', done: false });
    }
    try {
        const decoded = verifyToken(token);
        if (!decoded) {
            return response.status(200).json({ message: 'Geçersiz token', done: false });
        }
        const user = await User.findById(decoded.id);
        console.log("USER:", user)
        if (!user) {
            return response.status(200).json({ message: 'Kullanıcı bulunamadı', done: false });
        }

        user.attributes = attributes;
        await user.save();
        response.status(200).json({ user, done: true });
    } catch (error) {
        console.error('Token doğrulama hatası:', error);
        response.status(200).json({ message: 'Token doğrulama sırasında bir hata oluştu', done: false });
    }
});

// Register
router.post('/register', async (request, response) => {
    const { name, surname, phone, birthdate, email, attributes } = request.body;
    const code = 111111; // randomInt(100000, 999999).toString();

    if (!name || !surname || !phone || !birthdate || !email) {
        return response.status(200).json({ message: 'Tüm alanlar zorunludur', done: false });
    }
    const cleanedPhone = phone.replace(/\s/g, '');

    if (cleanedPhone.length !== 13) {
        return response.status(200).json({ message: 'Geçersiz Telefon Numarası', done: false });
    }



    try {
        const existingUserPhone = await User.findOne({ phone });
        if (existingUserPhone) {
            return response.status(200).json({ message: 'Bu telefon numarası zaten kayıtlı', done: false });
        }

        const existingUserEmail = await User.findOne({ email });
        if (existingUserEmail) {
            return response.status(200).json({ message: 'Bu e-mail adresi zaten kayıtlı', done: false });
        }

        const newUser = new User({
            name,
            surname,
            phone,
            birthdate,
            email,
            attributes,
            verification:{
                otpCode: code.toString()
            }
        });
        console.log(`Yeni kullanıcı oluşturuldu: ${newUser.name} ${newUser.surname} - ${newUser.phone} - ${newUser.birthdate} - ${newUser.email}`);

        await newUser.save();
        const token = generateToken(newUser);
        response.status(200).json({ token, message: 'Kullanıcı başarıyla kaydedildi', done: true });
    } catch (error) {
        console.error('Kayıt hatası:', error);
        response.status(200).json({ message: 'Kayıt işlemi sırasında bir hata oluştu', done: false});
    }
});


// Phone verification
router.post('/verify-phone', async (request, response) => {
    const { phone } = request.body;
    const code = "111111"; //randomInt(100000, 999999).toString();

    console.log(`Generated code for ${phone}: ${code}`);
    
    try {
        const existingUser = await User.findOne({ phone });
        if (!existingUser) {
            return response.status(200).json({ message: 'Telefon numarası bulunamadı', done: false });
        }

        if (!existingUser.verification) {
            existingUser.verification = {};
        }

        existingUser.verification.otpCode = code;
        console.log(`${existingUser.verification.otpCode} kodu ${existingUser.phone} numarasına gönderildi`);
        existingUser.verification.otpLastSent = new Date();
        console.log(existingUser)
        // await existingUser.save();

        await User.findOneAndUpdate(
            { phone },
            existingUser
        )
        
        console.log(`SMS sent to ${existingUser.phone} with code: ${code}`);
        return response.status(200).json({ 
            done: true, 
            message: 'SMS gönderildi',
        });
    } catch (error) {
        console.error('Phone verification error:', error);
        return response.status(200).json({ message: 'Telefon doğrulama sırasında bir hata oluştu', done: false });
    }
});

// SMS verification
router.post('/verify-sms', async (request, response) => {
    const { phone, code } = request.body;
   
    if (!code) {
        return response.status(200).json({ message: 'Doğrulama kodu gerekli', done: false });
    }

    try {

        const user = await User.findOne({ phone });
        if (!user) {
            return response.status(200).json({ message: 'Telefon numarası bulunamadı', done: false });
        }

        if (!(user.verification.otpCode.toString() === code.toString())) {
            console.log(`SMS doğrulama kodu: ${code}, senin kodun: ${user.verification.otpCode}`);
            return response.status(200).json({ message: 'Doğrulama kodu yanlış', done: false });
        }

        user.verification.status = true;
        user.verification.verifiedAt = new Date();
        user.verification.otpCode = "";
        await user.save();
        console.log(`SMS doğrulandı: ${user.phone} ile kod: ${code}`);
        
        const newToken = generateToken(user);
        return response.status(200).json({ done: true, token: newToken, message: 'SMS doğrulandı' });

    } catch (error) {
        console.error('SMS doğrulama hatası:', error);
        return response.status(200).json({ message: 'SMS doğrulama sırasında bir hata oluştu', done: false });
    }
});

export default router;