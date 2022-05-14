/*
GBPixelEditor

Copyright (c) 2022 emutyworks

Released under the MIT license
https://github.com/emutyworks/GBPixelEditor/blob/main/LICENSE
*/
window.onload = function(){
  base = document.getElementById('base');
  bctx = base.getContext('2d');

  view = document.getElementById('view');
  vctx = view.getContext('2d');

  cursor = document.getElementById('cursor');
  cctx = cursor.getContext('2d');

  $('#filename').val(init_form['filename']);
  $("input[name=download_lang][value='" + init_form['download_lang'] + "']").prop('checked',true);
  $("#edit_size option[value='" + init_form['edit_size'] + "']").prop('selected', true);
  $('input[name="edit_alert"]').prop("checked",init_form['non_dialog']);
  set_edit_alert();
  init_view();

  $(window).keydown(function(e){
    if(e.keyCode===27){
      edit_cancel();
      return false;
    }
  });

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
    if(check_history_area() && !clipboard_flag){
      set_tips('history');
      pick_history(e);
    }
    if(check_editor_area()){
      if(!clipboard_flag){
        set_edit_dot();
      }else if(clipboard_flag=='editor'){
        edit_d[ cur_info['di'] ] = cur_info['csel'];
        set_edit_data();
        edit_cancel();
      }
    }
    if(check_clipboard_area()){
      edit_clipboard(e);
    }
  }
  function onMouseMove(e){
    mousePos(e);
    tips_flag = false;
    if(check_palette_area()){
      set_tips('palette');
      if(mouse_down){
        pick_pallete();
      }
    }
    if(check_history_area() && !clipboard_flag){
      set_tips('history');
      pick_history(e);
    }
    if(check_editor_area() && !clipboard_flag){
      set_tips('editor');
      if(mouse_down){
        set_edit_dot();
      }
    }
    if(check_clipboard_area()){
      if(clipboard_flag!='history'){
        set_tips('clipboard');
      }
      edit_clipboard(e);
    }
    if(!tips_flag && !clipboard_flag){
      edit_cancel();
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
    var ed = editor_info['ds'];

    var dx = parseInt((x - EDITOR_START_X) / ed);
    var dy = parseInt((y - EDITOR_START_Y) / ed);
    var ix = dx;
    var iy = dy;
    var cx = parseInt((x - CLIPBOARD_START_X) / CLIPBOARD_SIZE);
    var cy = parseInt((y - CLIPBOARD_START_Y) / CLIPBOARD_SIZE);
    var ci = cx + cy * CLIPBOARD_MAX_CX;
    var hx = parseInt((x - HISTORY_START_X) / HISTORY_SIZE);
    var di = 0;

    if(editor_info['i']==2){
      if(dy>7){
        iy = dy - 8;
        di = 1;
      }
    }else if(editor_info['i']==4){
      if(dx<8 && dy>7){
        iy = dy - 8;
        di = 1;
      }else if(dx>7 && dy<8){
        ix = dx - 8;
        di = 2;
      }else if(dx>7 && dy>7){
        ix = dx - 8;
        iy = dy - 8;
        di = 3;
      }
    }

    cur_info = {
      org_x: org_x,
      org_y: org_y,
      x: x,
      y: y,
      //editor
      dx: dx,
      dy: dy,
      ix: ix,
      iy: iy,
      di: di,
      //clipboard
      cx: cx,
      cy: cy,
      ci: ci,
      csel: cur_info['csel'],
      cselx: cur_info['cselx'],
      csely: cur_info['csely'],
      //history
      hx: hx,
      hsel: cur_info['hsel'],
      hselx: cur_info['hselx'],
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
      var up_array = up_text.split('\n');

      var up_d = [];
      var clipboard_data = '';
      var clipboard_data_started = false;
      var clipboard_data_ended = false;

      for(var i=0; i < up_array.length; i++){
        var row = up_array[i];

        if(row.charAt(0) == '#'){
          if(row.trim() == '# [clipboard_data]' || row.trim() == '# clipboard_data'){
            clipboard_data_started = true;
          }else if(row.indexOf('[') != -1){
            var comment = row.split(']');
            var key = comment[0].substr(comment[0].indexOf('[') + 1).trim();
            up_d[key] = comment[1].trim();
          }
        }else if(row.charAt(0) == 'd' || row.charAt(0) == '0'){
          if(clipboard_data_started && !clipboard_data_ended){
            clipboard_data += row.replace(/\s+/g, '');
          }
        }
      }
      $('#filename').val(up_d['FileName']);
      if(up_d['EditSize']===undefined || up_d['EditSize']==''){
        up_d['EditSize'] = '8x8';
      }
      $("#edit_size option[value='" + up_d['EditSize'] + "']").prop('selected', true);
      clipboard_data = clipboard_data.replace(/db/g,'').replace(/\$/g,'').replace(/0x/g,'');
      var c = clipboard_data.split(',');
      var clipboard_d_tmp = convHexData(c);
      var cnt = 0;
      for(var i=0; i<parseInt(clipboard_d_tmp.length / DATA_SIZE); i++){
        for(var dy=0; dy<8; dy++){
          for(var dx=0; dx<8; dx++){
            clipboard_d[i][dx + dy * 8] = clipboard_d_tmp[cnt];
            cnt++;
          }
        }
      }
      set_edit_size();
      set_edit_data();
      set_clipboard_data();
      $('#data_upload').val('');
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
  var filename = $('#filename').val() + '.txt';
  var lang = $('input[name=download_lang]:checked').val();
  var es = $('[name=edit_size]').val();

  $('#download').attr('download',filename);

  var c = convDotDataToHex('clipboard', lang, clipboard_d);
  var content = '';
  content += '# [Create] ' + dt.toString() + '\n';
  content += '# [FileName] ' + $('#filename').val() + '\n';
  content += '# [Language] ' + lang + '\n';
  content += '# [EditSize] ' + es + '\n';
  content += '#\n';
  content += '# [editor_data]\n';
  content += '# *"editor_data" is obsolete and will not be imported.\n';
  content += '# [editor_data_ended]\n';
  content += '#\n';
  content += c;

  var blob = new Blob([ content ], {type:'text/plain'});
  
  if(window.navigator.msSaveBlob){
    window.navigator.msSaveBlob(blob, filename); 
  }else{
    document.getElementById('download').href = window.URL.createObjectURL(blob);
  }
}

function set_edit_alert(){
  if($('#edit_alert').prop('checked')){
    edit_alert = true;
  }else{
    edit_alert = false;
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