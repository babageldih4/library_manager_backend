require('dotenv').config({
    path: './config/config.env',
});

const app = require('./app');
const { sequelize } = require('./models');
const PORT = process.env.PORT || 5019;
const server = app.listen(PORT, async() => {
    await sequelize.authenticate();
    console.log(`Connected to DB and listening on port ${PORT}...`);
});
process.on('unhandledRejection', (err) => {
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});