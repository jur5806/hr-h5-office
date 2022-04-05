<template>
  <div class="warp page1 g-page-grey">
    <v-header :goBack="true" headTitle="防疫上报详情">
    </v-header>
    <v-scroll class="main-box scroll" ref="my_scroller" >
      <div class="g-add-visit">
        <div class="g-form-items" style="padding-top: 0.22rem;">
          <h4>报备类型：</h4>
          <div class="g-form-cont flex-box">
            <div class="g-inputs">
                <p>{{info.erTypeName}}</p>
            </div>
          </div>
        </div>
        <div class="g-forms-enter">
          <div v-for="(item, index) in info.erJson" :key="index">
            <div class="g-form-items" v-if="item.type === 'text'">
              <h4>{{item.label}}</h4>
              <div class="g-form-cont flex-box">
                <p>{{item.value}}</p>
              </div>
            </div>
            <div class="form-item-multiple-textarea" v-else-if="item.type === 'textarea'">
              <h4>{{item.label}}</h4>
              <div class="form-item-con">
                <span>{{item.value}}</span>
              </div>
            </div>
            <div class="g-form-items" v-if="item.type === 'radio'">
              <h4>{{item.label}}</h4>
              <div class="g-form-cont flex-box">
                <div v-for="(optionItem, optionIndex) in item.options" :key="optionIndex" v-if="item.value == optionItem.key" style="width: 100%;">
                  <!-- <i class="i-radio" :class="item.value === optionItem.key ? 'i-radio-active' : ''"></i> -->
                  <p class="p-radio">{{optionItem.value}}</p>
                </div>
              </div>
            </div>
            <div class="g-form-cont g-imgBox" v-else-if="item.type === 'file'">
              <div class="g-form-top">
                <h4>{{item.label || '图片上传：'}}</h4>
                <ul class="g-ups">
                  <li v-for="(imgItem, imgIndex) in item.value" :key="imgIndex" class="g-add-item" @click="lookimgs1(item.value, index)">
                    <img class="g-img-item" :src="imgItem.imgUrl" alt="">
                  </li>
                  <li v-if="item.value.length ==0" class="g-see-empty">暂无图片</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="form-item-multiple-textarea">
          <h4>报备内容：</h4>
          <div class="form-item-con">
            <span>{{info.erContent || "暂无数据"}}</span>
          </div>
        </div>
        <div class="g-form-cont g-imgBox">
          <div class="g-form-top">
            <ul class="g-ups">
              <li v-for="(item, index) in erFileUrl" :key="index" class="g-add-item" @click="lookimgs(erFileUrl, index)">
                <img class="g-img-item" :src="item" alt="" v-if="fileUrl(item) === 'image'">
              </li>
              <!-- <li v-if="erFileUrl.length ==0" class="g-see-empty">暂无图片</li> -->
            </ul>
          </div>
        </div>
      </div>
    </v-scroll>

      <v-lookimg :activeimg="activeimg" :indeximg="indeximg" v-if="lookbool" @closeimg="lookbool = false"></v-lookimg>
  </div>
</template>

<script>
  import * as getData from '../../service/getData'
  import * as mobile from '../../config/mUtils'
  export default {
    data () {
      return {
        info: {},
        activeimg: [],
        indeximg: 0,
        lookbool: false,
        types: 1,
        hasPersonOrder: 1,
        erFileUrl: [],
      }
    },
    mounted () {
      getData.getEpidemicReportDetail(this.$route.query.erId).then(res => {
        if (res.data.code == 1) {
          console.log(res.data.data,6666);
          res.data.data.erJson = JSON.parse(res.data.data.erJson)
          this.erFileUrl = res.data.data.erFileUrl?res.data.data.erFileUrl.split(','):[];
          console.log(this.erFileUrl,6666);
          this.info = res.data.data;
          console.log(this.info,6666);
        }
      })
    },
    components: {},
    computed: {},
    methods: {
      getStatus (odStatus) {
        switch (odStatus) {
          case 1:
            return '待处理'
          case 2:
            return '处理中'
          case 3:
            return '处理中'
          case 4:
            return '已完成'
          default:
            return odStatus
        }
      },
      lookimgs1 (list, index) {
        let arr = list.map(ele=>{
          return ele.imgUrl;
        })
        this.activeimg = arr
        this.indeximg = index
        this.lookbool = true
      },
      lookimgs (list, index) {
        this.activeimg = list
        this.indeximg = index
        this.lookbool = true
      },
      fileUrl(url){
        // 后缀获取
        let suffix = ''
        // 获取类型结果
        let result = ''
        try {
          const flieArr = url.split('.')
          suffix = flieArr[flieArr.length - 1]
        } catch (err) {
          suffix = ''
        }
        // fileName无后缀返回 false
        if (!suffix) { return false }
        suffix = suffix.toLocaleLowerCase()
        // 图片格式
        const imglist = ['png', 'jpg', 'jpeg', 'bmp', 'gif']
        // 进行图片匹配
        result = imglist.find(item => item === suffix)
        if (result) {
          return 'image'
        }
        // 其他 文件类型
        return 'other'

      }
    },
    filters: {

    }
  }
