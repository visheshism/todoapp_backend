import mongoose from "mongoose";

export const dbConn = (URI) => {
    mongoose.connect(URI, { dbName: "todo_app" }).then(s => console.log(`DB connected at ${s.connection.host}`)).catch(err => console.log(err.message))
}