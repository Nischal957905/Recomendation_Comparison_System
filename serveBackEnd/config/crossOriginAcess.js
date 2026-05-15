
// List comma-separated production origins in CORS_ORIGINS.
const envOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)
    : []

const crossOriginAccess = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://web.postman.co/',
    ...envOrigins,
]

export default crossOriginAccess
