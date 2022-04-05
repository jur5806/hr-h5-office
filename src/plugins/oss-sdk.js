import  MegaPixImage from '../assets/js/megapix-image'
import 'blueimp-canvas-to-blob'
const OSS = require('ali-oss');
let files = [];
let client = '', fileName = '';
let isNotNeedRequest = false;
let notNeedClientRequest = '';
let SystemOssChannelName = ''
window.Promise = Promise;

//获取OSS上传必须的秘钥及其他设置信息 （注意：如果拥有上传必备的秘钥以及其他配置信息，可以跳过本操作）
function multipartUploadWithSts(storeAs, file, uploadConfig) {//参数说明：文件名；文件；配置对象
  let action = uploadConfig.action;//请求地址
  if (uploadConfig.isNotNeedRequest && uploadConfig.clientRequest) {
    try {
      client = new OSS(uploadConfig.clientRequest);//初始化OSS对象
      multitest(client, new Date().getTime() + storeAs, file, uploadConfig);//使用OSS上传文件
    } catch (e) {
      uploadConfig.reject({err: e, storeAs: storeAs});
    }
    return
  } else if (!action) {
    uploadConfig.reject({
      uploadCode: 0,
      message: `如果要请求获取配置接口，请给定接口地址！`,
      storeAs: storeAs
    });
  }
  OSS.urllib.request(action, {
    method: 'GET',
  }, (err, response) => {
    let result, errmsg;
    if (err) {
      uploadConfig.reject({err: err, storeAs: storeAs});
      return console.error(err);
    }
    try {
      result = JSON.parse(response);
    } catch (e) {
      errmsg = 'parse sts response info error: ' + e.message;
      uploadConfig.reject({err: e, storeAs: storeAs});
      return console.error(errmsg);
    }
    let clientRequest = {
      accessKeyId: result.AccessKeyId,//通过阿里云控制台创建的access key
      accessKeySecret: result.AccessKeySecret,//通过阿里云控制台创建的access secret。
      stsToken: result.SecurityToken,//使用临时授权方式。
      bucket: 'park-static',// 通过控制台创建的bucket。
      endpoint: 'oss.zhihuipk.com',//OSS域名。
      cname: true,
      region: 'oss-cn-hangzhou',
    };
    //上传前的准备
    try {
      client = new OSS(clientRequest);//初始化OSS对象
      multitest(client, storeAs, file, uploadConfig);//使用OSS上传文件
    } catch (e) {
      uploadConfig.reject({err: e, storeAs: storeAs});
    }
  });
}

//使用OSS上传文件
function multitest(ossClient, storeAs, file, multitestConfig) {//参数说明：oss对象；文件名；文件；配置对象
  let checkpoint_temp,//当前节点（重新上传时需要）
    cpt = multitestConfig.cpt,//上一个节点（重新上传时需要）
    progressCb = multitestConfig.progressCb;//上传进度回调函数
  if (cpt) {
    //如果有断点则继续上一个节点上传该文件
    console.log("multitest with cpt", cpt);
    ossClient.multipartUpload(SystemOssChannelName + storeAs, file, {
      parallel: 2,
      checkpoint: cpt,
      //进度回调函数
      progress: async function (percent, storeAs, cpt) {//参数说明：当前上传进度的；当前上传的文件名；当前上传节点（进行重新上传时使用）
        progressCb && progressCb(percent, storeAs, cpt);
        checkpoint_temp = cpt;
      }
    }).then((result) => {//成功的返回
      multitestConfig.resolve({
        data: result,
        fileList: files,
      });
    }).catch((err) => {//失败的返回
      let errObj = {err: err, storeAs: storeAs};
      (checkpoint_temp !== undefined && checkpoint_temp !== null) && (errObj.cpt = checkpoint_temp);
      multitestConfig.reject(errObj);//将当前节点返回，使其可以重新从该节点继续上传文件
    });
  } else {
    console.log("multitest without cpt");
    ossClient.multipartUpload(SystemOssChannelName + storeAs, file, {
      parallel: 2,
      //进度回调函数
      progress: async function (percent, cpt) {//参数说明：当前上传进度的；当前上传的文件名；当前上传节点（进行重新上传时使用）
        progressCb && progressCb(percent, storeAs, cpt);
        checkpoint_temp = cpt;
      }
    }).then((result) => {//成功的返回
      multitestConfig.resolve({
        data: result,
        fileList: files,
      });
    }).catch((err) => {//失败的返回
      let errObj = {err: err, storeAs: storeAs};
      (checkpoint_temp !== undefined && checkpoint_temp !== null) && (errObj.cpt = checkpoint_temp);
      multitestConfig.reject(errObj);//将当前节点返回，使其可以重新从该节点继续上传文件
    });
  }
}

