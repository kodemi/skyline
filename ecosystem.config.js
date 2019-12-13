module.exports = {
    apps: [
        {
            name: 'API',
            script: './src/server/index.js',
            interpreter: 'node@8.0.0',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            env: {
                NODE_ENV: 'development'
            },
            env_production: {
                NODE_ENV: 'production'
            }
        }
    ]
};
