import dotenv from "dotenv";
import {connectDB} from "./db/index.js";
import {app} from "./app.js";
import selfPing from "./utils/selfPing.js";
dotenv.config();

connectDB()
    .then(() => {
        app.on("error",(err)=>{
            console.log("MONGODB Connection Error: ", err);
        })
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB:", err);
        process.exit(1);
    });