</script>

<style scoped lang="scss">
  @import '../../assets/css/mixin';
  .g-add-visit {
  margin:.3rem;
  padding: 0 0.3rem;
  background: #FFFFFF;
  border-radius: 0.08rem;
  .g-form-items {
    display: flex;
    padding: 0.26rem 0 0.24rem 0;
    border-bottom:1px solid #EEEEEE;
    &:last-child {
      margin-bottom: 0;
    }
    h4 {
      font-size: 0.28rem;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: rgba(67, 67, 67, 1);
      line-height: 0.4rem;
      span{
        color: red;
      }
    }
    .g-form-cont {
      flex: 1;
      .g-inputs {
        flex: 1;
        width: 100%;
        // height: 0.4rem;
      }
      P{
        flex: 1;
        width: 100%;
        height: 0.6rem;
        text-align: right;
      }
      .g-plabule{
        input::-webkit-input-placeholder {
          /* placeholder颜色  */
          color: #0F91FF;
        }
      }
      .imgs {
        width: 0.38rem;
        height: 0.38rem;
        margin-left: 0.24rem;
      }
      input, p,
      textarea,ul {
        display: block;
        font-size: 0.28rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 0.4rem;
        width: 100%;
        height: 100%;
        border:none;
        text-align: right;
        &::placeholder {
          font-size: 0.26rem;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(165, 165, 165, 1);
          line-height: 0.4rem;
        }
      }
    }
  }
}
.form-item-multiple-textarea {
  padding: 0.26rem 0 0.24rem 0;
  border-bottom:1px solid rgba(204, 204, 204, 0.6);
  h4{
    font-size: 0.28rem;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: rgba(67, 67, 67, 1);
    line-height: 0.4rem;
    margin-bottom: 0.2rem;
  }
  span{
      color: #666666;
      font-size: 0.28rem;
      width: 100%;
      height: 100%;
      font-family:PingFang SC;
      font-weight:500;
  }
  }
    .g-form-top {
      margin-top: 0.2rem;
      h4 {
        font-size: 0.28rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 500;
        color: #333333;
        line-height: 0.4rem;
    }
  }
  .g-ups {
    flex-wrap: wrap;
    display: flex;
    padding: 0.24rem 0;
    .g-see-empty {
      color: #666666;
      font-size: 0.28rem;
      font-weight:500;
    }
    .g-add-item {
      position: relative;
      
      input {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 99;
        opacity: 0;
      }
      .g-img-item {
        width: 1.5rem;
        height: 1.5rem;
        margin-bottom: 0.2rem;
        margin-right: 0.3rem;
        /* width: 100%;
        height: 100%; */
      }
      .g-del-up {
        position: absolute;
        width: 0.4rem;
        height: 0.4rem;
        right: -0.2rem;
        top: -0.2rem;
      }
    }
  }
.g-addbtn{
    padding: 0.3rem;
    p{
      width: 100%;
      height:0.8rem;
      // background:linear-gradient(135deg,rgba(20,158,255,1) 0%,rgba(44,122,238,1) 100%);
      background: rgba(20, 158, 255, 1);
      color:rgba(20, 158, 255, 1);
      border-radius:0.08rem;
      line-height: .8rem;
      text-align: center;
      font-size:0.32rem;
      font-family:PingFangSC-Medium,PingFang SC;
      font-weight:500;
      color:rgba(255,255,255,1);
    }
  }
  .g-forms-enter{
    .g-form-cont .p-conts{
      border: 0 none;
      color: #999999;
    }

  }
  .p-radio{
    text-align: right;
  }
</style>
