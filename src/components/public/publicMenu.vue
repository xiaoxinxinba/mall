<template>
  <div class="menu_cont">
    <div v-for="(item, i) in menuList" class="item">
      <div :class="nowRouterFatherTitle === item.title ? 'title active' : 'title'">
        <i></i>
        <span>{{item.title}}</span>
      </div>
      <ul>
        <template v-if="item.childMenu && item.childMenu.length > 0">
          <li v-for="it in item.childMenu">
            <!--          <router-link v-if="menuIds.indexOf(it.meta.id) !== -1 && it.meta.id"-->
            <!--                       :class="nowRouterName.indexOf(it.name) >= 0 ? 'active' : ''"-->
            <!--                       :to="`${item.path}${it.path !== '/' ? `/${it.path}` : ''}`">{{it.meta && it.meta.title}}-->
            <!--          </router-link>-->
            <!--          <span v-else class="noPermission">{{it.meta && it.meta.title}}</span>-->
<!--            <router-link v-if="it.isChecked && it.status === 0" :class="nowRouterName === it.title ? 'active' : ''" :to="it.url">{{it.title}}</router-link>-->
            <router-link v-if="it.isChecked && it.status === '0'" :class="nowRouterName === it.title ? 'active' : ''" :to="it.url">{{it.title}}</router-link>
            <span v-if="!it.isChecked && it.status === '0'" @click="noPermission" class="noLimit">{{it.title}}</span>
            <span v-if="it.status === '1'" class="noPermission">{{it.title}}</span>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script>
  import router from '../../router/index.js'
  import GetRoleAllMenuList from '@/api/PermissionManage/GetRoleAllMenuList'

  export default {
    data() {
      return {
        menu: router.options,
        menuList: [],
        nowRouterName: [],
        nowRouterFatherTitle: '',
        menuIds: [], //有权限的菜单列表
      }
    },
    created() {
      this.getMenuList();
      this.getMenuIds();
      eventBus.$on('getMenuIds', this.getMenuIds);
      eventBus.$on('getMenuList', this.getMenuList);
    },
    beforeDestroy() {
      eventBus.$off('getMenuIds');
      eventBus.$off('getMenuList');
    },
    methods: {
      getMenuList() {
        GetRoleAllMenuList.call(this, `?input.clientTimespan=${this.$Tool.formatDate(new Date())}`).then(res => {
          if (res.data.code === 1) {
            this.menuList = res.data.data.pcMenu;
          } else {
            this.$message.error(res.data.desc);
          }
        })
      },
      getMenuIds() {
        console.log('获取菜单权限');
        this.menuIds = sessionStorage.getItem('menuIds') ? JSON.parse(sessionStorage.getItem('menuIds')) : [];
        console.log('菜单权限：', this.menuIds)
      },
      noPermission() {
        this.$message.error('访问页面没有权限')
      }
    },
    watch: {
      '$route': {
        handler(to, from) {
          // 对路由变化作出响应...
          // 对路由变化作出响应...

          // let list = [];
          // to.matched.map(item => {
          //   list.push(item.name)
          // });
          this.nowRouterName = to.matched.length > 1 && to.matched[1].meta.title;
          this.nowRouterFatherTitle = to.matched.length && to.matched[0].meta.title;
        },
        immediate: true
      }
    },
  }
</script>

<style lang="less" scoped>
  @import "./less/menu.less";

  .noPermission {
    cursor: not-allowed;
    color: #c1c1c1;
  }
  .noLimit {
    cursor: pointer;
    color: #666;
    &:hover {
      color: #00a2ff;
    }
  }
</style>
