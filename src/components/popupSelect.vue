<template>
<div >
    <van-popup v-model="popup" ref="popup" round position="bottom">
      <van-picker
        show-toolbar
        :columns="options"
        :value-key="labelKey"
        @confirm="confirm"
        @cancel="cancel"
      />
  </van-popup>
</div>
</template>

<script>
  export default {
    data () {
      return {
       popup:false,
      }
    },
    created () {
      this.options
    },
    props: ['options','value','valueKey','labelKey'],
    methods: {
      open () {
        this.popup = true
      },
      close () {
        this.popup = false
      },
      confirm(item){
        this.popup = false
        this.$emit('input',item[this.valueKey])
        this.$emit('confirm',item)
      },
      cancel(){
        this.popup = false
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../assets/css/mixin';
</style>
