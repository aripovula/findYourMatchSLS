const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({ region: 'us-east-2', apiVersion: '2012-08-10' });
const cisp = new AWS.CognitoIndentityServiceProvider({ version: '2016-04-18' });

exports.handler = (event, context, callback) => {
    const accessToken = event.accessToken;
    const candidateID = event.candidateID;
    const params = {
        Key: {
            "UserID": {
                S: "a01"
            }
        },
        TableName: 'find-your-match'
    };
    const cispParams = {
        "AccessToken": accessToken
    };
    cispParams.getUser(cispParams, (err, result) => {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            dynamodb.deleteItem(params, function (err, data) {
                if (err) {
                    console.log(err);
                    callback(err);
                } else {
                    console.log(data);
                    callback(null, data);
                }
            });

        }

    });


};
