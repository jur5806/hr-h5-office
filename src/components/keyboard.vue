<template>
  <div class="keyboard-wrap">
    <ul class="number flex-box">
      <li class="key-item" v-for="(item,index) in numberList" :key="index" @click="select(item,index)">
        {{item.label}}
      </li>
    </ul>
    <ul class="english-1 flex-box">
      <li class="key-item" v-for="(item,index) in englishList1" :key="index" @click="select(item,index)">
        {{item.label}}
      </li>
    </ul>
    <ul class="english-2 flex-box">
      <li class="key-item" v-for="(item,index) in englishList2" :key="index" @click="select(item,index)">
        {{item.label}}
      </li>
    </ul>
    <ul class="english-3 flex-box">
      <li class="btn-toggle" @click.stop="toggle">{{keyType===1?'省份':'ABC'}}</li>
      <li class="key-item" v-for="(item,index) in englishList3" :key="index" @click="select(item,index)">
        {{item.label}}
      </li>
      <li class="btn-del" @click="del">
        <!--<div class="btn-del-border">-->
        <i class="iconfont icon-guanbi"></i>
        <!--</div>-->
      </li>
    </ul>
    <div class="complete" @click="complete">完成</div>
  </div>
</template>
<script>
  import * as global from '../config/mUtils'

  export default {
    data() {
      return {
        numberList: [],
        englishList1: [],
        englishList2: [],
        englishList3: [],
        staticData: {
          numberListX: [
            {'label': '京', 'value': '京'}, {'label': '津', 'value': '津'},
            {'label': '渝', 'value': '渝'}, {'label': '沪', 'value': '沪'},
            {'label': '冀', 'value': '冀'}, {'label': '晋', 'value': '晋'},
            {'label': '辽', 'value': '辽'}, {'label': '吉', 'value': '吉'},
            {'label': '黑', 'value': '黑'}, {'label': '苏', 'value': '苏'}
          ],
          numberList: [
            {label: 1, value: 1}, {label: 2, value: 2}, {label: 3, value: 3}, {label: 4, value: 4},
            {label: 5, value: 5}, {label: 6, value: 6}, {label: 7, value: 7}, {label: 8, value: 8},
            {label: 9, value: 9}, {label: 0, value: 0}
          ],
          englishList1X: [
            {'label': '浙', 'value': '浙'}, {'label': '皖', 'value': '皖'},
            {'label': '闽', 'value': '闽'}, {'label': '赣', 'value': '赣'},
            {'label': '鲁', 'value': '鲁'}, {'label': '豫', 'value': '豫'},
            {'label': '鄂', 'value': '鄂'}, {'label': '湘', 'value': '湘'},
            {'label': '粤', 'value': '粤'}, {'label': '琼', 'value': '琼'}
          ],
          englishList1: [
            {label: 'Q', value: 'Q'}, {label: 'W', value: 'W'}, {label: 'E', value: 'E'}, {label: 'R', value: 'R'},
            {label: 'T', value: 'T'}, {label: 'Y', value: 'Y'}, {label: 'U', value: 'U'}, {label: 'I', value: 'I'},
            {label: 'O', value: 'O'}, {label: 'P', value: 'P'}
          ],
          englishList2: [
            {label: 'A', value: 'A'}, {label: 'S', value: 'S'}, {label: 'D', value: 'D'}, {label: 'F', value: 'F'},
            {label: 'G', value: 'G'}, {label: 'H', value: 'H'}, {label: 'J', value: 'J'}, {label: 'K', value: 'K'},
            {label: 'L', value: 'L'}
          ],
          englishList2X: [
            {'label': '川', 'value': '川'}, {'label': '贵', 'value': '贵'},
            {'label': '云', 'value': '云'}, {'label': '陕', 'value': '陕'},
            {'label': '甘', 'value': '甘'}, {'label': '青', 'value': '青'},
            {'label': '蒙', 'value': '蒙'}, {'label': '桂', 'value': '桂'},
            {'label': '宁', 'value': '宁'}, {'label': '新', 'value': '新'}
          ],
          englishList3: [
            {label: 'Z', value: 'Z'}, {label: 'X', value: 'X'}, {label: 'C', value: 'C'}, {label: 'V', value: 'V'},
            {label: 'B', value: 'B'}, {label: 'N', value: 'N'}, {label: 'M', value: 'M'}
          ],
          englishList3X: [
            {'label': '藏', 'value': '藏'}, {'label': '使', 'value': '使'},
            {'label': '领', 'value': '领'}, {'label': '警', 'value': '警'},
            {'label': '学', 'value': '学'}, {'label': '港', 'value': '港'},
            {'label': '澳', 'value': '澳'}
          ]
        },
        checkList: {
          number: [
            {label: 'numberList', value: 'numberList'},
            {label: 'englishList1', value: 'englishList1'},
            {label: 'englishList2', value: 'englishList2'},
            {label: 'englishList3', value: 'englishList3'}
          ],
          numberX: [
            {label: 'numberList', value: 'numberListX'},
            {label: 'englishList1', value: 'englishList1X'},
            {label: 'englishList2', value: 'englishList2X'},
            {label: 'englishList3', value: 'englishList3X'}
          ]
        },
        keyType: ''
      }
    },
    mounted() {
      this.keyType = this.keyboardType
      this.init()
    },
    methods: {
      init() {
        const arr = this.keyType === 1 ? this.checkList.number : this.checkList.numberX
        arr.forEach((item) => {
          this[item.label] = this.staticData[item.value]
        })
      },
      select(row, index) {
        this.$emit('select', row.value);
      },
      toggle() {
        this.keyType = this.keyType === 1 ? 2 : 1
        this.init()
      },
      complete() {
        this.$emit('closed')
      },
      del(){
        this.$emit('keyDel')
      }
    },
    props: {
      keyboardType: {
        type: Number,
        default: 1
      }
    },
    watch: {
      keyboardType(val) {
        this.keyType = this.keyboardType
        this.init();
      }
    }
  }
