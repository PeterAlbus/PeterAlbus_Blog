<template xmlns="http://www.w3.org/1999/html">
  <Banner title="照片墙" description="会收录一些图片。点击可查看原图。"></Banner>
  <div class="main-container">
    <el-row>
      <el-col :lg="{span:11,offset:3}" :sm="15">
        <div style="margin: 0 auto;width: 90%;">
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
        </div>
      </el-col>
      <el-col :lg="{span:6}" :sm="9">
        <div class="sticky-box">
          <PersonalInfo info="若有侵权，深表歉意。可联系删除"></PersonalInfo>
          <FriendLinks></FriendLinks>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {Link} from "@element-plus/icons-vue";
import FriendLinks from "@/components/FriendLinks.vue"
import PersonalInfo from "@/components/PersonalInfo.vue"
import Banner from '@/components/Banner.vue'
export default {
  components:{Banner, LinkIcon:Link,FriendLinks,PersonalInfo},
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
    photoRight:function (){
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
    photoLeft:function (){
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
.photo {
  padding: 0 0 5px 0;
  background-color: white;
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>
