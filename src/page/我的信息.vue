<template>
  <div class="warp page1 g-page-grey">
    <v-header :goBack="true" headTitle="我的信息"> </v-header>
    <v-scroll class="scroll main-box28">
      <div class="basic-info">
        <div class="g-basic-item">
          <div class="g-basic-label">
            <div class="g-basic-title">
              用户名<span class="g-font-danger">*</span>
            </div>
          </div>
          <div class="g-basic-input">
            <input
              class="basic-input"
              @blur="bridges.scrollToTop()"
              v-model.trim="form.username"
              placeholder="请输入用户名"
              maxlength="20"
            />
          </div>
        </div>
        <div class="g-basic-item">
          <div class="g-basic-label">
            <div class="g-basic-title">
              手机号<span class="g-font-danger">*</span>
            </div>
          </div>
          <div class="g-basic-input">
            <input
              class="basic-input"
              v-model.trim="form.phone"
              placeholder="请输入手机号"
              maxlength="11"
              @blur="
                checkPhone;
                bridges.scrollToTop();
              "
            />
          </div>
        </div>
        <div class="g-basic-item" @click.stop="showDate">
          <div class="g-basic-label">
            <div class="g-basic-title">出生日期：</div>
          </div>
          <div class="g-basic-input flex-box" style="justify-content: flex-end">
            <p v-if="form.birthDate">
              {{ form.birthDate.replace("-", "/") | date }}
            </p>
            <p class="p1" v-else></p>
            <i class="iconfont icon-jinru-copy icon"></i>
          </div>
        </div>
        <div class="g-basic-item" @click.stop="show = true">
          <div class="g-basic-label">
            <div class="g-basic-title">性别</div>
          </div>
          <div class="g-basic-input flex-box" style="justify-content: flex-end">
            <p class="p1">{{ visitorsNumberOption[form.sex].label }}</p>
            <i class="iconfont icon-jinru-copy icon"></i>
          </div>
        </div>
        <div class="g-basic-item">
          <div class="g-basic-label">
            <div class="g-basic-title">邮箱</div>
          </div>
          <div class="g-basic-input">
            <input
              class="basic-input"
              v-model.trim="form.email"
              placeholder="请输入邮箱"
              @blur="bridges.scrollToTop()"
            />
          </div>
        </div>
        <div class="g-basic-item">
          <div class="g-basic-label">
            <div class="g-basic-title">积分</div>
          </div>
          <div class="g-basic-input">
            <span class="basic-input" style="line-height: 1.2rem">{{
              form.sumPoints
            }}</span>
          </div>
        </div>
      </div>
    </v-scroll>
    <van-popup v-model="show1" position="bottom" :style="{ height: '50%' }">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择年月日"
        @confirm="onConfirm"
        :min-date="minDate"
        :max-date="maxDate"
      />
    </van-popup>
    <div class="g-enterprise-footer">
      <p @click.stop="submit">确认修改</p>
    </div>
  </div>
</template>

