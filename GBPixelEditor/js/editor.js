/*
GBPixelEditor

Copyright (c) 2022 emutyworks

Released under the MIT license
https://github.com/emutyworks/GBPixelEditor/blob/main/LICENSE
*/
function drawHorizontal(){
  var ci = null;
  var d = [];

  if(editor_info['i']==1){//8x8
    ci = edit_d[ cur_info['di'] ];
    d = clipboard_d[ci].concat();
  }else if(edit_flag=='change_block'){
    ci = editor_info['ci'];
    d = clipboard_d[ci].concat();
  }else{
    return false;
  }

  for(var y1=0; y1<8; y1++){
    var x2 = 7;
    var y2 = y1;
    for(var x1=0; x1<8; x1++){
      clipboard_d[ci][x1 + y1 * 8] = d[x2 + y2 * 8];
      x2--;
    }
  }
  set_clipboard_box(ci);
  set_edit_data();
}

function drawVertical(){
  var ci = null;
  var d = [];

  if(editor_info['i']==1){//8x8
    ci = edit_d[ cur_info['di'] ];
    d = clipboard_d[ci].concat();
  }else if(edit_flag=='change_block'){
    ci = editor_info['ci'];
    d = clipboard_d[ci].concat();
  }else{
    return false;
  }

  var y2 = 7;
  for(var y1=0; y1<8; y1++){
    for(var x1=0; x1<8; x1++){
      var x2 = x1;
      clipboard_d[ci][x1 + y1 * 8] = d[x2 + y2 * 8];
    }
    y2--;
  }
  set_clipboard_box(ci);
  set_edit_data();
}

function drawClockwise(){
  var ci = null;
  var d = [];

  if(editor_info['i']==1){//8x8
    ci = edit_d[ cur_info['di'] ];
    d = clipboard_d[ci].concat();
  }else if(edit_flag=='change_block'){
    ci = editor_info['ci'];
    d = clipboard_d[ci].concat();
  }else{
    return false;
  }

  for(var y1=0; y1<8; y1++){
    var x2 = y1;
    var y2 = 7;
    for(var x1=0; x1<8; x1++){
      clipboard_d[ci][x1 + y1 * 8] = d[x2 + y2 * 8];
      y2--;
    }
  }
  set_clipboard_box(ci);
  set_edit_data();
}

function drawCounterClockwise(){
  var ci = null;
  var d = [];

  if(editor_info['i']==1){//8x8
    ci = edit_d[ cur_info['di'] ];
    d = clipboard_d[ci].concat();
  }else if(edit_flag=='change_block'){
    ci = editor_info['ci'];
    d = clipboard_d[ci].concat();
  }else{
    return false;
  }

  var x2 = 7;
  for(var y1=0; y1<8; y1++){
    for(var x1=0; x1<8; x1++){
      var y2 = x1;
      clipboard_d[ci][x1 + y1 * 8] = d[x2 + y2 * 8];
    }
    x2--;
  }
  set_clipboard_box(ci);
  set_edit_data();
}

function drawFill(){
  var ix = cur_info['ix'];
  var iy = cur_info['iy'];
  var ci = edit_d[ cur_info['di'] ];

  if(!edit_flag){
    set_tips('bucket');
    edit_flag = 'bucket';
    $('#bucket img').attr('src','img/bucket_on.png');
  }else{
    if(mouse_down){
      if(edit_alert){
        flag = true;
      }else{
        flag = edit_confirm_alert('Do you want to paint?');
      }
      if(flag){
        var pi = pal_info['index'];
        var fi = clipboard_d[ci][ix + iy * 8];

        if(pi!=fi){
          set_history(ci);
          
          clipboard_d[ci][ix + iy * 8] = pi;
          pushFillBuffer(ix,iy, 1, 0);
          pushFillBuffer(ix,iy,-1, 0);
          pushFillBuffer(ix,iy, 0, 1);
          pushFillBuffer(ix,iy, 0,-1);
          
          searchFillBuffer(ci,pi,fi);
        }
        set_clipboard_box(ci);
        set_edit_data();
      }
      edit_cancel();
    }
  }
}

