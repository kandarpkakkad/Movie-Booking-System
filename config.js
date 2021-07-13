const secret = "ThisIsSecret";
const mongo_username = "admin";
const mongo_password = "admin";
const mongo_url = `mongodb+srv://${mongo_username}:${mongo_password}@cluster0.wvhb6.mongodb.net/MovieBookingSystem?retryWrites=true&w=majority`;

module.exports = {
    secret: secret,
    mongo_url: mongo_url
};