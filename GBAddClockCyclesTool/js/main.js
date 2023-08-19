function add_comment(){
  var asm_txt = '';
  var asm_array = null;
  var result = '';

  asm_txt = $("textarea[name='asm']").val();
  asm_array = asm_txt.split('\n');

  for(var i=0; i<asm_array.length; i++){
    var row_org = asm_array[i];
    var row = row_org.replace(/\t/g,'').toLowerCase().trim();

    var row_left = row.split(' ');
    var key = '';

    if(instruction.indexOf(row_left[0]) != -1){
      if(row_left[1]!==undefined){
        var row_right = row_left[1].split(',');
        var row_right1 = row_right[0];
        var row_right2 = row_right[1];

        if(row_right1.indexOf('[') != -1){
          row_right1 = replacement[row_right1.trim()];
          if(row_right1===undefined){
            row_right1 = '[nn]';
          }
        }else{
          row_right1 = replacement[row_right1.trim()];
          if(row_right1===undefined){
            row_right1 = 'n';
          }
        }

        if(row_right2!==undefined){
          if(row_right2.indexOf('[') != -1){
            row_right2 = replacement[row_right2.trim()];
            if(row_right2===undefined){
              row_right2 = '[nn]';
            }
          }else{
            row_right2 = replacement[row_right2.trim()];
            if(row_right2===undefined){
              row_right2 = 'n';
            }
          }
        }

        if(row_right2!=undefined){
          key = row_left[0]+' '+row_right1+','+row_right2;
        }else{
          key = row_left[0]+' '+row_right1;
        }
      }else{
        key = row_left[0];
      }
    }
    if(opcode[key]){
      result += row_org+' ;'+opcode[key]+"\n";
    }else
    if(key==''){
      result += row_org+"\n";
    }
    else{
      //debug
      result += key+"\n";
      console.log(key);
    }
  }
  $("textarea[name='result']").text(result);
}