function searchFillBuffer(ci,pi,fi){
  while(fill_b.length){
    var fb = fill_b.pop();
    var xy = fb.split(',');
    var ix = parseInt(xy[0]);
    var iy = parseInt(xy[1]);
    var i = clipboard_d[ci][ix + iy * 8];

    if(i==fi){
      clipboard_d[ci][ix + iy * 8] = pi;
      pushFillBuffer(ix,iy, 1, 0);
      pushFillBuffer(ix,iy,-1, 0);
      pushFillBuffer(ix,iy, 0, 1);
      pushFillBuffer(ix,iy, 0,-1);
    }
  }
}

function pushFillBuffer(ix,iy,ax,ay){
  var bx = ix + ax;
  var by = iy + ay;
  if(bx>=0 && bx<8 && by>=0 && by<8){
    fill_b.push(bx+','+by);
  }
}

function edit_cancel(){
  set_tips('reset');
  reset_history_cursor();
  reset_clipboard_cursor();
  reset_editor_cursor();
  edit_flag = false;
  mouse_down = false;
  cur_info['csel'] = null;
  cur_info['hsel'] = null;
  $('#bucket img').attr('src','img/bucket_off.png');

  bctx.fillStyle = EDITOR_LINE2;
  for(var i=1; i<5; i++){
    bctx.fillRect(TOOLS_START_X + TOOLS_H * i, TOOLS_START_Y, 1, TOOLS_H + 1);
  }
  bctx.fillStyle = EDITOR_BOX;
  bctx.fillRect(TOOLS_START_X, TOOLS_START_Y, TOOLS_W, 1);
  bctx.fillRect(TOOLS_START_X, TOOLS_START_Y + TOOLS_H, TOOLS_W, 1);
  bctx.fillRect(TOOLS_START_X, TOOLS_START_Y, 1, TOOLS_H);
  bctx.fillRect(TOOLS_START_X + TOOLS_W, TOOLS_START_Y, 1, TOOLS_H + 1);
}

function reset_clipboard_cursor(){
  var fill_x = CLIPBOARD_START_X;
  var fill_y = CLIPBOARD_START_Y;
  var fill_w = CLIPBOARD_MAX_X;
  var fill_h = CLIPBOARD_MAX_Y;

  cctx.clearRect(fill_x, fill_y, fill_w + 1, fill_h + 1);
  set_clipboard_cursor();
}

function set_clipboard_cursor(){
  for(var i=0; i<editor_info['i']; i++){
    var ci = edit_d[i];
    var cy = parseInt(ci / CLIPBOARD_MAX_CX);
    var cx = ci - cy * CLIPBOARD_MAX_CX;
    var clipboard_x = cx * CLIPBOARD_SIZE;
    var clipboard_y = cy * CLIPBOARD_SIZE;

    cdrowBox(CLIPBOARD_START_X + clipboard_x, CLIPBOARD_START_Y + clipboard_y, CLIPBOARD_SIZE, CLIPBOARD_SIZE, EDITOR_BOX2);
    cctx.globalAlpha = 0.1;
    cctx.fillStyle = EDITOR_BOX2;
    cctx.fillRect(CLIPBOARD_START_X + clipboard_x, CLIPBOARD_START_Y + clipboard_y, CLIPBOARD_SIZE, CLIPBOARD_SIZE);
    cctx.globalAlpha = 1.0;
  }
}

function select_clipboard(clipboard_x, clipboard_y){
  cctx.globalAlpha = 0.3;
  cctx.fillStyle = EDITOR_BOX;
  cctx.fillRect(CLIPBOARD_START_X + clipboard_x, CLIPBOARD_START_Y + clipboard_y, CLIPBOARD_SIZE, CLIPBOARD_SIZE);
  cctx.globalAlpha = 1.0;
}

