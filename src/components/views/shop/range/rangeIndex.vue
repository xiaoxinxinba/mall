<template>
  <div class="warp_bg" v-loading="loading">
    <div class="box">
      <div class="left">
        <p>已 选 择 经 营 范 围</p>
        <table border="0" cellspacing="0" cellpadding="0">
          <thead>
            <tr>
              <th>一级分类</th>
              <th>二级分类</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in tableDatas" :key="index">
              <td>{{item.parentTitle}}</td>
              <td>{{item.title}}</td>
              <td @click="removeNodes(item)">移除</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="right">
        <div class="search">
          <p>可添加经营范围</p>
          <input type="text" placeholder="请输入搜索内容" v-model="filterText">
          <button class="seaerch_btn" @click="doFilter">查询</button>
        </div>
        <div class="warp_tree">
          <el-tree
            :data="tree"
            show-checkbox
            node-key="id"
            :default-expanded-keys="[1]"
            :default-checked-keys="defaultCheckedKey"
            :filter-node-method="filterNode"
            :props="defaultProps"
            @check-change="getCheckedNodes"
            ref="tree">
          </el-tree>

<!--          <el-button @click="getCheckedNodes">添加</el-button>-->

        </div>
      </div>
    </div>

    <div class="bottom">
      <el-button type="primary" @click="centerDialogVisible = true">提交审核</el-button>
      <el-button type="default" @click="goBack">返回</el-button>
    </div>


    <el-dialog
      title="温馨提示"
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
      <span>变更经营范围后，需提交平台审核通过后方可生效，确定提交经营范围变更吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">确定</el-button>
        <el-button  @click="centerDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
  import shopBusinessScope from '../../../../api/ShopBusinessScope/ShopBusinessScope';
  import businessScope from '../../../../api/ShopBusinessScope/BusinessScope';
  import changeBusinessScope from '../../../../api/ShopBusinessScope/ChangeBusinessScope';
  export default {
    data(){
      return{
        filterText: '',
        tree: [],
        defaultCheckedKey: [],//默认选中的
        tableDatas: [],
        oldData: [],//已有经营范围id
        defaultProps: {
          children: 'childScope',
          label: 'title'
        },
        loading: true,
        centerDialogVisible:false,
      }
    },

    // watch: {
    //   filterText(val) {
    //     this.$refs.tree.filter(val);
    //   }
    // },
    mounted: function (){
      let nowTime = new Date();
      //获取店铺已有经营范围
      shopBusinessScope.call(this,`?input.clientTimespan=${nowTime}`).then(res => {
        if (res.data.code === 1) {
          let tableDatas = [];
          let obj = {};
          //将接口数据转换成需要的数据结构
          for(var parent_index in res.data.data.scopeInfo){
            for(var child_index in res.data.data.scopeInfo[parent_index].childScope){
              this.defaultCheckedKey.push(res.data.data.scopeInfo[parent_index].childScope[child_index].id);
              obj.id = res.data.data.scopeInfo[parent_index].childScope[child_index].id;
              obj.title = res.data.data.scopeInfo[parent_index].childScope[child_index].title;
              obj.parentTitle = res.data.data.scopeInfo[parent_index].title;
              obj.parentId = res.data.data.scopeInfo[parent_index].id;
              tableDatas.push(obj);
              obj = {};

              this.oldData.push(res.data.data.scopeInfo[parent_index].childScope[child_index].id);
            }
          }
          this.tableDatas = tableDatas;
        }else {
          this.$message.error(res.data.desc);
        }
      });
      //获取所有经营范围
      businessScope.call(this,`?input.clientTimespan=${nowTime}`).then(res => {
        if (res.data.code === 1) {
          this.tree = res.data.data;
        }else {
          this.$message.error(res.data.desc);
        }
      })
      this.loading = false
    },

    methods: {
      /*** 搜索筛选 */
      filterNode(value, data) {
        if (!value) return true;
        return data.title.includes(value);
      },

      doFilter(){
        this.$refs.tree.filter(this.filterText);
      },

      /*** 添加按钮 */
      getCheckedNodes() {
        let nodes = this.$refs.tree.getCheckedNodes(false,true);

        let parentNode = [];
        for(var index in nodes){
          if(nodes[index].childScope){
            parentNode.push(nodes[index]);
          }
        }
        let leafNodes = this.$refs.tree.getCheckedNodes(true,true);
        for(var index in leafNodes){
          for(var index_parent in parentNode){
            if(parentNode[index_parent].childScope.includes(leafNodes[index])){
              leafNodes[index].parentId = parentNode[index_parent].id;
              leafNodes[index].parentTitle = parentNode[index_parent].title;
            }
          }
        }
        this.tableDatas = leafNodes;
      },
      /*** 移除 */
      removeNodes(item){
        let checkedKeys = this.$refs.tree.getCheckedKeys(true);
        checkedKeys.splice(checkedKeys.indexOf(item.id),1);
        this.$refs.tree.setCheckedKeys(checkedKeys);
        this.getCheckedNodes();
      },
      /*** 提交 */
      submit(){

        let param = {
          add: [],
          del: [],
          clientTimespan: new Date()
        };
        let leafNodes = this.$refs.tree.getCheckedKeys(true);//选中的节点
        for(var index in this.oldData){
          if(!leafNodes.includes(this.oldData[index])){//没包含就是移除的
            param.del.push(this.oldData[index]);
          }
        }
        for(var index in leafNodes){
          if(!this.oldData.includes(leafNodes[index])){
            param.add.push(leafNodes[index]);
          }
        }
        changeBusinessScope.call(this,param).then(res => {
          if (res.data.code === 1) {
            this.$message.success(res.data.desc);
          }else {
            this.$message.error(res.data.desc);
          }
        })

        this.centerDialogVisible=false;
      },
      goBack(){
        this.$router.push({name:"RangeMain"})
      }
    },
  }
