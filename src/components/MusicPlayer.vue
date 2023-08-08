<template>
  <div ref="playerRef" class="customAPlayer"></div>
</template>

<script setup lang="ts">
import 'APlayer/dist/APlayer.min.css';
import APlayer from 'APlayer';
import {nextTick, onBeforeUnmount, onMounted, ref} from 'vue'
import axios from "axios";

const playerRef = ref()
let instance:any;

// APlayer歌曲信息
class Audio {
  // 音频艺术家
  artist: String;
  // 音频名称
  name: String;
  // 音频链接
  url: String;
  // 音频封面
  cover: String;
  // 歌词
  lrc: String;

  constructor(artist: String, name: String, url: String, cover: String, lrc: String) {
    this.artist = artist;
    this.name = name;
    this.url = url;
    this.cover = cover;
    this.lrc = lrc;
  }
}

const props = defineProps({
  // 开启吸底模式
  fixed: {
    type: Boolean,
    default: true
  },
  // 开启迷你模式
  mini: {
    type: Boolean,
    default: true
  },
  // 音频自动播放
  autoplay: {
    type: Boolean,
    default: false
  },
  // 主题色
  theme: {
    type: String,
    default: 'rgba(136, 167, 113,0.2)'
  },
  // 音频循环播放
  loop: {
    type: String,
    default: 'all',
    validator: (value: 'all' | 'one' | 'none') => {
      return value === 'all' || value === 'one' || value === 'none';
    }
  },
  // 音频循环顺序
  order: {
    type: String,
    default: 'random',
    validator: (value: 'list' | 'random') => {
      return value === 'list' || value === 'random';
    }
  },
  // 预加载
  preload: {
    type: String,
    default: 'auto',
    validator: (value: 'auto' | 'metadata' | 'none') => {
      return value === 'auto' || value === 'metadata' || value === 'none';
    }
  },
  // 默认音量
  volume: {
    type: Number,
    default: 0.7,
    validator: (value: Number) => {
      return value >= 0 && value <= 1;
    }
  },
  // 互斥，阻止多个播放器同时播放，当前播放器播放时暂停其他播放器
  mutex: {
    type: Boolean,
    default: true
  },
  // 传递歌词方式
  lrcType: {
    type: Number,
    default: 3
  },
  // 列表是否默认折叠
  listFolded: {
    type: Boolean,
    default: true
  },
  // 列表最大高度
  listMaxHeight: {
    type: String,
    default: '100px'
  },
  // 存储播放器设置的 localStorage key
  storageName: {
    type: String,
    default: 'aplayer-setting'
  }
})

// 初始化
onMounted(() => {
  nextTick(() => {
    axios.get('/music/queryAll')
    .then(res=>{
      instance = new APlayer({
        container: playerRef.value,
        fixed: props.fixed,
        mini: props.mini,
        autoplay: props.autoplay,
        theme: props.theme,
        loop: props.loop,
        order: props.order,
        preload: props.preload,
        volume: props.volume,
        mutex: props.mutex,
        lrcType: props.lrcType,
        listFolded: props.listFolded,
        listMaxHeight: props.listMaxHeight,
        storageName: props.storageName,
        audio: res.data
      })
      instance.lrc.toggle()
      instance.volume(0.1,true)
      // setTimeout(()=>{
      //   instance.play()
      // },5000)
    })
  })
})
// 销毁
onBeforeUnmount(() => {
  instance.destroy()
})
</script>

<style scoped>
.customAPlayer{
  bottom: 120px!important;
}
</style>
