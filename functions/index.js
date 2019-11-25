const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

//Function to create specific UIDs
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// First function is meant to write something in the database
exports.writeNewData = functions.https.onRequest(async (request, response) => {
  const writeResult = await admin.firestore().collection('emulatorTest').add({UUID: uuidv4()});
  // Send back a message that we've succesfully written the message
  response.json({result: `Message with ID: ${writeResult.id} added.`});
});

// Second function is meant to read the collection
exports.readData = functions.https.onRequest((request, response) => {
  try {
    const collectionReference = admin.firestore().collection('emulatorTest');
    var allData = collectionReference.get()
      .then(snapshot => {
        const users = snapshot.docs.map (doc => doc.data());
        snapshot.forEach(doc => {
          console.log(doc.id, '=>', doc.data());
        });
        response.json(users);
      })
      .catch(err => {
        console.log('Error getting documents', err);
        response.json(err);
      });
  }
  catch(error){
    console.log('Error executing the function', error);
    response.json(err);
  }
});

//Third function is to check the emulator trigger
exports.onWriteData = functions.firestore
  .document('emulatorTest/{docId}')
  .onWrite((change, context) => {
    console.log("it's working")
    console.log(JSON.stringify(change.after.data()));
    return ({"response": change.after.data() });
});
