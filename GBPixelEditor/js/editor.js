/*
GBPixelEditor

Copyright (c) 2022 emutyworks

Released under the MIT license
https://github.com/emutyworks/GBPixelEditor/blob/main/LICENSE
*/
function edit_clipboard(e){
  var clipboard_x = cur_info['cx'] * CLIPBOARD_SIZE;
  var clipboard_y = cur_info['cy'] * CLIPBOARD_SIZE;
  set_clipboard_line();
  drowBox(CLIPBOARD_START_X + clipboard_x, CLIPBOARD_START_Y + clipboard_y, CLIPBOARD_SIZE, CLIPBOARD_SIZE, EDITOR_BOX);
  set_tips('clipboard');

  if(mouse_down){
    if(e.shiftKey){
      if(edit_alert){
        flag = true;
      }else{
        flag = edit_confirm_alert('Do you want to copy a editor to a clipboard?');
      }
      if(flag){
        copyToClipboard();
        set_clipboard_line();
      }
    }else{
      if(edit_alert){
        flag = true;
      }else{
        flag = edit_confirm_alert('Do you want to copy a clipboard to a editor?');
      }
      if(flag){
        copyToEditor();
        set_clipboard_line();
      }
    }
    mouse_down = false;
    document.activeElement.blur();
  }
}

function copyToEditor(){
  var clipboard_d_p = cur_info['cx'] * 64 + cur_info['cy'] * CLIPBOARD_MAX_CX * 64;

  for(var dy=0; dy<8; dy++){
    for(var dx=0; dx<8; dx++){
      edit_d[dx + dy * 8] = clipboard_d[ clipboard_d_p + dx + dy * 8];
    }
  }
  set_edit_data();
  history_d.unshift(edit_d.slice());
  history_d.pop();
  set_history_data();
  //console.log(history_d);
}

function copyToClipboard(){
  var clipboard_x = cur_info['cx'] * CLIPBOARD_SIZE;
  var clipboard_y = cur_info['cy'] * CLIPBOARD_SIZE;
  var clipboard_d_p = cur_info['cx'] * 64 + cur_info['cy'] * CLIPBOARD_MAX_CX * 64;
  var d = [];
  for(var dy=0; dy<8; dy++){
    for(var dx=0; dx<8; dx++){
      var i = edit_d[dx + dy * 8];

      d[dx + dy * 8] = i;
      clipboard_d[clipboard_d_p + dx + dy * 8] = i;
      ctx.fillStyle = palettes[ pal_info['bank'] ][i];
      ctx.fillRect(CLIPBOARD_START_X + 1 + clipboard_x + CLIPBOARD_DOT * dx, CLIPBOARD_START_Y + 1 + clipboard_y + CLIPBOARD_DOT * dy, CLIPBOARD_DOT, CLIPBOARD_DOT);
    }
  }
  history_d.unshift(d.slice());
  history_d.pop();
  console.log(history_d);
  set_history_data();
}

function pick_history(){
  var history_x = cur_info['hx'] * (HISTORY_DOT * 8 + 1);
  set_history_line();
  drowBox(HISTORY_START_X + history_x, HISTORY_START_Y, HISTORY_DOT * 8 + 1, HISTORY_DOT * 8 + 1, EDITOR_BOX);
  if(mouse_down){
    if(edit_alert){
      flag = true;
    }else{
      flag = edit_confirm_alert('Do you want to copy a history to a editor?');
    }
    if(flag){
      edit_d = history_d[ cur_info['hx'] ].slice();
      set_edit_data();
    }
  }
}

function set_dot(){
  var dx = cur_info['dx'];
  var dy = cur_info['dy'];
  var i = pal_info['index'];
  
  edit_d[dx + dy * 8] = i;
  ctx.fillStyle = palettes[ pal_info['bank'] ][i];
  ctx.fillRect(EDITOR_START_X + 1 + PIXEL_DOT * dx, EDITOR_START_Y + 1 + PIXEL_DOT * dy, PIXEL_DOT - 1, PIXEL_DOT - 1);
  ctx.fillRect(PREVIEW_START_X + 1 + PREVIEW_DOT * dx, PREVIEW_START_Y + 1 + PREVIEW_DOT * dy, PREVIEW_DOT, PREVIEW_DOT);
}

function set_history_data(){
  for(var hx=0; hx<16; hx++){
    var history_x = (HISTORY_DOT * 8 + 1) * hx;
    for(var dy=0; dy<8; dy++){
      for(var dx=0; dx<8; dx++){
        var i = history_d[hx][ dx + dy * 8];

        ctx.fillStyle = palettes[ pal_info['bank'] ][i];
        ctx.fillRect(HISTORY_START_X + 1 + history_x + HISTORY_DOT * dx, HISTORY_START_Y + 1 + HISTORY_DOT * dy, HISTORY_DOT, HISTORY_DOT);
      }
    }
  }
}

