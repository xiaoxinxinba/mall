<template>

    <div class="warp_bg">
      <div class="top_form ">
        <el-form ref="form" :model="form" label-position="right" label-width="140px">
          <el-form-item label="类目搜索：">
            <el-input v-model="form.name"></el-input>
            <el-button type="primary" @click="searchCate">快速查找类目</el-button>
          </el-form-item>

          <el-form-item label="您最近使用的类目：">
            <el-select v-model="form.latelyCate" placeholder="请选择最近使用的类目" @change="(e) => latelyCateChange(e)" style="width: 400px;">
              <el-option v-for="(item, i) in latelyCateData" :key="i" :label="item.fullName" :value="item.classList"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <!--类目选择开始-->
      <div class="screen">
        <div class="left">
          <div class="search">
            <el-input
              placeholder="输入名称/拼音首字母"
              suffix-icon="el-icon-search"
              v-model="search_first">
            </el-input>
          </div>
          <ul>
            <li v-for="(item, i) in cateFilter(firstCateData, search_first)"  :key="i" @click="firstCateActive = item.cid; thirdCateActive = 0;" :class=" firstCateActive == item.cid ? 'cur' : '' ">{{item.title}}<i class="iconfont icon-right"></i> </li>
          </ul>
        </div>
        <div class="middle">
          <div class="search">
            <el-input
              placeholder="输入名称/拼音首字母"
              suffix-icon="el-icon-search"
              v-model="search_second">
            </el-input>
          </div>
          <ul>
            <li v-for="(item,i) in cateFilter(secondCateData, search_second)" :key="i" @click="secondCateActive = item.cid; secondCateTitle = item.title; isAuthentication();" :class=" secondCateActive == item.cid ? 'cur' : '' ">{{item.title}}<i class="iconfont icon-right"></i> </li>
          </ul>
        </div>
        <div class="right">
          <div class="search">
            <el-input
              placeholder="输入名称/拼音首字母"
              suffix-icon="el-icon-search"
              v-model="search_third">
            </el-input>
          </div>
          <ul>
            <li v-for="(item,i) in cateFilter(thirdCateData, search_third)" :key="i" @click="thirdCateActive = item.cid; thirdCateTitle = item.title;" :class=" thirdCateActive == item.cid ? 'cur' : '' ">{{item.title}}<i class="iconfont icon-right"></i> </li>
          </ul>
        </div>

        <div class="search_box" v-if="searchCateVisible">
          <div class="search_top">
            <span>匹配到 <b> {{searchCateData.length}} </b> 个类目 <!--<i>双击直接发布</i>--></span>
            <i class="el-icon-error" @click="closeSearchCate"></i>
          </div>
          <div class="search_main">
            <ul>
              <li v-for="(item, i) in searchCateData" :class="searchCateActive === item.classList ? 'on' : ''" :key="i" @click="searchCateSelect(item.classList, item.fullName)">{{ item.fullName }}</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="choice">
        <img src="./img/top.jpg" alt="">
        您当前选择的是：<span>{{firstCateTitle}} </span> <span v-if="secondCateTitle !== ''"> > {{secondCateTitle}} </span> <span v-if="thirdCateTitle !== ''"> > {{thirdCateTitle}}</span>
      </div>
      <!--类目选择开始-->

      <!--调整经营范围开始-->
      <div class="adjust">
        <p class="">店铺的经营范围决定可选商品类目</p>
        <p class="">如果没有找到您想要的类别，可尝试调整您店铺的经营范围  <a href="javascript: void(0);" @click="goRangeMain">点击调整经营范围</a></p>
      </div>
      <!--调整经营范围结束-->

      <!--商家认证开始-->
      <div class="authent">
        <div v-if="isAuthData === 1"><!--商家认证通过-->
          <label>商家资质：</label><img src="./img/renz.png" alt="">
        </div>
        <div v-if="isAuthData === 2"><!--商家认证未通过-->
          <label>商家资质：</label><img src="./img/renz_not.png" alt=""> <span>商家当前未完成当前类目商品资质认证，<a href="javascript: void(0);" @click="goGoodsShopAuth">前去认证</a> </span>
        </div>
      </div>
      <!--商家认证结束-->

      <div class="releaseBtn">
        <el-button type="primary" @click="goPublish" :disabled="((this.isAuthData === 2) || (thirdCateActive === 0 && thirdCateData )) ? true : false">现在去发布商品</el-button>
        <!--<el-button type="primary" @click="goPublish" :disabled="thirdCateActive === 0 ? true : false">现在去发布商品</el-button>-->
      </div>
    </div>

