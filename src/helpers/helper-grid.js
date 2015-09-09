
module.exports.container = function(context, data){

  return '\
  <div class="webkit" >\
  <!--[if (gte mso 9)|(IE)]>\
  <table width="'+context.width+'" align="center" >\
  <tr>\
  <td>\
  <![endif]-->\
  <table class="outer" align="center" >\
  '+ data.fn(this) + '\
  </table>\
  <!--[if (gte mso 9)|(IE)]>\
  </td>\
  </tr>\
  </table>\
  <![endif]-->\
  </div>'
}


module.exports.row = function(context , data){
  return '\
  <tr>\
  <td class="full-row" >\
  <!--[if (gte mso 9)|(IE)]>\
  <table width="100%"  >\
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

module.exports.col = function(context, options){

  var percent = context.width / options.hash.size;
  return '\
  <!--[if (gte mso 9)|(IE)]>\
  <td width="'+percent+'%" valign="top" >\
  <![endif]-->\
  <div class="'+numberToWord(options.hash.size)+'-column column" >\
  <table width="100%">\
  <tr>\
  <td class="inner" >\
  <table class="contents">\
    <tr>\
      <td >\
  '+ options.fn(this) +'\
      </td>\
    </tr>\
  </table>\
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
    case '1':
    return 'one';
    break;
    case '2':
    return 'two';
    break;
    case '3':
    return 'three';
    break;
    case '4':
    return 'four';
    break;
    case '5':
    return 'five';
    break;
    case '6':
    return 'six';
    break;
    case '7':
    return 'seven';
    break;
    case '8':
    return 'eight';
    break;
    case '9':
    return 'nine';
    break;
    case '10':
    return 'ten';
    break;
    case '11':
    return 'eleven';
    break;
    case '12':
    return 'twelve';
    break;
    default:
    return '';

  }
}