function edit_clipboard(e){
  var clipboard_x = cur_info['cx'] * CLIPBOARD_SIZE;
  var clipboard_y = cur_info['cy'] * CLIPBOARD_SIZE;
  var ci = cur_info['ci'];

  if(!edit_flag || edit_flag=='clipboard' || edit_flag=='history'){
    reset_clipboard_cursor();
    cdrowBox(CLIPBOARD_START_X + clipboard_x, CLIPBOARD_START_Y + clipboard_y, CLIPBOARD_SIZE, CLIPBOARD_SIZE, EDITOR_BOX);

    if(edit_flag=='clipboard'){
      select_clipboard(cur_info['cselx'], cur_info['csely']);
    }
  }
  
  if(mouse_down){
    if(edit_flag=='history'){
      if(edit_alert){
        flag = true;
      }else{
        flag = edit_confirm_alert('Do you want to copy the selected target?');
      }
      if(flag){
        clipboard_d[ ci ] = history_d[ cur_info['hsel'] ].concat();
        set_clipboard_data();
      }
      edit_cancel();
    }else{
      if(e.shiftKey){
        select_clipboard(clipboard_x, clipboard_y);
        edit_flag = 'clipboard';
        cur_info['csel'] = ci;
        cur_info['cselx'] = clipboard_x;
        cur_info['csely'] = clipboard_y;
      }else{
        if(edit_flag=='clipboard'){
          if(edit_alert){
            flag = true;
          }else{
            flag = edit_confirm_alert('Do you want to copy the selected target?');
          }
          if(flag){
            set_history(ci);
            clipboard_d[ ci ] = clipboard_d[ cur_info['csel'] ].concat();
            set_clipboard_data();
          }
          edit_cancel();
        }else{
          if(editor_info['i']==1){//8x8
            edit_d[0] = cur_info['ci'];
          }else{
            if(!edit_flag){
              select_clipboard(clipboard_x, clipboard_y);
    
              if(!edit_d.includes(ci)){
                edit_flag = 'editor';
                cur_info['csel'] = ci;
              }
            }
          } 
        }
      }
    }
    set_edit_data();
    exit_edit();
  }
}

function set_history(ci){
  var flag = false;
  for(var i=0; i<clipboard_d[ ci ].length; i++){
    if(clipboard_d[ ci ][i]!=0){
      flag = true;
      break;
    }
  }
  if(flag){
    history_d.unshift(clipboard_d[ ci ].concat());
    history_d.pop();
    set_history_data();
  }
}

function select_history(history_x){
  cctx.globalAlpha = 0.3;
  cctx.fillStyle = EDITOR_BOX;
  cctx.fillRect(HISTORY_START_X + history_x, HISTORY_START_Y, HISTORY_SIZE, HISTORY_SIZE);
  cctx.globalAlpha = 1.0;
}

function pick_history(){
  var hx = cur_info['hx'];
  var history_x = hx * HISTORY_SIZE;
  if(!edit_flag){
    reset_history_cursor();
    cdrowBox(HISTORY_START_X + history_x, HISTORY_START_Y, HISTORY_SIZE, HISTORY_SIZE, EDITOR_BOX);
  }

  if(mouse_down){
    var flag = false;
    for(var i=0; i<history_d[hx].length; i++){
      if(history_d[hx][i]!=0){
        flag = true;
        break;
      }
    }
    if(flag){
      select_history(history_x);
      edit_flag = 'history';
      cur_info['hsel'] = hx;
      cur_info['hselx'] = history_x;
    }
  }
}

function select_editor(e){
  if(e.shiftKey && !edit_flag){
    var editor_x = cur_info['ex'];
    var editor_y = cur_info['ey'];
    editor_info['ci'] = edit_d[ cur_info['di'] ];

    edit_flag = 'change_block';

    cctx.globalAlpha = 0.2;
    cctx.fillStyle = EDITOR_BOX2;
    cctx.fillRect(EDITOR_START_X + editor_x, EDITOR_START_Y + editor_y, EDITOR_BLOCK_SIZE, EDITOR_BLOCK_SIZE);
    cctx.globalAlpha = 1.0;

  }else{
    set_edit_dot();
  }
}

function set_edit_dot(){
  var dx = cur_info['dx'];
  var dy = cur_info['dy'];
  var ix = cur_info['ix'];
  var iy = cur_info['iy'];
  var i = pal_info['index'];
  var ed = editor_info['ds'];
  var pd = preview_info['ds'];
  var ci = edit_d[ cur_info['di'] ];

  clipboard_d[ci][ix + iy * 8] = i;
  vctx.fillStyle = palettes[ pal_info['bank'] ][i];
  vctx.fillRect(EDITOR_START_X + 1 + ed * dx, EDITOR_START_Y + 1 + ed * dy, ed - 1, ed - 1);
  vctx.fillRect(PREVIEW_START_X + 1 + pd * dx, PREVIEW_START_Y + 1 + pd * dy, pd, pd);

  set_clipboard_box(ci);
}

