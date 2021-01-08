# Google Form responses to Discord automation
![sample](assets/sample.png)

## Setting up a Google Form
1. Open a new or existing Google Form in edit mode.
2. Select Script Editor from the "..." dropdown in the top right corner.

![Script Editor](assets/script_editor.png)

3. Replace the code in the script editor with the contents of [script.js](script.js).
4. Enter a Project Name (i.e. Discord Webhook) and click Save (but do not close the script editor yet!).

## Create a Discord Webhook
Assumed: you have created a Discord account, joined a Discord server with the "Manage Webhooks" permmission enabled and there is at least one text channel (to display the notifications).

1. Navigate to Server Settings \> Integrations \> Webhooks \> Create Webhook. Select the channel you want the notifications to be pushed to.
2. Click "Copy Webhook URL".

## Link the Google Form to the Discord Webhook
1. In the script editor, paste the Webhook URL between the '' symbols on the first line, and click Save.
2. Navigate to Edit \> Current Project's Triggers and select Add Trigger.
3. Change the event type to "On form submit" and click Save.
4. Provide permissions to the workflow as prompted.

Congratulations, your automation is now set up!

Note: if you cannot find the Edit menu in the script editor, make sure you are using the Legacy editor.
