const inquirer = require('inquirer')
const quality = require('./util/quality')
const uploading = require('./util/uploading')

// 
inquirer.prompt([
    {
        type: 'list',
        message: '请选择使用的功能:',
        name: 'fruit',
        choices: [
            "压缩图片并添加版本号",
            "上传图片"
        ],
        filter: function (val) { // 使用filter将回答变为小写
            return val.toLowerCase();
        }
    }
]).then((answers) => {
    if (answers.fruit === '压缩图片并添加版本号') {
        console.log('因为要请求tinify的接口来进行压缩，可能会存在网络环境慢的问题')
        inquirerVal()
    } else {
        uploading()
    }
})
function inquirerVal() {
    inquirer.prompt([
        {
            type: 'input',
            message: '请输入版本号:',
            name: "version",
            filter(val) {
                return val
            }

        }
    ]).then((answers) => {
        // console.log('结果为:')
        let version = answers.version
        quality(version)
        // console.log(answers)
    })
}