</script>
<style scoped lang="scss">
  @import "../assets/css/mixin";

  .keyboard-wrap {
    user-select: none;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4.32rem;
    background: #cccfd5;
    padding: .2rem .1rem;
    box-sizing: border-box;
    transition: all .3s ease-in-out;

    > ul {
      justify-content: center;

      li {
        width: .62rem;
        height: .84rem;
        text-align: center;
        background: #fefefe;
        border-radius: .08rem;
        margin-left: .12rem;
        @include sc(.36rem, #333);
        /*font-weight: bold;*/
        line-height: .74rem;
        box-shadow: 0 0 .05rem #83858d;
      }

      li:first-child {
        margin-left: 0;
      }

      .key-item:active {
        background: #f2f2f2;
      }

      .btn-toggle {
        width: 1rem;
        position: relative;
        background: #9799a1;
        line-height: .84rem;
      }

      .btn-del {
        width: 1rem;
        line-height: .84rem;
        position: relative;
        background: #9799a1;

        .btn-del-border {
          width: .32rem;
          height: .32rem;
          border: .03rem solid #333;
          border-radius: .06rem;
          box-sizing: border-box;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }

        .btn-del-border:after {
          /* content: '';
           position: absolute;
           left: -50%;
           top: 10%;
           width: 70%;
           height: 70%;
           background: #fff;
           transform: rotateZ(45deg);
           border-left: .03rem solid #333;
           border-bottom: .03rem solid #333;
           box-sizing: border-box;
           border-top-right-radius: .06rem;
           border-bottom-right-radius: .06rem;*/
        }

        .icon-guanbi {
          font-size: .28rem;
          color: #333;
          font-weight: bold;
        }
      }
    }

    .english-1 {
      margin-top: .24rem;
    }

    .english-2, .english-3 {
      margin-top: .22rem;
    }

    .complete {
      position: absolute;
      width: 100%;
      background: #f2f2f2;
      left: 0;
      top: -.54rem;
      text-align: right;
      @include sc(.3rem, #6dc2ff);
      line-height: .56rem;
      padding: 0 .2rem;
      box-sizing: border-box;
    }
  }
</style>
