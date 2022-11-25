var express = require('express'),
    request = require('request'),
    bodyParser = require('body-parser'),
    app = express();

var myLimit = typeof(process.argv[2]) != 'undefined' ? process.argv[2] : '100kb';
console.log('Using limit: ', myLimit);

app.use(bodyParser.json({limit: myLimit}));

app.all('*', function (req, res, next) {

    // Set CORS headers: allow all origins, methods, and headers: you may want to lock this down in a production environment
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
    res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers'));

    console.log("Yepaleee");

    if (req.method === 'OPTIONS') {
        // CORS Preflight
        res.send();
    } else { 
        var targetURL = req.header('Target-URL');
        if (!targetURL) {
            console.log("targetURL NO TIENE SOCORRO");
            res.send(500, { error: 'There is no Target-Endpoint header in the request' });
            return;
        }
        console.log("targetURL: " + targetURL);
        console.log("autoriza: " + req.header('Authorization'));


        const body =  {
      "author": "urn:li:person:6nSkGft3PX",
      "lifecycleState": "PUBLISHED",
      "specificContent": {
        "com.linkedin.ugc.ShareContent": {
          "shareCommentary": {
            "text": "Texto para el vídeo"
          },
          "shareMediaCategory": "ARTICLE",
          "media": [
            {
              "status": "READY",
              "description": {
                "text": "Texto para el vídeo."
              },
              "originalUrl": "https://blog.linkedin.com/",
              "title": {
                "text": "Official Linke2222dIn Blog"
              }
            }
          ]
        }
      },
      "visibility": {
        "com.linkedin.ugc.MemberNetworkVisibility": "CONNECTIONS"
      
    }
};
        request({ url: targetURL, method: req.method, json: body ,headers: {'Authorization': req.header('Authorization'), 'Content-Type': 'application/json', 'Linkedin-Version':'202206', 'X-Restli-Protocol-Version':'2.0.0'} },
            function (error, response, body) {
                if (error) {
                    console.error('error : ' + error.statusCode)
                }
               console.log(response.statusCode);

            }).pipe(res);
    }
});

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function () {
    console.log('Proxy server listening on port ' + app.get('port'));
});