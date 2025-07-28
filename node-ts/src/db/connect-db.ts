import mongoose from 'mongoose';


const DATABASE_NAME = "node-basic";

export async function connectManagedDb() {
    Promise.resolve(
        mongoose.connect(`${process.env.DATABASE_URL}/${DATABASE_NAME}`,{})
    ).then((data) => {
        console.log("Connected to MongoDB Successfully" + data.connection.host);
        console.log("Database Name: " + data.connection.name);
    }).catch((err) => {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1)
    });
}


// export async function connectLocalDb() {
//     Promise.resolve(
//         mongoose.connect(`${process.env.LOCAL_DATABASE_URL}/${DATABASE_NAME}`,{})
//     ).then((data) => {
//         console.log("Connected to Local MongoDB Successfully " + data.connection.host);
//         console.log("Database Name: " + data.connection.name);
//     }).catch((err) => {
//         console.error("Error connecting to Local MongoDB:", err);
//         process.exit(1)
//     });
// }


