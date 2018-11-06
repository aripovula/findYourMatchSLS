const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({ region: 'us-east-2', apiVersion: '2012-08-10' });
let dataAsJsObject = [];

exports.handler = (event, context, callback) => {
    const type = event.type;
    if (type === 'all') {
        const params = {
            TableName: 'find-your-match'
        };

        dynamodb.scan(params, function (err, data) {
            if (err) {
                console.log(err);
                callback(err);
            } else {
                console.log(data);

                let i = 0;
                data.Items.map((item) => {

                    dataAsJsObject.push({
                        id: "" + item.UserID.S,
                        name: "" + item.name.S,
                        gender: "" + item.gender.S,
                        interests: "" + item.interests.S
                    });
                });
                console.log(data);
                callback(null, dataAsJsObject);
            }
        });
    } else if (type === 'single') {
        const params = {
            Key: {
                "UserID": {
                    S: "a22"
                }
            },
            TableName: 'find-your-match'
        };

        dynamodb.getItem(params, function (err, data) {
            if (err) {
                console.log(err);
                callback(err);
            } else {
                console.log(data);


                callback(null, {
                    id: "" + data.Item.UserID.S,
                    name: "" + data.Item.name.S,
                    gender: "" + data.Item.gender.S,
                    interests: "" + data.Item.interests.S
                });
            }
        });
    } else {
        callback('Get type is incorrect');
    }
};
