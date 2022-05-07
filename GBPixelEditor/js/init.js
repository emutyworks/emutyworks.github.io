/*
GBPixelEditor

Copyright (c) 2022 emutyworks

Released under the MIT license
https://github.com/emutyworks/GBPixelEditor/blob/main/LICENSE
*/
var MAX_PIXEL_X = 8;
var MAX_PIXEL_Y = 8;
var PIXEL_SIZE = 16;
var PALETTE_SIZE = 16;
var PREVIEW_SIZE = 4;

var OFFSET_X = 10;
var OFFSET_Y = 35;
var EDITOR_LINE = "#c0c000";
var EDITOR_LINE2 = "#808080";
var EDITOR_BOX = "#ff0000";
var PREVIEW_START_X = 0;
var PREVIEW_START_Y = 0;
var EDITOR_START_X = 80;
var EDITOR_START_Y = 40;
var PALETTE_START_X = 0;
var PALETTE_START_Y = 40;
var VIEW_MAX_X = EDITOR_START_X + 1 + PIXEL_SIZE * MAX_PIXEL_X;
var VIEW_MAX_Y = EDITOR_START_Y + 1 + PIXEL_SIZE * MAX_PIXEL_Y;

var view = null;
var cursor = null;
var ctx = null;
var c_ctx = null;
var mouse_down = false;

var edit_d = [
  0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,
];

var cur_info = {
  org_x: 0,
  org_y: 0,
  x: 0,
  y: 0,
  //editor
  dx: 0,
  dy: 0,
};

var editor_info = {
  w: PIXEL_SIZE * MAX_PIXEL_X,
  h: PIXEL_SIZE * MAX_PIXEL_X,
};

var preview_info = {
  w: PREVIEW_SIZE * MAX_PIXEL_X,
  h: PREVIEW_SIZE * MAX_PIXEL_X,
};

function init_view(){
  $('#view').attr({
    width: VIEW_MAX_X + 100 + 'px',
    height: VIEW_MAX_Y + 'px',
  });
  $('#cursor').attr({
    width: VIEW_MAX_X + 100 + 'px',
    height: VIEW_MAX_Y + 'px',
  });
  
  init_editor();
  init_preview();
  set_download_data();
  set_palette();
  //view_edit_info();
}

function init_editor(){
  var fill_x = EDITOR_START_X;
  var fill_y = EDITOR_START_Y;
  var fill_w = editor_info['w'];
  var fill_h = editor_info['h'];

  ctx.fillStyle = palettes[0][0];
  ctx.fillRect(fill_x, fill_y, fill_w, fill_h);

  ctx.fillStyle = EDITOR_LINE;
  for(var i=0; i<MAX_PIXEL_X; i++){
    ctx.fillRect(fill_x + PIXEL_SIZE * i, fill_y, 1, fill_h);
  }
  for(var i=0; i<MAX_PIXEL_Y; i++){
    ctx.fillRect(fill_x, fill_y + PIXEL_SIZE * i, fill_w, 1);
  }
  drowBox(fill_x, fill_y, fill_w, fill_h, EDITOR_BOX);
  ctx.fillStyle = EDITOR_LINE2;
  ctx.fillRect(fill_x + PIXEL_SIZE * 4, fill_y, 1, fill_h);
  ctx.fillRect(fill_x, fill_y + PIXEL_SIZE * 4, fill_w, 1);
}

function init_preview(){
  var fill_x = PREVIEW_START_X;
  var fill_y = PREVIEW_START_Y;
  var fill_w = preview_info['w'];
  var fill_h = preview_info['h'];

  drowBox(fill_x, fill_y, fill_w + 1, fill_h + 1, EDITOR_BOX);
}

function drowBox(x,y,w,h,c){
  ctx.fillStyle = c;
  ctx.fillRect(x, y, 1, h);
  ctx.fillRect(x, y, w, 1);
  ctx.fillRect(x + w, y, 1, h);
  ctx.fillRect(x, y + h, w + 1, 1);
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