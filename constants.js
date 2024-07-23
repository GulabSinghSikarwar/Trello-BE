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
module.exports = { credentials }