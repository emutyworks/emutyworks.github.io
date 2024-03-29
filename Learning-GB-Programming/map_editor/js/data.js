$(function(){
  $("input:file[name='bin_upload']").change(function(e){

    var file = e.target.files[0];
    var reader = new FileReader();

    reader.onload = function() {
      var ar = new Uint8Array(reader.result);
      var tile_cnt = 0;
      for(var i=0; i<ar.length; i+=2){
        var dataH = dec2bin8(ar[i+1]);
        var dataL = dec2bin8(ar[i]);
        var row_array = [];
        for(var j=0; j<8; j++){
          var dh = dataH.charAt(j);
          var dl = dataL.charAt(j);
          if(dh=="1" && dl=="1"){
            row_array[j] = "3";
          }else
          if(dh=="1" && dl=="0"){
            row_array[j] = "2";
          }else
          if(dh=="0" && dl=="1"){
            row_array[j] = "1";
          }else{
            row_array[j] = "0";
          }
        }
        bg_tiles[tile_cnt] = row_array.concat();
        tile_cnt++;
        if(tile_cnt>=BGTILES_MAX*8){
          break;
        }
      }
      $("input:file[name='bin_upload']").val('');
      bin_upload = true;
      setMapSize();
    }
    reader.readAsArrayBuffer(file);
  });

  $("input:file[name='map_upload']").change(function(e){
    if(!bin_upload){ 
      $("input:file[name='map_upload']").val('');
      return;
    }
    
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.readAsText(file);

    reader.onload = function() {
      var up_text = reader.result;
      loadInitData(up_text.split('\n'));
      $("input:file[name='map_upload']").val('');

      setMapSize();
    }
  });
})

function loadInitData(load_array){
  var bg_palette_data_start = false;
  var bg_palette_data_ended = false;
  var map_part_data_start = false;
  var map_part_data_ended = false;
  var map_data_start = false;
  var bg_palette_cnt = 0;
  var map_part_data = "";
  var map_array = [];
  var map_array_cnt = 0;
  var up_d = [];

  for(var i=0; i<MAPPART_MAX_X*MAPPART_MAX_Y*2; i++){
      map_part[i] = "00000000";
  }
  for(var i=0; i<load_array.length; i++){
    var row = load_array[i].replace(/\s+/g,'');

    if(row.charAt(0)=='#'){
      if(row.trim()=='#[BGPalette]'){
        bg_palette_data_start = true;
      }else
      if(row.trim()=='#[MapPartTbl]'){
        bg_palette_data_ended = true;
        map_part_data_start = true;
      }else
      if(row.trim()=='#[MapTbl]'){
        map_part_data_ended = true;
        map_data_start = true;
      }else
      if(row.indexOf('[') != -1){
        var comment = row.split(']');
        var key = comment[0].substr(comment[0].indexOf('[') + 1);
        up_d[key] = comment[1].toLowerCase();
      }
    }else if(row.charAt(0)=='d' || row.charAt(0)=='0'){
      if(bg_palette_data_start && !bg_palette_data_ended){
        bg_palette[bg_palette_cnt]
          = row.toLowerCase().replace(/dw/g,'');
        bg_palette_cnt++;
      }
      if(map_part_data_start && !map_part_data_ended){
        map_part_data += row.toLowerCase().replace(/\$/g,'').replace(/db/g,'')+",";
      }
      if(map_data_start){
        map_array[map_array_cnt] = row.toLowerCase().replace(/\$/g,'').replace(/db/g,'');
        map_array_cnt++;
      }
    }
  }

  if('FileName' in up_d){
    $("input[name='download_file']").val(up_d['FileName']);
  }
  if('ReverseMapTableOrder' in up_d && up_d['ReverseMapTableOrder']=="true"){
    $('input:checkbox[name="reverse_map"]').prop('checked',true);
    reverse_map = true;
  }

  map_max_x = 20;
  if('MapSize' in up_d && up_d['MapSize']==32){
      map_max_x = 32;
  }
  $('[name="map_size"]').val(map_max_x).prop('selected',true);

  show_grid = false;
  if('ShowGrid' in up_d && up_d['ShowGrid']=="true"){
    show_grid = true;
    $('input:checkbox[name="show_grid"]').prop('checked',true);
  }

  var map_part_array = map_part_data.split(',');
  var map_part_cnt = 0;
  for(var i=0; i<map_part_array.length; i++){
    if(map_part_array[i]!=""){
      map_part[map_part_cnt] = hex2bin8(map_part_array[i]);
      map_part_cnt++;
    }
  }

  var map_table_cnt = 0;
  if(reverse_map==false){
    for(var i=0; i<map_array.length; i++){
      var row_array = map_array[i].split(',');
      var map_row = [];
      var map_row_cnt = 0;
      for(var j=0; j<row_array.length; j++){
        if(row_array[j]!=""){
          map_row[map_row_cnt] = hex2dec(row_array[j]);
          map_row_cnt++;
        }
      }
      map_table[map_table_cnt] = map_row.concat();
      map_table_cnt++;
    }
  }else{
    for(var i=(map_array.length-1); i>=0; i--){
      var row_array = map_array[i].split(',');
      var map_row = [];
      var map_row_cnt = 0;
      for(var j=0; j<row_array.length; j++){
        if(row_array[j]!=""){
          map_row[map_row_cnt] = hex2dec(row_array[j]);
          map_row_cnt++;
        }
      }
      map_table[map_table_cnt] = map_row.concat();
      map_table_cnt++;
    }
  }
}

