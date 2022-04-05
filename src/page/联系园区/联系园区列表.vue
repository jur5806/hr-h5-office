<template>
  <div class="warp page1">
    <v-header :goBack="true" headTitle="联系园区"></v-header>
    <div class="search-box">
      <div class="search-inp">
        <i class="iconfont icon-sousuo"></i>
        <input type="text" placeholder="输入姓名关键字搜索园区人员" v-model="name" @keyup.enter="init">
      </div>
      <button class="btn-search" @click="init">搜索</button>
    </div>
    <div class="contract-box" v-if="tableList!=0">
      <v-scroll class="scroll" style="overflow-y: auto;height: 100%;">
        <div v-for="(item,index) in tableList" ::key="item.label">
          <div class="item-label" v-if="item.type==1">{{item.depName}}</div>
          <div class="item-box" v-else @click="$router.push({path: '/contactDetail', query:{id: item.adminId,depName: item.depName}})">
            <div class="item-xing">{{changeToPinYin(item.adminName)}}</div>
            <div class="item-name">{{item.adminName}}</div>
            <div class="item-icon">
              <i class="iconfont icon-xiangyou"></i>
            </div>
          </div>
        </div>
        <div style="text-align: center;padding: 10px 0">- 加载完毕 -</div>
      </v-scroll>
    </div>
    <div class="no-data" v-if="tableList==0">
      <img src="http://park.hzqisheng.cn/v3.5/nocompany.png" alt="">
      暂无数据
    </div>
  </div>
</template>

<script>
import pinyin from 'chinese-to-pinyin'
import * as getData from './../../service/getData'
import * as mobile from './../../config/mUtils'
export default {
  name: '',
  components: {},
  data () {
    return {
      name: '',
      tableList: [
        
      ]
    }
  },

  mounted() {
    this.init();
  },

  methods: {
    changeToPinYin(name){
      return pinyin(name[0], { firstCharacter: true }).toUpperCase()
    },
    init() {
      this.tableList = []
      this.$dialog.loading.open('正在努力获取中...')
      getData.getParkContractList({name: this.name}).then(res =>{
        this.$dialog.loading.close()
        if(res.data.code === 1 ){
          this.tableList = res.data.data
        }else{
          mobile.toast(res.data.message)
        }
      }).catch(e=>{
        mobile.toast(e)
        this.$dialog.loading.close()
      })
    }
  },
  beforeDestroy() {
    this.$dialog.loading.close()
  },
}

</script>
<style lang='scss' scoped>
.warp{
  background:rgba(238, 240, 244, 1);
}
.search-box{
  background: #4F7BE6;
  padding: .3rem .25rem;
  display: flex;
  align-items: center;
  i{
    color: rgb(196, 196, 196);
    margin-left: .2rem;
    margin-right: .1rem;
    position: relative;
    bottom: -.04rem;
  }
  .search-inp{
    padding: .1rem 0;
    flex: 1;
    background: #f7f7f7;
    border-radius: 0.08rem;
    margin-right: .3rem;
    input{
      width: 85%;
      height: .4rem;
      font-size: .22rem;
    }
  }
  .btn-search{
    font-size: 0.3rem;
    font-weight: 500;
    color: #FFFFFF;
    line-height: 0.42rem;
  }
}
.contract-box{
  padding: .3rem;
  background:rgba(238, 240, 244, 1);
  flex: 1;
  overflow: auto;
  .item-box{
    background: #FFFFFF;
    padding: .3rem;
    border-radius: 0.12rem;
    margin-top: .15rem;
    margin-bottom: .15rem;
    display: flex;
    align-items: center;
    .item-name{
      flex: 1;
    }
    .item-icon{
      i{
        color: rgb(172, 172, 172);
      }
    }
    .item-name{
      font-size: 0.3rem;
      font-weight: bold;
      color: #333333;
      line-height: 0.42rem;
      padding-left: .3rem;
    }
  }
  .item-label{
    font-size: 0.3rem;
    font-weight: 500;
    color: #2D363C;
    padding: .15rem 0;
    display: flex;
    align-items: center;
    &::before{
      content: '';
      display: inline-block;
      width: 0.08rem;
      height: 0.4rem;
      background: #0F8FFF;
      margin-right: .15rem;
    }
  }
}
.item-xing{
  width: 0.92rem;
  height: 0.92rem;
  text-align: center;
  line-height: .92rem;
  background: #e0f1ff;
  border-radius: 50%;

  font-size: 0.4rem;
  font-weight: 500;
  color: #0F8FFF;
}
.no-data{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  font-size: .3rem;
  font-weight: 500;
  img{
    width: 4rem;
  }
}

</style>
