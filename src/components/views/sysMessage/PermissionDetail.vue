<template>
  <div class="main">
    <el-form label-width="120px">
      <el-form-item label="角色名称" class="custom-require">
        <el-input v-model="role_name" style="width: 300px;"></el-input>
      </el-form-item>
    </el-form>
    <el-tabs v-model="tabName">
      <el-tab-pane label="PC权限设置" name="pc">
        <div class="block" v-for="(item_first, index_first) in pcMenu" :key="item_first.menuId">
          <div style="margin-bottom: 10px;">
            <el-checkbox v-model="item_first.checkAll" style="color: #000;font-weight: 700;"
                         @change="(val) => checkAll(val, item_first, 'pcMenu_selected')">{{item_first.title}}
            </el-checkbox>
          </div>
          <el-checkbox-group v-model="pcMenu_selected" @change="(val) => isCheckAll(val, item_first)">
            <el-checkbox v-for="(item_second, index_second) in item_first.childMenu" :label="item_second.menuId"
                         :key="item_second.menuId">{{item_second.title}}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </el-tab-pane>

      <el-tab-pane label="APP权限设置" name="app">
        <div class="block" v-for="(item_first, index_first) in appMenu" :key="item_first.menuId">
          <div style="margin-bottom: 10px;">
            <el-checkbox v-model="item_first.checkAll" style="color: #000;font-weight: 700;"
                         @change="(val) => checkAll(val, item_first, 'appMenu_selected')">{{item_first.title}}
            </el-checkbox>
          </div>
          <el-checkbox-group v-model="appMenu_selected" @change="(val) => isCheckAll(val, item_first)">
            <el-checkbox v-for="(item_second, index_second) in item_first.childMenu" :label="item_second.menuId"
                         :key="item_second.menuId">{{item_second.title}}
            </el-checkbox>
          </el-checkbox-group>
        </div>

      </el-tab-pane>
      <el-tab-pane label="消息模板权限设置" name="msg">
        <div class="block">
          <el-checkbox-group v-model="smsTypeList_selected">
            <!--            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>-->
            <el-checkbox v-for="(item_first, index_first) in smsTypeList" :key="item_first.id"
                         :label="item_first.id">{{item_first.title}}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div>
      <el-button type="primary" size="medium" @click="submit">确定</el-button>
      <el-button size="medium" @click="$router.go(-1)">返回</el-button>
    </div>
  </div>
</template>

<script>
  import GetRoleMenuList from '@/api/PermissionManage/GetRoleMenuList'
  import UpdateRoleInfo from '@/api/PermissionManage/UpdateRoleInfo'

  export default {
    name: "PermissionDetail",
    data() {
      return {
        tabName: 'pc',
        role_code: '',
        role_name: '',
        role_id: 0,
        appMenu: [],
        pcMenu: [],
        smsTypeList: [],
        appMenu_selected: [],
        pcMenu_selected: [],
        smsTypeList_selected: [],
      }
    },
    created() {
      this.role_code = this.$route.query.roleCode ? this.$route.query.roleCode : '';
      this.getTreeData();
    },
    methods: {
      //判断是否全选
      isCheckAll(val, menu) {
        let checkLength = 0;
        menu.childMenu.forEach(item_child => {
          val.forEach(item => {
            if (item_child.menuId === item) {
              checkLength += 1;
            }
          })
        });
        menu.checkAll = checkLength === menu.childMenu.length;
      },
      //全选
      checkAll(val, menu, selected_list) {
        if (val) {
          //全选
          menu.childMenu.forEach(item_child => {
            //如果选中数组中没有，存入数组
            if (this[selected_list].indexOf(item_child.menuId) === -1) {
              this[selected_list].push(item_child.menuId);
            }
          })
        } else {
          //取消全选
          menu.childMenu.forEach((item_child, index_child, array_child) => {
            this[selected_list].forEach((item, index, array) => {
              //找到下标然后删除
              if (item === item_child.menuId) {
                array.splice(index, 1);
              }
            })
          })
        }
      },
      submit() {
        if (this.role_name === '') {
          this.$message.error('请填写角色名称');
          return;
        }
        UpdateRoleInfo.call(this, {
          appMenuIds: this.appMenu_selected.join(),
          pcMenuids: this.pcMenu_selected.join(),
          smsIds: this.smsTypeList_selected.join(),
          roleCode: this.role_code,
          roleDesc: '',
          roleId: this.role_id,
          roleName: this.role_name,
          clientTimespan: this.$Tool.formatDate(new Date()),
        }).then(res => {
          if (res.data.code === 1) {
            this.$message.success('操作成功');
            this.$router.go(-1);
          } else {
            this.$message.error(res.data.desc);
          }
        })
      },
      getTreeData() {
        GetRoleMenuList.call(this, `?input.roleCode=${this.role_code}&input.clientTimespan=${this.$Tool.formatDate(new Date())}`).then(res => {
          if (res.data.code === 1) {
            this.role_code = res.data.data.roleCode ? res.data.data.roleCode : '';
            this.role_name = res.data.data.roleName ? res.data.data.roleName : '';
            this.role_id = res.data.data.roleId ? res.data.data.roleId : 0;

            this.appMenu = res.data.data.appMenu.map(item => {
              let isCheckLength = 0;//选中数量
              //判断是否已选
              item.childMenu.forEach(item_child => {
                if (item_child.isChecked) {
                  this.appMenu_selected.push(item_child.menuId);
                  isCheckLength += 1;
                }
              });
              //手动增加全选判断表示
              this.$set(item, 'checkAll', item.childMenu.length === isCheckLength);
              return item;
            });

            this.pcMenu = res.data.data.pcMenu.map(item => {
              let isCheckLength = 0;//选中数量
              //判断是否已选
              item.childMenu.forEach(item_child => {
                if (item_child.isChecked) {
                  this.pcMenu_selected.push(item_child.menuId);
                  isCheckLength += 1;
                }
              });
              //手动增加全选判断表示
              this.$set(item, 'checkAll', item.childMenu.length === isCheckLength);
              return item;
            });

            this.smsTypeList = res.data.data.smsTypeList;
            //判断是否已选
            this.smsTypeList.forEach(item_child => {
              if (item_child.isChecked) {
                this.smsTypeList_selected.push(item_child.id);
              }
            })
          } else {
            this.$message.error(res.data.desc);
          }
        })
      },
      handleCheckAllChange() {

      }
    }
  }
</script>

<style lang="less" scoped>
  .main {
    background-color: #fff;
    overflow: auto;
    padding: 20px;

    .block {
      padding: 10px 0;
      margin-bottom: 20px;
    }
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
