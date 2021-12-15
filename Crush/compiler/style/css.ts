// var template = document.querySelector('style').innerHTML.trimRight()

// var RE = /\s*([^{}:;]*)([{}:;])\s*/g

// // #container { 

// function extract() {

//     return RE.exec(template)
// }



// while (RE.lastIndex !== template.length) {
//     var [x, cap1, cap2] = extract()
//     console.log('捕获组1', cap1);
//     console.log('捕获组2', cap2);
// }

    // var template = document.querySelector('style').innerHTML.trimLeft()

    // var cssTemplateDivider = /\s*([^{}:;]*)({|}|;|:{1,2})\s*/

    // while (template) {
    //     var chip = cssTemplateDivider.exec(template)
    //     console.log(chip[1],'=>',chip[2]);
    //     template = template.substring(chip[0].length)
    //     template = template.trimLeft()
    // }