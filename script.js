const webhookURL = "";

function submitPost(e) {
    // retrieve and unpack data
    let responses = e.response.getItemResponses();
    let payload = responses.map(x => ({
        "name": x.getItem().getTitle(),
        "value": x.getResponse(),
        "inline": false
    }));
    console.log(payload);
    // create post request to webhook
    let options = {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
        },
        "payload": JSON.stringify({
            "content": "",
            "embeds": [{
                "title": e.source.getTitle() + " has received a new response!",
                "fields": payload,
            }]
        }),
    };
    UrlFetchApp.fetch(webhookURL, options);
}
