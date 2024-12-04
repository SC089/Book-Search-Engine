import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://sacasadevall:4VRZor3ijm6VLviT@project-cluster.vvxou.mongodb.net/');

export default mongoose.connection;
