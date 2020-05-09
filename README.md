# iWonder Slack Bot

iWonder is the Slack bot, developed to ease the search of Jargons, acronyms and abbreviated terms, for eg., GCS is the term which a commoner find hard to understand unless is told about the expanded form "Google Cloud Platform"! This slack Bot helps the user to understand such acronyms.

## Usage

The Slack bot has is backend deployed as Google cloud function, written in Node. The same can be deployed with this repo using following commands

```console
$ gcloud config set project <gcp-project-id>
$ gcloud functions deploy ocSlackBot --quiet  --runtime nodejs8 --source=./app/ --trigger-http --entry-point=ocSlackBot --timeout=540 --allow-unauthenticated --region=europe-west3 --service-account=<service-account> -set-env-vars=SLACK_APP_TOKEN=GcMqc7AoNKB7UXc1k4tLgFuP,GCS_BUCKET_NAME=<GCS_BUCKET_NAME>,ACRONYM_FILE=<acronyms_reference_filename>
```

### User Operations

 The Slack bot can be invoked using the slash commands (The app home page block development is in progress!), like ```/iWonder What is GCS```! Then the app responds the expansion privately to the user! (This's done as the user can look for the values anywhere!)

#### Maintenance

This app can be updated with the latest abbreviations and acronyms for the same, users don't have to raise any PR to the app instead can directly load the Acronym and its value to the Slack Modal, invoked with the slack app shortcut!. Once the users key-in the data! app responds with a Thanks for confirming the request, in-parallel it will send for an approval/confirmation to the admin-slack channel to get the entries reviewed validated and approved! Once an admin member approves the request, the new acronym gets added to the iWonder's DB.

#### Env Variables

The cloud function uses following environment variables

- DICT_URL  - ApiURL from the Oxford Dictionary api
- DICT_APPID (encrypted value) - AppID from the Oxford Dictionary api
- DICT_KEY (encrypted value) - AppKey from the Oxford Dictionary api
- FS_COLLECTION_NAME - Firestore Data Collection Key
- FS_COLLECTION_IDENTIFIER - Firestore DataCollection Identifier
- SLACK_APP_TOKEN (encrypted value) - Slack App Incoming Request token used to validate the incoming request from the slack
- SLACK_APP_AUTHTOKEN (encrypted value) - Slack App Auth Token, used to authorize the request to SLACK
- SLACK_CHANNEL_ID (encrypted value) - Slack Admin Channel ID, used for sending approval requests! and new words adding suggestion.
- SLACK_WEBHOOK - Slack WebHook to send new word suggestion notifications.

##### gcloud KMS Encryptions

The function takes KMS encrypted values for the following environment variables and the service account

- SLACK_APP_TOKEN
- DICT_APPID
- DICT_KEY
- SLACK_APP_AUTHTOKEN
- SLACK_CHANNEL_ID
- SERVICEACCOUNT

(Encryption sample )

```
echo -n <string-value-to-encrypt> | gcloud kms encrypt --plaintext-file=- --ciphertext-file=- --location=<location> --keyring=<kms-keyring-name> --key=<kms-key-name> | base64
```

#### Deployments

Cloud functions get auto deployed to GCP on Successful merge from the cloud build based on the steps defined in Cloudbuild.yaml and the same also can be done manually (once validated) with following gcloud command

```
$ gcloud builds submit  . --config=cloudbuild-prod.yaml
```
