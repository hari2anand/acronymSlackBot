const {
    Firestore
} = require("@google-cloud/firestore");

const   firestore = new Firestore();

const fsCollection= process.env.FS_COLLECTION_NAME,
      fsIdentifier= process.env.FS_COLLECTION_IDENTIFIER;
module.exports= {
    saveFSDoc: (fsAddDocData)=>
        {

            let docRef = firestore.collection(fsCollection).doc(fsIdentifier);

            docRef.get()
                .then(doc => {
                    if (doc.exists) {
                        if (doc.data()[Object.keys(fsAddDocData)]) {
                            let fsFoundFlag = false;
                            doc.data()[Object.keys(fsAddDocData)].map(fsDoc => {
                                if (fsDoc.toLowerCase() === fsAddDocData[Object.keys(fsAddDocData)].toLowerCase()) {
                                    console.log("Found", fsAddDocData[Object.keys(fsAddDocData)])
                                    fsFoundFlag = true
                                }
                            })
                            !fsFoundFlag ?
                                (() => {
                                    console.log(`Appending ${fsAddDocData[Object.keys(fsAddDocData)]} to existing key ${Object.keys(fsAddDocData)}`)
                                    document = doc.data();
                                    document[Object.keys(fsAddDocData)] = [...doc.data()[Object.keys(fsAddDocData)], ...[fsAddDocData[Object.keys(fsAddDocData)]]];
                                    docRef.set(document);
                                }).call() :
                                console.log(`Ignoring, as the value ${fsAddDocData[Object.keys(fsAddDocData)]} already exists for ${Object.keys(fsAddDocData)}`);
                        } else {
                            fsAddDocData[Object.keys(fsAddDocData)] = [fsAddDocData[Object.keys(fsAddDocData)]];
                            fsAddDocData = {...doc.data(), ...fsAddDocData};
                            console.log("documents after: " + JSON.stringify(fsAddDocData));
                            docRef.set(fsAddDocData);
                        }
                    }
                    else{console.log("Not Exists")
                        fsAddDocData[Object.keys(fsAddDocData)] = [fsAddDocData[Object.keys(fsAddDocData)]];
                        docRef.set(fsAddDocData);
                    }

                })
                .catch(err => {
                    console.log('Error getting document', err);

                });
        },
    fetchFS:  ()=>{

            const document = firestore.doc(`${fsCollection}/${fsIdentifier}`);
            return  document.get().then((doc) => {
                console.log("Document Retrieved");
               // console.debug(doc.data());
               return doc.data();
            ;})

    }
}



/* Sample Document input
let documents=  { "GA": ["Google Analytics"] }
*/
