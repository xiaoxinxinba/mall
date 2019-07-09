<template>
  <div class="main">
    <!-- 表格 -->
    <div>
      <div style="margin-bottom: 10px;">
        <el-button type="primary" icon="el-icon-plus" @click="accountOpen">开通账号</el-button>
      </div>
      <el-table
        :header-cell-style="{backgroundColor: '#f1f1f3', color: '#000', textAlign: 'center'}"
        :cell-style="{textAlign: 'center'}"
        v-loading="table_loading"
        :data="table_data"
        border
        style="width: 100%">
        <el-table-column
          label="编号"
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          prop="userName"
          label="账号"
          width="255">
        </el-table-column>
        <el-table-column
          prop="nickeName"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="roleList"
          label="角色">
          <template slot-scope="scope">
            <span v-if="scope.row.isMain">管理员</span>
            <span v-else>{{scope.row.roleList}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="联系电话">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱">
        </el-table-column>
        <el-table-column
          prop="desc"
          label="描述">
        </el-table-column>
        <el-table-column
          prop="loginTime"
          label="最近登录">
        </el-table-column>
        <el-table-column
          prop="statusName"
          label="状态">
        </el-table-column>
        <el-table-column
          width="300"
          label="操作">
          <template slot-scope="scope">
            <template v-if="!scope.row.isMain">
              <el-button type="text" v-if="scope.row.statusName === '启用'"
                         @click="operatingChangeOpen('禁用', 1, scope.row)">禁用
              </el-button>
              <el-button type="text" v-if="scope.row.statusName === '禁用'"
                         @click="operatingChangeOpen('启用', 0, scope.row)">启用
              </el-button>
              <el-button type="text" @click="setRole(scope.row)">设置角色</el-button>
              <el-button type="text" v-if="scope.row.statusName === '禁用'"
                         @click="operatingChangeOpen('删除', 2, scope.row)">删除
              </el-button>
            </template>
            <el-button type="text" @click="resetPassword(scope.row)">重置密码</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-pagination
      style="margin-top: 10px;text-align: right"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 20, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageTotal">
    </el-pagination>
    <!--    弹出层-->
    <!--    重置密码-->
    <el-dialog
      title="重置密码"
      :visible.sync="resetPasswordVisible"
      width="30%">
      <div>
        <el-form label-width="120px">
          <el-form-item label="设置密码">
            <el-input type="password" v-model="resetPasswordInfo.newPassword"></el-input>
          </el-form-item>
          <el-form-item label="重复密码">
            <el-input type="password" v-model="newPasswordSecond"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetPasswordVisible = false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="resetPasswordSubmit"
                   :loading="reset_password_loading">重置密码</el-button>
      </span>
    </el-dialog>
    <!--    禁用启用删除 提示-->
    <el-dialog
      title="提示"
      :visible.sync="operating_visible"
      width="450px">
      <div style="text-align: center">
        确定 <strong>{{operating_tip_text}}</strong> 该账号吗？
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="operating_visible = false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="operatingChange">确定</el-button>
      </span>
    </el-dialog>
    <!--    选择角色-->
    <el-dialog
      title="设置角色"
      :visible.sync="role_visible"
      width="450px">
      <el-form label-width="120px">
        <el-form-item label="角色：">
          <template v-if="role_list.length > 0">
            <el-checkbox v-for="item in role_list" :key="item.roleId" v-model="role_selected" :label="item.roleId">
              {{item.roleName}}
            </el-checkbox>
          </template>
          <span v-else>暂无角色</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="role_visible = false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="setRoleSubmit">确定</el-button>
      </span>
    </el-dialog>
    <!--    开通账号-->
    <el-dialog
      title="开通账号"
      :visible.sync="account_visible"
      width="600px">
      <el-form autocomplete="off" label-width="120px" size="small" v-if="account_tab === '1'">
        <el-form-item label="手机号码：" class="custom-require">
          <el-input style="width: 200px" v-model="account_info.phone"></el-input>
          <el-button v-if="code_reset_time === 0" style="margin-left: 10px;" @click="sendCode"
                     :loading="code_reset_loading">获取验证码
          </el-button>
          <el-button v-else style="margin-left: 10px;" :disabled="true">剩余时间({{code_reset_time}})</el-button>
        </el-form-item>
        <el-form-item label="验证码：" class="custom-require">
          <el-input style="width: 200px" v-model="account_info.code"></el-input>
        </el-form-item>
        <el-form-item label="设置密码：" class="custom-require">
          <el-input type="password" v-model="account_info.pwd"></el-input>
        </el-form-item>
        <el-form-item label="重复密码：" class="custom-require">
          <el-input type="password" v-model="account_info.pwd2"></el-input>
        </el-form-item>
        <el-form-item label="状态：" class="custom-require">
          <el-radio-group v-model="account_info.status">
            <el-radio-button label="0">启用</el-radio-button>
            <el-radio-button label="1">禁用</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="">
          <div>已有满集网账号？
            <el-button type="text" @click="account_tab = '2'">直接开通</el-button>
          </div>
        </el-form-item>
      </el-form>
      <div v-else>
        <div style="margin-bottom: 20px;padding-left: 75px;">
          <el-input size="small" style="width: 250px;" placeholder="请输入手机号" v-model="account_search_phone"></el-input>
          <el-button size="small" @click="accountSearch" :loading="account_search_loading">搜索</el-button>
        </div>
        <el-form size="small" label-width="120px" v-if="account_search_visible">
          <strong style="padding-left: 75px;">搜索结果</strong>
          <el-form-item label="昵称：">
            <span>{{account_search_info.nickname}}</span>
          </el-form-item>
          <el-form-item label="联系电话：">
            <span>{{account_search_info.phone}}</span>
          </el-form-item>
          <el-form-item label="头像：">
            <img :src="account_search_info.avatar" alt="" width="100" height="100">
          </el-form-item>
          <el-form-item label="状态：">
            <el-radio-group v-model="account_search_info.status">
              <el-radio-button :label="0">启用</el-radio-button>
              <el-radio-button :label="1">禁用</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div style="padding-left: 75px;">暂无满集网账号？
          <el-button type="text" @click="account_tab = '1'">去开通</el-button>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="account_visible = false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="userRegister" :loading="user_register_loading">确定开通</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import GetUserChildList from '@/api/ChildAccountManage/GetUserChildList'
  import UserRePassword from '@/api/ChildAccountManage/UserRePassword'
  import UpdateUserChildOperating from '@/api/ChildAccountManage/UpdateUserChildOperating'
  import GetShopRoleList from '@/api/ChildAccountManage/GetShopRoleList'
  import UpdateUserAndRole from '@/api/ChildAccountManage/UpdateUserAndRole'
  import ValidateMobile from '@/api/ChildAccountManage/ValidateMobile'
  import SmsSendVerifyCode from '@/api/ChildAccountManage/SmsSendVerifyCode'
  import VerifyCode from '@/api/ChildAccountManage/VerifyCode'
  import UserRegister from '@/api/ChildAccountManage/UserRegister'
  import GetUsersByAccount from '@/api/ChildAccountManage/GetUsersByAccount'
  import GetSyncShop from '@/api/ChildAccountManage/GetSyncShop'

  import {JSEncrypt} from 'jsencrypt'


  export default {
    name: "childAccount",
    data() {
      return {
        active_item: '',

        account_visible: false,
        code_reset_loading: false,
        code_reset_time: 0,//验证码剩余时间
        code_reset_interval: '',//验证码轮询
        account_info: {
          phone: '',
          code: '',
          pwd: '',
          pwd2: '',
          status: '0',
        },
        account_tab: '1',
        user_register_loading: false,

        account_search_loading: false,
        account_search_phone: '',
        account_search_info: {
          id: '',
          user_name: '',
          nickname: '',
          phone: '',
          avatar: '',
          status: '',
        },
        account_search_visible: false,

        role_visible: false,
        role_list: [],
        role_selected: [],

        operating_tip_text: '',
        operating_value: '',
        operating_visible: false,

        status_visible: false,
        reset_password_loading: false,
        resetPasswordVisible: false,
        pageTotal: 0,
        table_loading: false,
        currentPage: 1,
        pageSize: 10,

        table_data: [],
        resetPasswordInfo: {
          code: '',
          type: 1,
          typeValue: '',
          newPassword: '',
        },
        newPasswordSecond: '',
      }
    },
    created() {
      this.getTableData();
    },
    methods: {
      //账户搜索
      accountSearch() {
        if (this.account_search_phone === '') {
          this.$message.error('请输入手机号');
          return;
        }
        this.account_search_loading = true;
        GetUsersByAccount.call(this, `?input.query=${this.account_search_phone}&input.clientTimespan=${this.$Tool.formatDate(new Date())}`).then(res => {
          this.account_search_loading = false;
          if (res.data.code === 1) {
            if (res.data.data) {
              this.account_search_visible = true;
              this.account_search_info.id = res.data.data.id;
              this.account_search_info.user_name = res.data.data.user_name;
              this.account_search_info.nickname = res.data.data.nick_name;
              this.account_search_info.phone = res.data.data.mobile;
              this.account_search_info.avatar = res.data.data.avatar;
              this.account_search_info.status = res.data.data.status;

            } else {
              this.$message.info('暂无数据')
            }
          } else {
            this.$message.error(res.data.desc);
          }
        }).catch(e => {
          this.account_search_loading = false;
        })
      },
      //确认开通
      userRegister: async function () {
        //新账号注册
        if (this.account_tab === '1') {
          if (this.account_info.pwd === '' || this.account_info.pwd2 === '') {
            this.$message.error('密码不能为空');
            return;
          }
          if (this.account_info.pwd !== this.account_info.pwd2) {
            this.$message.error('两次密码不一致');
            return;
          }
          let validate_code = await this.verifyCode();
          if (validate_code.data.code === 1) {
            let encryptor = new JSEncrypt(); // 新建JSEncrypt对象
            encryptor.setPublicKey('MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDC4wHerJc4BSst20Zb07lY9LeZss4OEEhe+SrnLyYy8hGquX/aTQNn+5wnV/+8ierKPgqPGIXPf1ZRww5/6yON+O7dAfJ7BRx85HneIWqwPCZToLck8DN8UXsBuXLMcG7tfMunnnZKenrPsAslN0eKvkYkvz4EPGdvmPwz0NCKXQIDAQAB');  // 设置公钥
            let rsaPassWord = encryptor.encrypt(this.account_info.pwd); // 对密码进行加密
            this.user_register_loading = true;
            UserRegister.call(this, {
              phoneNumber: this.account_info.phone,
              password: rsaPassWord,
              registerType: 0,
              code: this.account_info.code,
              clientTimespan: this.$Tool.formatDate(new Date()),
            }).then(res => {
              this.user_register_loading = false;
              if (res.data.code === 1) {
                this.account_visible = false;
                this.account_search_info.id = res.data.data.userID;
                this.getSyncShop();
              } else {
                this.$message.error(res.data.desc);
              }
            }).catch(e => {
              this.user_register_loading = false;
            })
          } else {
            this.$message.error(validate_code.data.desc);
          }
        } else {
          this.getSyncShop()
        }

      },
      //已有账号
      getSyncShop() {
        if (!this.account_search_visible) {
          this.$message.error('请先搜索账号');
          return;
        }
        GetSyncShop.call(this, {
          admin: false,
          applicationType: '2',
          childRoleType: 'Buyer',
          childRoleValue: 0,
          childUserId: this.account_search_info.id,
          roleType: 'Shop',
          roleValue: JSON.parse(sessionStorage.getItem('tokenInfo')).shopId,
          status: this.account_search_info.status,
          userId: JSON.parse(sessionStorage.getItem('tokenInfo')).userId,
          username: this.account_search_info.user_name,
          clientTimespan: this.$Tool.formatDate(new Date()),
        }).then(res => {
          if (res.data.code === 1) {
            this.$message.success('操作成功');
            this.account_visible = false;
            this.account_search_visible = false;
            this.getTableData();
          } else {
            this.$message.error(res.data.desc);
          }
        })
      },
      //验证 验证码
      verifyCode() {
        return new Promise((resolve, reject) => {
          VerifyCode.call(this, `?input.type=${1}&input.codeSourceType=${0}&input.typeValue=${this.account_info.phone}&input.code=${this.account_info.code}&input.clientTimespan=${this.$Tool.formatDate(new Date())}`).then(res => {
            resolve(res);
          })
        });
      },
      //验证手机号
      validateMobile() {
        return new Promise((resolve, reject) => {
          ValidateMobile.call(this, `?input.phoneNumber=${this.account_info.phone}&input.clientTimespan=${this.$Tool.formatDate(new Date())}`).then(res => {
            resolve(res);
          })
        })
      },
      //获取手机验证码
      sendCode: async function () {
        if (this.account_info.phone === '') {
          this.$message.error('请输入手机号');
          return;
        }
        let validate_mobile = await this.validateMobile();
        if (validate_mobile.data.code === 1) {
          this.code_reset_loading = true;
          SmsSendVerifyCode.call(this, {
            type: 1,
            codeSourceType: 0,
            typeValue: this.account_info.phone,
            clientTimespan: this.$Tool.formatDate(new Date()),
          }).then(res => {
            this.code_reset_loading = false;
            this.codeReset();
            if (res.data.code === 1) {
            } else {
              this.$message.error(res.data.desc);
            }
          }).catch(e => {
            this.code_reset_loading = false;
          })
        } else {
          this.$message.error(validate_mobile.data.desc);
        }
      },
      //验证码倒计时
      codeReset() {
        this.code_reset_time = 59;
        this.code_reset_interval = setInterval(() => {
          if (this.code_reset_time === 0) {
            clearInterval(this.code_reset_interval)
          } else {
            this.code_reset_time -= 1;
          }
        }, 1000)
      },
      //
      accountOpen() {
        // this.account_tab = '1';
        Object.keys(this.account_info).forEach(item => {
          if (item === 'status') {
            this.account_info[item] = '0';
          } else {
            this.account_info[item] = '';
          }
        });
        this.account_visible = true;
        this.account_search_visible = false;
      },
      //角色修改提交
      setRoleSubmit() {
        UpdateUserAndRole.call(this, {
          id: this.active_item.id,
          roleIds: this.role_selected.join(),
          clientTimespan: this.$Tool.formatDate(new Date()),
        }).then(res => {
          if (res.data.code === 1) {
            this.$message.success('操作成功');
            this.getTableData();
            this.role_visible = false;
          } else {
            this.$message.error(res.data.desc);
          }
        })
      },
      //设置角色
      setRole(item) {
        this.role_selected = [];
        GetShopRoleList.call(this, `?input.ChildAccountId=${item.id}&input.clientTimespan=${this.$Tool.formatDate(new Date())}`).then(res => {
          if (res.data.code === 1) {
            this.role_list = res.data.data;
            this.role_list.forEach(item => {
              if (item.isChecked) {
                this.role_selected.push(item.roleId);
              }
            })
          } else {
            this.$message.error(res.data.desc);
          }
        });
        this.active_item = item;
        this.role_visible = true;
      },
      //账号状态修改提交
      operatingChange() {
        UpdateUserChildOperating.call(this, {
          id: this.active_item.id,
          status: this.operating_value,
          clientTimespan: this.$Tool.formatDate(new Date()),
        }).then(res => {
          if (res.data.code === 1) {
            this.$message.success('操作成功');
            this.operating_visible = false;
            this.getTableData();
          } else {
            this.$message.error(res.data.desc);
          }
        })
      },
      //
      operatingChangeOpen(text, value, item) {
        this.operating_visible = true;
        this.operating_tip_text = text;
        this.operating_value = value;
        this.active_item = item;
      },
      //修改密码提交
      resetPasswordSubmit() {
        if (this.resetPasswordInfo.newPassword === '') {
          this.$message.error('密码不能为空');
          return;
        }
        if (this.resetPasswordInfo.newPassword !== this.newPasswordSecond) {
          this.$message.error('两次密码不一致');
          return;
        }
        this.reset_password_loading = true;
        let encryptor = new JSEncrypt(); // 新建JSEncrypt对象
        encryptor.setPublicKey('MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDC4wHerJc4BSst20Zb07lY9LeZss4OEEhe+SrnLyYy8hGquX/aTQNn+5wnV/+8ierKPgqPGIXPf1ZRww5/6yON+O7dAfJ7BRx85HneIWqwPCZToLck8DN8UXsBuXLMcG7tfMunnnZKenrPsAslN0eKvkYkvz4EPGdvmPwz0NCKXQIDAQAB');  // 设置公钥
        let rsaPassWord = encryptor.encrypt(this.resetPasswordInfo.newPassword); // 对密码进行加密
        UserRePassword.call(this, {
          type: this.resetPasswordInfo.type,
          typeValue: this.resetPasswordInfo.typeValue,
          code: this.resetPasswordInfo.code,
          newPassword: rsaPassWord,
          clientTimespan: this.$Tool.formatDate(new Date()),
        }).then(res => {
          this.reset_password_loading = false;
          if (res.data.code === 1) {
            this.$message.success('重置成功');
            this.resetPasswordVisible = false;
          } else {
            this.$message.error(res.data.desc);
          }
        }).catch(e => {
          this.reset_password_loading = false;
        })
      },
      //修改密码弹框
      resetPassword(item) {
        this.resetPasswordInfo.newPassword = '';
        this.newPasswordSecond = '';
        this.resetPasswordInfo.typeValue = item.mobile ? item.mobile : item.userName;
        this.resetPasswordVisible = true;
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pageSize = val;
        this.getTableData();
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage = val;
        this.getTableData();
      },
      getTableData() {
        this.table_loading = true;
        GetUserChildList.call(this, {
          pageIndex: this.currentPage,
          pageSize: this.pageSize,
          clientTimespan: this.$Tool.formatDate(new Date()),
        }).then(res => {
          this.table_loading = false;
          if (res.data.code === 1) {
            this.table_data = res.data.data.data;
            this.pageTotal = res.data.data.totalCount;
          } else {
            this.$message.error(res.data.desc);
          }
        }).catch(e => {
          this.table_loading = false;
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .main {
    background-color: #fff;
    overflow: auto;
    padding: 20px;
  }
</style>
<style lang="less">
  .custom-require label.el-form-item__label {
    position: relative;

    &:before {
      content: "*";
      position: relative;
      color: red;
      font-size: 1.5em;
      right: 5px;
      top: 7px;
    }
  }
</style>
