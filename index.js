var express = require('express');
var app = express();
var hellosign = require('hellosign-sdk')({ key: '83a47c17303bbc8a912cc5f86873b623d9d26425ade149ee7eb99c652ed354b8' });
var fs = require('fs')
var request = require('request');
var bodyParser = require("body-parser");

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send(200);
    } else {
        next();
    }
};


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(allowCrossDomain);



app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
    response.render('pages/index');
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

app.post('/signed', function(req, res) {
    res.send('Hello API Event Received')

    console.log('doc digned')
        // res.redirect('back')
})

app.get('/signed', function(req, res) {
    res.send('okthen')
    console.log('doc Signed')
        // res.redirect('back')

})

app.get('/getFinalDownload/:id', function(req, res) {
    console.log(req.params.id)
    signatureRequestId = req.params.id
    hellosign.signatureRequest.download(signatureRequestId, { file_type: 'pdf', get_url: true }, function(err, response) {
        // var fs = require('fs');
        // var file = fs.createWriteStream("files.zip");
        // response.pipe(file);
        // file.on('finish', function() {
        //     file.close();
        // });
        if (err) {
            console.error(err)
            res.end(err)

        } else {
            res.end(response.file_url)
            console.log(response.file_url)

        }
    });
})


app.post('/getSignURL', function(req, res) {
    // res.send('this works');
    // pdfFileName = req.body.name + ".pdf"
    // console.log(req.body.name)
    pdfFileName = 'test.pdf';
    var pdf = fs.createWriteStream(pdfFileName);
    var pdfurl = 'https://demo.propy.com/propy-demo/pdf/PAfltu26aqr7p3r.pdf';

    r = request(pdfurl).pipe(pdf)
    r.on('error', function(err) { console.log(err); });
    r.on('finish', function() {
        pdf.close(function() {
            initHelloSign()
        })
    });

    function initHelloSign() {
        var options = {
            test_mode: 1,
            clientId: '07082ea7036af829954c5d2ec103b45e',
            subject: 'Propy.com E-Sign Demo',
            message: 'Testing...',
            signers: [{
                email_address: 'test@mail.com',
                name: 'John Wong'
            }],
            files: [pdfFileName]
        };
        hellosign.signatureRequest.createEmbedded(options)
            .then(function(response) {
                var signatureId = response.signature_request.signatures[0].signature_id;
                var signatureRequestId = response.signature_request.signature_request_id
                signurl = hellosign.embedded.getSignUrl(signatureId)
                signurl.then(function(el) {
                    newobj = {}
                    newobj.signatureRequestId = signatureRequestId
                    newobj.url = el.embedded.sign_url
                    console.log(newobj)
                    res.send(newobj)
                })
            })
            .catch(function(err) {
                //catch error
                console.log(err)
            });
    }

    function returnUrl(url) {
        response = {}
        response.url = url
        response.
        res.send(url);
    }
})


signUrl = ""