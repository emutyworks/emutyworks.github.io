/*
GBPixelEditor

Copyright (c) 2022 emutyworks

Released under the MIT license
https://github.com/emutyworks/GBPixelEditor/blob/main/LICENSE
*/
var canvas = document.getElementById("view_dot");
var ctx = canvas.getContext("2d");

$(function(){
	$("#data_upload").change(function(e){
		
		var file = e.target.files[0];
		var reader = new FileReader();

		reader.onload = function() {
	
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

function toHex(v) {
	var len = v.toString(16).length;
	return '$' + (('00' + v.toString(16).toLowerCase()).substring(len,len + 2));
}
function toBin(v) {
	var len = v.toString(2).length;
	return '%' + (('00000000' + v.toString(2).toLowerCase()).substring(len,len + 8));
}
function toBin2(v) {
	var len = v.toString(2).length;
	return (('00000000' + v.toString(2).toLowerCase()).substring(len,len + 8));
}