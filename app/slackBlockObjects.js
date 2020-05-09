const slackChannelID = process.env.SLACK_CHANNEL_ID;

function OpenViewsModalReq(triggerID, userID) {
    this.triggerID = triggerID;
    this.userID = userID;
    this.reqBodyString= JSON.stringify({
        trigger_id: this.triggerID,
        view: {
            "type": "modal",
            "title": {
                "type": "plain_text",
                "text": "iWonder",
                "emoji": true
            },
            "submit": {
                "type": "plain_text",
                "text": "Submit",
                "emoji": false
            },
            "close": {
                "type": "plain_text",
                "text": "Cancel",
                "emoji": true
            },
            "blocks": [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": `Hi @${this.userID} 👋 \n I'm the iWonderBot, Thanks for spending your time in enhancing my database!`
                    }
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "Please enter the new acronym and its expansion in the following input fields,"
                    }
                },
                {
                    "type": "divider"
                },
                {
                    "type": "input",
                    "element": {
                        "type": "plain_text_input"
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Acronyms/Jargons",
                        "emoji": false
                    }
                },
                {
                    "type": "input",
                    "element": {
                        "type": "plain_text_input"
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Expansion",
                        "emoji": true
                    }
                }
            ]
        }
    });
};

function ConfirmSubmissionReq(triggerID, userID, acrynmData) {
    this.triggerID = triggerID
    this.userID = userID
    this.acrynmData = acrynmData
    this.reqBodyString= JSON.stringify({
        trigger_id: this.triggerID,
        view:
            {
                "type": "modal",
                "title":
                    {
                        "type":
                            "plain_text",
                        "text":
                            "iWonder",
                        "emoji":
                            true
                    }
                ,
                "close":
                    {
                        "type":
                            "plain_text",
                        "text":
                            "close",
                        "emoji":
                            true
                    }
                ,
                "blocks":
                    [
                        {
                            "type": "section",
                            "text": {
                                "type": "mrkdwn",
                                "text": `Thanks for your help <@${this.userID}>! Your Inputs are taken and shared for review and approval! Hope soon it will get added to my DB! Thanks again for your help!`,
                                "verbatim": false
                            }
                        },
                        {
                            "type": "divider"
                        },
                        {
                            "type": "context",
                            "elements": [
                                {
                                    "type": "mrkdwn",
                                    "text": `Entries Submitted for Review: ${this.acrynmData[0]} : ${this.acrynmData[1]}`
                                }
                            ]
                        }
                    ]
            }
    })
};

function ApproveSubmissionReq(triggerID, userID, acrynmData) {
    this.triggerID = triggerID
    this.userID = userID
    this.acrynmData = acrynmData
    this.reqBodyString= JSON.stringify(
        {
            "text": `<@${this.userID = userID}> wants to add a new Acronym in iWonder's DB!\n Do you Approve the request?`,
            "channel": slackChannelID,
            "attachments":
                [
                    {
                        "text": `\nAcronym: *${this.acrynmData[0]}*\n Expansion: _${this.acrynmData[1]}_`,
                        "fallback": "You are unable to approve!",
                        "callback_id": "iWonderupdateKey",
                        "color": "#3AA3E3",
                        "attachment_type": "default",
                        "actions": [
                            {
                                "name": "Approve",
                                "text": "Approve",
                                "type": "button",
                                "value": "Yes",
                                "confirm": {
                                    "title": "You're approving!",
                                    "ok_text": "Yes",
                                    "dismiss_text": "No"
                                }
                            },
                            {
                                "name": "Reject",
                                "text": "Reject/Deny",
                                "style": "danger",
                                "type": "button",
                                "value": "No",
                                "confirm": {
                                    "title": "You're Rejecting!",
                                    "text": "Aware that it'll be shown that you rejected in the approval message!",
                                    "ok_text": "Yes",
                                    "dismiss_text": "No"
                                }
                            }
                        ]
                    }
                ]
            
        })
};

function ApproveActionConrfmtnReq(triggerID, userID, approvalStatus, requestUser, acrynmData, actionTimeStamp) {
    this.triggerID = triggerID;
    this.userID = userID;
    this.acrynmData = acrynmData;
    this.approvalStatus = approvalStatus;
    this.requestUser = requestUser;
    this.actionTimeStamp = actionTimeStamp;
    let color = this.approvalStatus === "Rejected" ? "#E01E5A" : "#2EB67D";
    
    this.reqBodyString=JSON.stringify(
        {
            "trigger_id": this.triggerID,
            "text": `${this.requestUser} requested to add a new Acronym in iWonder's DB!\n Do you Approve the request?`,
            "channel": slackChannelID,
            "attachments":
                [
                    {
                        "text": `\nAcronym: ${this.acrynmData[1]}\n Expansion: ${this.acrynmData[2]}`,
                        "fallback": "You are unable to approve!",
                        "callback_id": "iWonderupdateKey",
                        "attachment_type": "default",
                        "color": color,
                        "fields": [
                            {
                                "title": this.approvalStatus,
                                "short": false
                            }
                        ],
                        "footer": `<@${this.userID}> ${this.approvalStatus} the request!`,
                        "ts": this.actionTimeStamp
                    }
                ]
        })
}


module.exports = {
    OpenViewsModalReq: OpenViewsModalReq,
    ConfirmSubmissionReq: ConfirmSubmissionReq,
    ApproveSubmissionReq: ApproveSubmissionReq,
    ApproveActionConrfmtnReq: ApproveActionConrfmtnReq
    
}
