//window.onload = function(){ add_comment(); } //debug

function add_comment(){
  var asm_txt = '';
  var asm_array = null;
  var result = '';
  var sum = 0;

  asm_txt = $("textarea[name='asm']").val();
  asm_array = asm_txt.split('\n');

  for(var i=0; i<asm_array.length; i++){
    var row_org = asm_array[i];
    var row = row_org.replace(/\t/g,'').toLowerCase().trim();

    var row_nocomment = row.split(';');
    var row_left = row_nocomment[0].trim().split(' ');
    var key = '';

    if(instruction.indexOf(row_left[0]) != -1){
      if(row_left[1]!==undefined){
        var row_right = row_left[1].trim().split(',');
        var row_right1 = row_right[0];
        var row_right2 = row_right[1];

        if(row_right1.indexOf('[') != -1){
          row_right1 = checkRow(row_right1,'[nn]');
        }else{
          row_right1 = checkRow(row_right1,'n');
        }

        if(row_right2!==undefined){
          if(row_right2.indexOf('[') != -1){
            row_right2 = checkRow(row_right2,'[nn]');
          }else{
            row_right2 = checkRow(row_right2,'n');
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
      var clock = opcode[key];
      var clock_str = ';'+clock;
      var clock_sum_str = '';

      if(clock.indexOf('/') != -1){
        var clock_array = clock.split('/');
        var clock1 = parseInt(clock_array[0]);
        var clock2 = parseInt(clock_array[1]);
        clock_sum_str = clock_str+' = '+(sum+clock1)+'/'+(sum+clock2);
        sum += clock2;
      }else{
        sum += parseInt(clock);
        clock_sum_str = clock_str+' = '+sum;
      }
      if(reset_sum[ key ]===true){
        sum = 0;
      }

      if((reset_sum[ key ]===undefined && row_org.indexOf(clock_str+" ") == -1 &&
      (row_org.indexOf(clock_str) == -1 || row_org.indexOf(clock_str)!=(row_org.length - clock_str.length)))
      || (reset_sum[ key ]!==undefined && row_org.indexOf(clock_sum_str+" ") == -1 &&
      (row_org.indexOf(clock_sum_str) == -1 || row_org.indexOf(clock_sum_str)!=(row_org.length - clock_sum_str.length)))
      ){
        if(row_org.indexOf(';') != -1){
          if(reset_sum[ key ]===undefined){
            result += row_org.replace(';', clock_str+' ;')+"\n";
          }else{
            result += row_org.replace(';', clock_sum_str+' ;')+"\n";
          }
        }else{
          if(reset_sum[ key ]===undefined){
            result += row_org+' '+clock_str+"\n";
          }else{
            result += row_org+' '+clock_sum_str+"\n";
          }
        }
      }else{
        result += row_org+"\n";
      }
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

function checkRow(row,val){
  row = replacement[row.trim()];
  if(row===undefined){
    row = val;
  }
  return row;
}