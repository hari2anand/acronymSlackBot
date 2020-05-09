const slackHook = process.env.SLACK_WEBHOOK;
const slackViewsURL = "https://slack.com/api/views.open";
const slackChatURL = "https://slack.com/api/chat.postMessage";
const slackViewsPayload = require('./slackBlockObjects').OpenViewsModalReq;
const slackConfrmnPayload = require('./slackBlockObjects').ConfirmSubmissionReq;
const slackApprvlReqPayload = require('./slackBlockObjects').ApproveSubmissionReq;
const slackApprvlConfmPayload = require('./slackBlockObjects').ApproveActionConrfmtnReq;

let request = require("request");


module.exports = {
    SlackNotify: SlackNotify,
    SlackApprovalSubmission: SlackApprovalSubmission,
    SlackApprovalConfirmation: SlackApprovalConfirmation,
    SlackConfirmSubmission: SlackConfirmSubmission,
    SlackViewsOpen: SlackViewsOpen
}


function SlackNotify(queryInp) {
    this.queryInp = queryInp
    console.log('Submitting Slack Notification for New Unkown word')
    
    let options = {
        'method': 'POST',
        'url': slackHook,
        'headers': {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "title": "Missed Query",
            "attachments": [{
                "title": `Someone Missed to find results from iWonder! `,
                "text": `Worth a check? -  "***${this.queryInp}***"`
            }]
        })
        
    };
    
    request(options, function (error, response) {
        if(error) throw new Error(error);
        console.debug(response.body);
        //resolve(response.body);
    });
}

function SlackViewsOpen(triggerID, userID) {
    this.triggerID = triggerID
    this.userID = userID
    console.log('Submitting Slack User Entry Modal')
    this.reqPayload= new slackViewsPayload(this.triggerID,this.userID).reqBodyString
    
    let options = {
        'method': 'POST',
        'url': slackViewsURL,
        'headers': {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + process.env.SLACK_APP_AUTHTOKEN
        },
        body: this.reqPayload
    };
    console.log(" Slack Views Open Request");
    console.log(options.body);
    
    request(options, function (error, response) {
        if(error) throw new Error(error);
        console.log("Slack Views Open Response");
        console.log(response.body);
        //console.log(response);
    });
}

function SlackConfirmSubmission(triggerID, userID, acrynmData) {
    this.triggerID = triggerID
    this.userID = userID
    this.acrynmData = acrynmData
    console.log('Submitting Slack Confirmation for User Entry')
    
    let options = {
        'method': 'POST',
        'url': slackViewsURL,
        'headers': {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + process.env.SLACK_APP_AUTHTOKEN
        },
        body: new slackConfrmnPayload(this.triggerID,this.userID, this.acrynmData).reqBodyString
    };
    console.log("Confirmation to Slack Request");
    console.log(options.body);
    
    request(options, function (error, response) {
        if(error) throw new Error(error);
        console.log("Slack View Confirmation Response");
        console.log(response.body);
        //console.log(response);
    });
}

function SlackApprovalSubmission(triggerID, userID, acrynmData) {
    this.triggerID = triggerID
    this.userID = userID
    this.acrynmData = acrynmData
    console.log('Submitting Slack Approval Request')
    let options = {
        'method': 'POST',
        'url': slackChatURL,
        'headers': {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + process.env.SLACK_APP_AUTHTOKEN
        },
        body: new slackApprvlReqPayload(this.triggerID,
            this.userID,
            this.acrynmData).reqBodyString
        
    };
    
    request(options, function (error, response) {
        if(error) throw new Error(error);
        console.log(response.body);
        //resolve(response.body);
    });
}

function SlackApprovalConfirmation(url, triggerID, userID, approvalStatus, requestUser, acrynmData, actionTimeStamp) {
    this.triggerID = triggerID
    this.userID = userID
    this.acrynmData = acrynmData
    this.approvalStatus = approvalStatus;
    this.requestUser = requestUser;
    this.actionTimeStamp = actionTimeStamp
    
    console.log('Submitting Slack Approval Confirmation')
    
    let options = {
        'method': 'POST',
        'url': url,
        'headers': {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + process.env.SLACK_APP_AUTHTOKEN
        },
        body: new slackApprvlConfmPayload(this.triggerID,
            this.userID,
            this.approvalStatus,
            this.requestUser,
            this.acrynmData,
            this.actionTimeStamp).reqBodyString
        
    };
    console.log("Approval Action Confirmation Message Request")
    console.log(options.body);
    
    request(options, function (error, response) {
        if(error) throw new Error(error);
        console.log(response.body);
        //resolve(response.body);
    });
}

