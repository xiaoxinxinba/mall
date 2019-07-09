<template>
  <div class="sysMessage_box">
    <div class="menu">
      <span v-for="item in menuData" :class="menuType === item.type ? 'on' : ''" @click="menuChange(item.type)">{{item.name}} <i
        v-if="item.num > 0"> ( {{item.num}} ) </i></span>
    </div>

    <div class="opera">
      <label><el-checkbox v-model="selectFlag">全选</el-checkbox></label>
      <el-select v-model="value" placeholder="请选择">
        <el-option
          v-for="item in stateOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>

      <el-button type="default" class="margin_10" @click="deleteByIds">删除</el-button>

      <span class="opera_span">站内信息保存时间为3个月，系统会自动删除过期信件。</span>
    </div>

    <div class="list">
      <div class="box" v-for="item in listData">
        <div class="left">
          <!--<div>123</div>-->
          <el-checkbox v-model="item.flag" @change="select(item)"></el-checkbox>
        </div>
        <div class="right">
          <h3>
            {{item.title}}
            <span>
              {{item.time}}
              <small class="close_icon" @click="deleteById(item)"></small>
            </span>
          </h3>
          <p>{{item.content}}</p>
          <a href="javascript: void(0);" @click="goDetail(item.url)">查看详情 >></a>
        </div>
      </div>

      <!--页码开始-->
      <div class="page">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 20, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="recordCount">
        </el-pagination>
      </div>
      <!--页码结束-->
    </div>

  </div>
</template>

