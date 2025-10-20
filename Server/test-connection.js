import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const testConnection = async () => {
    try {
        console.log('🔍 Testing MongoDB connection...');
        console.log('MongoDB URI:', process.env.MONGODB_URI);
        
        const connection = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('✅ Connected to MongoDB successfully!');
        console.log('Host:', connection.connection.host);
        console.log('Database:', connection.connection.name);
        
        // Test creating a simple document
        const testSchema = new mongoose.Schema({
            name: String,
            test: Boolean
        });
        
        const TestModel = mongoose.model('Test', testSchema);
        
        const testDoc = new TestModel({
            name: 'Test Document',
            test: true
        });
        
        await testDoc.save();
        console.log('✅ Test document created successfully!');
        
        // Clean up
        await TestModel.deleteOne({ _id: testDoc._id });
        console.log('✅ Test document cleaned up!');
        
        await mongoose.disconnect();
        console.log('✅ Disconnected from MongoDB');
        
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        console.error('Full error:', error);
        process.exit(1);
    }
};

testConnection();
