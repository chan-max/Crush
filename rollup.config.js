
import typescript from 'rollup-plugin-typescript2';

//console.log(replace(replacements));

const entry = './packages/core/index.ts'
  
export default {
    input:entry ,
    output:[
      {
        // file:'./dist/Crush-esm.js',
        format:'esm',
        dir:'./dist/esm'
      },
      {
        name:'Crush',
        file:'./dist/cjs/crush.js',
        format:'cjs'
      },{
        name:'Crush',
        file:'./dist/umd/crush.js',
        format:'umd'
      },
      {
        name:'Crush',
        format:'amd',
        dir:'./dist/amd'
      },
      {
        name:'Crush',
        file:'./dist/iife/crush.js',
        format:'iife'
      }
    ],
      plugins: [
        typescript(), 
    ]

  };