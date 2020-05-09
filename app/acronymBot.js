//const debug = require('@google-cloud/debug-agent').start({allowExpressions:true});
const od_fetch = require('./oxfDictionaryAPI');
const sendNotification = require('./sendSlackNotification').SlackNotify;
const firestoreDataFetch = require('./fsOperations').fetchFS;
let InteractiveSlackOprns = require('./interactiveSlackOprns.js').SlacOperns;
const slackAppKey = process.env.SLACK_APP_TOKEN;

module.exports = async (req, res) => {
    console.log("Request Path: ", req.path)
    console.log("Input Request: ", req.body);
    try {
        if(req.method != "POST") {
            res.status(404).send();
        } else if(req.path.includes("find/acronym")) {
            if(req.body.token != slackAppKey) {
                res.status(403).send();
            } else {
                let respResult, reqQuery;
                try {
                    reqQuery = req.body.event.text.toUpperCase().trim();
                } catch (e) {
                    reqQuery = req.body.text.toUpperCase().trim()
                }
                if(reqQuery.toLowerCase().trim().includes(('who am i'))) {
                    res.status(200).send({
                        "title": "Hello!",
                        "attachments": [{
                            "title": `Found you :wink: `,
                            "text": `<@${req.body.user_name}>`
                        }]
                    })
                    
                } else {
                    respResult = reqQuery != "" ? findAcronym(reqQuery) : "Send Some Text that I can look for :wink:";
                    res.status(200).send({
                        "title": "Results for your Query!",
                        "attachments": [{
                            "title": `Available Results for: ${reqQuery} `,
                            "text": await respResult
                        }]
                    })
                }
            }
        } else if(req.path.includes("add/acronym")) {
            let slackOprnCaller = new InteractiveSlackOprns(JSON.parse(req.body.payload), res);
        } else {
            res.status(404).send();
        }
    } catch (e) {
        console.error("Internal Error Occurred: ", e);
        res.status(500).send({
            error: {
                reason: "Error Occurred Internally",
                message: e.message,
                code: 500,
            },
        });
    }
};

async function findAcronym(queryInp) {
    
    //TODO:enable NLP to process the acronym List
    //return new Promise(async resolve => {
    
    let respOut;
    
    respOut = await Promise.all(
        queryInp.split(" ").map(async (a) => {
            return firestoreDataFetch().then(
                result => {
                    if(result[a]) {
                        console.log("Result: ", typeof result[a])
                        return `*${a}*: ${result[a].filter(Boolean).join(', \n')}`
                    }
                }
            )
            
        }));
    //console.log("valUE", respOut.filter(Boolean).join( ', \n'))
    
    if(respOut.filter(Boolean).join(', ') === "") ;
    return await respOut.filter(Boolean).join(', ') === "" ? dictonaryFetch(queryInp) : respOut.filter(Boolean).join(', \n');
}


async function dictonaryFetch(queryInp) {
    try {
        try {
            sendNotification(queryInp);
        } catch (e) {
            return "Unable to Send Slack Notification " + JSON.stringify(e)
        }
        
        return `No terms/Expansions found in my DB!
        (Don't forget to enhance me :wink: ! Come back and update my database once you know your answers!
        I also shared the query to my team! Lets see who is fast in updating me! :joy: !
        to update use \`/iwonder_update <search-key> <answer>\`)
        
        Meanwhile trying to see if there's a meaning for your query :wink:
        Looking in Oxford Dictionary for
         : ${await Promise.all(queryInp.split(" ").map(async qryInp => {
            return (await od_fetch(qryInp).then(async val => {
                val = JSON.parse(await val)
                if(!val.error) {
                    retString = `\n *${qryInp}*: \nProvider: ${val.metadata.provider};
            Total Results Found: ${val.results[0].lexicalEntries.length};
            ${val.results.length >= 0 ?
                        "Available Languages: " + (val.results.map(res => {
                            return res.language;
                        })).join(", ")
                        : "No Result Found"};
            Available lexical Entries: ${(val.results.length >= 0 ? (val.results.map(res => {
                            return res.lexicalEntries.length >= 0 ? (res.lexicalEntries.map(lexers => {
                                    return lexers.entries.length >= 0 ? (lexers.entries.map(entry => {
                                            return entry.etymologies ? entry.etymologies : "Not Found"
                                        }))
                                        : "No Entries/Record Found"
                                }))
                                : "No lexicalEntries Found"
                        }))
                        : "No Result Found").join(", ")}
            Available Meanings: ${(val.results.length >= 0 ? (val.results.map(res => {
                            return res.lexicalEntries.length >= 0 ? (res.lexicalEntries.map(lexers => {
                                    return lexers.entries.length >= 0 ? (lexers.entries.map(entries => {
                                            return entries.senses.length >= 0 ? (entries.senses.map(sense => {
                                                    return sense.definitions ? sense.definitions : "Meaning Not Found"
                                                }))
                                                : "No Meanings Found"
                                        }))
                                        : "No Entries/Record Found"
                                }))
                                : "No lexicalEntries Found"
                        }))
                        : "No Result Found").join(", ")}
            Available Examples/Usage: ${(val.results.length >= 0 ? (val.results.map(res => {
                            return res.lexicalEntries.length >= 0 ? (res.lexicalEntries.map(lexers => {
                                    return lexers.entries.length >= 0 ? (lexers.entries.map(entries => {
                                            return entries.senses.length >= 0 ? (entries.senses.map(senses => {
                                                    return (senses.examples ? (senses.examples.length >= 0 ? (senses.examples.map(example => {
                                                            return example.text ? example.text : ""
                                                        }))
                                                        : "") : "")
                                                }))
                                                : "No Meanings Found"
                                        }))
                                        : "No Entries/Record Found"
                                }))
                                : "No lexicalEntries Found"
                        }))
                        : "No Result Found").join(", ")}`
                } else {
                    retString = `\n*${qryInp}* \n: ${val.error} ! \n  Try sending the required word alone without any spaces or symbols! \n example: /iWonder Magic \n`
                }
                return retString;
            }))
        }))
        }`
    } catch (e) {
        return "Unable to Fetch from Dictonary " + JSON.stringify(e)
    }
}

/*
debug.isReady().then(() => {
    debugInitialized = true
    console.log("Debugger is initialize")
});*/

