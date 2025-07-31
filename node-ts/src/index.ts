import app from "./app";
import 'dotenv/config';
import { connectManagedDb } from "./db/connect-db";
// import { connectManagedDb } from "./db/connect-db";

const PORT = 5174;


connectManagedDb()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
        console.log('Environment:', process.env.NODE_ENV || 'development');
    });
}).catch(() => {
    console.log("failed to connect any database unable to start server")
    process.exit(1)
})



    