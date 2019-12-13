switch (process.env.NODE_ENV) {
    case 'development':
        module.exports = require('./development');
        break;
    case 'production':
        module.exports = require('./production');
        break;
    default:
        console.error("Unrecognized NODE_ENV: " + process.env.NODE_ENV);
        process.exit(1);
}