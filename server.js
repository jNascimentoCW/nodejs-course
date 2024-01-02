const mongoose = require('mongoose');
const dotenv = require('dotenv');

//Uncaught exceptions
process.on('uncaughtException', (err) => {
    console.log(err.name, err.message);
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    process.exit(1);
});

dotenv.config({ path: 'config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD,
);

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
    .then(() => console.log('DB connection successful!'));
// .catch((err) => console.log('ERROR'));

const port = process.env.PORT || 3000;
const server = app.listen(port, (req, res) => {
    console.log(`App running on port ${port}...`);
});

//Unhandle rejection
process.on('unhandledRejection', (err) => {
    console.log(err.name, err.message);
    console.log('UNHANDELR REJECTION! 💥 Shutting down...');
    server.close(() => {
        process.exit(1);
    });
});
