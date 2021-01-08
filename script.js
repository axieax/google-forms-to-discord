///////////
// SETUP //
///////////

// [TODO]: Paste your Discord Webhook URL in the quotation marks below
const webhookURL = '';
// [OPTIONAL]: If you want your responses to be hidden in the notification, change false to true below
const hideResponses = false;

// Setup instructions: https://github.com/axieax/google-forms-to-discord/


/////////////////////////
// DO NOT MODIFY BELOW //
/////////////////////////

// Discord embed limits
const maxTextLength = 1024;
const maxFields = 25;

// Main Function
function submitPost(e) {
    // retrieve and unpack data
    let responses = e.response.getItemResponses();

    // extract responses
    let payload = [];
    extractResponses(payload, responses);
    
    // ignore empty responses
    if (!payload.length) return;

    // prepare POST request to webhook
    let formTitle = e.source.getTitle();
    if (!formTitle) formTitle = 'Untitled form';
    let embed = {
        'title': '✨ ' + formTitle + ' has received a new response!',
        'footer': {
            'text': 'Google Forms to Discord Automation - www.github.com/axieax',
        },
        'color': 16766720,
    }
    // include responses in payload unless specified otherwise
    if (!hideResponses) embed.fields = payload;
    
    // create POST request to webhook
    let options = {
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/json',
        },
        'payload': JSON.stringify({
            'username': 'Response Carrier',
            'avatar_url': 'https://github.com/axieax/google-forms-to-discord/blob/main/assets/birb.jpg?raw=true',
            'embeds': [embed],
        }),
    };
    UrlFetchApp.fetch(webhookURL, options);
}


// Extract Responses
function extractResponses(payload, responses) {
    responses.forEach(response => {
        let item = response.getItem();
        let resp = response.getResponse();
        let respFmt;
        switch (item.getType()) {
            case FormApp.ItemType.CHECKBOX:
                // Checkbox
                respFmt = '';
                resp.forEach(option => {
                    respFmt += option + '\n';
                })
                resp = respFmt;
                break;
            case FormApp.ItemType.FILE_UPLOAD:
                // File upload
                resp = 'File(s) uploaded';
                break;
            case FormApp.ItemType.GRID:
                // Multiple choice grid
                respFmt = '';
                rows = item.asGridItem().getRows();
                for (i = 0; i < resp.length; i++) {
                    // skip empty rows?
                    respFmt += rows[i] + ': ' + resp[i] + '\n';
                }
                resp = respFmt; // new lines
                break;
            case FormApp.ItemType.CHECKBOX_GRID:
                // Tick box grid
                respFmt = '';
                rows = item.asCheckboxGridItem().getRows();
                for (i = 0; i < resp.length; i++) {
                    // skip empty rows?
                    respFmt += rows[i] + ': ' + resp[i] + '\n';
                }
                resp = respFmt; // new lines
                break;
            default:
                // Short answer, paragraph, multiple choice, linear scale, date, time
                break;
        }
        
        // ignore empty responses
        if (resp) payload.push({
            'name': item.getTitle(),
            'value': (resp.length <= maxTextLength) ? resp : resp.slice(0, maxTextLength - 3) + '...',
            'inline': false,
        });
    });
}


/* Future Features:
Embed Limits (https://discord.com/developers/docs/resources/channel#embed-limits)
    - Embed Title (includes Form Title) - Maximum 256 characters
    - Payload Fields (includes Payload Responses) - Maximum 25 responses can be displayed
    - Field Name (includes Response Question) - Maximum 256 characters
    - Total Characters (includes Embed Title, Field Names, Field Values, Footer Text) - Maximum 6000 characters
        - https://developers.google.com/apps-script/reference/forms/form-response#toprefilledurl
Regex?
*/
