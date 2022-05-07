/*
GBPixelEditor

Copyright (c) 2022 emutyworks

Released under the MIT license
https://github.com/emutyworks/GBPixelEditor/blob/main/LICENSE
*/
function set_dot(){
  var dx = cur_info['dx'];
  var dy = cur_info['dy'];
  var i = pal_info['index'];
  
  edit_d[dx + dy * 8] = i;
  ctx.fillStyle = palettes[0][i];
  ctx.fillRect(EDITOR_START_X + 1 + PIXEL_SIZE * dx, EDITOR_START_Y + 1 + PIXEL_SIZE * dy, PIXEL_SIZE - 1, PIXEL_SIZE - 1);
  ctx.fillRect(PREVIEW_START_X + 1 + PREVIEW_SIZE * dx, PREVIEW_START_Y + 1 + PREVIEW_SIZE * dy, PREVIEW_SIZE, PREVIEW_SIZE);
}

function set_download_data(){
  for(var dy=0; dy<8; dy++){
    for(var dx=0; dx<8; dx++){
      var i = edit_d[dx + dy * 8];

      ctx.fillStyle = palettes[0][i];
      ctx.fillRect(EDITOR_START_X + 1 + PIXEL_SIZE * dx, EDITOR_START_Y + 1 + PIXEL_SIZE * dy, PIXEL_SIZE - 1, PIXEL_SIZE - 1);
      ctx.fillRect(PREVIEW_START_X + 1 + PREVIEW_SIZE * dx, PREVIEW_START_Y + 1 + PREVIEW_SIZE * dy, PREVIEW_SIZE, PREVIEW_SIZE);
    }
  }
}

function pick_pallete(){
  if(cur_info['x']>0 && cur_info['x']<PALETTE_SIZE){
    pal_info['index'] = 0;
  }else if(cur_info['x']>PALETTE_SIZE && cur_info['x']<PALETTE_SIZE * 2){
    pal_info['index'] = 1;
  }else if(cur_info['x']>PALETTE_SIZE * 2 && cur_info['x']<PALETTE_SIZE * 3){
    pal_info['index'] = 2;
  }else{
    pal_info['index'] = 3;
  }
  set_palette();
}

function set_palette(){
  var pos_x = pal_info['index'] * PALETTE_SIZE;
  var fill_x = PALETTE_START_X;
  var fill_y = PALETTE_START_Y;
  var fill_w = PALETTE_SIZE;
  var fill_h = PALETTE_SIZE;
  
  for(var i=0; i<4; i++){
    ctx.fillStyle = palettes[0][i];
    ctx.fillRect(fill_x + fill_w * i, fill_y, fill_w, fill_h);
  }

  drowBox(PALETTE_START_X + pos_x, PALETTE_START_Y, PALETTE_SIZE - 1, PALETTE_SIZE - 1, EDITOR_BOX);
}

function view_edit_info(){
  var dx = ('000' + cur_info['dx']).slice(-3);
  var dy = ('000' + cur_info['dy']).slice(-3);

  $('#edit_info').html('<span class="mono"> px:' + dx + " py:" + dy + "</span>");
}
