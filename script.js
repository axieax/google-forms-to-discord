///////////////////////////////////////////////////////
//           Google Form to Discord Webhook          //
// https://github.com/axieax/google-forms-to-discord //
///////////////////////////////////////////////////////

/*
  SETUP OPTIONS
*/

// [TODO]: Paste your Discord Webhook URL in the quotation marks below (don't remove the quotation marks)
const webhookURL = "";
// [OPTIONAL]: If you want your responses to be hidden in the notification, change false to true below
const hideResponses = false;
// [OPTIONAL]: If you want to show incomplete rows for grids and checkbox grids, change true to false below
const hideEmptyRows = true;
// Further setup instructions can be found at https://github.com/axieax/google-forms-to-discord/

/*
  DO NOT MODIFY BELOW
*/

// Discord embed limits
const maxTextLength = 1024;
const maxFields = 25;

/**
 * Post Google Form responses to Discord Webhook
 */
function submitPost(e) {
  // prepare POST request to webhook
  const formTitle = e.source.getTitle() ?? "Untitled Form";
  const embed = {
    title: `✨ ${formTitle} has received a new response!`,
    footer: {
      text: "Google Forms to Discord Automation - https://github.com/axieax",
    },
    color: 16766720,
  };

  // retrieve and unpack data
  const responses = e.response.getItemResponses();
  // format responses if responses are not to be hidden in the webhook
  if (!hideResponses) {
    // extract responses
    const payload = extractResponses(responses);
    // ignore empty responses
    if (!payload.length) return;
    // include responses in payload
    embed.fields = payload;
  }

  // create POST request to webhook
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    payload: JSON.stringify({
      username: "Response Carrier",
      avatar_url:
        "https://github.com/axieax/google-forms-to-discord/blob/main/assets/birb.jpg?raw=true",
      embeds: [embed],
    }),
  };
  UrlFetchApp.fetch(webhookURL, options);
}

/**
 * Extract responses
 * @return {Array<string>}
 */
const extractResponses = (responses) => {
  const formatGridResponse = (response, questions) => {
    return response
      .map((answer, index) => {
        if (!hideEmptyRows || answer !== null) {
          return `${questions[index]}: ${
            Array.isArray(answer) ? answer.join(", ") : answer
          }`;
        }
      })
      .filter((x) => x !== undefined)
      .join("\n");
  };

  // format each response
  const payload = responses.map((r) => {
    const item = r.getItem();
    const response = r.getResponse();

    let resp, questions;
    switch (item.getType()) {
      case FormApp.ItemType.CHECKBOX:
        // display checkbox responses on separate lines
        resp = response.join("\n");
        break;
      case FormApp.ItemType.FILE_UPLOAD:
        // generate URL for uploaded files
        resp =
          "File(s) uploaded:\n" +
          response
            .map((fileID) => "https://drive.google.com/open?id=" + fileID)
            .join("\n");
        break;
      case FormApp.ItemType.GRID:
        // display grid responses on separate lines
        questions = item.asGridItem().getRows();
        resp = formatGridResponse(response, questions);
        break;
      case FormApp.ItemType.CHECKBOX_GRID:
        // display grid responses on separate lines
        questions = item.asCheckboxGridItem().getRows();
        resp = formatGridResponse(response, questions);
        break;
      default:
        // short answer, paragraph, multiple choice, linear scale, datetime
        resp = response;
        break;
    }

    return {
      name: item.getTitle(),
      value:
        resp.length <= maxTextLength
          ? resp
          : resp.slice(0, maxTextLength - 3) + "...",
      inline: false,
    };
  });

  // TODO: handle maxFields
  return payload;
};

/* Future Features:
Embed Limits (https://discord.com/developers/docs/resources/channel#embed-limits)
  - Embed Title (includes Form Title) - Maximum 256 characters
  - Payload Fields (includes Payload Responses) - Maximum 25 responses can be displayed
  - Field Name (includes Response Question) - Maximum 256 characters
  - Total Characters (includes Embed Title, Field Names, Field Values, Footer Text) - Maximum 6000 characters
      - https://developers.google.com/apps-script/reference/forms/form-response#toprefilledurl
Regex?
Date format
Extend ellipsis
*/
