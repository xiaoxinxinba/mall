<template>
  <div class="main">
    <div v-if="statusInit">
      <div class="tips" v-if="status === 0">
        资料更新审核中
      </div>
      <div class="tips" v-if="status === 1">
        资料更新审核已通过
        <el-button class="btn" type="primary" size="mini" @click="statusInit = false">知道了</el-button>
      </div>
      <div class="tips" v-if="status === 2">
        审核未通过
        <el-button class="btn" type="primary" size="mini" @click="$router.push({name: 'UpdataCompany'})">立即修改</el-button>
      </div>
      <div class="tips" v-if="status === 3">
        由于系统升级，账户安全性提高，请您完成店铺相关资料的更新，否则将无法进行交易
        <el-button class="btn" type="primary" size="mini" @click="$router.push({name: 'UpdataCompany'})">立即更新</el-button>
      </div>
    </div>
    <div class="menu">
      <ul>
        <li :class="choice === item && 'active'" v-for="(item, i) in carList" :key="i" @click="changeChoice(item)">{{item}}</li>
      </ul>
      <div class="ribbon"></div>
    </div>
    <router-view/>
  </div>
</template>

<script>
  import GetSupplementInformationStatus from '@/api/ShopInfo/GetSupplementInformationStatus'
  export default {
    components: {

    },
    data() {
      return {
        carList: ['公司信息', '店铺信息', '店铺状态', '商家信誉'],
        choice: '公司信息',
        status: 0,//审核状态
        statusInit: false,
      }
    },
    created: async function () {
      this.getTitle();
      this.getSupplementInformationStatus();
    },
    methods: {
      //获取资料补充状态
      //资料补充状态检测
      getSupplementInformationStatus() {
        GetSupplementInformationStatus.call(this, `?input.clientTimespan=${this.$Tool.formatDate(new Date())}`).then(res => {
          if (res.data.code === 1) {
            this.statusInit = true;
            this.status = res.data.data;
          }
        })
      },
      changeChoice(name) {
        this.choice = name;
        switch (name) {
          case '公司信息':
            // this.$router.push({name: "ProjectInfo", query: {project_id:this.$route.query.project_id}});
            this.$router.push({name: "CompanyInfo"});
            break;
          case '店铺信息':
            this.$router.push({name: "StoreShop"});
            break;
         /* case '账户信息':
            this.$router.push({name: "AccountInfo"});
            break;*/
          case '店铺状态':
            this.$router.push({name: "StoreState"});
            break;
          case '商家信誉':
            this.$router.push({name: "ShopReputation"});
            break;
        }
      },

      // 默认获取头部标题
      getTitle() {
        // let routerName = this.$router.history.current.name;
        let routerTitle = this.$router.history.current.meta.title;
        console.log(routerTitle, "routerName");
        this.choice = routerTitle;
      },
    },
    watch: {
      '$route': {
        handler(to, from) {
          // 对路由变化作出响应...
          this.choice = this.$router.history.current.meta.title;
        },
        immediate: true
      }

    },
  }
</script>

<style lang="less" scoped>
  @import "./less/index.less";
  .main {
    .tips {
      position: relative;
      margin-bottom: 10px;
      padding: 10px 20px;
      border: 1px solid rgba(254, 219, 171, 1);
      background-color: rgba(255, 250, 242, 1);
      color: red;
      .btn {
        position: absolute;
        right: 20px;
        top: 5px;
      }
    }
  }
</style>
