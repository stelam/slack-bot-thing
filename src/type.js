const axios = require('axios');
const debug = require('debug')('slash-command-template:type');
const qs = require('querystring');
const apiUrl = 'https://slack.com/api';


const displayDialog = (dialogType, reqBody, res) => {
    const {trigger_id, text} = reqBody;
    
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

const addType = (body) => {
  
}

module.exports = { displayDialog, addType };