function refill_map_table(){
  var bak_map_table = map_table.concat();
  var map_tmp = [];
  for(var i=0; i<Math.trunc(map_max_x/2); i++){
    map_tmp[i] = 0;
  }
  for(var i=0; i<map_max_y*4; i++){
    map_table[i] = map_tmp.concat();
  }

  for(var i=0; i<map_table.length; i++){
    var row = map_table[i];
    var bak_row = bak_map_table[i];

    if(bak_row!==undefined){
      if(map_max_x==32){
        for(var j=0; j<bak_row.length; j++){
          row[j] = bak_row[j];
        }
      }else{
        for(var j=0; j<row.length; j++){
          row[j] = bak_row[j];
        }
      }
      map_table[i] = row.concat();
    }
  }
}

function map_download(){
  var dt = new Date();
  var filename = $("input[name='download_file']").val();

  $('#map_download').attr('download',filename+'.txt');
  reverse_map = false;
  if($('input:checkbox[name="reverse_map"]:checked').val()=="1"){
    reverse_map = true;
  }

  var data = "";
  data += '# [Create] '+dt.toString()+'\n';
  data += '# [FileName] '+filename+'\n';
  data += '#\n';

  data += '# [BGPalette]\n';
  var cnt = 0;
  for(var j=0; j<Math.trunc(bg_palette.length/4); j++){
    for(var i=0; i<4; i++){
      data += '\tdw '+bg_palette[cnt]+'\n';
      cnt++;
    }
    data += '\n';
  }

  data += '# [MapPartTbl]';
  var cnt = 0;
  for(var i=0; i<map_part.length; i++){
    if(cnt==0){
      data += '\n\tdb $'+bin2hex(map_part[i]);
    }else{
      data += ',$'+bin2hex(map_part[i]);
    }
    cnt++;
    if(cnt==16){
      cnt = 0;
    }
  }
 
  data += '\n';
  data += '\n# [MapTbl]';
  data += '\n# [MapSize] '+map_max_x;
  data += '\n# [ShowGrid] '+show_grid;
  data += '\n# [ReverseMapTableOrder] '+reverse_map;
  var cnt = 0;

  if(reverse_map==false){
    for(var i=0; i<map_table.length; i++){
      var rows = map_table[i];
      for(var j=0; j<rows.length; j++){
        if(j==0){
          data += '\n\tdb $'+dec2hex(rows[j]);
        }else{
          data += ',$'+dec2hex(rows[j]);
        }
      }
      cnt++;
      if(cnt==map_max_y){
        data += '\n';
        cnt = 0;
      }
    }
  }else{
    for(var i=(map_table.length-1); i>=0; i--){
      var rows = map_table[i];
      for(var j=0; j<rows.length; j++){
        if(j==0){
          data += '\n\tdb $'+dec2hex(rows[j]);
        }else{
          data += ',$'+dec2hex(rows[j]);
        }
      }
      cnt++;
      if(cnt==map_max_y){
        data += '\n';
        cnt = 0;
      }
    }
  }

  var blob = new Blob([data], {type:'text/plain'});
  
  if(window.navigator.msSaveBlob){
    window.navigator.msSaveBlob(blob,filename+'.txt');
  }else{
    document.getElementById('map_download').href = window.URL.createObjectURL(blob);
  }
}