<script>
import * as getData from "../service/getData";
import * as mobile from "../config/mUtils";
export default {
  data() {
    return {
      form: {
        username: "",
        name: "",
        sex: 1,
        birthDate: "",
        email: "",
        phone: "",
        userPosition: "",
        sex: 0,
      },
      currentDate: [],
      minDate: new Date(1985, 0, 1),
      maxDate: new Date(2025, 10, 1),
      ruler: {
        phone: "",
      },
      show: false,
      show1: false,
      visitorsNumberOption: [
        { label: "男", value: 1 },
        { label: "女", value: 0 },
      ],
    };
  },
  mounted() {
    this.userId = sessionStorage.getItem("userId");
    this.init();
  },
  components: {},

  computed: {},
  methods: {
    checkFrom() {},
    showDate() {
      console.log(99999);
      this.show1 = true;
    },
    onConfirm(date) {
      this.form.birthDate = new Date(date).format("yyyy-MM-dd hh:mm:ss");
      this.show1 = false;
    },
    visitorsCheck(row, index) {
      this.form.sex = row.value;
      this.show = false;
    },
    checkPhone() {
      var myReg = /^1[3|4|5|7|8][0-9]\d{4,8}$/;
      if (!myReg.test(this.form.phone)) {
        mobile.toast("手机号格式错误");
        return false
      }else{
        return true
      }
    },
    init() {
      getData
        .userDetail(this.userId)
        .then((res) => {
          if (res.data.code === 200) {
            this.form = res.data.data;
          }
        })
        .catch(() => {});
    },
    submit() {
      
      if (!this.form.username) {
        mobile.toast("请填写你的用户名");
        return;
      }
      console.log(55555)
      if (!this.form.phone) {
        mobile.toast("请填写你的手机号");
        return;
      }
      console.log(55555)
      if (!this.checkPhone()) {
        return;
      }
      console.log(55555)
      getData
        .userInfoEdit(this.form)
        .then((res) => {
          if (res.data.code === 200) {
            this.$router.go(-1);
            mobile.toast("修改成功");
          } else {
            mobile.toast("修改失败");
          }
        })
        .catch(() => {});
    },
  },
  filters: {},
};
</script>

<style scoped lang="scss">
@import "../assets/css/mixin";
.basic-info {
  background: #fff;
  // border-radius: .40rem .40rem 0 0;
  position: relative;
  z-index: 100;
  padding: 0 0.2rem;
  box-sizing: border-box;
  // border-bottom: 0.28rem solid #f2f3fa;
  border-top: 0.3rem solid #f2f3fa;

  .g-basic-item {
    position: relative;
    width: 100%;
    height: 1.2rem;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eaeaea;

    .g-basic-label {
      display: flex;
      align-items: center;
      .g-basic-icon {
        width: 0.77rem;
        height: 0.77rem;
        margin-right: 0.21rem;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .g-basic-icon-mini {
        width: 0.32rem;
        height: 0.32rem;
        margin-right: 0.09rem;
      }

      .g-basic-title {
        font-size: 0.28rem;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(67, 67, 67, 1);
        line-height: 0.28rem;
        > p {
          font-size: 0.28rem;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(67, 67, 67, 1);
          line-height: 0.28rem;
        }
        .tips-info {
          font-size: 0.22rem;
          font-family: PingFang SC;
          font-weight: 400;
          color: #999999;
          padding-top: 0.1rem;
        }
      }

      .g-basic-title-mini {
        font-size: 0.26rem;
        > p {
          font-size: 0.26rem;
        }
      }
    }

    .g-basic-img {
      width: 0.88rem;
      height: 0.88rem;
      margin-right: 0.1rem;
      margin-left: 0.2rem;
      position: relative;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
      .g-delimg {
        position: absolute;
        width: 0.4rem;
        height: 0.4rem;
        top: -0.1rem;
        right: -0.1rem;
      }
    }
    .g-basic-input {
      flex: 1;
      /*height: .30rem;*/
      text-align: right;
      height: 100%;
      .p1 {
        font-size: 0.3rem;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: #434343;
        line-height: 0.3rem;
        margin-top: -0.08rem;
      }
      .basic-input {
        width: 100%;
        height: 100%;
        text-align: right;
        font-size: 0.3rem;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: #434343;
        line-height: 0.3rem;
        padding: 0 0.17rem;
        box-sizing: border-box;

        &::placeholder {
          font-size: 0.3rem;
          color: rgba(204, 204, 204, 1);
          line-height: 0.3rem;
        }
      }

      .icon {
        @include sc(0.46rem, #999);
        margin-right: 0.05rem;
      }
    }
  }

  .tips {
    height: 0.73rem;

    .tips-icon {
      width: 0.26rem;
      height: 0.26rem;
      margin-top: 0.03rem;
      margin-left: 0.08rem;
      margin-right: 0.11rem;
      vertical-align: middle;
    }
  }
}
</style>
