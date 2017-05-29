var hellosign = require('hellosign-sdk')({ key: '83a47c17303bbc8a912cc5f86873b623d9d26425ade149ee7eb99c652ed354b8' });
var fs = require('fs')
var request = require('request');


var pdf = fs.createWriteStream('pdfToSign.pdf');
var pdfurl = 'https://demo.propy.com/propy-demo/pdf/PAfltu26aqr7p3r.pdf'

r = request(pdfurl).pipe(pdf)
r.on('error', function(err) { console.log(err); });
r.on('finish', function() {
    pdf.close(initHelloSign)

});


function initHelloSign() {
    var options = {
        test_mode: 1,
        clientId: '07082ea7036af829954c5d2ec103b45e',
        subject: 'My First embedded signature request',
        message: 'Awesome, right?',
        signers: [{
            email_address: 'johndheeter@gmail.com',
            name: 'John Heeter'
        }],
        files: ['pdfToSign.pdf']
    };
    hellosign.signatureRequest.createEmbedded(options)
        .then(function(response) {
            var signatureId = response.signature_request.signatures[0].signature_id;
            signUrl = hellosign.embedded.getSignUrl(signatureId);
            // res.send(signUrl);
            // console.log(signUrl);
            return signUrl
        })
        .then(function(response) {
            console.log('URL = ' + response.embedded.sign_url);
            returnUrl(response.embedded.sign_url)
        })
        .catch(function(err) {
            //catch error
            console.log(err)
        });
}

function returnUrl(url) {

}