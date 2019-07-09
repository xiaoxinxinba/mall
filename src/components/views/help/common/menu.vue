<template>
    <div class="help_menu">
        <el-row class="tac">
  <el-col :span="12">
    <el-menu
      default-active="3"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      unique-opened
      >
      <!--导航一 -->
      <el-submenu index="1">
        <template slot="title">
          <span>导航一</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="1-1">选项1</el-menu-item>
          <el-menu-item index="1-2">选项2</el-menu-item>
        </el-menu-item-group>
          <el-menu-item index="1-3">选项3</el-menu-item>
      </el-submenu>
      <!-- 导航2 -->
      <el-submenu index="2">
        <template slot="title">
          <span>导航一</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="1-1">选项1</el-menu-item>
          <el-menu-item index="1-2">选项2</el-menu-item>
        </el-menu-item-group>
          <el-menu-item index="1-3">选项3</el-menu-item>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">
          <span>导航一</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="1-1">选项1</el-menu-item>
          <el-menu-item index="1-2">选项2</el-menu-item>
        </el-menu-item-group>
          <el-menu-item index="1-3">选项3</el-menu-item>
      </el-submenu>
      <el-submenu index="4">
        <template slot="title">
          <span>导航一</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="1-1">选项1</el-menu-item>
          <el-menu-item index="1-2">选项2</el-menu-item>
        </el-menu-item-group>
          <el-menu-item index="1-3">选项3</el-menu-item>
      </el-submenu>
      <el-submenu index="5">
        <template slot="title">
          <span>导航一</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="1-1">选项1</el-menu-item>
          <el-menu-item index="1-2">选项2</el-menu-item>
        </el-menu-item-group>
          <el-menu-item index="1-3">选项3</el-menu-item>
      </el-submenu>
      <el-submenu index="6">
        <template slot="title">
          <span>导航一</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="1-1">选项1</el-menu-item>
          <el-menu-item index="1-2">选项2</el-menu-item>
        </el-menu-item-group>
          <el-menu-item index="1-3">选项3</el-menu-item>
      </el-submenu>
    </el-menu>
  </el-col>
</el-row>
    </div>
</template>

<script>
 export default {
     data(){
         return {

         }
     },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>

<style lang="less">
.help_menu {
    height: 1000px;
    overflow: hidden;
    .tac{
        height: 100%;
        .el-col{
            width:200px;
            height: 100%;
            .el-menu-vertical-demo{
                height: 100%;
            }
        }
    }
}

</style>