<script>
  import CategoryList from '../../../api/system_message/CategoryList';
  import MessageList from '../../../api/system_message/MessageList';
  import MessageDelete from '../../../api/system_message/MessageDelete';

  export default {
    data() {
      return {
        selectFlag:false,
        ids:[],
        menuType: 0,
        menuData: [{
          name: '全部信件',
          type: 0,
          num: 0,
        }/*, {
          name: '审核回执',
          type: '1',
          num: 0
        }, {
          name: '交易提醒',
          type: '2',
          num: 0
        }, {
          name: '售后提醒',
          type: '3',
          num: 15
        }, {
          name: '商品提醒',
          type: '4',
          num: 0
        }, {
          name: '纠纷提醒',
          type: '5',
          num: 0
        }, {
          name: '其他',
          type: '6',
          num: 0
        }, {
          name: '资金提醒',
          type: '7',
          num: 0
        }, {
          name: '平台通知',
          type: '8',
          num: 0
        }*/],

        stateOptions: [{
          value: 2,
          label: '已读'
        }, {
          value: 1,
          label: '未读'
        }, {
          value: 0,
          label: '全部'
        }],
        value: 0,

        listData: [{
          flag:false,
          id: 1,
          title: '新订单接单',
          time: '2019-05-10 12:12:11',
          content: '亲!您所发布的XX，因【】未审核通过，请修改后重新申请发布，若有疑问请致电400-6766-999咨询，谢谢！亲!您所发布的XX，因【】未审核通过，请修改后重新申请发布，若有疑问请致电400-6766-999咨询！',
        }/*, {
          id: 2,
          title: '新订单接单',
          time: '2019-05-10 12:12:11',
          content: '亲!您所发布的XX，因【】未审核通过，请修改后重新申请发布，若有疑问请致电400-6766-999咨询，谢谢！亲!您所发布的XX，因【】未审核通过，请修改后重新申请发布，若有疑问请致电400-6766-999咨询！',
        }, {
          id: 3,
          title: '新订单接单',
          time: '2019-05-10 12:12:11',
          content: '亲!您所发布的XX，因【】未审核通过，请修改后重新申请发布，若有疑问请致电400-6766-999咨询，谢谢！亲!您所发布的XX，因【】未审核通过，请修改后重新申请发布，若有疑问请致电400-6766-999咨询！',
        }*/],
        currentPage: 1,
        pageSize: 10,
        recordCount: 400,
        clientVersion: '1',
        clientTimespan: new Date().toLocaleString(),
      }
    },
    watch:{
      value:function (val) {
        this.categoryList();
      },
      //监听全选框变化，改变列表复选框状态
      selectFlag:function (ids1, ids2) {
        if (ids1){
          this.selectAll();
          for (let i = 0; i < this.listData.length; i++) {
            this.listData[i].flag=true;
          }
        }else {
          for (let i = 0; i < this.listData.length; i++) {
            this.listData[i].flag=false;
          }
          console.log("执行了清除全部操作");
          this.ids=[];
        }

      }
    },
    methods: {
      //根据全选添加到ids
      selectAll(){
        for (let i = 0; i <this.listData.length; i++) {
          if (this.ids.indexOf(this.listData[i].id)===-1) {
            this.ids.push(this.listData[i].id);
          }
        }
      },

      //根据列表复选框变化ids
      select(e){
        if (e.flag){
          if (this.ids.indexOf(e.id)===-1) {
            this.ids.push(e.id);
          }
        } else {
          if (this.ids.indexOf(e.id)!==-1){
            let index = this.ids.indexOf(e.id);
            this.ids.splice(index,1);
          }
        }
      },

      //删除根据复选框
      deleteByIds(){
        MessageDelete.call(this,{
          messageIds:JSON.parse(this.ids),
          sendTo:1,
          clientVersion:this.clientVersion,
          clientTimespan:this.clientTimespan,
        }).then(
          res=>{
            if (res.data.code===1){
              alert("删除成功");
              this.categoryList();
              this.selectFlag=false;
            }
          }
        )
      },
      //删除根据图标
      deleteById(t){
        MessageDelete.call(this,{
          messageIds:JSON.parse(t.id),
          sendTo:1,
          clientVersion:this.clientVersion,
          clientTimespan:this.clientTimespan,
        }).then(
          res=>{
            if (res.data.code===1){
              console.log("已删除该条信息");
              this.categoryList();
            }
          }
        )
      },
      /**
       * 菜单切换事件
       */
      menuChange(type) {
        this.menuType = type;
        this.categoryList();
      },
      //查分类
      messageList() {
          MessageList.call(this, '?input.clientVersion=' + this.clientVersion + '&input.clientTimespan=' + this.clientTimespan)
          .then(
            res => {
              if (res.data.code === 1) {
                //this.menuData = res.data.data;
                var d = res.data.data;
                for(let i = 0; i < d.length; i++){
                  let o = {};
                  o.name = d[i].title;
                  o.type = d[i].categoryId;
                  o.num = d[i].count;
                  //o.url  = d[i].url ;
                  this.menuData.push(o);
                }
              }
            }
          )
      },
      //查列表
      categoryList() {
        CategoryList.call(this, '?clientVersion=' + this.clientVersion + '&clientTimespan=' + this.clientTimespan + '&isRead='
          + this.value + '&category=' + this.menuType + '&pageIndex=' + this.currentPage + '&pageSize=' + this.pageSize)
          .then(
            res => {

              if (res.data.code === 1) {
                this.listData=[];
                this.currentPage = res.data.data.pageIndex;
                this.pageSize = res.data.data.pageSize;
                this.recordCount = res.data.data.recordCount;
                let a = res.data.data.data;

                for(let i = 0; i < a.length; i++){
                  let o = {};
                  o.id = a[i].messageId ;
                  o.title = a[i].title ;
                  o.content = a[i].content ;
                  o.time = a[i].time ;
                  o.url  = a[i].url  ;
                  o.flag=false;
                  this.listData.push(o);
                }
              }
            }
          )
      },

      /**
       * 分页方法
       * @param val
       */
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pageSize=val;
        this.categoryList();
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage=val;
        this.categoryList();
      },

      /**
       * 跳转到系统消息详情?
       * 跳到指定地址
       */

      goDetail(url) {
        //this.$router.push({name: 'SysMessageDetail',query:id});
       // console.log(id+'-----------------------------------');
        let pre = window.location.href.split('/sysMessage')[0];
        //alert(pre);
        if (url !== '' && url != null) {
          window.open(pre+url);
        }else {
          return this.$message.error('信息为空');
        }
      },

    },
    created() {
      this.categoryList();
      this.messageList()
    },

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "./less/style.less";
</style>


