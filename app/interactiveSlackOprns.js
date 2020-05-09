const SlackViewsOpen = require('./sendSlackNotification').SlackViewsOpen;
const SlackConfirmSubmission = require('./sendSlackNotification').SlackConfirmSubmission;
const SlackApprovalSubmission = require('./sendSlackNotification').SlackApprovalSubmission;
const SlackApprovlActionConfrmn = require('./sendSlackNotification').SlackApprovalConfirmation;
const firestoreDataUpdate = require('./fsOperations').saveFSDoc;
const slackAppKey = process.env.SLACK_APP_TOKEN;

function SlacOperns(slackInrctvReqPayload, response) {
    this.slackInrctvReqPayload = slackInrctvReqPayload;
    this.response = response;
    
    console.log("Loaded Slack Interactive Message", this.slackInrctvReqPayload)
    if(this.slackInrctvReqPayload.token != slackAppKey) {
        this.slackInrctvReqPayload = null;
        this.response.status(403).send();
    } else if(this.slackInrctvReqPayload.type == 'shortcut') {
        console.log("Add Request to Bot - Type ShortCut")
        let slacksViewOpen = new SlackViewsOpen(this.slackInrctvReqPayload.trigger_id, this.slackInrctvReqPayload.user.username)
        this.slackInrctvReqPayload = null;
    } else if(this.slackInrctvReqPayload.type == 'view_submission') {
        let userInputAcronym, userInputExpnsn;
        this.slackInrctvReqPayload.view.blocks.map(blk => {
            if(blk.label) {
                if(blk.label.text.includes('Acronym')) {
                    //console.log(blk.label.text, blk.element.action_id)
                    userInputAcronym = [blk.block_id, blk.element.action_id];
                } else if(blk.label.text.includes('Expansion')) {
                    //console.log(blk.label.text, blk.element.action_id)
                    userInputExpnsn = [blk.block_id, blk.element.action_id];
                }
            }
        })
        userInputAcronym = this.slackInrctvReqPayload.view.state.values[userInputAcronym[0]][userInputAcronym[1]].value
        userInputExpnsn = this.slackInrctvReqPayload.view.state.values[userInputExpnsn[0]][userInputExpnsn[1]].value
        console.debug(userInputAcronym, userInputExpnsn)
        console.log("Confirm Request Submission from Bot - Type View Submission")
        let slcksubmission = new SlackConfirmSubmission(this.slackInrctvReqPayload.trigger_id, this.slackInrctvReqPayload.user.username, [userInputAcronym, userInputExpnsn]);
        let slckaprvl = new SlackApprovalSubmission(this.slackInrctvReqPayload.trigger_id, this.slackInrctvReqPayload.user.username, [userInputAcronym, userInputExpnsn]);
        this.slackInrctvReqPayload = null;
    } else if(this.slackInrctvReqPayload.type == 'interactive_message') {
        let requestUser = this.slackInrctvReqPayload.original_message.text.split(' wants')[0]
        let retrivedAcronymData = this.slackInrctvReqPayload.original_message.attachments[0].text.split('\n')
        retrivedAcronymData = retrivedAcronymData.map(a => {
            return a.split(": ")[1]
        });
        console.log(`Retrieved Acronym Data on Approval Message: ${retrivedAcronymData[1]}: ${retrivedAcronymData[2]} Requested by ${requestUser}`)
        console.log("Response Back URL- " + this.slackInrctvReqPayload.response_url);
        if(this.slackInrctvReqPayload.actions[0].name == "Reject") {
            console.log("Acronym not approved! by user- " + this.slackInrctvReqPayload.user.name);
        } else {
            let dsUpdateData = {};
            dsUpdateData[(retrivedAcronymData[1]).trim().replace(/\_/g, '').replace(/\*/g, '').replace(/\\n/g, '').toUpperCase()]
                = retrivedAcronymData[2].trim().replace(/\_/g, '').replace(/\*/g, '').replace(/\\n/g, '')
            
            console.log("Acronym entry approved! by user- " + this.slackInrctvReqPayload.user.name);
            console.log("To Write to DB", dsUpdateData)
            firestoreDataUpdate(dsUpdateData)
            
        }
        let slackAprvlAction = new SlackApprovlActionConfrmn(this.slackInrctvReqPayload.response_url, this.slackInrctvReqPayload.trigger_id, this.slackInrctvReqPayload.user.name,
            this.slackInrctvReqPayload.actions[0].name + (this.slackInrctvReqPayload.actions[0].name === "Reject" ? 'ed' : 'd'), requestUser, retrivedAcronymData, this.slackInrctvReqPayload.action_ts);
        this.slackInrctvReqPayload = null;
    }
    
    this.response.status(200).send();
    
}

module.exports = {SlacOperns: SlacOperns}



