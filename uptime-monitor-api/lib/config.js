// Configuration variables

const nodeEnvironments = {};

nodeEnvironments.development = {
    'HTTP_PORT': 3000,
    'HTTPS_PORT' : 3001,
    'ENV' : 'development',
    'hashingSecret' : 'thisIsASecret',
    'maxChecks' : 5
};

nodeEnvironments.production = {
    'HTTP_PORT': 8080,
    'HTTPS_PORT' : 8081,
    'ENV' : 'production',
    'hashingSecret' : 'thisIsASecret',
    'maxChecks' : 5
};

const currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? 
process.env.NODE_ENV.toLowerCase() : "";

// Check current environment and defualt to staging
const environmentToExport = typeof(nodeEnvironments[currentEnvironment]) == 'object' ?
nodeEnvironments[currentEnvironment] : nodeEnvironments.development

module.exports = environmentToExport;

