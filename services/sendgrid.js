const token = process.env.SENDGRID_TOKEN
const endpoint = process.env.SENDGRID_ENDPOINT
const supressionId = process.env.SENDGRID_SUPRESSION
const https = require('https')

function writeApi(url,reqBody){
    return new Promise(function(response,rej){
        const options = {
            method : 'POST',
            hostname: endpoint,
            path: url,
            body: reqBody,
            headers : { 
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json' 
            }
        };
        var req = https.request(options, function(res){
            var body = '';
            res.on('data', function(chunk){
                body += chunk
            })
            res.on('end', function(){
                var data = JSON.parse(body)
                response(data)
            })
        }).on('error', function(err){
            console.log("Error: " + err.message);
        })
        req.write(JSON.stringify(reqBody));
        req.end()
    })
}

function getApi(url, cb){
    const options = {
        method : 'GET',
        hostname: endpoint,
        path: url,
        headers : { 
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json' 
        }
    };
    var req = https.request(options, function(res){
        var body = '';
        res.on('data', function(chunk){
            body += chunk
        })
        res.on('end', function(){
            var data = JSON.parse(body)
            cb(data)
        })
    }).on('error', function(err){
        console.log("Error: " + err.message);
    })
    req.end()
}

async function getListId(lists){
    return new Promise(function(res,rej){
        getApi('/v3/contactdb/lists', function(data){
            var listOut = new Array()
            for(var i = 0; i < lists.length ; i++){
                for(var x = 0 ; x < data.lists.length ; x++){
                    if (data.lists[x].name === lists[i]){
                        listOut.push(data.lists[x].id)
                    }
                }
            }
            res(listOut)
        })
    })
}

async function getSenderId(email){
    return new Promise(function(res,rej){
        getApi('/v3/senders', function(data){
            for(var x = 0 ; x < data.length ; x++){
                if (data[x].from.email === email){
                    res(data[x].id)
                    return;
                }
            }
        })
    })
}

async function sendCampaign(lists, sender, subject, html, version){
    return new Promise(function(res,rej){
        const reqBody = {
            "title": subject + ' v' + version,
            "subject": subject,
            "sender_id": sender,
            "list_ids": lists,
            "suppression_group_id": supressionId,
            "html_content": html,
            "plain_content": html
        }
        res(writeApi('/v3/campaigns',reqBody))
    })
}

module.exports = {
    getListId,
    getSenderId,
    sendCampaign
}