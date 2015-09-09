
module.exports.hb = function(context, data){
  var border_style = context.style != undefined ? context.style : (data != 'undefined' && data.hash.style != "undefined" ? data.hash.style : "solid");
  var border_color = context.color != undefined ? context.color : (data != 'undefined' && data.hash.color != "undefined" ? data.hash.color : "#000000");
  var border_size  = context.size != undefined ? context.size : (data != 'undefined' && data.hash.size != "undefined" ? data.hash.size : "1px");
  return '\
    <tr>\
      <td>\
        <table style="width: 100%; border-bottom: '+border_size+' '+border_style+' '+border_color+' ;">\
          <tr>\
            <td padding-top="10px">&nbsp;</td>\
          </tr>\
        </table>\
      </td>\
    </tr>';
}
