const axios = require('axios');
const debug = require('debug')('slash-command-template:type');
const qs = require('querystring');
const apiUrl = 'https://slack.com/api';
const users = require('./users');
const MongoClient = require('mongodb').MongoClient;

const displayDialog = async (dialogType, reqBody, res) => {
    const {trigger_id, text} = reqBody;
  
    let type = await getThingType('pop');
    console.log(type);
  
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


const getThingType = async (type) => {
    
  return await MongoClient.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`, async (err, client) => {
    const db = client.db('slack-bot-thing');
    console.log("in");
    return await db.collection('types').findOne({name:type});
  });
  
}

module.exports = { displayDialog, addThing };
