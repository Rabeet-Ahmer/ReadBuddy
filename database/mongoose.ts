import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please add your Mongo URI to .env.local');
}

declare global {
    var mongooseCache: {
        conn: typeof mongoose | null,
        promise: Promise<typeof mongoose> | null
    }
}

let cached = global.mongooseCache || (global.mongooseCache = {conn: null, promise: null})

export const connectToDatabase = async () => {
    if (cached.conn) return cached.conn;
    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {bufferCommands: false}).then((mongoose) => mongoose)
    }
    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        console.error('MongoDB connection failed. Please check your MONGODB_URI');
        throw e;
    }
    console.info('MongoDB connected successfully');
    return cached.conn;
}