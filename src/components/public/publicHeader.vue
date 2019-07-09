<template>
  <div class="header">
    <div class="info">
      <div class="logo">
        <router-link to="/index">
          <img src="./img/logo.png" alt="">
        </router-link>
        <span>商家中心</span>
      </div>
      <div class="operation">
        <div class="message" style="cursor:pointer;" @click="$router.push({name: 'SysMessageList'})">
          <i></i>
          <span>即时通讯</span>
        </div>
        <div class="notice" style="cursor:pointer;" @click="$router.push({name: 'ConsultingSettings'})">
          <i></i>
          <span>系统讯息</span>
        </div>
        <div class="user">
          <!--<img class="vue-lazyload" v-lazy="`https://picsum.photos/46`" alt="">-->
          <img class="vue-vue-lazyload" v-lazy="pcLogo" alt="" width="46" height="46"/>
          <p>{{storeName}}</p>
          <i @click="changeUserMenu"></i>
          <transition name="slide-fade">
            <div class="function" v-if="userMenu">
              <ul>
                <li @click="countSet">切换店铺</li>
                <li @click="logout">安全退出</li>
              </ul>
            </div>
          </transition>
        </div>
      </div>
      <!-- <div class="contract-tips" v-if="timeTrips">
        {{timeTrips}}
        <a @click="$router.push({name: 'AgreementProtocol'})">前往续约</a>
      </div> -->
    </div>
    <div class="ribbon"></div>
<!--    弹出层-->
    <el-dialog
      title="资料更新提醒"
      :visible.sync="dialogVisible"
      width="400px">
      <span>由于系统升级，账户安全性提高，请您完成店铺相关资料的更新，否则将无法进行交易。</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="$router.push({name: 'UpdataCompany'});dialogVisible = false;">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import LoginOut from '@/api/login/LoginOut'
  import GetShopInfo from '@/api/ShopInfo/GetShopInfo'
  import GetSupplementInformationStatus from '@/api/ShopInfo/GetSupplementInformationStatus'
  export default {
    data() {
      return {
        dialogVisible: false,
        userMenu: false,
      }
    },
    computed: {
      storeName() {
        return this.$store.state.account.storeName
      },
      pcLogo() {
        return this.$store.state.account.pcLogo
      }
    },
    created() {
      this.getShopInfo();
      this.getSupplementInformationStatus();
      eventBus.$on('getShopInfo', this.getShopInfo);
    },
    beforeDestroy() {
      eventBus.$off('getShopInfo');
    },
    methods: {
      //资料补充状态检测
      getSupplementInformationStatus() {
        GetSupplementInformationStatus.call(this, `?input.clientTimespan=${this.$Tool.formatDate(new Date())}`).then(res => {
          if (res.data.code === 1) {
            if (res.data.data === 3) {
              this.dialogVisible = true;
            }
          }
        })
      },
      //获取店铺名称和头像
      getShopInfo() {
        GetShopInfo.call(this, `?input.clientTimespan=${this.$Tool.formatDate(new Date())}`).then(res => {
          if (res.data.code === 1) {
            const { pcLogo, storeName } = res.data.data
            this.$store.commit('setShopInfo', {
              pcLogo, storeName
            })
          } else {
            this.$message.error(res.data.desc);
          }
        })
      },
      changeUserMenu() {
        this.userMenu = !this.userMenu;
      },
      logout() {
        let loading = this.$loading();
        LoginOut.call(this,{
          'clientTimespan': this.$Tool.formatDate(new Date()),
        }).then(res => {
          loading.close();
          if (res.data.code === 1) {
            this.$router.push({name: 'Login'});
            sessionStorage.clear();
          } else {
            this.$message.error(res.data.desc);
          }
        }).catch(e => {
          this.$message.error(e);
          loading.close();
        })
      },

      /**
       * 账号设置跳转页面
       */
      countSet() {
        this.$router.push({ name: 'ShopChange' });
        this.userMenu = false;
      }
    }

  }
</script>

<style lang="less" scoped>
  @import "./less/header.less";
  .slide-fade-enter-active {
    transition: all .1s ease;
  }
  .slide-fade-leave-active {
    transition: all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateY(-20px);
    opacity: 0;
  }
</style>
