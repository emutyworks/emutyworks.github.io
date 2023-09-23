// Pan Docs: CPU Instruction Set
// https://gbdev.io/pandocs/CPU_Instruction_Set.html
// gbz80(7) — CPU opcode reference
// https://rgbds.gbdev.io/docs/master/gbz80.7
var instruction = [
  'ld',
  'ldh',
  'push',
  'pop',
  'add',
  'adc',
  'sub',
  'sbc',
  'and',
  'xor',
  'or',
  'cp',
  'inc',
  'dec',
  'daa',
  'cpl',
  'rlca',
  'rla',
  'rrca',
  'rra',
  'rlc',
  'rl',
  'rrc',
  'rr',
  'sla',
  'swap',
  'sra',
  'srl',
  'bit',
  'set',
  'res',
  'ccf',
  'scf',
  'nop',
  'halt',
  'stop',
  'di',
  'ei',
  'jp',
  'jr',
  'call',
  'ret',
  'reti',
  'rst',
  'macro',
  'endm'
];

var replacement = {
  'a':'r',
  'b':'r',
  'c':'r',
  'd':'r',
  'e':'r',
  'h':'r',
  'l':'r',
  'af':'rr',
  'bc':'rr',
  'de':'rr',
  'hl':'rr',
  'sp':'rr',
  'z':'r',
  'n':'r',
  'nz':'r',
  'nc':'r',
  '[bc]':'[bc]',
  '[de]':'[de]',
  '[hl]':'[hl]',
  '[hli]':'[hli]',
  '[hld]':'[hld]',
  '[c]':'[c]',
};
/*
af
bc
de
hl
sp
pc
z
n
h
c
*/

var opcode = {
  //8-bit Load instructions
  'ld r,r':'4',
  'ld r,n':'8',
  'ld r,[hl]':'8',
  'ld [hl],r':'8',
  'ld [hl],n':'12',
  'ld r,[bc]':'8', //ld A,[BC]
  'ld r,[de]':'8', //ld A,[DE]
  'ld r,[nn]':'16', //ld A,[nn]
  'ld [bc],r':'8',
  'ld [de],r':'8',
  'ld [nn],r':'16', //ld [nn],A
  'ldh r,[nn]':'12', //ldh A,[nn]
  'ldh [nn],r':'12', //ldh [nn],A
  'ldh r,[c]':'8',
  'ld [c],r':'8',
  'ld [hli],r':'8',
  'ld r,[hli]':'8', //ld A,[HLI]
  'ld [hld],r':'8', //ld [HLD],A
  'ld r,[hld]':'8', //ld A,[HLD]

  //16-bit Load instructions
  'ld rr,n':'12', //ld rr,nn
  'ld [nn],rr':'20', //ld [nn],SP
  'ld rr,rr':'8', //ld SP,HL
  'push rr':'16',
  'pop rr':'12',

  //8-bit Arithmetic/Logic instructions
  'add r,r':'4', //add A,r
  'add r,n':'8', //add A,n
  'add r,[hl]':'8', //add A,[HL]
  'adc r,r':'4', //adc A,r
  'adc r,n':'8', //adc A,n
  'adc r,[hl]':'8', //adc A,[HL]
  'sub r':'4',
  'sub n':'8',
  'sub [hl]':'8',
  'sbc r,r':'4', //sdc A,r
  'sbc r,n':'8', //sbc A,n
  'sbc r,[hl]':'8', //sbc A,[HL]
  'and r':'4',
  'and n':'8',
  'and [hl]':'8',
  'xor r':'4',
  'xor n':'8',
  'xor [hl]':'8',
  'or r':'4',
  'or n':'8',
  'or [hl]':'8',
  'cp r':'4',
  'cp n':'8',
  'cp [hl]':'8',
  'inc r':'4',
  'inc [hl]':'12',
  'dec r':'4',
  'dec [hl]':'12',
  'daa':'4',
  'cpl':'4',

  //16-bit Arithmetic/Logic instructions
  'add rr,rr':'8', //add HL,rr
  'inc rr':'8',
  'dec rr':'8',
  'add rr,n':'16', //add SP,dd
  //'add hl,sp+dd':'12',

  //Rotate and Shift instructions
  'rlca':'4',
  'rla':'4',
  'rrca':'4',
  'rra':'4',
  'rlc r':'8',
  'rlc [hl]':'16',
  'rl r':'8',
  'rl [hl]':'16',
  'rrc r':'8',
  'rrc [hl]':'16',
  'rr r':'8',
  'rr [hl]':'16',
  'sla r':'8',
  'sla [hl]':'16',
  'swap r':'8',
  'swap [hl]':'16',
  'sra r':'8',
  'sra [hl]':'16',
  'srl r':'8',
  'srl [hl]':'16',

  //Single-bit Operation instructions
  'bit n,r':'8',
  'bit n,[hl]':'12',
  'set n,r':'8',
  'set n,[hl]':'16',
  'res n,r':'8',
  'res n,[hl]':'16',

  //CPU Control instructions
  'ccf':'4',
  'scf':'4',
  'nop':'4',
  'halt':'N*4',
  'stop':'?',
  'di':'4',
  'ei':'4',

  //Jump instructions
  'jp n':'16', //jp nn
  'jp rr':'16', //jp HL
  'jp r,n':'16/12', //jp f,nn
  'jr n':'12', //jr PC+dd
  'jr r,n':'12/8', //jr f,PC+dd
  'call n':'24', //call nn
  'call r,n':'24/12', //call f,nn
  'ret':'16',
  'ret r':'20/8', //ret f
  'reti':'16',
  'rst n':'16',

  // other
  'macro n': '0',
  'endm': '0',
};

var reset_sum = {
  'jp n': true, //jp nn
  'jp rr': true, //jp HL
  'jp r,n': false, //jp f,nn
  'jr n': true, //jr PC+dd
  'jr r,n': false, //jr f,PC+dd
  'call n': false, //call nn
  'call r,n': false, //call f,nn
  'ret': true,
  'ret r': false, //ret f
  'reti': true,
  'rst n': false,
  'endm': true,
};