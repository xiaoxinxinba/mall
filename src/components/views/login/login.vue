<template>
  <div class="container">
    <div class="header">
      <a href=""><img :src="loginImg"></a>
      <div><span>商家中心</span></div>
    </div>
    <div class="main">
      <div class="dialog">
        <div class="dialog-title">登&emsp;录</div>
        <div class="inp user"><i class="user-icon"></i>
          <el-input clearable v-model="user" placeholder="用户名/手机号/邮箱" @keyup.enter.native="submit"></el-input>
        </div>
        <div class="inp password"><i class="password-icon"></i>
          <el-input type="password" clearable v-model="password" placeholder="请输入账户密码" @keyup.enter.native="submit"></el-input>
        </div>
        <!--<div class="remind"><span class="remind-icon"></span><span>登录失效，请重新登录</span></div>-->
        <el-button class="btn" @click="submit" :loading="login_loading">登&emsp;录</el-button>
        <div class="forget" @click="jump('forgetPwd')"><span>忘记密码？</span></div>
        <ul class="main-footer">
          <li @click="jump('mall')"><span>满集商城</span></li>
          <li @click="jump('openShop')"><span>商家开店</span></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import Login from '@/api/login/Login'
  import {JSEncrypt} from 'jsencrypt'
  import getMenuIds from '@/api/login/getMenuIds'
  import GetLoginNextUrl from '@/api/Admin/GetLoginNextUrl'

  export default {
    name: "login",
    data() {
      return {
        loginImg: require("./img/loginLogo.png"),
        user: '',
        password: '',
        login_loading: false,
      }
    },
    methods: {
      submit() {
        if (this.user.length === 0) {
          this.$message.error('请输入登录名');
          return;
        }
        if (this.password.length === 0) {
          this.$message.error('请输入密码');
          return;
        }
        let encryptor = new JSEncrypt(); // 新建JSEncrypt对象
        encryptor.setPublicKey('MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDC4wHerJc4BSst20Zb07lY9LeZss4OEEhe+SrnLyYy8hGquX/aTQNn+5wnV/+8ierKPgqPGIXPf1ZRww5/6yON+O7dAfJ7BRx85HneIWqwPCZToLck8DN8UXsBuXLMcG7tfMunnnZKenrPsAslN0eKvkYkvz4EPGdvmPwz0NCKXQIDAQAB');  // 设置公钥
        let rsaPassWord = encryptor.encrypt(this.password.replace(/\s*/g,"")); // 对密码进行加密

        this.login_loading = true;
        Login.call(this, {
          username: this.user.replace(/\s*/g,""),
          password: rsaPassWord,
        }).then((res) => {
          this.login_loading = false;
          if (res.data.Code === 1) {
            res.data.Data.curTime = this.$Tool.formatDate(new Date());
            sessionStorage.setItem("tokenInfo", JSON.stringify(res.data.Data));
            GetLoginNextUrl.call(this, `?input.clientTimespan=${this.$Tool.formatDate(new Date())}`).then(res => {
              if (res.data.code === 1) {
                if (res.data.data.siteUrl) {
                  location.href = res.data.data.siteUrl;
                } else {
                  this.$router.push({name: 'Index'});
                }
              } else {
                this.$message.error(res.data.desc);
              }
            });
            //权限菜单
            getMenuIds.call(this, {

            }).then(res => {
              if (res.data.Code === 1) {
                let ids = res.data.Data.split(',').map(item => Number(item));
                sessionStorage.setItem('menuIds', JSON.stringify(ids));
                eventBus.$emit('getMenuIds');//重新获取权限列表
              }
            })
          } else {
            this.$message.error(res.data.Desc);
          }
        }).catch(e => {
          this.$message.error(e);
          this.login_loading = false;
        })
      },
      jump(name) {
        window.open(this.$store.state.api[name]);
      }
    },
    beforeRouteEnter (to, from, next) {
      let tokenInfo = JSON.parse(sessionStorage.getItem('tokenInfo'));
      //有token信息直接跳转首页
      if (tokenInfo && tokenInfo.access_token && tokenInfo.refresh_token) {
        next(vm => {
          vm.$router.push({path: '/index'})
        })
      } else {
        next()
      }
    },
  }
</script>

<style lang="less" scoped>
  @import "less/login.less";
</style>
