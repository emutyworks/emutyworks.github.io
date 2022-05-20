/*
GBPixelEditor

Copyright (c) 2022 emutyworks

Released under the MIT license
https://github.com/emutyworks/GBPixelEditor/blob/main/LICENSE
*/
var init_form = {
  filename: 'new_tiles',
  download_lang: 'asm', // 'asm','c'
  edit_size: '16x16', // '8x8','8x16','16x16'
  non_dialog: true // checked=true
};
var palettes = {
  0:{
    // Game Boy
    0: '#e0ef29',
    1: '#39b942',
    2: '#207531',
    3: '#07392e',
  },
  1:{
  }
};
var pal_info = {
  index: 3, // 0,1,2,3
  bank: 0,
};