var express    = require('express');
var Webtask    = require('webtask-tools');
var bodyParser = require('body-parser');
var request = require('request-promise');
var cheerio = require('cheerio');
var app = express();


var accountSid = 'AC4e7046efee884749b292c4d5eecb5c40'; // Your Account SID from www.twilio.com/console
var authToken = '3a278dd3321f35e2de65a35c93a6b8b4';   // Your Auth Token from www.twilio.com/console

var twilio = require('twilio');
var client = new twilio(accountSid, authToken);

app.use(bodyParser.json());

const options = {
				method: 'GET',
				// uri: config.base_alfred_url + '/v1.0/snapshot/creative-adcode',
				uri: 'https://weworkremotely.com/categories/remote-programming-jobs',
				// body: { creative: 'creative', container: 'container', folder: 'folder' },
				// headers: {
				// 	Authorization: `${token.auth_type} token="${token.secret}",aid="${advertiserId}"`
				// },
				// json: true
			};

request(options).then(data => {
  var selector = cheerio.load(data);
  console.log('asdfasdf');
  selector('section.jobs ul li a').each(function(){
    console.log(`sup ${selector(this).attr('href')}`);
  });
  // console.log(selector('section.jobs ul li'));
  
})
.catch(err => {
  console.log('err', err);
});
app.get('/', function (req, res) {
  res.sendStatus(200);
});

module.exports = Webtask.fromExpress(app);
