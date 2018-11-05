const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({region: 'us-east-2', apiVersion: '2012-08-10'});

exports.handler =  (event, content, callback) => {

const id = event.id;
const name = event.name;
const gender = event.gender;
const interests = event.interests;
console.log('event', event);
console.log('id', id);
console.log('name', name);
console.log('gender', gender);
console.log('interests', interests);

var params = {
  Item: {
    "UserID": {
     S: id
    }, 
   "name": {
     S: name
    }, 
   "genger": {
     S: gender
    }, 
   "interests": {
     S: interests
    }
  }, 
  
  TableName: "find-your-match"
 };
 dynamodb.putItem(params, function(err, data) {
   if (err) {
       console.log(err, err.stack); // an error occurred
       callback(err);
   } else {    
    console.log(data);           // successful response
    

    callback(null, "Hi "+name+". Followings were recorded in DynamoDB "+data);
   }
 });

};


    // TODO implement
    // const response = {
    //     statusCode: 200,
    //     body: JSON.stringify('Hello ULA !')
    // };
    // return response;
