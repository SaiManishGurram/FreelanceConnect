
const admin = require('firebase-admin');
const serviceAccount = require('../config/firebase-service-account.json'); // Ensure this is correct

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;
