/*
GBPixelEditor

Copyright (c) 2022 emutyworks

Released under the MIT license
https://github.com/emutyworks/GBPixelEditor/blob/main/LICENSE
*/
var PIXEL_DOT = 16;
var PALETTE_DOT = 16;
var PREVIEW_DOT = 4;
var CLIPBOARD_DOT = 2;
var HISTORY_DOT = 2;

var OFFSET_X = 8;
var OFFSET_Y = 35;
var EDITOR_LINE = '#c0c000';
var EDITOR_LINE2 = '#808080';
var EDITOR_BOX = '#ff0000';
var EDITOR_START_X = 80;
var EDITOR_START_Y = 55;
var PREVIEW_START_X = 0;
var PREVIEW_START_Y = 0;
var PALETTE_START_X = 0;
var PALETTE_START_Y = EDITOR_START_Y;
var CLIPBOARD_MAX_CX = 16;
var CLIPBOARD_MAX_CY = 8;
var CLIPBOARD_SIZE = CLIPBOARD_DOT * 8 + 1;
var CLIPBOARD_MAX_X = CLIPBOARD_SIZE * CLIPBOARD_MAX_CX;
var CLIPBOARD_MAX_Y = CLIPBOARD_SIZE * CLIPBOARD_MAX_CY;
var CLIPBOARD_START_X = EDITOR_START_X + 16 + PIXEL_DOT * init_form['edit_size_x'];
var CLIPBOARD_START_Y = EDITOR_START_Y;
var HISTORY_START_X = CLIPBOARD_START_X;
var HISTORY_START_Y = 28;

var VIEW_MAX_X = EDITOR_START_X + 16 + 3 + CLIPBOARD_MAX_X + PIXEL_DOT * init_form['edit_size_x'];
var VIEW_MAX_Y = EDITOR_START_Y + 3 + CLIPBOARD_MAX_Y;

var view = null;
var cursor = null;
var ctx = null;
var c_ctx = null;
var mouse_down = false;
var flag = false;
var edit_alert = false;

var edit_d = new Array(init_form['edit_size_x'] * init_form['edit_size_y']);
for(var i=0; i<edit_d.length; i++){
  edit_d[i] = 0;
}
var clipboard_d = new Array(8 * 8 * CLIPBOARD_MAX_CX * CLIPBOARD_MAX_CY);
for(var i=0; i<clipboard_d.length; i++){
  clipboard_d[i] = 0;
}
var history_d = new Array(16);
for(var i=0; i<16; i++){
  history_d[i] = edit_d.slice();
}

var cur_info = {
  org_x: 0,
  org_y: 0,
  x: 0,
  y: 0,
  //editor
  dx: 0,
  dy: 0,
  //clipboard
  cx: 0,
  cy: 0,
  //history
  hx: 0,
};

var editor_info = {
  w: PIXEL_DOT * init_form['edit_size_x'],
  h: PIXEL_DOT * init_form['edit_size_y'],
};

var preview_info = {
  w: PREVIEW_DOT * init_form['edit_size_x'],
  h: PREVIEW_DOT * init_form['edit_size_y'],
};

var tips_mes = {
  clipboard: 'Clipboard: [LM] Copy to Editor. [Shift + LM] Copy from Editor.',
  reset: '"LM" Left Mouse Click.',
};

function init_view(){
  $('#view').attr({
    width: VIEW_MAX_X + 'px',
    height: VIEW_MAX_Y + 'px',
  });
  $('#cursor').attr({
    width: VIEW_MAX_X + 'px',
    height: VIEW_MAX_Y + 'px',
  });
  
  init_editor();
  init_preview();
  init_clipboard();
  init_history();
  set_edit_data();
  set_palette();
  set_tips('reset');
}

