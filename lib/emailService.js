var mandrill = require('mandrill-api/mandrill');
mandrill_client = new mandrill.Mandrill('MAV-UzITtA_aLmknKBpz-A');

DEFAULT_MESSAGE = {
    "html": "<p>Travel with miles!</p>",
    "subject": "TRAVEL WITH MILES RESULTS FOUND WITH ",
    "from_email": "gonzalo.docarmo@gmail.com",
    "from_name": "Miles Check Script",
    "to": [{
            "email": "gonzalo.docarmo@gmail.com",
            "name": "Gonzalo",
            "type": "to"
        }
        ,
        {
        "email": "santiagoesteva@gmail.com",
        "name": "Santiago",
        "type": "to"
        }
    ],
    "important": true,
    "preserve_recipients": true,
    "view_content_link": false
};

function sendEmail(airline, results) {

    var message = DEFAULT_MESSAGE;
    message.subaccount = airline + "-miles";
    message.subject = message.subject + airline.toUpperCase();
    message.html += "<p>" + results.toString().replace(/,/g, '<br/>') + "</p>";

    return mandrill_client.messages.send({
        "message": message,
        "async": false,
        "ip_pool": null,
        "send_at": null
    }, function(result) {
        console.log(result);
        /*
        [{
                "email": "recipient.email@example.com",
                "status": "sent",
                "reject_reason": "hard-bounce",
                "_id": "abc123abc123abc123abc123abc123"
            }]
        */
    }, function(e) {
        // Mandrill returns the error as an object with name and message keys
        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
        // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
    });
}

module.exports.notify = sendEmail;