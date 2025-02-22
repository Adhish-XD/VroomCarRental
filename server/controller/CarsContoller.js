import CarModel from '../models/CarsModel.js';


// Controller function to handle adding a new car
export const addCar = async (req, res) => {
    try {
        const { carName, numberPlate, category, color, price } = req.body;
        const carImage = req.file.path; // Get the URL of the uploaded image from Cloudinary

        console.log('Uploaded file:', req.file);

        // Logging the carImage URL
        console.log('Uploaded car image URL:', carImage);

        // Set the status to "Available"
        const status = 'Available';

        // Create a new car instance
        const newCar = new CarModel({
            carName,
            numberPlate,
            category,
            color,
            carImage,
            status,
            price
        });

        // Save the new car to the database
        await newCar.save();

        // Respond with a success message and the saved car data
        res.status(201).json({ message: 'Car details saved successfully', car: newCar });
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ error: 'An error occurred while saving car details' });
    }
};



// Other controller functions for fetching, updating, and deleting cars...
// Controller function to handle fetching all cars
export const getAllCars = async (req, res) => {
    try {
        // Fetch all cars from the database
        const cars = await CarModel.find();

        // Respond with the list of cars
        res.status(200).json({ cars });
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ error: 'An error occurred while fetching cars' });
    }
};

// Controller function to handle fetching a single car by ID
export const getCarById = async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch the car with the specified ID from the database
        const car = await CarModel.findById(id);

        // If the car is not found, respond with a 404 status code
        if (!car) {
            return res.status(404).json({ error: 'Car not found' });
        }

        // Respond with the fetched car data
        res.status(200).json({ car });
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ error: 'An error occurred while fetching car details' });
    }
};

// // Controller function to handle updating a car by ID
// export const updateCarById = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const updatedCarData = req.body;

//         // Find the car with the specified ID and update its data
//         const updatedCar = await CarModel.findByIdAndUpdate(id, updatedCarData, { new: true });

//         // If the car is not found, respond with a 404 status code
//         if (!updatedCar) {
//             return res.status(404).json({ error: 'Car not found' });
//         }

//         // Respond with the updated car data
//         res.status(200).json({ message: 'Car updated successfully', car: updatedCar });
//     } catch (error) {
//         console.error('Error occurred:', error);
//         res.status(500).json({ error: 'An error occurred while updating car details' });
//     }
// };

// Controller function to handle deleting a car by ID
export const deleteCarById = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the car with the specified ID and delete it from the database
        const deletedCar = await CarModel.findByIdAndDelete(id);

        // If the car is not found, respond with a 404 status code
        if (!deletedCar) {
            return res.status(404).json({ error: 'Car not found' });
        }

        // Respond with a success message
        res.status(200).json({ message: 'Car deleted successfully' });
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ error: 'An error occurred while deleting car details' });
    }
};
// Function to fetch cars by category
export const fetchSportCars = async () => {
    try {
        // Fetch all cars with the category 'Sports'
        const sportCars = await CarModel.find({ category: 'Sports' });
        console.log('Sport cars:', sportCars);
        return sportCars;
    } catch (error) {
        console.error('Error fetching sport cars:', error);
        throw error;
    }
};
export const fetchLuxuryCars = async () => {
    try {
        // Fetch all cars with the category 'Luxury'
        const luxuryCars = await CarModel.find({ category: 'Luxury' });
        console.log('Luxury cars:', luxuryCars);
        return luxuryCars;
    } catch (error) {
        console.error('Error fetching luxury cars:', error);
        throw error;
    }
};
export const fetchRegularCars = async () => {
    try {
        // Fetch all cars with the category 'Normal'
        const normalCars = await CarModel.find({ category: 'Normal' });
        console.log('Normal cars:', normalCars);
        return normalCars;
    } catch (error) {
        console.error('Error fetching normal cars:', error);
        throw error;
    }
};

export const bookCar = async (_id, dropDate) => {
    try {
        console.log('Booking car with ID:', _id); // Log the ID of the car being booked
        // Log the CarModel object to inspect its structure
        console.log('This is CarModel',CarModel);
       
        // Ensure CarModel has the findById method
        if (typeof CarModel.findById !== 'function') {
            throw new Error('findById method is not defined on CarModel');
        }
        
        // Find the car by ID and update its status to "Booked"
        const car = await CarModel.findById(_id).exec();
        if (!car) {
            throw new Error('Car not found');
        }
        car.status = 'Booked';
        const updatedCar = await car.save();
        console.log('status:',car.status)
        // Schedule drop-off if drop date is in the future
        const today = new Date();
        const dropDateTime = new Date(dropDate);
        if (dropDateTime > today) {
            const timeDifference = dropDateTime.getTime() - today.getTime();
            setTimeout(async () => {
                try {
                    await dropOffCar(_id);
                } catch (error) {
                    console.error('Error occurred during drop-off:', error);
                }
            }, timeDifference);
        }

        return updatedCar;
    } catch (error) {
        console.error('Error occurred:', error);
        throw new Error('An error occurred while updating car status to "Booked"');
    }
};


// Controller function to handle updating the status of the car to "Available" after drop-off
export const dropOffCar = async (_id) => {
    try {
        // Find the car by ID and update its status to "Available"
        const car = await CarModel.findById(_id).exec();;
        if (!car) {
            throw new Error('Car not found');
        }
        car.status = 'Available';
        const updatedCar = await car.save();

        return updatedCar;
    } catch (error) {
        console.error('Error occurred:', error);
        throw new Error('An error occurred while updating car status to "Available"');
    }
};

// Controller function to handle updating a car by ID
export const updateCarById = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCarData = req.body;

        // Validate request body
        if (!updatedCarData || Object.keys(updatedCarData).length === 0) {
            return res.status(400).json({ error: 'Invalid request: no data provided for update' });
        }

        // Find the car with the specified ID and update its data
        const updatedCar = await CarModel.findByIdAndUpdate(id, updatedCarData, { new: true, runValidators: true });

        // If the car is not found, respond with a 404 status code
        if (!updatedCar) {
            return res.status(404).json({ error: 'Car not found' });
        }

        // Respond with the updated car data
        res.status(200).json({ message: 'Car updated successfully', car: updatedCar });
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ error: 'An error occurred while updating car details' });
    }
};