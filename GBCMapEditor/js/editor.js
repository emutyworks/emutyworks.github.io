function setMapTable(){
  var i = cur_info['mi'];
  var bi = cur_info['bsel'];
  map_table[i] = bi;
  attr_table[i] = dec2bin8(tile_palette[bi]);
  drawMapTiles();
}

function selectBgTiles(){
  if(!edit_flag){
    edit_flag = 'edit_maptable2';
    setMes(edit_flag);
    cur_info['bsel'] = cur_info['bi'];
    
    var xx = bgtiles_start_x+cur_info['bx']*(BGTILES_SIZE+1);
    var yy = BGTILES_START_Y+cur_info['by']*(BGTILES_SIZE+1);
    cctx.globalAlpha = 0.2;
    cctx.fillStyle = EDITOR_BOX;
    cctx.fillRect(xx,yy,BGTILES_SIZE+1,BGTILES_SIZE+1);
    cctx.globalAlpha = 1.0;
  }
}

function drawTile(xx,yy,index,p,dot_size,v_flip,h_flip,m){
  var tile_cnt = index*8;
  var bg_tile = [];

  var v_cnt = 7;
  for(var y=0; y<8; y++){
    if(v_flip==1){
      bg_tile[v_cnt] = bg_tiles[tile_cnt+y].concat();
      v_cnt--;
    }else{
      bg_tile[y] = bg_tiles[tile_cnt+y].concat();
    }
  }

  for(var y=0; y<8; y++){
    var bg_data = bg_tile[y].concat();
    if(h_flip==1){
      bg_data = _flipHorizontalTile(bg_data);
    }
    for(var x=0; x<8; x++){
      var d = Math.trunc(bg_data[x]);
      var c = gbc2htmlc(bg_palette[d+4*p]);
      if(m=="v"){
        vctx.fillStyle = c;
        vctx.fillRect(xx+x*dot_size,yy+y*dot_size,dot_size,dot_size);
      }
    }
  }
}

function _flipHorizontalTile(v){
  var r = [];
  var cnt = 0;
  for(var i=7; i>=0; i--){
    r[cnt] = v[i].concat();
    cnt++;
  }
  return r;
}

function drawPallette(){
  var xx = palette_start_x;
  var yy = PALETTE_START_Y;
  var loop = Math.trunc(bg_palette.length/4);
  var y = 0;
  for(var l=0; l<loop; l++){
    var x = 0;
    for(var i=0; i<4; i++){
      vctx.fillStyle = gbc2htmlc(bg_palette[i+l*4]);
      vctx.fillRect(xx+x+1,yy+y+1,PALETTE_DOT,PALETTE_DOT);
      x += PALETTE_DOT+1;
    }
    y += PALETTE_DOT+1;
    bdrawText(xx+PALETTE_DOT*4+7,y-3,7,l);
  }
}

function setMes(key){
  $('#help_mes').html("&nbsp "+help_mes[key]);
}

function editCancel(){
  setMes('reset');
  resetMapTableCursor();
  resetBgTilesCursor();
  edit_flag = false;
  mouse_down = false;
}

function checkMapTableArea(){
  if(cur_info['x']>MAP_START_X
    && cur_info['y']>MAP_START_Y
    && cur_info['x']<MAP_START_X+MAP_SIZE*map_max_x
    && cur_info['y']< MAP_START_Y+MAP_SIZE*map_max_y
    ){
    setMapTableInfo();
    return true;
  }
  $('#map_table_info').text("");
  return false;
}

function resetMapTableCursor(){
  var x = MAP_START_X;
  var y = MAP_START_Y;
  var w = MAP_SIZE*map_max_x+1;
  var h = MAP_SIZE*map_max_y+1;
  cctx.clearRect(x,y,w,h);
}

function setMapTableCursor(){
  var xx = MAP_START_X+cur_info['mx']*MAP_SIZE;
  var yy = MAP_START_Y+cur_info['my']*MAP_SIZE;
  cdrowBox(xx,yy,MAP_SIZE+1,MAP_SIZE+1,EDITOR_LINE);
}

function resetBgTilesCursor(){
  var x = bgtiles_start_x;
  var y = BGTILES_START_Y;
  var w = BGTILES_MAX_X*(BGTILES_SIZE+1);
  var h = BGTILES_MAX_Y*(BGTILES_SIZE+1);
  cctx.clearRect(x,y,w,h);
}

function setBgTilesCursor(){
  var xx = bgtiles_start_x+cur_info['bx']*(BGTILES_SIZE+1);
  var yy = BGTILES_START_Y+cur_info['by']*(BGTILES_SIZE+1);
  cdrowBox(xx,yy,BGTILES_SIZE+1,BGTILES_SIZE+1,EDITOR_LINE);
}

