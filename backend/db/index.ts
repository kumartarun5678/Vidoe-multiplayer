import mongoose from 'mongoose';
import { DB_NAME } from '../constants.ts';

const connectDB = async () => {
    try{
        const connectionIntance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log('Connected to the database:', connectionIntance.connection.host);
    }catch(error){
        console.error('Error connecting to the database', error);
        process.exit(1);
    }
};

export default connectDB;