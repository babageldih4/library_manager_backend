const fs = require('firebase-admin');

const serviceAccount = require('./../smsverification-d48c0-7978b3da3781.json');

fs.initializeApp({
  credential: fs.credential.cert(serviceAccount),
});

const db = fs.firestore();

module.exports = db.collection('sms');
