const path = require('path')
const fs = require('fs')
const tinify = require('tinify')
const config = require('../config/config')
const inquirer = require('inquirer')
const uploading = require('../util/uploading')



tinify.key = config.qualityConfig.tinifyKey
//原图存放处
let imagePath = path.join(__dirname, '../image/')
// 压缩图存放处
let condense = path.join(__dirname, '../condense/')
let imageNumber = 0


module.exports = (keyVersion = '') => {
    imageNumber = 0
    fn.filesCallback(keyVersion)

}

class component {
    files() {
        let that = this
        return new Promise((resove, reject) => {
            fs.readdir(imagePath, (err, files) => {
                if (err) {
                    console.log('报错')
                    reject(err)
                }
                that.unlink()
                let newFiles = []
                for (let i = 0; i < files.length; i++) {
                    let pathName = files[i]
                    if (/.(gif|jpg|jpeg|png|gif|jpg|png)$/.test(pathName)) {
                        newFiles.push(pathName)
                    }
                }
                resove(newFiles)
            })
        })
    }
    imagesQuality(pathName, keyVersion, length) {
        const source = tinify.fromFile(imagePath + pathName);
        let timeFils = new Date().getTime()
        let toFileName = condense + (keyVersion + timeFils + pathName )
        source.toFile(toFileName).then((err, res) => {
            imageNumber++
            const newStatRes = fs.statSync(toFileName)
            const outStatRes = fs.statSync(imagePath + (pathName))
            let newKb = Math.ceil(newStatRes.size / 1024)
            let outKb = Math.ceil(outStatRes.size / 1024)
            //    压缩计数
            let compressionsThisMonth = tinify.compressionCount;
            let msg = `${pathName} 压缩后的大小 => ${outKb}kb => ${newKb}kb => tinify计数：${compressionsThisMonth}`
            console.log(msg)
            console.log(`已压缩${imageNumber}张图片 共 ${length} 张图片`)
            if(imageNumber == length){
                console.log('压缩完毕')
                this.inquirerFn()
            }
        })
    }
    unlink() {
        let condenseRes = fs.readdirSync(condense)
        if (condenseRes.length > 0) {
            for (let i = 0; i < condenseRes.length; i++) {
                if (/.(gif|jpg|jpeg|png|gif|jpg|png)$/.test(condenseRes[i])) {
                    // fs.removeSync(condense + '*')
                    fs.unlinkSync(condense + condenseRes[i])
                }
            }
        }
    }
    async filesCallback(keyVersion) {
        let filesRes = await this.files()
        for (let i = 0; i < filesRes.length; i++) {
            let pathName = filesRes[i]
            if (/.(gif|jpg|jpeg|png|gif|jpg|png)$/.test(pathName)) {
                this.imagesQuality(pathName, keyVersion, filesRes.length)
            }
        }
    }
    inquirerFn(){
        inquirer.prompt([
            {
                type: 'list',
                message: '请选择使用的功能:',
                name: 'pushImage',
                choices: [
                    "不上传图片",
                    "继续上传图片至七牛"
                ],
                filter(val) { // 使用filter将回答变为小写
                    return val.toLowerCase();
                }
            }
          ]).then((answers) => {
            if(answers.pushImage == '继续上传图片至七牛'){
                uploading()
            }
          })
    }
}

const fn = new component()