function set_edit_data(){
  for(var dy=0; dy<init_form['edit_size_x']; dy++){
    for(var dx=0; dx<init_form['edit_size_y']; dx++){
      var i = edit_d[dx + dy * init_form['edit_size_y']];

      ctx.fillStyle = palettes[ pal_info['bank'] ][i];
      ctx.fillRect(EDITOR_START_X + 1 + PIXEL_DOT * dx, EDITOR_START_Y + 1 + PIXEL_DOT * dy, PIXEL_DOT - 1, PIXEL_DOT - 1);
      ctx.fillRect(PREVIEW_START_X + 1 + PREVIEW_DOT * dx, PREVIEW_START_Y + 1 + PREVIEW_DOT * dy, PREVIEW_DOT, PREVIEW_DOT);
    }
  }
}

function set_clipboard_data(){
  var d_cnt = 0;
  for(var cy=0; cy<CLIPBOARD_MAX_CY; cy++){
    for(var cx=0; cx<CLIPBOARD_MAX_CX; cx++){

      var clipboard_x = cx * CLIPBOARD_SIZE;
      var clipboard_y = cy * CLIPBOARD_SIZE;

      for(var dy=0; dy<8; dy++){
        for(var dx=0; dx<8; dx++){
          var i = clipboard_d[d_cnt];
          d_cnt++;

          ctx.fillStyle = palettes[ pal_info['bank'] ][i];
          ctx.fillRect(CLIPBOARD_START_X + 1 + clipboard_x + CLIPBOARD_DOT * dx, CLIPBOARD_START_Y + 1 + clipboard_y + CLIPBOARD_DOT * dy, CLIPBOARD_DOT, CLIPBOARD_DOT);
        }
      }
    }
  }
}

function pick_pallete(){
  if(cur_info['x']>0 && cur_info['x']<PALETTE_DOT){
    pal_info['index'] = 0;
  }else if(cur_info['x']>PALETTE_DOT && cur_info['x']<PALETTE_DOT * 2){
    pal_info['index'] = 1;
  }else if(cur_info['x']>PALETTE_DOT * 2 && cur_info['x']<PALETTE_DOT * 3){
    pal_info['index'] = 2;
  }else{
    pal_info['index'] = 3;
  }
  set_palette();
}

function set_palette(){
  var index_x = pal_info['index'] * PALETTE_DOT;
  var fill_x = PALETTE_START_X;
  var fill_y = PALETTE_START_Y;
  var fill_w = PALETTE_DOT;
  var fill_h = PALETTE_DOT;
  
  for(var i=0; i<4; i++){
    ctx.fillStyle = palettes[ pal_info['bank'] ][i];
    ctx.fillRect(fill_x + fill_w * i, fill_y, fill_w, fill_h);
  }
  drowBox(PALETTE_START_X + index_x, PALETTE_START_Y, PALETTE_DOT - 1, PALETTE_DOT - 1, EDITOR_BOX);

  //var selected_x = pal_info['selected'] * PALETTE_DOT;
  //ctx.fillStyle = '#ffffff';
  //ctx.fillRect(PALETTE_START_X + selected_x + 1, PALETTE_START_Y + 1, 3, 3);
  $('#palette_info').html('Bank:' + pal_info['bank']);
}

function check_palette_area(){
  if(cur_info['x']>PALETTE_START_X
    && cur_info['x']<PALETTE_DOT * 4
    && cur_info['y']>PALETTE_START_Y
    && cur_info['y']<PALETTE_START_Y + PALETTE_DOT
    ){
    return true;
  }
  return false;
}

function check_history_area(){
  if(cur_info['x']>HISTORY_START_X
    && cur_info['x']<HISTORY_START_X + (HISTORY_DOT * 8 + 1) * 16
    && cur_info['y']>HISTORY_START_Y
    && cur_info['y']<HISTORY_START_Y + HISTORY_DOT * 8 + 1
    ){
    return true;
  }
  return false;
}

function check_editor_area(){
  if(cur_info['x']>EDITOR_START_X
    && cur_info['x']<EDITOR_START_X + PIXEL_DOT * init_form['edit_size_x']
    && cur_info['y']>EDITOR_START_Y
    && cur_info['y']<EDITOR_START_Y + PIXEL_DOT * init_form['edit_size_y']
    ){
    return true;
  }
  return false;
}

function set_tips(key){
  $('#tips_mes').html('Tips: ' + tips_mes[key]);
}

