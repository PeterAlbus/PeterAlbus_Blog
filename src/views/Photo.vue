<template xmlns="http://www.w3.org/1999/html">
  <div class="banner">
    <div class="banner-container">
      <div>
        <h1>照片墙</h1>
        <p>会收录一些图片。点击可查看原图。</p>
      </div>
    </div>
  </div>
  <div class="main-container">
    <el-row>
      <el-col :lg="{span:11,offset:3}" :sm="15">
        <el-row>
          <el-col :span="7">
            <el-card class="photo" v-for="item in photoLeft" shadow="hover" :body-style="{ padding: '0px' }">
              <a :href="item.imgSrc" target="_blank">
                <el-image :src="item.imgThumb" style="width: 100%" fit="cover" lazy>
                  <template #placeholder>
                    <div class="image-slot">
                      加载中<span class="dot">...</span>
                    </div>
                  </template>
                </el-image>
                <span class="paragraph">{{item.imgName}}</span>
              </a>
            </el-card>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-card class="photo" v-for="item in photoMid" shadow="hover" :body-style="{ padding: '0px' }">
              <a :href="item.imgSrc" target="_blank">
                <el-image :src="item.imgThumb" style="width: 100%" fit="cover" lazy>
                  <template #placeholder>
                    <div class="image-slot">
                      加载中<span class="dot">...</span>
                    </div>
                  </template>
                </el-image>
                <span class="paragraph">{{item.imgName}}</span>
              </a>
            </el-card>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-card class="photo" v-for="item in photoRight" shadow="hover" :body-style="{ padding: '0px' }">
              <a :href="item.imgSrc" target="_blank">
                <el-image :src="item.imgThumb" style="width: 100%" fit="cover" lazy>
                  <template #placeholder>
                    <div class="image-slot">
                      加载中<span class="dot">...</span>
                    </div>
                  </template>
                </el-image>
                <span class="paragraph">{{item.imgName}}</span>
              </a>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
      <el-col :lg="{span:6}" :sm="9">
        <div class="module">
          <div class="content paragraph">
            <el-avatar :size="50" :src="require('../assets/2.png')"></el-avatar>
            <h4>PeterAlbus</h4>
            <p>若有侵权，深表歉意。可联系删除</p>
            <el-tooltip class="item" effect="dark" content="发送电子邮件" placement="top">
              <a href="mailto:wuhongdb@163.com">
                <i class="fa fa-fw fa-envelope" style="font-size:20px"></i>
              </a>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="github" placement="top">
              <a href="https://github.com/PeterAlbus" target="_blank">
                <i class="fa fa-fw fa-github" style="font-size:20px"></i>
              </a>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="bilibili" placement="top">
              <a href="https://space.bilibili.com/2003822" target="_blank">
                <i class="iconfont icon-bilibili-line" style="font-size:20px"></i>
              </a>
            </el-tooltip>
          </div>
        </div>
        <div class="module">
          <h2 class="title">友情链接</h2>
          <div class="content paragraph">
            <p v-for="item in friendLinkList"><a :href="item.linkUrl" target="_blank">{{ item.linkName }}</a></p>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "Photo",
  data(){
    return {
      photoList:[
        {
          imgId:1,
          imgSrc:'https://file.peteralbus.com/assets/blog/imgs/cover/cover1.jpg',
          imgThumb:'https://file.peteralbus.com/assets/blog/imgs/cover/cover1.jpg',
          imgName:'loading'
        },
        {
          imgId:2,
          imgSrc:'https://file.peteralbus.com/assets/blog/imgs/cover/8a0be7eaef3c44469200443affd26d33',
          imgThumb:'https://file.peteralbus.com/assets/blog/imgs/cover/cover1.jpg',
          imgName:'loading'
        },
        {
          imgId:3,
          imgSrc:'https://file.peteralbus.com/assets/blog/imgs/cover/79f797340075430abcdc9b80fc908f66',
          imgThumb:'https://file.peteralbus.com/assets/blog/imgs/cover/cover1.jpg',
          imgName:'loading'
        },
      ],
      friendLinkList:[
        {
          linkId:1,
          linkName:'loading',
          linkUrl:'#'
        }
      ]
    }
  },
  created() {
    this.getPhotoList()
    this.getFriendLinkList()
  },
  methods:{
    getPhotoList:function (){
      let that=this;
      that.$axios.get('/photo/queryAll')
      .then(res=>{
        that.photoList=res.data;
      })
    },
    getFriendLinkList: function (){
      let that=this;
      that.$axios.get('friendLink/getFriendLinkList')
          .then(res=>{
            that.friendLinkList=res.data;
          })
    }
  },
  computed:{
    photoLeft:function (){
      let count=0;
      let photoLeft=[];
      for(let i of this.photoList)
      {
        if(count%3===0)
        {
          photoLeft.push(i);
        }
        count++;
      }
      return photoLeft.reverse();
    },
    photoMid:function (){
      let count=0;
      let photoMid=[];
      for(let i of this.photoList)
      {
        if(count%3===1)
        {
          photoMid.push(i);
        }
        count++;
      }
      return photoMid.reverse();
    },
    photoRight:function (){
      let count=0;
      let photoRight=[];
      for(let i of this.photoList)
      {
        if(count%3===2)
        {
          photoRight.push(i);
        }
        count++;
      }
      return photoRight.reverse();
    },
  }
}
</script>

<style scoped>
.banner {
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  height: 30vh;
  background: url("../assets/background.jpg") fixed center center;
  text-align: center;
  color: #fff !important;
}

.banner-container {
  position: absolute;
  width: 100%;
  margin-top: 13vh;
  line-height: 1.5;
  color: #eee;
}

.photo {
  padding: 0 0 5px 0;
  background-color: white;
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>
