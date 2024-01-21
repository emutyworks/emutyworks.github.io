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
      row_array = ["0","0","0","0","0","0","0","0"];
      for($i=0; $i<1024; $i++){
        bg_tiles[$i+1024] = row_array.concat();
      }
      $("input:file[name='bin_upload']").val('');
      bin_upload = true;
      setMes('reset');
      setMapSize();
    }
    reader.readAsArrayBuffer(file);
  });

  $("input:file[name='bin_upload2']").change(function(e){

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
        bg_tiles[tile_cnt + 1024] = row_array.concat();
        tile_cnt++;
        if(tile_cnt>=BGTILES_MAX*8){
          break;
        }
      }
      $("input:file[name='bin_upload2']").val('');
      bin_upload = true;
      setMes('reset');
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
  var tile_palette_data_start = false;
  var map_data_start = false;
  var attr_data_start = false;
  var bg_palette_cnt = 0;
  var tile_array = [];
  var tile_array_cnt = 0;
  var map_array = [];
  var map_array_cnt = 0;
  var attr_array = [];
  var attr_array_cnt = 0;
  var up_d = [];

  for(var i=0; i<load_array.length; i++){
    var row = load_array[i].replace(/\s+/g,'');

    if(row.charAt(0)=='#'){
      if(row.trim()=='#[BGPalette]'){
        bg_palette_data_start = true;
      }else
      if(row.trim()=='#[TilePalette]'){
        tile_palette_data_start = true;
      }else
      if(row.trim()=='#[MapTbl]'){
        map_data_start = true;
      }else
      if(row.trim()=='#[AttributesTbl]'){
        attr_data_start = true;
      }else
      if(row.indexOf('[') != -1){
        var comment = row.split(']');
        var key = comment[0].substr(comment[0].indexOf('[') + 1);
        up_d[key] = comment[1].toLowerCase();
      }
    }else if(row.charAt(0)=='d'){
      if(attr_data_start){
        attr_array[attr_array_cnt] = row.toLowerCase().replace(/\$/g,'').replace(/db/g,'');
        attr_array_cnt++;
      }else
      if(map_data_start){
        map_array[map_array_cnt] = row.toLowerCase().replace(/\$/g,'').replace(/db/g,'');
        map_array_cnt++;
      }else
      if(tile_palette_data_start){
        tile_array[tile_array_cnt] = row.toLowerCase().replace(/\$/g,'').replace(/db/g,'');
        tile_array_cnt++;
      }else
      if(bg_palette_data_start){
        bg_palette[bg_palette_cnt] = row.toLowerCase().replace(/dw/g,'');
        bg_palette_cnt++;
      }
    }
  }

  if('FileName' in up_d){
    $("input[name='download_file']").val(up_d['FileName']);
  }
  if('MapSize' in up_d){
    setMapMax(up_d['MapSize']);
  }
  if('MapScreens' in up_d){
    map_screens = up_d['MapScreens'];
  }

  $('[name="map_size"]').val(getMapSize()).prop('selected',true);
  $('[name="map_screens"]').val(map_screens).prop('selected',true);

  show_grid = false;
  if('ShowGrid' in up_d && up_d['ShowGrid']=="true"){
    show_grid = true;
    $('input:checkbox[name="show_grid"]').prop('checked',true);
  }

  var tile_palette_cnt = 0;
  for(var i=0; i<tile_array.length; i++){
    var row_array = tile_array[i].split(',');
    for(var j=0; j<row_array.length; j++){
      tile_palette[tile_palette_cnt] = row_array[j];
      tile_palette_cnt++;
    }
  }
  var map_table_cnt = 0;
  for(var i=0; i<map_array.length; i++){
    var row_array = map_array[i].split(',');
    for(var j=0; j<row_array.length; j++){
      map_table[map_table_cnt] = hex2dec(row_array[j]);
      map_table_cnt++;
    }
  }
  var attr_table_cnt = 0;
  for(var i=0; i<attr_array.length; i++){
    var row_array = attr_array[i].split(',');
    for(var j=0; j<row_array.length; j++){
      attr_table[attr_table_cnt] = hex2bin8(row_array[j]);
      attr_table_cnt++;
    }
  }
}

function refill_map_table(){
  var bak_tile_palette = tile_palette.concat();
  for(var i=0; i<BGTILES_MAX; i++){
    tile_palette[i] = 0;
  }
  for(var i=0; i<tile_palette.length; i++){
    if(bak_tile_palette[i]===undefined){
      break;
    }
    tile_palette[i] = bak_tile_palette[i];
  }

  var bak_map_table = map_table.concat();
  for(var i=0; i<getMaxMaps(map_screens); i++){
    map_table[i] = dec2hex(0);
  }
  for(var i=0; i<map_table.length; i++){
    if(bak_map_table[i]===undefined){
      break;
    }
    map_table[i] = bak_map_table[i];
  }

  var bak_attr_table = attr_table.concat();
  for(var i=0; i<getMaxMaps(map_screens); i++){
    attr_table[i] = bin2hex(0);
  }
  for(var i=0; i<attr_table.length; i++){
    if(bak_attr_table[i]===undefined){
      break;
    }
    attr_table[i] = bak_attr_table[i];
  }
}

function map_download(){
  var dt = new Date();
  var filename = $("input[name='download_file']").val();

  $('#map_download').attr('download',filename+'.txt');

  var data = "";
  data += '# This data was created with GBCMapEditor.\n';
  data += '# https://github.com/emutyworks/GBCMapEditor/wiki\n';
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

  data += '# [TilePalette]';
  cnt = 0;
  do{
    for(var i=0; i<8; i++){
      if(i==0){
        data += '\n\tdb '+tile_palette[cnt];
      }else{
        data += ','+tile_palette[cnt];
      }
      cnt++;
    }
  }while(cnt<BGTILES_MAX);

  data += '\n';
  data += '\n# [MapTbl]';
  data += '\n# [MapSize] '+getMapSize();
  data += '\n# [MapScreens] '+map_screens;
  data += '\n# [ShowGrid] '+show_grid;

  cnt = 0;
  var cnt_y = 0;
  do{
    for(var i=0; i<map_max_x; i++){
      if(i==0){
        data += '\n\tdb $'+dec2hex(map_table[cnt]);
      }else{
        data += ',$'+dec2hex(map_table[cnt]);
      }
      cnt++;
    }
    cnt_y++;
    if(cnt_y==map_max_y){
      data += "\n";
      cnt_y = 0;
    }
  }while(cnt<(getMaxMaps(map_screens)));

  data += '\n# [AttributesTbl]';
  cnt = 0;
  cnt_y = 0;
  do{
    for(var i=0; i<map_max_x; i++){
      if(i==0){
        data += '\n\tdb $'+bin2hex(attr_table[cnt]);
      }else{
        data += ',$'+bin2hex(attr_table[cnt]);
      }
      cnt++;
    }
    cnt_y++;
    if(cnt_y==map_max_y){
      data += "\n";
      cnt_y = 0;
    }
  }while(cnt<(getMaxMaps(map_screens)));

  var blob = new Blob([data], {type:'text/plain'});
  
  if(window.navigator.msSaveBlob){
    window.navigator.msSaveBlob(blob,filename+'.txt');
  }else{
    document.getElementById('map_download').href = window.URL.createObjectURL(blob);
  }
}