function check_data(d){
  var f = false;
  for(var i=0; i<DATA_SIZE; i++){
    if(d[i]!=0){
      f = true;
      break;
    }
  }
  return f;
}

function set_history_data(){
  for(var hx=0; hx<HISTORY_MAX_X; hx++){
    var history_x = HISTORY_SIZE * hx;
    for(var dy=0; dy<8; dy++){
      for(var dx=0; dx<8; dx++){
        var hd = history_d[hx][dx + dy * 8];
        vctx.fillStyle = palettes[ pal_info['bank'] ][hd];
        vctx.fillRect(HISTORY_START_X + 1 + history_x + HISTORY_DOT * dx, HISTORY_START_Y + 1 + HISTORY_DOT * dy, HISTORY_DOT, HISTORY_DOT);
      }
    }
  }
}

function set_edit_data(){
  var ei = editor_info['i'];
  for(var i=0; i<ei; i++){
    var ci = edit_d[i];
    set_edit_box(ci,i);
  }
}

function set_edit_box(ci,bp){
  var ed = editor_info['ds'];
  var pd = preview_info['ds'];
  var edit_x = 0;
  var edit_y = 0;
  var preview_x = 0;
  var preview_y = 0;

  if(bp==1){
    edit_y = ed * 8;
    preview_y = pd * 8;
  }else if(bp==2){
    edit_x = ed * 8;
    preview_x = pd * 8;
  }else if(bp==3){
    edit_x = ed * 8;
    edit_y = ed * 8;
    preview_x = pd * 8;
    preview_y = pd * 8;
  }

  for(var dy=0; dy<8; dy++){
    for(var dx=0; dx<8; dx++){
      var i = clipboard_d[ci][dx + dy * 8];

      vctx.fillStyle = palettes[ pal_info['bank'] ][i];
      vctx.fillRect(EDITOR_START_X + 1 + edit_x + ed * dx, EDITOR_START_Y + 1 + edit_y + ed * dy, ed - 1, ed - 1);
      vctx.fillRect(PREVIEW_START_X + 1 + preview_x + pd * dx, PREVIEW_START_Y + 1 + preview_y + pd * dy, pd, pd);
    }
  }
}

function set_clipboard_data(){
  for(var cy=0; cy<CLIPBOARD_MAX_CY; cy++){
    for(var cx=0; cx<CLIPBOARD_MAX_CX; cx++){
      var ci = cx + cy * CLIPBOARD_MAX_CX;
      set_clipboard_box(ci);
    }
  }
}

