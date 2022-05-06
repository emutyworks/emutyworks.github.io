/*
GBPixelEditor

Copyright (c) 2022 emutyworks

Released under the MIT license
https://github.com/emutyworks/GBPixelEditor/blob/main/LICENSE
*/
window.onload = function(){
  view = document.getElementById('view');
  ctx = view.getContext('2d');

  cursor = document.getElementById('cursor');
  c_ctx = cursor.getContext('2d');

  $('#filename').val('new_tiles');

  init_view();

  /* canvas mouse event */
  function onMouseUp(e){
    mouse_down = false;
    mousePos(e);
  }
  function onMouseDown(e){
    mouse_down = true;
    mousePos(e);

    if(cur_info['x']>PALETTE_START_X
      && cur_info['x']<(PALETTE_SIZE * 4)
      && cur_info['y']>PALETTE_START_Y
      && cur_info['y']<PALETTE_SIZE
      ){
      pick_pallete();
    }

    if(cur_info['x']>EDITOR_START_X
      && cur_info['x']<EDITOR_START_X + (PIXEL_SIZE * MAX_PIXEL_X)
      && cur_info['y']>EDITOR_START_Y
      && cur_info['y']<EDITOR_START_Y + (PIXEL_SIZE * MAX_PIXEL_Y)
      ){
      set_dot();
    }

  }
  function onMouseMove(e){
    mousePos(e);
    if(mouse_down){

      if(cur_info['x']>PALETTE_START_X
        && cur_info['x']<(PALETTE_SIZE * 4)
        && cur_info['y']>PALETTE_START_Y
        && cur_info['y']<PALETTE_SIZE
        ){
        pick_pallete();
      }

      if(cur_info['x']>EDITOR_START_X
        && cur_info['x']<EDITOR_START_X + (PIXEL_SIZE * MAX_PIXEL_X)
        && cur_info['y']>EDITOR_START_Y
        && cur_info['y']<EDITOR_START_Y + (PIXEL_SIZE * MAX_PIXEL_Y)
        ){
        set_dot();
      }
    }
  }
  cursor.addEventListener('mouseup', onMouseUp, false);
  cursor.addEventListener('mousedown', onMouseDown, false);
  cursor.addEventListener('mousemove', onMouseMove, false);

  function mousePos(e){
    //console.log(mouse_down);

    var org_x = e.clientX;
    var org_y = e.clientY;
    var x = org_x - OFFSET_X;
    var y = org_y - OFFSET_Y;

    var dx = parseInt((x - EDITOR_START_X) / PIXEL_SIZE);
    var dy = parseInt((y - EDITOR_START_Y) / PIXEL_SIZE);  

    cur_info = {
      'org_x': org_x,
      'org_y': org_y,
      'x': x,
      'y': y,
      'dx': dx,
      'dy': dy,
    };

    view_edit_info();
  }

  /* data upload */
  var file = document.querySelector('#data_upload');
  file.onchange = function(){
    var fileList = file.files;
    var reader = new FileReader();
    reader.readAsText(fileList[0]);

    reader.onload = function(){
      var up_text = reader.result;
      var up_array = up_text.split("\n");

      var up_d = new Array();
      var editor_data = '';
      //var clipboard_data = '';
      var editor_data_ended = null;
      //var clipboard_data_ended = null;

      for(var i=0; i < up_array.length; i++){
        var row = up_array[i];

        if(row.charAt(0) == '#'){
          if(row.indexOf('[') != -1){
            var comment = row.split("]");
            var key = comment[0].substr(comment[0].indexOf('[')+1).trim();
            up_d[key] = comment[1].trim();
          }else if(row.trim() == '# TilesEnd:'){
            editor_data_ended = 1;
          //}else if(row.trim() == '# clipboard_data_ended'){
          //  clipboard_data_ended = 1;
          }

        }else if(row.charAt(0) == 'd'){
          if(!editor_data_ended){
            editor_data += row.replace(/\s+/g, "");
          }
          //if(!editor_data_ended){
          //  editor_data += row.replace(/\s+/g, "");
          //}else if(!clipboard_data_ended){
          //  clipboard_data += row.replace(/\s+/g, "");
          //}
        }

      }
      $('#filename').val(up_d['FileName']);
      editor_data = editor_data.replace(/db/g, "");
      editor_data = editor_data.replace(/\$/g, "");
      var d = editor_data.split(',');
      var b = [];
      for(var i=0; i<d.length; i++){
        if(d[i]!=""){
          b[i] = hex2bin(d[i]);
        }
      }

      for(var i=0; i<8; i++){
        for(var j=0; j<8; j++){
          var low = b[i*2].charAt(j);
          var hi = b[(i*2)+1].charAt(j);

          if(low=="0" && hi=="0"){
            edit_d[j+(i*8)] = 0;
          }else if(low=="1" && hi=="0"){
            edit_d[j+(i*8)] = 1;
          }else if(low=="0" && hi=="1"){
            edit_d[j+(i*8)] = 2;
          }else{
            edit_d[j+(i*8)] = 3;
          }
        }
      }
      set_download_data();
    };

    if(!String.prototype.trim){
      String.prototype.trim = function(){
        return this.replace(/^\s+|\s+$/g,'');
      };
    }
  };
}

/*
 * download
 */
function data_download(){
  var dt = new Date();
  var filename = $("#filename").val() + '.txt';
        
  $('#download').attr('download',filename);

  var x = 0;
  var y = 0;
  var low = "";
  var hi = "";
  var d = "";
  for(var i=0; i<edit_d.length; i++){
    var r = edit_d[i];
    if(r==0){
      low += "0";
      hi += "0";
    }else if(r==1){
      low += "1";
      hi += "0";
    }else if(r==2){
      low += "0";
      hi += "1";
    }else{
      low += "1";
      hi += "1";
    }
    x++;
    if(x==8){
      d += toHex(parseInt(low,2)) + ",";
      d += toHex(parseInt(hi,2)) + ",";
      low = "";
      hi = "";
      x = 0;
      y += 2;
    }
  }

  var content = '';
  content += "# [Create] " + dt.toString() + "\n";
  content += "# [FileName] " + $("#filename").val() + "\n";
  content += "#\n";
  content += "# Sprite/Tile data for assembler (RGBDS)\n";
  content += "# Tiles:\n";
  content += "db " + d + "\n";
  //db $3c,$3c,$42,$7e,$a1,$df,$81,$ff,$81,$ff,$81,$ff,$42,$7e,$3c,$3c,
  content += "# TilesEnd:\n";

  var blob = new Blob([ content ], { "type" : "text/plain" });
  
  if(window.navigator.msSaveBlob){
    window.navigator.msSaveBlob(blob, filename); 
  }else{
    document.getElementById("download").href = window.URL.createObjectURL(blob);
  }
}

