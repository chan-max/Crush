var fs = require('fs');
const path = require('path');

const zh = path.resolve(__dirname, '../docs-zh');
const en = path.resolve(__dirname, '../docs-en');

function getList(dir) {
    var files = fs.readdirSync(dir);
    return files
}

module.exports = {
    getZhDir() {
        return createDir(zh)
    },
    getEnDir() {
        return createDir(en)
    }
}



const createDir = (dir, rootDir = '') => {
    rootDir = rootDir || dir
    var token = dir.split('/')
    var dirName = token[token.length - 1]
    return {
        type: 'directroy',
        src: dir,
        name: dirName,
        children: getList(dir).map((item) => {
            var newDir = dir + '/' + item
            if (item.endsWith('.md')) {
                // isFile
                // console.log(rootDir);
                // console.log(item);
                // console.log(item.split(rootDir)[1]);
                return {
                    abstractSrc: newDir.split(rootDir)[1].split('.md')[0], // the root not
                    type: 'file',
                    name: item.split('.')[0],
                    src: newDir,
                }
            } else {
                // isDirectroy
                return createDir(newDir,rootDir)
            }
        })
    }
}