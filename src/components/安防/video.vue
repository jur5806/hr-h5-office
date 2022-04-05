<template>
  <!--<div class="g-video-warp" @mousedown="clickVideo">-->
  <video
    class="video-js"
    :class="{
    'min-width-400':true,
    'min-height-300':true,
    }"
    controls
    muted
    ref="video"
    preload="auto"
    :id="id"
    autoplay="autoplay"
    data-setup='{}'>
    <source :src="src"></source>
    <p class="vjs-no-js">
      To view this video please enable JavaScript, and consider upgrading to a
      web browser that
      <a href="http://videojs.com/html5-video-support/" target="_blank">
        supports HTML5 video
      </a>
    </p>
  </video>
  <!--</div>-->
</template>

<script>
  import videojs from 'video.js'
  import 'video.js/dist/video-js.css'

  require('videojs-flash')

  export default {
    data () {
      return {
        url: ''
      }
    },
    props: {
      src: {
        type: String,
        default: 'rtmp://58.200.131.2:1935/livetv/hunantv'
      },
      id: {
        type: String,
        default: 'video'
      }
    },
    mounted () {
      this.initVideo()
    },
    components: {},
    computed: {},
    methods: {
      initVideo () {
        if (this.player) {
          this.player.dispose()
        }
        this.player = videojs(this.id, {
          autoplay: true,
          language: 'zh-CN',
          techOrder: ['flash', 'html5'],
          flash: {swf: './static/js/video-js.swf'}
        })
        this.player.autoplay()
      }
    },
    beforeDestroy () {
      this.player.dispose()
      this.player = ''
    },
    watch: {
      src: {
        handler: function (val, oldval) {
          if (this.player) {
            this.player.src(val)
            this.player.play()
          }
        },
        immediate: true
      }
    }
  }
</script>

<style lang="scss">
  .video-js {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .min-width-400 {
    /*min-width: 400px;*/
  }

  .min-height-300 {
    /*min-height: 300px;*/
  }
</style>
