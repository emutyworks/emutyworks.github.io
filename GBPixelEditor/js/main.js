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

  $('#filename').val(init_form['filename']);
  $("input[name=download_lang][value='" + init_form['download_lang'] + "']").prop('checked',true);

  init_view();

  /* canvas mouse event */
  function onMouseUp(e){
    mouse_down = false;
    mousePos(e);
  }
  function onMouseDown(e){
    mouse_down = true;
    mousePos(e);

    if(check_palette_area()){
      pick_pallete();
    }
    if(check_editor_area()){
      set_dot();
    }
    if(check_clipboard_area()){
      edit_clipboard(e);
    }
  }
  function onMouseMove(e){
    mousePos(e);
    var tips_mes = false;
    if(mouse_down){
      if(check_palette_area()){
        pick_pallete();
      }
    }
    if(check_editor_area()){
      if(mouse_down){
        set_dot();
      }
      //pal_info['selected'] = edit_d[cur_info['dx'] + cur_info['dy'] * 8];
      //set_palette();
    }
    if(check_clipboard_area()){
      tips_mes = true;
      edit_clipboard(e);
    }
    if(!tips_mes){
      set_tips('reset');
    }
  }
  cursor.addEventListener('mouseup', onMouseUp, false);
  cursor.addEventListener('mousedown', onMouseDown, false);
  cursor.addEventListener('mousemove', onMouseMove, false);

  function mousePos(e){
    var org_x = e.clientX;
    var org_y = e.clientY;
    var x = org_x - OFFSET_X;
    var y = org_y - OFFSET_Y;

    var dx = parseInt((x - EDITOR_START_X) / PIXEL_SIZE);
    var dy = parseInt((y - EDITOR_START_Y) / PIXEL_SIZE);
    var cx = parseInt((x - CLIPBOARD_START_X) / CLIPBOARD_SIZE);
    var cy = parseInt((y - CLIPBOARD_START_Y) / CLIPBOARD_SIZE);

    cur_info = {
      org_x: org_x,
      org_y: org_y,
      x: x,
      y: y,
      //editor
      dx: dx,
      dy: dy,
      //clipboard
      cx: cx,
      cy: cy,
    };
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
      var editor_data = "";
      var editor_data_ended = null;

      for(var i=0; i < up_array.length; i++){
        var row = up_array[i];

        if(row.charAt(0) == '#'){
          if(row.indexOf('[') != -1){
            var comment = row.split("]");
            var key = comment[0].substr(comment[0].indexOf('[') + 1).trim();
            up_d[key] = comment[1].trim();
          //}else if(row.trim() == '# TilesEnd:'){
          //  editor_data_ended = 1;
          }
        }else if(row.charAt(0) == 'd' || row.charAt(0) == '0'){
          if(!editor_data_ended){
            editor_data += row.replace(/\s+/g, "");
          }
        }

      }
      $('#filename').val(up_d['FileName']);
      editor_data = editor_data.replace(/db/g, "");
      editor_data = editor_data.replace(/\$/g, "");
      editor_data = editor_data.replace(/0x/g, "");
      var d = editor_data.split(',');

      setHexForEditData(d);
      setHexForClipboarData(d);
      set_edit_data();
      set_clipboard_data();
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
  var lang = $('input[name=download_lang]:checked').val();
        
  $('#download').attr('download',filename);

  var e = convEditDataToHex(lang);
  var c = convClipboardDataToHex(lang);
  var content = '';
  content += "# [Create] " + dt.toString() + "\n";
  content += "# [FileName] " + $("#filename").val() + "\n";
  content += "# [Language] " + lang + "\n";
  content += "#\n";
  content += e;
  content += "#\n";
  content += c;

  var blob = new Blob([ content ], { "type" : "text/plain" });
  
  if(window.navigator.msSaveBlob){
    window.navigator.msSaveBlob(blob, filename); 
  }else{
    document.getElementById("download").href = window.URL.createObjectURL(blob);
  }
}

/* browser cache */
$('script').each(function(index, element){
  const src = $(element).attr('src');
  $(element).attr('src', src + '?' + new Date().getTime());
});
$('link').each(function(index, element){
  const href = $(element).attr('href');
  $(element).attr('href', href + '?' + new Date().getTime());
});