</script>

<style lang="less" type="text/less" scoped>

  .warp_bg{
    background: #fff;
    .box{
      width: 1200px;
      height: auto;
      position: relative;
      background: #ececec;
      padding: 20px;
      box-sizing: border-box;
      margin: 0 auto;
      .left{
        width: 540px;
        height: 600px;
        overflow: auto;
        background: #fff;
        float: left;
        p{
          width: 100%;
          height: 39px;
          line-height: 39px;
          color: #fff;
          font-size: 16px;
          padding: 0 20px;
          box-sizing: border-box;
          background-image: url("./img/pic1.jpg");
        }
        table{
          width: 100%;
          height: auto;
          border-collapse: collapse;
          thead{
            width: 100%;
            height: auto;
            tr{
              width: 100%;
              height: auto;
              th{
                width: 33.33333%;
                height: 40px;
                font-size: 14px;
                color: #333333;
                background: #f5f5f5;
                border: 1px #e5e5e5 solid;
                text-align: center;
              }
            }
          }
          tbody{
            width: 100%;
            height: auto;
            tr{
              width: 100%;
              height: auto;
              td{
                width: 33.333%;
                height: 40px;
                text-align: center;
                background: #fff;
                border: 1px #e5e5e5 solid;
                &:nth-child(3n){
                  color: #00a2ff;
                  cursor: pointer;
                }
              }
            }
          }
        }
      }
      .right{
        width: 590px;
        height: 600px;
        overflow: auto;
        float: right;
        background: #fff;
        .search{
          width: 100%;
          height: 40px;
          padding: 0 20px;
          box-sizing: border-box;
          background-image: url("./img/pic1.jpg");
          background-size: 100% 100%;
          p{
            font-size: 14px;
            color: #fff;
            line-height: 40px;
            margin-right: 60px;
            display: inline-block;
          }
          input{
            width: 290px;
            height: 25px;
            background: #fff;
            border-radius: 12.5px;
            border: none;
            text-indent: 5px;
            font-size: 14px;
            margin-right: 10px;
          }
          button{
            width: 65px;
            height: 25px;
            background: #ff6600;
            line-height: 25px;
            color: #fff;
            font-size: 12px;
            border: none;
            border-radius: 3px;
            cursor: pointer;
          }
        }
        .warp_tree{
          padding: 20px;
        }
      }
      &:after{
        clear: both;
        content: '';
        display: block;
      }
    }
    .bottom {
      padding: 20px 30px;
    }
  }

</style>
