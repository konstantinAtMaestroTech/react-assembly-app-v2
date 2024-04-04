var credentials = {
    credentials: {
        client_id: 'cJcXpNyRkMK4BkxpcfiGQJ8Eo7RkZRPG',
        client_secret: 'jmhsjiF6NGPAiE6l',
        grant_type: 'client_credentials',
        scope: 'data:read',
    },

    //Autodesk Platform Service base url
    BaseUrl: 'https://developer.api.autodesk.com',
    Version: 'v2'
};

credentials.Authentication = credentials.BaseUrl + '/authentication/' + credentials.Version + '/token'

module.exports = credentials;