const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");
const connectionString = process.env.ATLAS_URI;
const client = new MongoClient(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let dbConnection;

module.exports = {
  connectToServer: async function (callback) {
    try{
      client.connect();
      dbConnection = client.db("daycare_db");
      mongoose.connect(
        connectionString,
        (err) => {
         if(err) console.log(err) 
         else console.log("mongdb is connected");
        }
      );
      return callback();
  }catch(err){
      console.log(err)
  }},

  getDb: function () {
    return dbConnection;
  },
};