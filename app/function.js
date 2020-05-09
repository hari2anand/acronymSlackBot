const debug = require('@google-cloud/debug-agent').start({allowExpressions:true});

/* Deploy Command
gcloud functions deploy expense_exporter --runtime nodejs8 --trigger-http --allow-unauthenticated 

Cloud function can reached at 
https://us-central1-ingka-edu-group1-dev.cloudfunctions.net/expense_exporter
*/

exports.ocSlackBot = require('./acronymBot')

debug.isReady().then(() => {
    debugInitialized = true
    console.log("Debugger is initialize")
});