function check_clipboard_area(){
  if(cur_info['x']>CLIPBOARD_START_X
    && cur_info['x']<CLIPBOARD_START_X + CLIPBOARD_MAX_X
    && cur_info['y']>CLIPBOARD_START_Y
    && cur_info['y']<CLIPBOARD_START_Y + CLIPBOARD_MAX_Y
    ){
    return true;
  }
  return false;
}

function convHexData(dd){
  var b = [];
  var d = [];

  for(var i=0; i<dd.length; i++){
    if(dd[i]!=''){
      b[i] = hex2bin(dd[i]);
    }
  }

  var dd_cnt = parseInt(dd.length/2);
  for(var i=0; i<dd_cnt; i++){
    for(var j=0; j<8; j++){
      var low = b[i * 2].charAt(j);
      var hi = b[(i * 2) + 1].charAt(j);

      if(low=='0' && hi=='0'){
        d[j + i * 8] = 0;
      }else if(low=='1' && hi=='0'){
        d[j + i * 8] = 1;
      }else if(low=='0' && hi=='1'){
        d[j + i * 8] = 2;
      }else{
        d[j + i * 8] = 3;
      }
    }
  }
  return d.concat();
}

function convEditDataToHex(lang){
  var x = 0;
  var low = '';
  var hi = '';
  var d = '';
  for(var i=0; i<edit_d.length; i++){
    var r = edit_d[i];
    if(r==0){
      low += '0';
      hi += '0';
    }else if(r==1){
      low += '1';
      hi += '0';
    }else if(r==2){
      low += '0';
      hi += '1';
    }else{
      low += '1';
      hi += '1';
    }
    x++;
    if(x==8){
      if(lang=='asm'){
        d += '$' + toHex(parseInt(low,2)) + ',';
        d += '$' + toHex(parseInt(hi,2)) + ',';
      }else{
        d += '0x' + toHex(parseInt(low,2)) + ',';
        d += '0x' + toHex(parseInt(hi,2)) + ',';
      }
      low = '';
      hi = '';
      x = 0;
    }
  }
  var s = '# [editor_data]\n';
  if(lang=='asm'){
    s += '# Sprite/Tile data for Assembler (RGBDS)\n';
    s += '# Tiles:\n';
    s += 'db ' + d + '\n';
    s += '# TilesEnd:\n';
  }else{
    s += '# Sprite/Tile data for C/C++\n';
    s += '# {\n';
    s += d + '\n';
    s += '# }\n';
  }
  s += '# [editor_data_ended]\n';
  return (s);
}

function convClipboardDataToHex(lang){
  var x = 0;
  var hx = 0;
  var low = '';
  var hi = '';
  var d = '';
  var d2 = '';
  //console.log(clipboard_d);
  for(var i=0; i<clipboard_d.length; i++){
    var r = clipboard_d[i];
    //console.log(r);
    if(r==0){
      low += '0';
      hi += '0';
    }else if(r==1){
      low += '1';
      hi += '0';
    }else if(r==2){
      low += '0';
      hi += '1';
    }else{
      low += '1';
      hi += '1';
    }
    x++;
    if(x==8){
      if(lang=='asm'){
        d += '$' + toHex(parseInt(low,2)) + ',';
        d += '$' + toHex(parseInt(hi,2)) + ',';
      }else{
        d += '0x' + toHex(parseInt(low,2)) + ',';
        d += '0x' + toHex(parseInt(hi,2)) + ',';
      }
      low = '';
      hi = '';
      x = 0;
      hx++;
      //console.log(d);
    }
    if(hx==8){
      if(lang=='asm'){
        d2 += 'db ' + d + '\n';
      }else{
        d2 += d + '\n';
      }
      low = '';
      hi = '';
      x = 0;
      hx=0;
      d='';
      
    }
  }
  var s = '';
  s += '# [clipboard_data]\n';
  if(lang=='asm'){
    s += '# Sprite/Tile data for Assembler (RGBDS)\n';
    s += '# Tiles:\n';
    s += d2;
    s += '# TilesEnd:\n';
  }else{
    s += '# Sprite/Tile data for C/C++\n';
    s += '# {\n';
    s += d2;
    s += '# }\n';
  }
  s += '# [clipboard_data_ended]\n';
  return (s);
}

function set_edit_alert(){
  if($('#edit_alert').prop('checked')){
    edit_alert = true;
  }else{
    edit_alert = false;
  }
}

/*
function view_edit_info(){
  var dx = ('000' + cur_info['dx']).slice(-3);
  var dy = ('000' + cur_info['dy']).slice(-3);

  $('#edit_info').html('<span class="mono"> px:' + dx + " py:" + dy + "</span>");
}
*/
