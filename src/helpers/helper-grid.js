
module.exports.container = function(data){
  return '\
  <div class="webkit" style="max-width:600px;" >\
  			<!--[if (gte mso 9)|(IE)]>\
  			<table width="600" align="center" style="border-spacing:0;font-family:sans-serif;color:#333333;" >\
  					<tr>\
  							<td style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;" >\
      						<![endif]-->\
      						<table class="outer" align="center" style="border-spacing:0;font-family:sans-serif;color:#333333;Margin:0 auto;width:100%;max-width:600px;" >\
                    '+ data.fn(this) + '\
                  </table>\
                  <!--[if (gte mso 9)|(IE)]>\
                </td>\
            </tr>\
        </table>\
        <![endif]-->\
  </div>'
}


module.exports.row = function(data){
  return '\
  <tr>\
    <td class="'+data.hash.columns+'-column" style="'+data.hash.styles+'" >\
      <!--[if (gte mso 9)|(IE)]>\
      <table width="100%" style="border-spacing:0;font-family:sans-serif;color:#333333;" >\
        <tr>\
      <![endif]-->\
          ' + data.fn(this) +'\
      <!--[if (gte mso 9)|(IE)]>\
          </tr>\
      </table>\
      <![endif]-->\
    </td>\
  </tr>';

}

module.exports.col = function(options){

  console.log('##################################');
  console.log(options);
  return '\
    <!--[if (gte mso 9)|(IE)]>\
    <td width="30%" valign="top" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;" >\
    <![endif]-->\
    <div class="column" style="width:100%;max-width:200px;display:inline-block;vertical-align:top;" >\
      <table width="100%" style="border-spacing:0;font-family:sans-serif;color:#333333;" >\
        <tr>\
          <td class="inner" style="padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;" >\
          '+ options.fn(this) +'\
          </td>\
        </tr>\
      </table>\
    </div>\
    <!--[if (gte mso 9)|(IE)]>\
    </td>\
    <![endif]-->';
}

function numberToWord(number){
  switch(number){
    case 1:
      return 'one';
      break;
    case 2:
      return 'two';
      break;
    case 3:
      return 'three';
      break;
    default:
      return '';

  }
}
