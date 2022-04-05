<template>
  <div class="flex-box">
    <div style="width: 49px;" v-for="(item,index) in inputList" :key="index">
      <input v-model="item.value" type="tel" maxLength="2" ref="input" class="config-input"
             :class="{'g-disabled':disabled}" :disabled="disabled"
             @input="change($event,item,index)"
             @keyup="delChange($event,item,index)"
             @blur="checkNumber($event,item,index)"
             @focus="getFocus($event,item,index)"/>
    </div>
  </div>
</template>
<script>
  import * as global from '../config/mUtils'

  export default {
    data() {
      return {
        inputList: [
          {
            oldValue: '',
            value: '',
          },
          {
            oldValue: '',
            value: '',
          },
          {
            oldValue: '',
            value: '',
          },
          {
            oldValue: '',
            value: '',
          },
          {
            oldValue: '',
            value: '',
          },
          {
            oldValue: '',
            value: '',
          },
          {
            oldValue: '',
            value: '',
          },
          {
            oldValue: '',
            value: '',
          }],
        list: '',
      }
    },
    mounted() {
      this.init();
    },
    methods: {
      init () {
        this.list = this.$refs['input'];
      },
      change (e, item, index) {
        if (global.number0.test(item.value)) {
          if (item.value) {
            if (item.value.length > 1) {
              //console.log(item.value,1231,item.value.slice(-1),item.value.slice(0,1))
              let first = item.value.slice(0,1);
              let second = item.value.slice(-1);
              if (first != item.oldValue && second == item.oldValue) {
                item.value = first;
                item.oldValue = item.value;
              } else if (first == item.oldValue && second != item.oldValue) {
                item.value = second;
                item.oldValue = item.value;
              } else {
                item.value = second;
                item.oldValue = item.value;
              }
            } else if (item.value.length === 1){
              item.oldValue = item.value
            }
            if (this.list[index + 1]) {
              this.list[index + 1].focus();
            } else {
              this.list[index].blur();
            }
          }
        } else {
          item.value = '';
        }
        this.getContent();
      },
      delChange  (e, item, index) {
        if (e.keyCode === 8) {
          item.value = '';
          if (!this.list) return;
          if (this.list[index - 1]) {
            this.list[index - 1].focus();
          }
          this.getContent();
          return
        }
      },
      checkNumber (e, item, index) {
        if (!global.number0.test(item.value)) {
          item.value = '';
          this.getContent();
        }
      },
      getFocus (e, item, index) {
        if (!this.list) return;
        if (this.list[index - 1]) {
          if (!this.list[index - 1].value && !this.list[index].value) {
            this.list[index - 1].focus();
          }
        }
      },
      getContent () {
        let arr = [];
        this.inputList.forEach((item) => {
          if (item.value && global.number0.test(item.value)) {
            arr.push(item.value)
          }
        });
        this.$emit('getContent', arr)
      }
    },
    props: {
      disabled: {
        type: Boolean,
        default: false
      }
    }
  }
</script>
<style scoped lang="scss">
  .config-input {
    line-height: .6rem;
    text-align: center;
    box-sizing: border-box;
    margin-right: .16rem;
    width:0.6rem;
    height:0.6rem;
    background:rgba(250,250,250,1);
    border-radius:0.08rem;
    border:1px solid #D4D4D4;
    &:focus{
      border:1px solid #0F8FFF;
    }

  }
  .g-disabled {
    background-color: #f5f7fa;
    border-color: #e4e7ed;
    color: #c0c4cc;
    cursor: not-allowed;
  }
</style>
