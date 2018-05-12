var express    = require('express');
var Webtask    = require('webtask-tools');
var bodyParser = require('body-parser');
var request = require('request-promise');
var cheerio = require('cheerio');
var app = express();
var accountSid = 'AC4e7046efee884749b292c4d5eecb5c40';
var authToken = '3a278dd3321f35e2de65a35c93a6b8b4';
var twilio = require('twilio');
var client = new twilio(accountSid, authToken);

app.use(bodyParser.json());


app.get('/', function (req, res) {
  res.sendStatus(200);
  const options = {
    method: 'GET',
    uri: 'https://weworkremotely.com/categories/remote-programming-jobs',
  };

  // fetch response body from the jobs board site weworkremotely.com, scrape DOM data related to job postings, push links into an array and text the latest 10 job postings to a job seeker
  request(options).then(data => {
    let selector = cheerio.load(data);
    let links = [];
    selector('section.jobs ul li a').each(function(){
      links.push({
        link: `https://weworkremotely.com${selector(this).attr('href')}`,
        date: `${selector(this).find('time').text()}`
      });
    });
  
    let msg = 'Here are the last 10 job posts:';
    for(let i = 0; i <= 9; i++){
     msg += ` ${links[i].link} on ${links[i].date}.`;
    }
    console.log(msg);
    return client.messages.create({
      body: msg,
      to: '+15005550006',  // Twilio test account allows only for this single fake number
      from: '+15005550006'
    });
  })
  .then((message) => {
    console.log('successfully sent message', message.sid);
  })
  .catch(err => {
    console.log('error sending message', err);
  });
});

module.exports = Webtask.fromExpress(app);