//获取选中的文件
function upload(e, config) {
  SystemOssChannelName = config.clientRequest.SystemOssChannelName ? config.clientRequest.SystemOssChannelName + '/' : ''
  files = config.fileList ? config.fileList : [];//当前文件列表
  let fileNumber = config.fileNumber,//文件限制数量
    action = config.action,//请求地址
    template = config.template,//文件添加时的其他默认值
    cb = config.cb;//文件上传时的回调函数
  isNotNeedRequest = !!config.isNotNeedRequest;//默认为false，即需要请求接口获取配置信息，不需要时，请设置为true。
  let fileTemplate = (template && template.constructor === Object) ? template : {},
    progressCb = (cb && cb.constructor === Function) ? cb : '';
  return new Promise((resolve, reject) => {
    const target = e.target.files || e.dataTransfer.files;
    let file = target[0];//文件
    let storeAs = new Date().getTime() + '=-=' + file.name;//文件名
    fileName = storeAs;//文件名
    let fileType = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'].indexOf(file.type) > -1;//获取文件类型
    let hasFile = files.filter((item) => {
      return item.name === storeAs
    });//查找该文件
    if (isNotNeedRequest) {
      notNeedClientRequest = config.clientRequest;//获取OSS上传配置项
      if (!notNeedClientRequest) {
        reject({
          uploadCode: 0,
          message: `如果不需要请求获取配置接口，请给定规范的配置对象！详情请查看OSS文档`,
        });
        return
      }
    }
    if (fileNumber && fileNumber <= files.length) {//文件限制数量
      reject({
        uploadCode: 0,
        message: `最大上传${fileNumber}个文件！`,
      });
      return
    }
    if (hasFile.length) {//如果本次已经上传了该文件则提示
      reject({
        uploadCode: 0,
        message: '该文件已经上传过了',
      });
      console.warning('该文件已经上传过了');
    } else {
      //上传配置项
      const uploadConfig = {
        action: action,//请求地址
        resolve: resolve,//Promise(成功的返回)
        reject: reject,// Promise(失败的返回)
        progressCb: progressCb,//上传进度回调函数
      };
      if (fileType) {//如果该文件是图片格式，则使先转换成base64
        Promise.all(compressImg(target)).then(img => {/*压缩图片*/
          files.push(Object.assign(fileTemplate, {
            target: img[0].blob.res,//文件
            name: storeAs,//文件名
            type: 1,//文件格式为图片
            fileUrl: img[0].base64.res,//该文件的图片base64
            address: '',//该文件的OSS地址
          }));
          //是否请求接口获取配置信息
          if (isNotNeedRequest) {
            try {
              client = new OSS(notNeedClientRequest);//初始化OSS对象
              multitest(client, storeAs, img[0].blob.res, uploadConfig);//使用OSS上传文件
            } catch (e) {
              uploadConfig.reject({err: e, storeAs: storeAs});
            }
          } else {
            multipartUploadWithSts(storeAs, img[0].blob.res, uploadConfig);//获取OSS上传必须的秘钥及其他设置信息
          }
        });
      } else {
        if (fileNumber === 1) {
          config.fileList ? config.fileList = [] : files = [];
        }
        files.push(Object.assign(fileTemplate, {
          target: target[0],//文件
          name: storeAs,//文件名
          type: 0,//文件格式为其他类型的文件
          address: '',//该文件的OSS地址
        }));
        //是否请求接口获取配置信息
        if (isNotNeedRequest) {
          try {
            client = new OSS(notNeedClientRequest);//初始化OSS对象
            multitest(client, storeAs, file, uploadConfig);//使用OSS上传文件
          } catch (e) {
            uploadConfig.reject({err: e, storeAs: storeAs});
          }
        } else {
          multipartUploadWithSts(storeAs, file, uploadConfig);//获取OSS上传必须的秘钥及其他设置信息
        }
      }
    }
  });
}

