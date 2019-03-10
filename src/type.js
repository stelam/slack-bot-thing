const axios = require('axios');
const debug = require('debug')('slash-command-template:type');
const qs = require('querystring');


const displayDialog = (dialogType, reqBody, res) => {
    const {trigger_id, text} = reqBody;
  
    if (dialogType === 'add') {
    
    }
  
    const dialog = {
      token: process.env.SLACK_ACCESS_TOKEN,
      trigger_id,
      dialog: JSON.stringify({
        title: 'Submit a helpdesk ticket',
        callback_id: 'submit-ticket',
        submit_label: 'Submit',
        elements: [
          {
            label: 'Name of the new type of things',
            type: 'text',
            name: 'title',
            value: text,
            hint: 'camelCase, no special characters',
          },
          {
            label: 'Description',
            type: 'textarea',
            name: 'description',
            optional: true,
          },
          {
            label: 'Urgency',
            type: 'select',
            name: 'urgency',
            options: [
              { label: 'Low', value: 'Low' },
              { label: 'Medium', value: 'Medium' },
              { label: 'High', value: 'High' },
            ],
          },
        ],
      }),
    };

    // open the dialog by calling dialogs.open method and sending the payload
    axios.post(`${apiUrl}/dialog.open`, qs.stringify(dialog))
      .then((result) => {
        debug('dialog.open: %o', result.data);
        res.send('');
      }).catch((err) => {
        debug('dialog.open call failed: %o', err);
        res.sendStatus(500);
      });

}

module.exports = { displayDialog };
