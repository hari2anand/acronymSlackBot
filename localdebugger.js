const express = require("express");
const reqMaker = require("./app/acronymBot");
let app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.all("/*", reqMaker);

app.listen(8080, () => {
    console.log(" ********** : running on 8080");
});

process.on("SIGINT", function () {
    console.log("Caught interrupt signal");
    process.exit();
});

/*{
    projectId: 'project-name',
    keyFilename: './auth/serviceaccount.json'
  }
  
  */
