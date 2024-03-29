'use strict';

const {
    dialogflow,
    Suggestions,
} = require('actions-on-google');

const functions = require('firebase-functions');
// const admin = require('firebase-admin');

// const sgMail = require('@sendgrid/mail');
// // const SENDGRID_API_KEY = functions.config().sengrid.key;
// const app = dialogflow({
// 	clientId: '274009990685-cbp4ol5ura0qjpjssk5v32g8rcm7347o.apps.googleusercontent.com',
// });

const app = dialogflow({});
var Sentiment = require('sentiment');
var sentiment = new Sentiment();
var keywordExtractor = require("keyword-extractor");

// admin.initializeApp(functions.config().firebase);
// admin.firestore().settings({ timestampsInSnapshots: true });
// sgMail.setApiKey(SENDGRID_API_KEY);

// const auth = admin.auth();
// const db = admin.firestore();

// const nutrientRef = db.collection('nutrients');
// const userRef = db.collection('users');
// const quotesRef = db.collection('quotes');
// const fitnessRef = db.collection('fitness');
// const diseasesRef = db.collection('disease-oriented');

// const logo = 'https://i.ibb.co/SnWXCgw/Logo-Final.png';
// const imagebg = 'https://i.ibb.co/tL6z7WH/bg1.png';


// const myoption = [
// 	'How can I help you today ?',
// 	'What can I help you with today ?',
// 	'What can I do for you today ?',
// ];
// const myoption2 = [
// 	'This feature is still under development. It might be pushed to release in my future versions.',
// 	'Sorry! But my developers are too lazy playing games that they decided that they might put this in the next release.',
// 	'Hey there, this feature just might be available to you in the next update. Stay tuned to get it real quick.',
// 	'Are you a beta tester? If so, you\'ll be the first one to test this feature if this rolls out. For now please be patient and stay tuned.',
// ];


// function formatDate(date) {
// 	var monthNames = [
// 		"Jan", "Feb", "Mar",
// 		"Apr", "May", "Jun", "Jul",
// 		"Aug", "Sept", "Oct",
// 		"Nov", "Dec"
// 	];

// 	var day = date.getDate();
// 	var monthIndex = date.getMonth();
// 	var year = date.getFullYear();

// 	return day + ' ' + monthNames[monthIndex] + ' ' + year;
// }

// function today() {
// 	var today = new Date();
// 	var day = today.getDay();
// 	var daylist = ["sunday", "monday", "tuesday", "wednesday ", "thrusday", "friday", "saturday"];

// 	return daylist[day];
// }

app.intent('sentiment', (conv, { x }) => {
    var result = sentiment.analyze(x);
    var extraction_result = keywordExtractor.extract(x, {
        language: "english",
        remove_digits: true,
        return_changed_case: true,
        remove_duplicates: false
    });
    for (let i = 0; i < result.words.length; i++) {
        if (extraction_result.includes(result.words[i])) {
            var index = extraction_result.indexOf(result.words[i]);
            if (index > -1) {
                extraction_result.splice(index, 1);
            }
        }
    }
    console.log(extraction_result);


    switch (result.score) {
        case 0: conv.ask('Oh okay. How has life changed in the last year');
            break;
        case 1: conv.ask('Interesting. Are there any other instances where you feel' + result.positive[0]);
            break;
        case 2: conv.ask('I felt you' + result.negative[0] + 'and' + result.positive[0] + 'are interesting' + 'Tell me something about' + result.positive[0]);
            break;


        case -1: conv.ask('Interesting. Are there any other instances where you feel' + result.negative[0]);
            break;

        case -2: conv.ask('Oh\ ' + 'It\s tough ' + result.negative[0] + 'Life can be tough sometimes');
            break;
        default: conv.ask('No value fucker');
            break;
    }

    conv.ask('Your Keywords are' + extraction_result);  
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);