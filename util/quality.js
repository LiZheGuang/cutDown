const path = require('path')
const fs = require('fs')
const tinify = require('tinify')
const config = require('../config/config')

tinify.key = config.qualityConfig.tinifyKey
//原图存放处
let imagePath = path.join(__dirname, '../image/')
// 压缩图存放处
let condense = path.join(__dirname,'../condense/')



module.exports = (keyVersion = '') => {
    fn.filesCallback(keyVersion)

}

class component {
    files(){
        let that = this
        return new Promise((resove, reject) => {
            fs.readdir(imagePath, (err, files) => {
                if (err) {
                    console.log('报错')
                    reject(err)
                }
                that.unlink()
                resove(files)
            })
        })
    }
    imagesQuality(pathName,keyVersion){
        const source = tinify.fromFile(imagePath + pathName);
        source.toFile(condense + (keyVersion + pathName)).then((err,res)=>{
           const newStatRes =  fs.statSync(condense + (keyVersion + pathName))
           const outStatRes =  fs.statSync(imagePath + (pathName))
           let newKb =  Math.ceil(newStatRes.size / 1024)
           let outKb = Math.ceil(outStatRes.size / 1024)
        //    压缩计数
            let compressionsThisMonth = tinify.compressionCount;
           let msg = `${pathName} 压缩后的大小 => ${outKb}kb => ${newKb}kb => tinify计数：${compressionsThisMonth}`
           console.log(msg)
        })
    }
    unlink(){
        let condenseRes = fs.readdirSync(condense)
        if(condenseRes.length > 0){
            for(let i =0;i<condenseRes.length;i++){
                if(/.(gif|jpg|jpeg|png|gif|jpg|png)$/.test(condenseRes[i])){
                    // fs.removeSync(condense + '*')
                    fs.unlinkSync(condense + condenseRes[i])
                }
            }
        }
    }
    async filesCallback(keyVersion){
        let filesRes = await this.files()
        for(let i = 0 ;i<filesRes.length;i++){
            let pathName = filesRes[i]
            if(/.(gif|jpg|jpeg|png|gif|jpg|png)$/.test(pathName)){
                this.imagesQuality(pathName,keyVersion)
            }
        }
    }
}

const fn = new component()

