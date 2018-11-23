const showdown = require('showdown')
const converter = new showdown.Converter()
const toEmailHtml = require('./html2email')
const minify = require('html-minifier').minify;

converter.setOption('noHeaderId', true)


async function buildTemplate(res, data, template){
    return new Promise(function(response,rej){
        res.render(template, {
            data : data,
            logo : process.env.LOGO_URL,
            logoMono : process.env.LOGOMONO_URL,
            domain : process.env.SITE_URL,
            converter : converter
        }, function(err, htmlStr){
            response(htmlStr)
        })
        res.end()
    })
}

async function minifyHtml(htmlStr){
    return new Promise(function(response,rej){
        response(
            minify(htmlStr, {
                collapseInlineTagWhitespace: true,
                collapseWhitespace: true,
                minifyCSS: true
            })
        )
    })
}

async function buildEmail(res, data, template){
    var htmlStr = await buildTemplate(res, data, template)
    var emailHtml = await toEmailHtml.convertToEmail(htmlStr)
    var finalHtml = await minifyHtml(emailHtml)
    return finalHtml
}

module.exports = {
    buildEmail
}