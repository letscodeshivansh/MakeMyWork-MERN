const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/MakeMyWork")

.then(() => {
    console.log("MongoDB connected");
})
.catch((error) => {
    console.error("MongoDB connection error:", error);
});

const SignUpInfoSchema = new mongoose.Schema({
    floatingInput: {
        type: String,
        required: true
    },
    floatingPassword: {
        type: String,
        required: true
    }
});

const postworkschema = new mongoose.Schema({
    title : {
        type: string,
        required: true
    },
    description: {
        type: st
    }

})

const SignUpInfo = mongoose.model("SignUpInfo", SignUpInfoSchema);

module.exports = SignUpInfo;
