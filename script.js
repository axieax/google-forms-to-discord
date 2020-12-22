const webhookURL = '';

/* Restrictions (https://discord.com/developers/docs/resources/channel#embed-limits) */
// question name limited to 256 characters (will address in the future)
const maxTextLength = 1024;
// sum of all characters in an embed structure must not exceed 6000 characters (will address in the future)
const maxFields = 25; // will address in the future

function submitPost(e) {
    // retrieve and unpack data
    let responses = e.response.getItemResponses();

    // extract responses
    payload = []
    responses.forEach(response => {
        let item = response.getItem();
        let resp = response.getResponse();
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

        if (resp) payload.push({
            'name': item.getTitle(),
            'value': (resp.length <= maxTextLength) ? resp : resp.slice(0, maxTextLength - 3) + '...',
            'inline': false,
        });

    });

    // fields max length of 1000 characters
    // 10 questions max (embed)
    // use regex in the future
    console.log(payload);

    // create POST request to webhook
    let options = {
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/json',
        },
        'payload': JSON.stringify({
            'username': 'Response Carrier',
            'avatar_url': 'https://github.com/axieax/google-forms-to-discord/blob/main/assets/birb.jpg?raw=true',
            'embeds': [{
                'title': '✨ ' + e.source.getTitle() + ' has received a new response!',
                'fields': payload,
                'footer': {
                    'text': 'Google Forms to Discord Automation - www.github.com/axieax'
                },
            }],
        }),
    };
    if (payload.length) UrlFetchApp.fetch(webhookURL, options);
}
