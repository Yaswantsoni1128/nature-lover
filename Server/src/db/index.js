import mongoose from "mongoose";
export const connectDB = async () => {
    try {
        const mongoURI = `${process.env.MONGODB_URI}`;
        
        const connectionInstance = await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log("\n✅ MONGODB CONNECTED !! Host: ", connectionInstance.connection.host);
    } catch (error) {
        console.error("❌ MONGODB CONNECTION FAILED: ", error.message);
        console.error("Full error:", error);
        process.exit(1);
    }
}