</template>

<script>
  import GetGoodsPublishCategory from '../../../api/goods/goodsPublish/getGoodsPublishCategory';
  import GetPublishGoodsCategoryHistory from '../../../api/goods/goodsPublish/getPublishGoodsCategoryHistory';
  import SearchPublishGoodsCategoryList from '../../../api/goods/goodsPublish/searchPublishGoodsCategoryList';
  import SavePublishGoodsCategory from '../../../api/goods/goodsPublish/savePublishGoodsCategory';
  import IsAuthentication from '../../../api/BusinessScope/IsAuthentication';

  export default {
    data(){
      return{
        form: {
          name: '',
          latelyCate: '',
        },
        searchCateData: [], // 活动名称搜索出的类目
        searchCateVisible: false, // 活动名称搜索出的类目显示框
        searchCateActive: '', // 快速查找类目是否选中
        latelyCateData: [],

        firstCateActive: 0, // 一级选中值
        secondCateActive: 0, // 二级选中值
        thirdCateActive: 0, // 三级选中值

        firstCateTitle: '', // 一级选中的标题
        secondCateTitle: '', // 二级选中的标题
        thirdCateTitle: '', // 三级选中的标题

        search_first: '', // 一级搜索
        search_second: '', // 二级搜索
        search_third: '', // 三级搜索

        firstCateData: [], // 一级列表
        secondCateData: [], // 二级列表
        thirdCateData: [], // 三级列表

        isAuthData: 0, // 商家资质认证返回的数据
      }
    },

    methods: {

      /**
       * 查询最近使用的类目
       */
      getPublishGoodsCategoryHistory() {
        let clientTimespan = this.$Tool.formatDate(new Date());

        GetPublishGoodsCategoryHistory.call(this, `?clientTimespan=${clientTimespan}`).then( res => {
          console.log(res, "最近使用的类目数据");
          if ( res.data.code === 1 ) {
            this.latelyCateData = res.data.data;

            // this.$message.success(res.data.desc);
          } else {
            this.$message.error(res.data.desc);
          }

        });
      },

      /**
       * 选择最近使用类目事件
       */
      latelyCateChange( e ) {
        let cateSelected = e.split(',');
        if (this.firstCateActive === cateSelected[0]*1) {
          this.getCategory( this.firstCateActive, 'secondCate' );
        } else {
          this.firstCateActive = cateSelected[0]*1;
        }
        this.secondCateActive = cateSelected[1]*1;
        this.thirdCateActive = cateSelected[2]*1;
        this.isAuthentication();
      },

      /**
       * 获取分类
       */
      getCategory( parentId, level ) {
        let clientTimespan = this.$Tool.formatDate(new Date());

        GetGoodsPublishCategory.call(this, `?clientTimespan=${clientTimespan}&parentId=${parentId}`).then( res => {
          console.log(res, "获取分类");
          if (res.data.code === 1) {
            if ( level === 'firstCate' ) {
              this.firstCateData = res.data.data;
            } else if ( level === 'secondCate' ) {
              this.secondCateData = res.data.data;
              console.log(this.secondCateActive)
              if (this.secondCateData.some(val => val.cid === this.secondCateActive)) {
                this.secondCateTitle = this.secondCateData.find(val => val.cid === this.secondCateActive).title;
                console.log(this.secondCateTitle)
              }
            } else if ( level === 'thirdCate' ) {
              this.thirdCateData = res.data.data.length ? res.data.data : undefined;
              if (this.thirdCateData && this.thirdCateData.some(val => val.cid === this.thirdCateActive)) {
                this.thirdCateTitle = this.thirdCateData.find(val => val.cid === this.thirdCateActive).title;
              }
            }
          } else {
            this.$message.error(res.data.desc);
          }
        });
      },

      /**
       * 快速查找类目操作
       */
      searchCate() {
        let title = this.form.name;
        let clientTimespan = this.$Tool.formatDate(new Date());
        if (title === '') {
          this.$message.error("请先输入类目名称");
        } else {
          SearchPublishGoodsCategoryList.call(this, `?clientTimespan=${clientTimespan}&title=${title}`).then( res => {
            if (res.data.code === 1) {
              if ( res.data.data.length >= 1 ) {
                this.searchCateData = res.data.data;
                this.searchCateVisible = true;
              } else {
                this.$message.error("没有匹配项");
              }
            }
          });
        }
      },

      /**
       * 关闭类目搜索框
       */
      closeSearchCate() {
        this.searchCateVisible = false
      },

      /**
       * 选中快速查找出的类目
       */
      searchCateSelect( ids, name ) {
        let nameArr = name.split('>');
        let idsArr = ids.split(',');
        this.firstCateTitle = nameArr[0];
        this.secondCateTitle = nameArr[1];
        this.thirdCateTitle = nameArr[2];
        this.searchCateActive = ids;
        this.firstCateActive = idsArr[0];
        this.secondCateActive = idsArr[1];
        this.thirdCateActive = idsArr[2];
        this.isAuthentication();
      },

      /**
       * 分类的筛选
       */
      cateFilter( cateData = [], searchVal ) {
        return cateData.filter(res => {
          if (res.title.indexOf(searchVal) !== -1) {
            return res;
          }
        });
      },

      /**
       * 现在去发布商品
       */
      goPublish() {
        let clientTimespan = this.$Tool.formatDate(new Date());
        let data = {
          goodsPublishSelectCategorys: [
            {
              cid: this.firstCateActive,
              title: this.firstCateTitle
            },
            {
              cid: this.secondCateActive,
              title: this.secondCateTitle
            },
            {
              cid: this.thirdCateActive,
              title: this.thirdCateTitle
            }
          ],
          clientTimespan: clientTimespan
        };
        let goodsCate = {
          cid: this.firstCateActive + ',' + this.secondCateActive + ',' + this.thirdCateActive,
          title: this.firstCateTitle + ' > ' + this.secondCateTitle + ' > ' + this.thirdCateTitle
        };

        SavePublishGoodsCategory.call(this, data).then( res => {
          if ( res.data.code === 1 ) {
            sessionStorage.setItem('goodsCate', JSON.stringify(goodsCate));
            this.$router.push({
              path: '/goods/release',
              query: { id: 0 }
            });
          } else {
            this.$message.error( res.data.desc );
          }
        });
      },

      /**
       * 跳转到经营范围
       */
      goRangeMain() {
        this.$router.push({ name: 'RangeMain' });
      },

      /**
       * 跳转到商家认证页面
       */
      goGoodsShopAuth() {
        this.$router.push({
          path: '/goods/shopAuth',
          query: { cateId: this.secondCateActive }
        });
      },

      /**
       * 商家资质是否认证
       */
      isAuthentication() {
        let clientTimespan = this.$Tool.formatDate(new Date());
        IsAuthentication.call(this, `?clientTimespan=${clientTimespan}&twoCid=${this.secondCateActive}`).then( res => {
          if (res.data.code === 1) {
            this.isAuthData = res.data.data;
          }
        });
      },

    },
    watch: {
      firstCateActive( val ) {
        console.log(val)
        this.firstCateTitle = this.firstCateData.find(res => res.cid === val*1).title;
        this.thirdCateData = [];
        this.secondCateTitle = '';
        this.thirdCateTitle = '';
        this.getCategory( val, 'secondCate' );
      },
      secondCateActive( val ) {
        this.thirdCateTitle = '';
        this.thirdCateData = [];
        this.getCategory( val, 'thirdCate' );
      },
    },
    created() {
      this.getPublishGoodsCategoryHistory();
      this.getCategory( 0, 'firstCate' );
    },

  }
