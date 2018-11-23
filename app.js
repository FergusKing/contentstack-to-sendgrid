const http = require('http')
const debug = require('debug')('contentstack-to-sendgrid:server')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
require('dotenv').config()

const cmsKey = process.env.CMS_API_KEY

const sendgrid = require('./services/sendgrid')
const emailBuilder = require('./services/emailBuilder')


app.use(bodyParser.json())
app.use(express.static('webroot'))

const port = normalizePort(process.env.PORT || '3000')
app.set('port', port)
var server = http.createServer(app)

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

function normalizePort(val) {
    var port = parseInt(val, 10)
    if (isNaN(port)) {
        return val
    }
    if (port >= 0) {
        return port
    }
    return false
}
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error
    }
    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges')
            process.exit(1)
            break
        case 'EADDRINUSE':
            console.error(bind + ' is already in use')
            process.exit(1)
            break
        default:
            throw error
    }
}
function onListening() {
    var addr = server.address()
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port
    debug('Listening on ' + bind)
}

app.set('views', __dirname + '/views');
app.set('view engine', 'twig');
app.set("twig options", {
    allow_async: true,
    strict_variables: false
});

app.post('/webhook/press-release', async function (req, res) {
    var status, resMsg;
    if (cmsKey !== req.body.api_key) { status = 403; resMsg = 'Error: API Key does not match' }else{ status = 200; resMsg = 'Success' }
    res.header("Content-Type", "text/plain");
    res.header("statusCode", status);
    res.set("Connection", "close");
    res.status(status)
    res.send(resMsg)
    if (status !== 200) { console.log(resMsg) } else {
        var send = await createEmail(res, req.body.data.entry, req.body.data.content_type.uid)
        if (send.err) {
            console.log(send.err)
        } else {
            console.log('Campaign created: ' + send.title)
        }
    }
    res.end()
})

async function createEmail(res, data, template) {
    var emailData = data.email_details
    const [listsId, senderId, emailHtml] = await Promise.all([
        sendgrid.getListId(emailData.send_to),
        sendgrid.getSenderId(emailData.from[0]),
        emailBuilder.buildEmail(res, data, template)
    ])
    return sendgrid.sendCampaign(listsId, senderId, emailData.email_subject, emailHtml, data['_version'])
}
