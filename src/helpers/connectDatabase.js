const mongoose = require("mongoose");

function getDatabaseUri() {
    if (process.env.NODE_ENV == "production") return '';
    if (process.env.NODE_ENV == "test") return 'mongodb://localhost/story-test';
    return 'mongodb://localhost/story';
}
mongoose.connect(getDatabaseUri(), { useNewUrlParser: true })
    .then(() => console.log("Database connected!"))
    .catch(error => {
        console.log(error);
        process.exit(1);
    });