function set_clipboard_box(ci){
  var cy = parseInt(ci / CLIPBOARD_MAX_CX);
  var cx = ci - cy * CLIPBOARD_MAX_CX;
  var clipboard_x = cx * CLIPBOARD_SIZE;
  var clipboard_y = cy * CLIPBOARD_SIZE;

  for(var dy=0; dy<8; dy++){
    for(var dx=0; dx<8; dx++){
      var i = clipboard_d[ci][dx + dy * 8];

      vctx.fillStyle = palettes[ pal_info['bank'] ][i];
      vctx.fillRect(CLIPBOARD_START_X + 1 + clipboard_x + CLIPBOARD_DOT * dx, CLIPBOARD_START_Y + 1 + clipboard_y + CLIPBOARD_DOT * dy, CLIPBOARD_DOT, CLIPBOARD_DOT);
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

  reset_palette_cursor();
  var index_x = pal_info['index'] * PALETTE_DOT;
  cdrowBox(PALETTE_START_X + index_x, PALETTE_START_Y, PALETTE_DOT - 1, PALETTE_DOT - 1, EDITOR_BOX);
  //$('#palette_info').html('Bank:' + pal_info['bank']);
}


function reset_editor_cursor(){
  var fill_x = EDITOR_START_X;
  var fill_y = EDITOR_START_Y;
  var fill_w = editor_info['w'];
  var fill_h = editor_info['h'];

  cctx.clearRect(fill_x, fill_y, fill_w + 1, fill_h + 1);
}

function reset_palette_cursor(){
  var fill_x = PALETTE_START_X;
  var fill_y = PALETTE_START_Y;
  var fill_w = PALETTE_DOT * 4;
  var fill_h = PALETTE_DOT;

  cctx.clearRect(fill_x, fill_y, fill_w + 1, fill_h + 1);
}

function set_palette(){
  var index_x = pal_info['index'] * PALETTE_DOT;
  var fill_x = PALETTE_START_X;
  var fill_y = PALETTE_START_Y;
  var fill_w = PALETTE_DOT;
  var fill_h = PALETTE_DOT;
  
  for(var i=0; i<4; i++){
    bctx.fillStyle = palettes[ pal_info['bank'] ][i];
    bctx.fillRect(fill_x + fill_w * i, fill_y, fill_w, fill_h);
  }
  cdrowBox(PALETTE_START_X + index_x, PALETTE_START_Y, PALETTE_DOT - 1, PALETTE_DOT - 1, EDITOR_BOX);
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
    && cur_info['x']<HISTORY_START_X + HISTORY_SIZE * 16
    && cur_info['y']>HISTORY_START_Y
    && cur_info['y']<HISTORY_START_Y + HISTORY_SIZE
    ){
    return true;
  }
  return false;
}

function check_editor_area(){
  var w = editor_info['w'];
  var h = editor_info['h'];
  if(cur_info['x']>EDITOR_START_X
    && cur_info['x']<EDITOR_START_X + w
    && cur_info['y']>EDITOR_START_Y
    && cur_info['y']<EDITOR_START_Y + h
    ){
    return true;
  }
  return false;
}

function set_tips_first(key){
  if(key=='' || edit_flag=='change_block'){
    $('#tips_first').html('');
  }else if(editor_info['i']!=1){//not 8x8
    $('#tips_first').html(tips_mes[key]);
  }
}

function set_tips(key){
  if(key=='editor' || key=='clipboard' || key=='f_vertical' || key=='f_horizontal' || key=='c_clockwise' || key=='clockwise'){
    if(editor_info['i']==1){//8x8
      $('#tips_mes').html(tips_mes[ key + '1' ]);
    }else{
      $('#tips_mes').html(tips_mes[ key + '24' ]);
    }  
  }else{
    $('#tips_mes').html(tips_mes[key]);
  }
  tips_flag = true;
}

function exit_edit(){
  mouse_down = false;
  document.activeElement.blur();
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

function convDotDataToHex(mode,lang,dd){
  var x = 0;
  var hx = 0;
  var low = '';
  var hi = '';
  var d = '';
  var d2 = '';
  for(var i=0; i<dd.length; i++){
    for(var dp=0; dp<64; dp++){
      var r = dd[i][dp];
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
          d += '$' + dec2Hex(parseInt(low,2)) + ',';
          d += '$' + dec2Hex(parseInt(hi,2)) + ',';
        }else{
          d += '0x' + dec2Hex(parseInt(low,2)) + ',';
          d += '0x' + dec2Hex(parseInt(hi,2)) + ',';
        }
        low = '';
        hi = '';
        x = 0;
        hx++;
      }
      if(mode=='clipboard'){
        if(hx==8){
          if(lang=='asm'){
            d2 += 'db ' + d + '\n';
          }else{
            d2 += d + '\n';
          }
          low = '';
          hi = '';
          x = 0;
          hx = 0;
          d='';
        }
      }
    }
  }
  var s = '# [' + mode + '_data]\n';
  if(lang=='asm'){
    s += '# Sprite/Tile data for Assembler (RGBDS)\n';
    s += '# Tiles:\n';
    if(mode=='clipboard'){
      s += d2;
    }else{
      s += 'db ' + d + '\n';
    }
    s += '# TilesEnd:\n';
  }else{
    s += '# Sprite/Tile data for C/C++\n';
    s += '# {\n';
    if(mode=='clipboard'){
      s += d2;
    }else{
      s += d + '\n';
    }
    s += '# }\n';
  }
  s += '# [' + mode + '_data_ended]\n';
  return (s);
}