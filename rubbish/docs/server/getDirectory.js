var fs = require('fs');

var rootDir = '../Docs'

function getList(dir) {
    var files = fs.readdirSync(dir);
    return files
}

const createDir = (dir) => {

    var token = dir.split('/')
    var dirName = token[token.length - 1]
    return {
        type: 'directroy',
        src:dir,
        name:dirName,
        children: getList(dir).map((item) => {
            var newDir = dir + '/' + item
            if (item.endsWith('.md')) {
                // isFile
                return {
                    type: 'file',
                    name: item.split('.')[0],
                    src: newDir,
                }
            } else {
                // isDirectroy
                return createDir(newDir)
            }
        })
    }
}

module.exports = function getDirectory() {
    return createDir(rootDir)
}