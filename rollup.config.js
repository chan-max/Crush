
import typescript from 'rollup-plugin-typescript2';
import replace from 'rollup-plugin-replace';

//console.log(replace(replacements));

export default {
    input:'./Crush/main.ts',
    output:[
      // {
      //   name:'sight-esm',
      //   file:'./dist/sight-esm.js',
      //   format:'esm'
      // },{
      //   name:'sight-cjs',
      //   file:'./dist/sight-cjs.js',
      //   format:'cjs'
      // },{
      //   name:'sight-umd',
      //   file:'./dist/sight-umd.js',
      //   format:'umd'
      // },{
      //   name:'sight-amd',
      //   file:'./dist/sight-amd.js',
      //   format:'amd'
      // },
      {
        name:'Sight',
        file:'./dist/iife.js',
        format:'iife'
      }
    ],
      plugins: [
        typescript(), 
    ]

  };