const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app= express();
const PORT = process.env.PORT || 3000;

//Middleware
app.use(bodyParser.json());

//MongoDB Connection
mongoose.connect('mongodb://localhost:27017/social-network', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});
mongoose.connection.on('error', (err) => {
    console.error(err);
    process.exit(1);
});
mongoose.connection.once('open', () => {
    console.log('mongoDB connected');
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`)
    });
});

//Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/thoughts', require('./routes/thoughts'));
app.use('/api/reactions', require('./routes/reactions'));

module.exports = app;