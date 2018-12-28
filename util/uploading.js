
const config = require('../config/config')
var qiniu = require("qiniu");
const fs = require('fs')
const path = require('path')

const bucket = config.qiniuConfig.bucket; //此处设置BUCKET
//需要填写你的 Access Key 和 Secret Key
const accessKey = config.qiniuConfig.accessKey
const secretKey = config.qiniuConfig.secretKey
const host = config.qiniuConfig.host
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
var options = {
    scope: bucket,
};
var putPolicy = new qiniu.rs.PutPolicy(options);
var uploadToken = putPolicy.uploadToken(mac);
//要上传的空间
const condense = path.join(__dirname, '../condense/')

var putPolicy = new qiniu.rs.PutPolicy(options);
var uploadToken = putPolicy.uploadToken(mac);

var qiniuConfig = new qiniu.conf.Config();
// // 空间对应的机房
qiniuConfig.zone = qiniu.zone.Zone_z0

var formUploader = new qiniu.form_up.FormUploader(config);
var putExtra = new qiniu.form_up.PutExtra();

module.exports = () => {
    up.onl()
}

class uplodingComment {

    onl() {
        let findImageRes = fs.readdirSync(condense)
        let regExp = RegExp(/.(gif|jpg|jpeg|png|gif|jpg|png)$/)

        for (let i = 0; i < findImageRes.length; i++) { 
            if(regExp.test(findImageRes[i])){
                let imageName = findImageRes[i]
                this.formUploader(condense + imageName ,imageName)
            }
        }

       
    }
   formUploader(keyLocalFile,key){
    // 文件上传
    formUploader.putFile(uploadToken, key, keyLocalFile, putExtra, function (respErr,
        respBody, respInfo) {
        if (respErr) {
            throw respErr;
        }
        if (respInfo.statusCode == 200) {
            console.log(respBody);
        } else {
            console.log(respInfo.statusCode);
            console.log(respBody);
            if(respInfo.statusCode == 614){
                console.log('\x1B[41m', '\x1B[49m',key +' 文件上传错误，已经存在了相同的文件')
            }
        }
    });
   }
}

let up = new uplodingComment()