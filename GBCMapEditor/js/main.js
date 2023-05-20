window.onload = function(){
  base = document.getElementById('base');
  bctx = base.getContext('2d');

  view = document.getElementById('view');
  vctx = view.getContext('2d');

  grid = document.getElementById('grid');
  gctx = grid.getContext('2d');

  cursor = document.getElementById('cursor');
  cctx = cursor.getContext('2d');

  loadInitData(init_load_data.split('\n'));
  initView();
  setMes('start');

  $(window).keydown(function(e){
    if(bin_upload){
      if(e.keyCode===27){
        editCancel();
        return false;
      }else
      if(checkBgTilesArea()){
        if(e.keyCode>=48 && e.keyCode<=55){
          setBGTilesPalette(e.keyCode);
        }
      }else
      if(checkMapTableArea()){
        if((e.keyCode>=48 && e.keyCode<=55)
        || e.keyCode===72 || e.keyCode===86
        ){
          setMapAttributes(e.keyCode);
        }
      }
    }
  });

  $(document).on('contextmenu',function(e){
    return false;
  });
  function onMouseUp(e){
    mouse_down = false;
    mousePos(e);
  }
  function onMouseDown(e){
    mouse_down = true;
    mousePos(e);

    if(e.which==3){
      editCancel();
      return false;
    }

    if(bin_upload){
      if(checkBgTilesArea() && !edit_flag){
        setMes('edit_maptable');
        resetBgTilesCursor();
        setBgTilesCursor();
        selectBgTiles();
      }else
      if(checkMapTableArea() && edit_flag == 'edit_maptable'){
        setMapTable();
      }
    }
  }
  function onMouseMove(e){
    mousePos(e);
    help_flag = false;

    if(bin_upload){
      if(checkBgTilesArea() && !edit_flag){
        setMes('bg_tiles');
        resetBgTilesCursor();
        setBgTilesCursor();
      }else
      if(checkMapTableArea()){
        setMes('edit_maptable');
        resetMapTableCursor();
        setMapTableCursor();
      }else
      if(!help_flag && !edit_flag){
        editCancel();
      }
    }
  }
  cursor.addEventListener('mouseup', onMouseUp, false);
  cursor.addEventListener('mousedown', onMouseDown, false);
  cursor.addEventListener('mousemove', onMouseMove, false);

  function mousePos(e){
    var org_x = e.clientX;
    var org_y = e.clientY;
    var x = org_x-OFFSET_X;
    var y = org_y-OFFSET_Y;

    var bx = 0;
    var by = 0;
    var bi = 0;
    if(x>bgtiles_start_x && y>BGTILES_START_Y
    && x<bgtiles_start_x+(BGTILES_SIZE+1)*BGTILES_MAX_X
    && y<BGTILES_START_Y+(BGTILES_SIZE+1)*BGTILES_MAX_Y
    ){
      bx = Math.trunc((x-bgtiles_start_x)/(BGTILES_SIZE+1));
      by = Math.trunc((y-BGTILES_START_Y)/(BGTILES_SIZE+1));
      bi = BGTILES_MAX_X*by+bx;
    }

    var mx = 0;
    var my = 0;
    var mi = 0;
    if(x>MAP_START_X && y>MAP_START_Y
    && x<MAP_START_X+MAP_SIZE*map_max_x
    && y<MAP_START_Y+MAP_SIZE*map_max_y
    ){
      mx = Math.trunc((x-MAP_START_X)/MAP_SIZE);
      my = Math.trunc((y-MAP_START_Y)/MAP_SIZE);
      mi = map_max_x*my+mx;
    }

    cur_info = {
      org_x: org_x,
      org_y: org_y,
      x: x,
      y: y,
      cx: cur_info['cx'],
      cy: cur_info['cy'],
      //bg tiles
      bx: bx,
      by: by,
      bi: bi,
      bsel: cur_info['bsel'],
      //map table
      mx: mx,
      my: my,
      mi: mi,
    };
  }
}