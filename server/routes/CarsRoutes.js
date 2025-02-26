import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { addCar,getAllCars, getCarById, updateCarById, deleteCarById, fetchSportCars ,fetchRegularCars} from '../controller/CarsContoller.js';

// Configure Cloudinary
cloudinary.config({
    cloud_name: 'dzbpdmo26',
    api_key: '894865434996119',
    api_secret: 'I0EocWvLEhvkAD4TGyDSF5mHAHc'
});

// Logging Cloudinary configuration
console.log('Cloudinary configuration:', cloudinary.config());

// Multer configuration using Cloudinary as storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'car-images', // Folder name to store the uploaded images
        allowed_formats: ['jpg', 'png'], // Allowed image formats
        transformation: [{ width: 500, height: 500, crop: 'limit' }] // Image transformation (optional)
    }
});

const parser = multer({ storage: storage });

const router = express.Router();

// Route to add a new car with image upload
router.post('/addcar', parser.single('carImage'), addCar);

//  added Route to fetch all cars
router.get('/', getAllCars);

// added Route to fetch regular cars
router.get('/regular', fetchRegularCars);

// Route to fetch a single car by ID
router.get('/:id', getCarById);

// Route to update a car by ID
router.put('/:id', updateCarById);

// Route to delete a car by ID
router.delete('/:id', deleteCarById);

// Route to fetch sports cars
router.get('/sports', fetchSportCars);


router.post('/book', async (req, res) => {
    try {
        const { carId, dropDate } = req.body; // Assuming carId and dropDate are provided in the request body

        // Call the bookCar function to update the car status
        const updatedCar = await bookCar(carId, dropDate);

        // Respond with success message
        res.status(200).json({ message: 'Car booked successfully', car: updatedCar });
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ error: 'An error occurred while booking the car' });
    }
});
export { router as CarRouter };
 