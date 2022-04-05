<template>
  <div class="warp page1">
    <v-header :goBack="true" headTitle="详情"></v-header>
    <div class="search-box" v-if="hasPermission&&!noData">
      <div class="search-inp">
        <i class="iconfont icon-sousuo"></i>
        <input type="text" placeholder="输入姓名或号码进行搜索" v-model="search" @keyup.enter="init()" @blur="init">
      </div>
    </div>
    <div class="contract-box" v-if="hasPermission&&!noData">
      <v-scroll class="scroll" style="overflow-y: auto;height: 100%;" ref="my_scroller" :on-refresh="refresh" :on-infinite="infinite">
        <div v-for="(people, index) in tableList" :key="index" class="item-box" @click="goDetail(people)">
          <div class="item-name">{{people.userName}}</div>
          <div class="item-phone">
            <img src="./../../assets/images/phone1.png" alt="">
            联系方式：{{people.userMobile}}
          </div>
          <div class="item-area">
            <img src="./../../assets/images/area.png" alt="">
            所在区域：{{people.userCompanyName}}
          </div>
        </div>
      </v-scroll>
    </div>
    <div v-if="!hasPermission" class="no-permission">
      <img src="./../../assets/images/no-permission.png" alt="">
      <div>暂无权限</div>
    </div>
    <div v-if="noData&&hasPermission" class="no-permission">
      <img style="width: 50%" src="http://park.hzqisheng.cn/v3.5/nocompany.png" alt="">
      <div>暂无数据</div>
    </div>
  </div>
</template>

<script>
import * as getData from './../../service/getData'
import * as mobile from './../../config/mUtils'
export default {
  name: '',
  components: {},
  data () {
    return {
      search: '',
      pageSize: 10,
      pageIndex: 1,
      totalPage: 1, 
      tableList: [],
      hasPermission: true,
      noData: false
    }
  },

  mounted() {
  },

  methods: {
    init() {
      this.pageIndex = 1
      this.totalPage = 1
      this.tableList = []
      this.$refs.my_scroller.reload()
    },
    refresh(done){
      this.tableList = []
      getData.companyManageList({
        pageSize: this.pageSize,
        pageIndex: 1,
        search: this.search
      }).then((res) =>{
        if(res.data.code === 1 ){
          if(res.data.data.noPermission){
            this.hasPermission = false
            return
          }
          this.tableList = res.data.data.partList
          this.totalPage = res.data.data.pages
          this.pageIndex = 2
          if(this.tableList.length==0){
            this.noData = true
          }
          done()
        }else{
          mobile.toast(res.data.message)
          done('error')
        }
      }).catch(err=>{
        mobile.toast(err)
        done('error')
      })
    },
    infinite(done) {
      if (this.pageIndex > this.totalPage) {
        done('end')
        return
      }
      getData.companyManageList({
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        search: this.search
      }).then((res) =>{
        if(res.data.data.noPermission){
          this.hasPermission = false
          return
        }
        if(res.data.code === 1 ){
          this.tableList.push(...res.data.data.partList)
          this.totalPage = res.data.data.pages
          if(this.tableList.length==0){
            this.noData = true
          }
          this.pageIndex++
          if (this.pageIndex > this.totalPage) {
            done('end')
          } else {
            done()
          }
        }else{
          mobile.toast(res.data.message)
          done('error')
        }
      }).catch(error => {
        done('error')
      })
    },
    goDetail(row){
      this.$router.push({path: '/userManage'})
      mobile.setSession('userInfo', row)
    }
  },
}

</script>
<style lang='scss' scoped>
.warp{
  background:rgba(243, 244, 246, 1);
}
.search-box{
  background: rgba(243, 244, 246, 1);
  padding: .25rem .25rem;
  display: flex;
  align-items: center;
  line-height: .5rem;
  i{
    color: rgb(201, 201, 201);
    margin-left: .2rem;
    margin-right: .1rem;
    position: relative;
    bottom: -.04rem;
  }
  .search-inp{
    padding: .1rem 0;
    flex: 1;
    background: #ffffff;
    border-radius: 0.08rem;
    input{
      width: 85%;
      height: .4rem;
      font-size: .22rem;
    }
  }
}
.contract-box{
  padding: .25rem;
  padding-top: 0;
  background:rgba(243, 244, 246, 1);
  flex: 1;
  overflow: auto;
  .item-box{
    background: #FFFFFF;
    padding: .3rem;
    border-radius: 0.12rem;
    margin-bottom: .25rem;
    display: flex;
    flex-direction: column;
    .item-name{
      font-size: 0.3rem;
      font-weight: 500;
      color: #333333;
      margin-bottom: .2rem;
    }
    .item-phone,.item-area{
      font-size: 0.24rem;
      font-weight: 400;
      color: #333333;
      line-height: 0.4rem;
      display: flex;
      align-items: center;
      img{
        margin-right: .15rem;
      }
    }
  }
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
.no-permission{
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  div{
    font-size: 0.28rem;
    font-weight: 400;
    color: #333333;
    margin-top: .4rem;
  }
}
</style>