</script>

<style lang="less" scoped>

  .warp_bg{
    width: 100%;
    height: auto;
    padding: 20px;
    box-sizing: border-box;
    background: #fff;
    .top_form{
      .el-input{
        width: 500px;
      }
      .el-select>.el-input{
        width: 500px;
      }
    }
  }

  .screen{
    width: 700px;
    margin-left: 140px;
    display: table;
    position: relative;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    .search_box {
      position: absolute;
      width: 660px;
      height: 425px;
      top: 0;
      left: 0;
      background: #ecf4fa;
      padding: 20px;
      .search_top {
        font-size: 16px;
        color: #333;
        overflow: hidden;
        span {
          i {
            font-style: normal;
            font-size: 14px;
          }
          b {
            color: #FF9800;
          }
        }
        > i {
          float: right;
          font-size: 22px;
          color: #e9424b;
          cursor: pointer;
        }
      }
      .search_main {
        height: 360px;
        margin-top: 30px;
        background: #fff;
        padding: 20px;
        overflow: auto;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        ul {
          li {
            border: 1px dashed transparent;
            margin: 5px 0;
            padding: 5px 10px;
            cursor: pointer;
            &:hover {
              border: 1px dashed #00a0e9;
              background: #daedfc;
            }
          }
          li.on {
            border: 1px dashed #00a0e9;
            background: #daedfc;
          }
        }
      }
    }

    .left {
      width: 33.33333%;
      display: table-cell;
      vertical-align: top;
      border: 1px #e5e5e5 solid;
      .search{
        width: 90%;
        margin: 10px auto;
      }
      ul{
        width: 100%;
        height: 400px;
        overflow-y: auto;
        li{
          width: 100%;
          height: 30px;
          line-height: 30px;
          padding: 0 10px;
          box-sizing: border-box;
          font-size: 14px;
          color: #333333;
          cursor: pointer;
          .icon-right{
            float: right;
          }
          &:hover{
            border-left: 2px #00a0e9 solid;
            background: #ececec;
          }
        }
        .cur{
          border-left: 2px #00a0e9 solid;
          background: #ececec;
        }
      }
    }
    .middle{
      width: 33.33333%;
      display: table-cell;
      vertical-align: top;
      border: 1px #e5e5e5 solid;
      .search{
        width: 90%;
        margin: 10px auto;
      }
      ul{
        width: 100%;
        height: 400px;
        overflow-y: auto;
        li{
          width: 100%;
          height: 30px;
          line-height: 30px;
          padding: 0 10px;
          box-sizing: border-box;
          font-size: 14px;
          color: #333333;
          cursor: pointer;
          .icon-right{
            float: right;
          }
          &:hover{
            border-left: 2px #00a0e9 solid;
            background: #ececec;
          }
        }
        .cur{
          border-left: 2px #00a0e9 solid;
          background: #ececec;
        }
      }
    }
    .right{
      width: 33.33333%;
      display: table-cell;
      vertical-align: top;
      border: 1px #e5e5e5 solid;
      .search{
        width: 90%;
        margin: 10px auto;
      }
      ul{
        width: 100%;
        height: 400px;
        overflow-y: auto;
        li{
          width: 100%;
          height: 30px;
          line-height: 30px;
          padding: 0 10px;
          box-sizing: border-box;
          font-size: 14px;
          color: #333333;
          cursor: pointer;
          .icon-right{
            float: right;
          }
          &:hover{
            border-left: 2px #00a0e9 solid;
            background: #ececec;
          }
        }
        .cur{
          border-left: 2px #00a0e9 solid;
          background: #ececec;
        }
      }
    }
  }
  .choice{
    width: 700px;
    height: 35px;
    line-height: 35px;
    margin-left: 140px;
    background: #ecf4fa;
    color: #666666;
    font-size: 14px;
    border: 1px #e5e5e5 solid;
    margin-top: 20px;
    padding: 0 10px;
    position: relative;
    img{
      position: absolute;
      top: -6px;
      left: 18px;
    }
    span{
      color: #00a2ff;
    }
  }
  .adjust{
    margin: 20px 0 0 140px;
    p {
      a {
        text-decoration: underline;
      }
    }
  }
  .authent{
    margin-top: 30px;
    div{
      margin-top: 20px;
      label{
        display: inline-block;
        width: 130px;
        text-align: right;
        color: #666;
      }
      img{
        vertical-align: middle;
        margin-left: 10px;
      }
      span{
        color: #e9424b;
        margin-left: 10px;

        a {
          text-decoration: underline;
        }
      }
    }
  }
  .releaseBtn{
    margin-left: 140px;
    margin-top: 30px;
  }


</style>
