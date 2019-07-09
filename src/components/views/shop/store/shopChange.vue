<template>
  <div class="container">
    <ul v-if="childAccounts.length > 0">
      <li v-for="item in childAccounts" :key="item.id">
        <div class="img-show"><img :src="null == item.pic ? imgSrc : item.pic" alt="店铺头像"></div>
        <div class="content">{{item.shopName}}</div>
        <div class="btn" v-if="item.shopId != selectShopId">
          <el-button type="primary" @click="switchShopPost(item.shopId)">选择</el-button>
        </div>
      </li>
    </ul>
    <div style="padding: 20px; background-color: #fff">暂无数据</div>
  </div>
</template>

<script>

  import GetShopChildAccount from '../../../../api/ShopInfo/GetShopChildAccount';
  import SwitchShop from '../../../../api/ShopInfo/SwitchShop';
  import ApplyColseShop from '@/api/base/ApplyColseShop'
  import router from '../../../../router';

  export default {
    name: "shopChange",
    data() {
      return {
        imgSrc: 'http://kuailian-upload.oss-cn-shenzhen.aliyuncs.com/upload/201904/12/Gcuiv3d9BEf.jpg',
        childAccounts: [],
        selectShopId: 0,
        idsList: [],
      }
    },
    mounted: function () {
      this.initData(1, 10);
    },
    methods: {
      initData: function (pageIndex, pageSize) {
        GetShopChildAccount.call(this, '?clientVersion=1.0.0&clientTimespan=' + this.$Tool.formatDate(new Date())).then(res => {
          if (undefined != res.data.data) {
            this.childAccounts = res.data.data;
            this.selectShopId = JSON.parse(sessionStorage.getItem('tokenInfo')).shopId;
          }
        })
      },
      switchShopPost: function (id) {
        this.$confirm('确定要切换账号吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          SwitchShop.call(this, {
            selectedShopId: id,
            refresh_token: JSON.parse(sessionStorage.getItem('tokenInfo')).refresh_token,
            clientVersion: '1.0.0',
            clientTimespan: this.$Tool.formatDate(new Date())
          }).then(res => {
            if (res.data.code === 1) {
              this.$message.success('操作成功');
              sessionStorage.setItem("tokenInfo", JSON.stringify(res.data.data.tokenInfo));//存储新的token
              // //获取新的菜单权限id列表
              // let menuInfos = res.data.data.menuInfos;
              // this.getMenuIds(menuInfos);
              // sessionStorage.setItem('menuIds', JSON.stringify(this.idsList));
              // //重新存储菜单权限id列表
              // eventBus.$emit('getMenuIds');
              this.initData();
              this.getShopStatus();

              //重新获取左侧菜单
              eventBus.$emit('getMenuList');
              //重新获取头部右侧店铺信息
              eventBus.$emit('getShopInfo');
            }
          })
        })
      },
      //判断店铺状态跳转页面
      getShopStatus() {
        ApplyColseShop.call(this, `?input.clientTimespan=${this.$Tool.formatDate(new Date())}`).then(res => {
          if (res.data.code === 1) {
            if (res.data.data.status === 2) {//冻结
              this.$router.push({name: 'Freeze'})
            } else if (res.data.data.status === 3){//关闭
              this.$router.push({name: 'Close'})
            } else {
              this.$router.push({path: '/index'})
            }
          } else {
            this.$message.error(res.data.desc);
          }
        })
      },
      //递归存值
      getMenuIds(menu) {
        menu.forEach((item, index) => {
          if (item.childMenu && item.childMenu.length > 0) {
            this.getMenuIds(item.childMenu);
          } else {
            if (item.isChecked) {
              this.idsList.push(item.menuId);
            }
          }
        });
      }
    }
  }
</script>

<style lang="less" scoped>
  * {
    box-sizing: border-box;
  }

  li {
    padding: 10px 20px;
    background: #ffffff;
    margin-bottom: 10px;

    > div {
      display: inline-block;
      vertical-align: middle;
    }
  }

  .img-show {
    height: 52px;
    width: 52px;
    margin-right: 20px;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }

  .content {
    color: #333333;
    font-size: 14px;
  }

  .btn {
    float: right;
    padding-top: 8px;

    /deep/ button {
      padding: 0px;
      width: 104px;
      height: 36px;
    }
  }

</style>
