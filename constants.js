const credentials = {
    "web": {
        "client_id": "FILL YOUR CLIENT ID ",
        "project_id": "trello-clone-430311",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_secret": "FILL YOUR SECRET KEY",
        "redirect_uris": [
            "http://localhost:3000",
            "http://localhost:8000/auth/google/callback",
            "http://localhost:5000"
        ],
        "javascript_origins": [
            "http://localhost:3000",
            "http://localhost:8000",
            "http://localhost:5000"
        ]
    }
}
const StatusCode = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504
};

module.exports = { credentials ,StatusCode}