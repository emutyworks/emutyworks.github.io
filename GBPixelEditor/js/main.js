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

	init_view();

	/* canvas mouse event */
	function onMouseDown(e){
    mousePos(e);
		//console.log(cur_info);

		if(cur_info['x']>PALETTE_START_X
			&& cur_info['x']<(PALETTE_SIZE * 4)
			&& cur_info['y']>PALETTE_START_Y
			&& cur_info['y']<PALETTE_SIZE
			){
			pick_pallete();
		}

		if(cur_info['x']>EDITOR_START_X
			&& cur_info['x']<EDITOR_START_X + (PIXEL_SIZE * MAX_PIXEL_X)
			&& cur_info['y']>EDITOR_START_Y
			&& cur_info['y']<EDITOR_START_Y + (PIXEL_SIZE * MAX_PIXEL_Y)
			){
			set_dot();
		}

	}
	cursor.addEventListener('mousedown', onMouseDown, false);
/*
	function onMouseMove(e){
    mousePos(e);
	}
  cursor.addEventListener('mousemove', onMouseMove, false);
*/
}

function mousePos(e){
	//var rect = e.target.getBoundingClientRect();
	var org_x = e.clientX;
	var org_y = e.clientY;
	var x = org_x - OFFSET_X;
	var y = org_y - OFFSET_Y;

	cur_info = {
		'org_x': org_x,
		'org_y': org_y,
		'x': x,
		'y': y,
	};

//console.log("x:"+x+" y:"+y);
//console.log(cur_info);

}

/*
$(function(){
	$("#data_upload").change(function(e){
		
		var file = e.target.files[0];
		var reader = new FileReader();

		reader.onload = function(){
	
			var ar = new Uint8Array(reader.result);
			console.log(ar);
				
			var hex_text = "";
			var bin_text = "";
			var col_bin = [];
			var ret = 0;
			var ret2 = 0;
			var col_bin_cnt = 0;
			for(var i=0; i<ar.length; i++){
				ret++;
				ret2++;
				if(ret==16){
					hex_text += toHex(ar[i]) + ",\n";
					ret = 0;
				}else{
					hex_text += toHex(ar[i]) + ", ";
				}
				if(ret2==2){
					ret2 = 0;

					var res = "";
					for(var j=0; j<8; j++){
						var low = col_bin[col_bin_cnt].charAt(j);
						var hi = toBin2(ar[i]).charAt(j);
						if(low=="0" && hi=="0"){
							res += "0";
							ctx.fillStyle = "#e0ef29";
							ctx.fillRect(j*4,col_bin_cnt*4,4,4);
						}else if(low=="1" && hi=="0"){
							res += "1";
							ctx.fillStyle = "#39b942";
							ctx.fillRect(j*4,col_bin_cnt*4,4,4);
						}else if(low=="0" && hi=="1"){
							res += "2";
							ctx.fillStyle = "#207531";
							ctx.fillRect(j*4,col_bin_cnt*4,4,4);
						}else{
							res += "3";
							ctx.fillStyle = "#07392e";
							ctx.fillRect(j*4,col_bin_cnt*4,4,4);
						}
					}
					bin_text += '%' + toBin2(ar[i]) + "\n" + " " + res + "\n---------\n";

					col_bin[col_bin_cnt] = res;
					col_bin_cnt++;
				}else{
					bin_text += '%' + toBin2(ar[i]) + "\n";
					col_bin.push(toBin2(ar[i]));
				}
			}

			$('#view_hex').html(hex_text);
			$('#view_bin').html(bin_text);
			console.log(col_bin);
		}
		reader.readAsArrayBuffer(file);
		$('input[type=file]').val('');

		var imgD = ctx.getImageData(0,0,32,32);
		ctx.putImageData(imgD, 0, 0);
	})
})
*/

