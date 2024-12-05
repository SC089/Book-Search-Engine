import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || '';

console.log('MONGODB_URI:', process.env.MONGODB_URI);

if (!MONGODB_URI) {
    console.error('Error: MONGODB_URI is not defined in the environment variables.');
    process.exit(1);
}

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
            ssl: true, 
            tlsAllowInvalidCertificates: true,
        });
        console.log('Connected to MongoDB successfully!');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    }
};

connectDB();

export default mongoose.connection;
