var emailHtml = [
    {
        el: 'h1',
        open: '<tr><td VALIGN="middle" STYLE="color:#000000; text-align:center; font-size:48px; font-weight: 300; padding:0; line-height:56px; font-family:Calibri, Arial, Helvetica, sans-serif">',
        close: '</td></tr>',
        mt: 24,
        mb: 24
    },
    {
        el: 'h2',
        open: '<tr><td VALIGN="middle" STYLE="color:#000000; font-size:18px; padding:0; line-height:24px; font-weight: bold; font-family:Calibri, Arial, Helvetica, sans-serif;">',
        close: '</td></tr>',
        mt: 24,
        mb: 24
    },
    {
        el: 'p',
        open: '<tr align="left"><td STYLE="color:#616161; font-size:16px; padding:0; line-height:24px; font-family:Calibri, Arial, Helvetica, sans-serif">',
        close: '</td></tr>',
        mt: 0,
        mb: 16
    },
    {
        el: 'ul',
        open: '<tr><td STYLE="color:#616161; font-size:16px; padding:0; line-height:24px; font-family:Calibri, Arial, Helvetica, sans-serif"><table align="left" border="0" cellpadding="0" cellspacing="0" style="color:#616161; font-size:16px; padding:0; line-height:24px; font-family:Calibri, Arial, Helvetica, sans-serif">',
        close: '</td></tr>',
        mt: 0,
        mb: 0
    },
    {
        el: 'li',
        open: '<tr valign="top"><td valign="top" width="20" style="color: #616161; font-size: 24px; line-height:24px">&#9679;</td><td>',
        close: '</td></tr>',
        mt: 0,
        mb: 16
    }    
]
var linkHtml = ' <a style="color:#2b7bb9; font-family:Helvetica,Arial,sans-serif; font-size:15px; font-weight:bold; line-height:100%; text-decoration:none;"'

async function convertToEmail(htmlStr){
    return new Promise(function(res,rej){
        for(var x = 0; x < emailHtml.length ; x++){
            var mt = ''
            var mb = ''
            if( emailHtml[x].mt !== 0) { mt = '<tr><td height="' + emailHtml[x].mt + '"></td></tr>' }
            if( emailHtml[x].mb !== 0) { mb = '<tr><td height="' + emailHtml[x].mb + '"></td></tr>' }
            htmlStr = htmlStr.replace(RegExp('<' + emailHtml[x].el + '>',"g"), mt + emailHtml[x].open)
            htmlStr = htmlStr.replace(RegExp('<\/' + emailHtml[x].el + '>',"g"), emailHtml[x].close + mb)
        }
        htmlStr = htmlStr.replace(RegExp('<a (?!class="template")', 'g'),linkHtml)
        res(htmlStr)
    })
}

module.exports = {
    convertToEmail
}

