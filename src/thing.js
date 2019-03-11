const axios = require('axios');
const debug = require('debug')('slash-command-template:type');
const qs = require('querystring');
const apiUrl = 'https://slack.com/api';
const users = require('./users');
const MongoClient = require('mongodb').MongoClient;

const displayDialog = (dialogType, reqBody, res) => {
    const {trigger_id, text} = reqBody;
  
    getThingType('pop');
    
    if (dialogType === 'add') {
      
      
  
  
      const dialog = {
        token: process.env.SLACK_ACCESS_TOKEN,
        trigger_id,
        dialog: JSON.stringify({
          title: 'Add a new type of thing',
          callback_id: 'add-type',
          submit_label: 'Submit',
          elements: [
            {
              label: 'Name of the new type of thing',
              type: 'text',
              name: 'typeName',
              value: text,
              hint: 'camelCase, no special characters',
            },
            {
              label: 'JSON',
              type: 'textarea',
              max_length: 3000,
              name: 'json',
              hint: 'JSON representation of the new type'
            },
            {
              label: 'Send message to channel upon creation',
              type: 'select',
              value: 'no',
              name: 'notifyChannel',
              options: [
                { label: 'No', value: 'no' },
                { label: 'Yes', value: 'yes' }
              ]
            }
          ]
        })
      };
    
      

      // open the dialog by calling dialogs.open method and sending the payload
      axios.post(`${apiUrl}/dialog.open`, qs.stringify(dialog))
        .then((result) => {
          debug(result);
          console.log(result.data);
          debug('dialog.open: %o', result.data);
          res.send('');
        }).catch((err) => {
          debug('dialog.open call failed: %o', err);
          res.sendStatus(500);
        });
    }

}

const addThing = (body) => {
  const thing = {};
  
  //console.log(body);
  
  
  const typeFields = JSON.parse(body.submission.json.replace(/(\r\n|\n|\r)/gm, ""));
  const typeFieldsRaw = body.submission.json;
  const userId = body.user.id;
  
}


const getThingType = (type) => {
    
  MongoClient.connect(`mongodb://{process.env.MONGO_USER}:{process.env.MONGO_PASSWORD}@{process.env.MONGO_HOST}:{process.env.MONGO_PORT}/{process.env.MONGO_DB}`, (err, client) => {
    console.log(err);
    const db = client.db('slack-bot-thing');
    
    db.collection('types').find({name:type}, (err, doc) => {
      console.log(doc);
      client.close();
    });
  });
  

}

module.exports = { displayDialog, addThing };
