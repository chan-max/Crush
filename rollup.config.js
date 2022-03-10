
import typescript from 'rollup-plugin-typescript2';

//console.log(replace(replacements));

const entry = './crush/main.ts'
  
export default {
    input:entry ,
    output:[
      {
        // file:'./dist/Crush-esm.js',
        format:'esm',
        dir:'./dist/esm'
      },
      // {
      //   name:'Crush-cjs',
      //   file:'./dist/Crush-cjs.js',
      //   format:'cjs'
      // },{
      //   name:'Crush-umd',
      //   file:'./dist/Crush-umd.js',
      //   format:'umd'
      // },
      {
        name:'Crush-amd',
        format:'amd',
        dir:'./dist/amd'
      },
      {
        name:'Crush',
        file:'./dist/iife/iife.js',
        format:'iife'
      }
    ],
      plugins: [
        typescript(), 
    ]

  };