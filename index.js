var express = require('express');
var app = express();
var path = require("path");
app.use(express.static(path.join(__dirname, 'public')));
console.log(". = %s", path.resolve("."));
console.log("__dirname = %s", path.resolve(__dirname));


app.get('/', function (req, res) {
  res.send('Hello World!');
});
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

app.get('/index', function(req, res) {
   res.sendFile(path.join(__dirname + '/index.html'));
});

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies


app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/voiceAnalysisDA', function(req, res) {

  console.log("DeepAffects", DeepAffects);
  var defaultClient = DeepAffects.ApiClient.instance;
   if(defaultClient === undefined) {
    console.log("undefined");
  }else {
    console.log(defaultClient);
  }
  // Configure API key authorization: UserSecurity
  var UserSecurity = defaultClient.authentications['UserSecurity'];
  UserSecurity.apiKey = "apiKey";

  var apiInstance = new DeepAffects.DiarizeApi();

  var body = DeepAffects.DiarizeAudio.fromFile( __dirname + "/sample.wav"); // DiarizeAudio | Audio object that needs to be diarized.
  body['sampleRate'] = 16000;
  body['speakers'] = 2;
  body['languageCode'] = 'en-US';
  body['encoding'] = 'WAV';


  var callbackAsync = function(error, data, response) {
    if (error) {
      console.error(error);
    } else {
       let objJsonStr = JSON.stringify(data);
       console.log('Sync Returned response: ' + objJsonStr);
       let objJsonB64 = Buffer.from(objJsonStr).toString("base64");
       fs.appendFile('STT-DeepAffects.txt', objJsonB64, function (err) {
          if (err) throw err;
          console.log('Saved!');
        });
    }
  };

  var callbackSync = function(error, data, response) {
    if (error) {
      console.error(error);
    } else {
      console.log('New Sync Returned data: ' + data);
      console.log('New Sync Returned response: ' + response.content);
      if (data.constructor == Array){
        console.log("data is an array");
        for (var i = 0; i < data.length; i++) {
            console.log("i is " + i)
            //console.log(i + " response string " + data[i].content);
            let buf = new Buffer(data[i].content, 'base64');
            var file = "test" + i + ".wav";
            fs.writeFile(file, buf, function(err) {
              if(err) {
                console.log("err", err);
              } else {
                console.log("successfully saved");
              }
            }); 
        }
      }
      if (response.constructor == Array){
        console.log("response is an array")
      }
      
    }
  };
  webhook = "http://your.webhook"
  apiInstance.asyncDiarizeAudio(body, webhook, callback);
  apiInstance.syncDiarizeAudio(body, callbackSync);
});


// Google Speech to Text, IBM speech to text was giving errors.
// Moreover google speech recognition is the best of all STT tools available.


