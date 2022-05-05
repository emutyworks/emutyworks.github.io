/*
GBPixelEditor

Copyright (c) 2022 emutyworks

Released under the MIT license
https://github.com/emutyworks/GBPixelEditor/blob/main/LICENSE
*/
function set_dot(){
	var x = parseInt((cur_info['x'] - EDITOR_START_X) / PIXEL_SIZE);
	var y = parseInt((cur_info['y'] - EDITOR_START_Y) / PIXEL_SIZE);

	console.log("x:"+x+" y:"+y);

	var i = pal_info['index'];
	ctx.fillStyle = palettes[0][i];
	ctx.fillRect(EDITOR_START_X + (PIXEL_SIZE * x) + 1, EDITOR_START_Y + (PIXEL_SIZE * y) + 1, PIXEL_SIZE - 1, PIXEL_SIZE - 1);
}

function pick_pallete(){
	if(cur_info['x']>0 && cur_info['x']<(PALETTE_SIZE*1)){
		pal_info['index'] = 0;
	}else if(cur_info['x']>(PALETTE_SIZE*1) && cur_info['x']<(PALETTE_SIZE*2)){
		pal_info['index'] = 1;
	}else if(cur_info['x']>(PALETTE_SIZE*2) && cur_info['x']<(PALETTE_SIZE*3)){
		pal_info['index'] = 2;
	}else{
		pal_info['index'] = 3;
	}

	//console.log("pallete!!");
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
		ctx.fillRect(fill_x+fill_w*i, fill_y, fill_w, fill_h);
	}

	drowBox(PALETTE_START_X + pos_x, PALETTE_START_Y, PALETTE_SIZE - 1, PALETTE_SIZE - 1, EDITOR_GUIDE);
}