//获取图片base64
function getImgUrl(files) {
  return new Promise((res, err) => {
    const len = files.length;
    for (let i = 0; i < len; i++) {
      let reader = new FileReader();
      reader.readAsDataURL(files[i]);
      reader.onload = function (e) {
        let image = new Image();
        image.src = this.result;
        res(this.result);
      };
    }
  })
}

// 压缩图片
const compressImgSource = (img,maxW,maxH,quality) => {
  const browser = {
    versions:function(){
      var u = navigator.userAgent;
      return {
        trident: u.indexOf('Trident') > -1, //IE内核
        presto: u.indexOf('Presto') > -1, //opera内核
        webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
        mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
        iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
        iPad: u.indexOf('iPad') > -1, //是否iPad
        webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
        weixin: u.toLowerCase().match(/MicroMessenger/i) == 'micromessenger', //是否微信
        qq: u.match(/\sQQ/i) == " qq" //是否QQ
      };
    }()
  };
  const canvas = document.createElement('canvas');
  let width = img.width;
  let height = img.height;
  const max_width = maxW || 640;
  const max_height = maxH || 640;
  quality = quality || 1

  if (width > max_width) {
    height *= max_width / width;
    height = Math.round(height);
    width = max_width;
  }
  if(height > max_height){
    width *= max_height / height;
    width = Math.round(width);
    height = max_height;
  }
  canvas.width = width
  canvas.height = height
  const wh = {width, height}

  //将图片放入canvas，并重置canvas大小
  // if(browser.versions.ios || browser.versions.webApp){
  //   var mpImg = new MegaPixImage(img);
  //   mpImg.render(canvas, { width: width, height: height });
  // }else{
  //   var ctx = canvas.getContext("2d");
  //   ctx.drawImage(img, 0, 0, width, height);
  // }
  var mpImg = new MegaPixImage(img);
  mpImg.render(canvas, { width: width, height: height });

  let resBase64, base64, blob;

  return new Promise((resolve, reject) => {
    resBase64 = canvas.toDataURL("image/jpeg",quality);
    base64 = Object.assign({},wh,{res:resBase64})

    canvas.toBlob(data => {
      blob = Object.assign({},wh,{res:data})
      resolve({base64,blob});
    }, "image/jpeg", quality)
  })
}


const compressImg = ([...files],maxW,maxH,quality) => {
  if(typeof FileReader==='undefined'){
    new Error( '不支持图片上传' );
    return false;
  }

  let arr = [],promArr = [];

  files.forEach(file => {
    if (file.type.indexOf("image") == 0) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      promArr.push(
        new Promise((resolve, reject) => {
          reader.onload = (e) => {
            let image = new Image();
            image.src = e.target.result;
            image.onload = async () => {
              let res = await compressImgSource(image, maxW, maxH, quality)
              resolve(res);
            }
          };
        })
      )
    }
  })
  return promArr
}

/**获取图片外网访问地址
 * 如果图片的读写权限为私有
 * client.signatureUrl("你的图片地址/名字")
 例如我的图片(名字为testImg)在根目录
 client.signatureUrl("testImg");//返回的就是带加密签名的图片路径，复制这个路径到浏览器上，便可以在浏览器上访问

 * 如果图片的读写权限为公共
 client.getObjectUrl("你的图片名字");//返回的就是不带签名的图片路径，复制路径也可以在浏览器上访问.
 */
function getExtranetUrl(name, type) {
  if (client) {
    return type === 1 ? client.signatureUrl(name) : client.getObjectUrl(name);//1 为私有
  }
}

//删除OSS服务器上的文件
function deleteFile(name, index) {
  return new Promise((resolve, reject) => {
    (client && client.delete) ? client.delete(name).then((res) => {
      resolve(res)
    }).catch((err) => {
      reject(err);
    }) : (reject({errCode: 999, errContent: 'client is null , Please upload the file before deleting it !'}));
  })
}

export {
  upload, getExtranetUrl, multipartUploadWithSts, multitest, deleteFile
}
