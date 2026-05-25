
/**
 * PATIMAP REST API - v4.0 (AI ENHANCED)
 */

const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs').promises;
const { GoogleGenAI } = require('@google/genai');

const app = express();
const PORT = process.env.PORT || 5000;

// Gemini AI Client Initialization
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// 1. MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure Uploads Directory Exists
const ensureUploadDir = async () => {
    try {
        await fs.mkdir('./uploads', { recursive: true });
    } catch (err) {
        console.error("Upload folder error:", err);
    }
};
ensureUploadDir();

// 2. MONGODB CONNECTION
mongoose.connect('mongodb://localhost:27017/patimap', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('🚀 MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// 3. SCHEMA & MODEL
const IlanSchema = new mongoose.Schema({
    baslik: { type: String, required: true },
    aciklama: { type: String, required: true },
    sehir: { type: String, required: true },
    iletisim: { type: String, required: true },
    resimUrl: { type: String, required: true },
    tur: { type: String, default: 'Bilinmeyen' }, // Filled by Gemini
    olusturulmaTarihi: { type: Date, default: Date.now }
});
const Ilan = mongoose.model('Ilan', IlanSchema);

// 4. MULTER STORAGE CONFIG
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `pati-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage });

// 5. AI CLASSIFICATION HELPER
async function classifyPetImage(filePath) {
    try {
        const data = await fs.readFile(filePath);
        const base64Data = data.toString('base64');

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: {
                parts: [
                    { inlineData: { data: base64Data, mimeType: 'image/jpeg' } },
                    { text: "Analyze this pet photo. Is it a 'Kedi' (Cat) or 'Köpek' (Dog)? Return only the single word: 'Kedi', 'Köpek', or 'Bilinmeyen'." }
                ]
            }
        });

        const text = response.text?.trim();
        return ['Kedi', 'Köpek'].includes(text) ? text : 'Bilinmeyen';
    } catch (error) {
        console.error("AI Classification Failure:", error);
        return 'Bilinmeyen';
    }
}

// 6. API ENDPOINTS

/**
 * POST /api/ilan-olustur
 */
app.post('/api/ilan-olustur', upload.single('resim'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Resim yüklenemedi." });
        }

        // AI Classification
        const petType = await classifyPetImage(req.file.path);

        const yeniIlan = new Ilan({
            ...req.body,
            resimUrl: `/uploads/${req.file.filename}`,
            tur: petType
        });

        await yeniIlan.save();

        res.status(201).json({
            success: true,
            message: "İlan ve AI analizi başarılı!",
            data: yeniIlan
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "İlan oluşturulamadı.", error: error.message });
    }
});

/**
 * GET /api/ilanlar
 */
app.get('/api/ilanlar', async (req, res) => {
    try {
        const ilanlar = await Ilan.find().sort({ olusturulmaTarihi: -1 });
        res.status(200).json({ success: true, data: ilanlar });
    } catch (error) {
        res.status(500).json({ success: false, message: "Liste getirilemedi." });
    }
});

/**
 * DELETE /api/ilanlar/:id
 */
app.delete('/api/ilanlar/:id', async (req, res) => {
    try {
        const ilan = await Ilan.findById(req.params.id);
        if (!ilan) {
            return res.status(404).json({ success: false, message: "İlan bulunamadı." });
        }

        // Delete File from Disk
        const absolutePath = path.join(__dirname, ilan.resimUrl);
        try {
            await fs.unlink(absolutePath);
            console.log("🗑️ File deleted:", absolutePath);
        } catch (err) {
            console.warn("⚠️ File already missing or inaccessible:", absolutePath);
        }

        // Delete Record from DB
        await Ilan.findByIdAndDelete(req.params.id);

        res.status(200).json({ success: true, message: "İlan ve görsel başarıyla silindi." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Silme işlemi başarısız." });
    }
});

app.listen(PORT, () => console.log(`📡 PatiMap API running on port ${PORT}`));
