var mongoose = require("mongoose");
var dbUrl = //"mongodb://localhost/mekanbul";
    "mongodb+srv://Sarvar55:serDev2002@mekanbul.kuzfkhr.mongodb.net/mekanbul?retryWrites=true&w=majority";
require("./mekanshema");
mongoose.connect(dbUrl);

mongoose.connection.on("connected", () => {
    console.log(dbUrl + "adresindeki veri tabanin abaglandi");
});

mongoose.connection.on("error", () => {
    console.log("Baglanti hatasi");
});

mongoose.connection.on("disconnected", () => {
    console.log("Baglanti kesilidi");
});

function close(msg, callback) {
    mongoose.connection.close(() => {
        console.log(msg);
        callback();
    });
}
process.on("SIGINT", () => {
    close("Uygulama kapatilidi", () => {
        process.exit(0);
    });
});