function checkBgTilesArea(){
  if(cur_info['x']>bgtiles_start_x
    && cur_info['y']>BGTILES_START_Y
    && cur_info['x']<bgtiles_start_x+(BGTILES_SIZE+1)*BGTILES_MAX_X
    && cur_info['y']<BGTILES_START_Y+(BGTILES_SIZE+1)*BGTILES_MAX_Y
    ){
      setBGTilesInfo();
      return true;
  }
  $('#bg_tiles_title').text("BG Tiles:");
  return false;
}

function showGrid(){
  if($('#show_grid').prop('checked')){
    show_grid = true;
    gctx.fillStyle = EDITOR_LINE;
    gctx.globalAlpha = 0.2;
    for(var y=1; y<map_max_y; y++){
      gctx.fillRect(MAP_START_X+1,MAP_START_Y+y*MAP_SIZE,MAP_SIZE*map_max_x,1);
    }
    for(var x=1; x<map_max_x; x++){
      gctx.fillRect(MAP_START_X+MAP_SIZE*x+1,MAP_START_Y+1,1,MAP_SIZE*map_max_x);
    }

    gctx.fillStyle = EDITOR_LINE2;
    for(var y=8; y<map_max_y; y+=8){
      gctx.fillRect(MAP_START_X+1,MAP_START_Y+y*MAP_SIZE,MAP_SIZE*map_max_x,1);
    }
    for(var x=8; x<map_max_x; x+=8){
      gctx.fillRect(MAP_START_X+MAP_SIZE*x+1,MAP_START_Y+1,1,MAP_SIZE*map_max_x);
    }

    gctx.globalAlpha = 1.0;
  }else{
    show_grid = false;
    gctx.clearRect(MAP_START_X+1,MAP_START_Y,MAP_SIZE*map_max_x,MAP_SIZE*map_max_y);
  }
}

function drawMapTiles(){
  var xx = MAP_START_X+1;
  var yy = MAP_START_Y+1;

  for(var y=0; y<map_max_y; y++){
    for(var x=0; x<map_max_x; x++){
      var pos = y*map_max_y+x;
      var index = map_table[pos];
      var p = attr2Palette(attr_table[pos]);
      var v_flip = attr2VerticalFlip(attr_table[pos]);
      var h_flip = attr2HorizontalFlip(attr_table[pos]);
      drawTile(xx+x*BGTILES_SIZE,yy+y*BGTILES_SIZE,index,p,BGTILES_DOT,v_flip,h_flip,"v");
    }
  }
}

function drawBgTiles(){
  var xx = bgtiles_start_x;
  var yy = BGTILES_START_Y;

  var index = 0;
  for(var y=0; y<BGTILES_MAX_Y; y++){
    for(var x=0; x<BGTILES_MAX_X; x++){
      var p = tile_palette[index];
      drawTile(xx+x*(BGTILES_SIZE+1)+1,yy+y*(BGTILES_SIZE+1)+1,index,p,BGTILES_DOT,0,0,"v");
      index++;
    }
  }
}

function attr2VerticalFlip(attr){
  return (attr&0b01000000)>>6;
}
function attr2HorizontalFlip(attr){
  return (attr&0b00100000)>>5;
}
function attr2Palette(attr){
  return attr&0b00000111;
}

function setMapTableInfo(){
  var i = cur_info['mi'];
  var x = padNum2(cur_info['mx']);
  var y = padNum2(cur_info['my']);
  var p = attr2Palette(attr_table[i]);
  var h = attr2HorizontalFlip(attr_table[i]);
  var v = attr2VerticalFlip(attr_table[i]);
  var idx = padNum3(map_table[i]);
  var txt = '[pal: '+p+' h: '+h+' v: '+v+' idx: '+idx+' x: '+x+' y: '+y+']';
  $('#map_table_info').text(txt);
}

function setMapAttributes(keycode){
  var i = cur_info['mi'];
  var p = attr2Palette(attr_table[i]);
  var h = attr2HorizontalFlip(attr_table[i]);
  var v = attr2VerticalFlip(attr_table[i]);

  if(keycode>=48 && keycode<=55){
    p = keycode-48;
  }else
  if(keycode===72){//h
    if(h==0){
      h = 1;
    }else{
      h = 0;
    }
  }else
  if(keycode===86){//v
    if(v==0){
      v = 1;
    }else{
      v = 0;
    }
  }

  var attr = p;
  if(h==1){
    attr = attr|0b00100000;
  }
  if(v==1){
    attr = attr|0b01000000;
  }

  attr_table[i] = dec2bin8(attr);

  setMapTableInfo();
  drawMapTiles();
}

function setBGTilesInfo(){
  var i = cur_info['bi'];
  var p = tile_palette[i];
  var txt = 'BG Tiles:[idx: '+padNum3(i)+' pal: '+p+']';
  $('#bg_tiles_title').text(txt);
}

function setBGTilesPalette(keycode){
  var i = cur_info['bi'];
  tile_palette[i] = keycode-48;
  drawBgTiles();
  setBGTilesInfo();
}