function init_history(){
  var fill_x = HISTORY_START_X;
  var fill_y = HISTORY_START_Y;
  var fill_w = (HISTORY_DOT * 8 + 1) * 16;
  var fill_h = HISTORY_DOT * 8 + 1;

  set_history_line();
  drowBox(fill_x, fill_y, fill_w, fill_h, EDITOR_BOX);
  set_history_data();
}

function set_history_line(){
  var fill_x = HISTORY_START_X;
  var fill_y = HISTORY_START_Y;
  var fill_w = HISTORY_DOT * 8 + 1;
  var fill_h = HISTORY_DOT * 8 + 1;

  ctx.fillStyle = EDITOR_LINE2;
  for(var i=1; i<16; i++){
    ctx.fillRect(fill_x + fill_w * i, fill_y, 1, fill_h);
  }
}

function init_clipboard(){
  var fill_x = CLIPBOARD_START_X;
  var fill_y = CLIPBOARD_START_Y;
  var fill_w = CLIPBOARD_MAX_X;
  var fill_h = CLIPBOARD_MAX_Y;

  set_clipboard_line();
  drowBox(fill_x, fill_y, fill_w, fill_h, EDITOR_BOX);
  set_clipboard_data();
}

function set_clipboard_line(){
  var fill_x = CLIPBOARD_START_X;
  var fill_y = CLIPBOARD_START_Y;
  var fill_w = CLIPBOARD_MAX_X;
  var fill_h = CLIPBOARD_MAX_Y;

  ctx.fillStyle = EDITOR_LINE2;
  for(var i=1; i<CLIPBOARD_MAX_CX; i++){
    ctx.fillRect(fill_x + CLIPBOARD_SIZE * i, fill_y, 1, fill_h);
  }
  for(var i=1; i<CLIPBOARD_MAX_CY; i++){
    ctx.fillRect(fill_x, fill_y + CLIPBOARD_SIZE * i, fill_w, 1);
  }
}

function init_editor(){
  var fill_x = EDITOR_START_X;
  var fill_y = EDITOR_START_Y;
  var fill_w = editor_info['w'];
  var fill_h = editor_info['h'];

  ctx.fillStyle = palettes[ pal_info['bank'] ][0];
  ctx.fillRect(fill_x, fill_y, fill_w, fill_h);

  ctx.fillStyle = EDITOR_LINE;
  for(var i=0; i<init_form['edit_size_x']; i++){
    ctx.fillRect(fill_x + PIXEL_DOT * i, fill_y, 1, fill_h);
  }
  for(var i=0; i<init_form['edit_size_y']; i++){
    ctx.fillRect(fill_x, fill_y + PIXEL_DOT * i, fill_w, 1);
  }
  drowBox(fill_x, fill_y, fill_w, fill_h, EDITOR_BOX);
  ctx.fillStyle = EDITOR_LINE2;
  ctx.fillRect(fill_x + PIXEL_DOT * 4, fill_y, 1, fill_h);
  ctx.fillRect(fill_x, fill_y + PIXEL_DOT * 4, fill_w, 1);
}

function init_preview(){
  var fill_x = PREVIEW_START_X;
  var fill_y = PREVIEW_START_Y;
  var fill_w = preview_info['w'] + 1;
  var fill_h = preview_info['h'] + 1;

  drowBox(fill_x, fill_y, fill_w, fill_h, EDITOR_BOX);
}

function drowBox(x,y,w,h,c){
  ctx.fillStyle = c;
  ctx.fillRect(x, y, 1, h);
  ctx.fillRect(x, y, w, 1);
  ctx.fillRect(x + w, y, 1, h);
  ctx.fillRect(x, y + h, w + 1, 1);
}

function edit_confirm_alert(mes){
  return window.confirm(mes);
}

function toHex(v){
  var len = v.toString(16).length;
  return (('00' + v.toString(16).toUpperCase()).substring(len, len + 2));
}

function hex2bin(v){
  v = parseInt(v, 16);
  var len = v.toString(2).length;
  return ('00000000' + v.toString(2)).substring(len, len + 8);
}