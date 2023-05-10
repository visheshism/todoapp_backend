import { App } from "./App.js";
import { dbConn } from "./data/dbConn.js";
import { MONGO_URI, PORT } from "./data/env.js";

dbConn(MONGO_URI)

App.listen(PORT,()=>{
    console.log(`Listening on PORT ${PORT}`)
})