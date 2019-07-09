<template>
  <div class="incrementService_box">
    <div class="table">
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          fixed
          label="增值服务类型"
          align="center"
          width="280">
          <template slot-scope="scope">
            <div class="table_type" :class="scope.row.node === 1 ? 'msg_icon' : 'phone_icon'">
              <p>{{scope.row.type}}</p>
              <p>{{scope.row.typeCont}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="通知节点"
          width="400">
          <template slot-scope="scope">
            <div class="table_node" v-if="scope.row.node === 1">
              <!--短信节点信息-->
              <p v-for="node in nodes"><span>{{node.title}}：</span> <span v-for="snode in node.children">{{snode.title}}；</span></p>
              <!--<p><span>账户：</span> 关闭店铺</p>
              <p><span>财务：</span> 提现申请；银行卡；纠纷冻结</p>-->
            </div>
            <div v-if="scope.row.node === 2">
              —
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="价格">
          <template slot-scope="scope">
            <div class="table_price">
              <div v-if="scope.row.node === 1">
                <p v-for="price in priceInfo"><span>{{price.money}}</span> 元/{{price.number}}条</p>
                <!--<p><span>89</span> 元/1000条</p>
                <p><span>800</span> 元/10000条</p>-->
              </div>

              <div v-if="scope.row.node === 2">
                <p><span>10</span> 元/100分钟</p>
                <p><span>90</span> 元/1000分钟</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="状态">
          <template slot-scope="scope">
            <div class="table_state" :class="scope.row.state === 1 ? 'pass' : ''">
              {{scope.row.state === 1 ? '已购买' : '未购买'}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          width="200">
          <template slot-scope="scope">
            <el-button v-if="scope.row.state === 1" type="primary" size="small" @click="renewVisible = true">续费
            </el-button>
            <el-button v-if="scope.row.state === 0" type="primary" size="small" @click="buyNowVisible = true">立即购买
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="box">
      <div class="top">
        <span>短信发送节点 <small class="help_icon" @click="explainVisible = true"></small></span>
        <span class="tips"><i class="<!--el-icon-warning-->"></i><!-- 暂未勾选任何发送节点--></span>
      </div>

      <div class="content">
        <div class="left" v-for="(item, i) in nodeData">
          <h3>{{item.title}}</h3>
          <template v-for="(cItem, index) in item.children">
            <p :class="cItem.isSelect===0 ? 'on' : ''"><i :class="cItem.isSelect===0?'el-icon-success':''" ></i> <span>{{index+1}}</span> {{cItem.title}}</p>
            <p class="color_666"><i></i> <span></span> {{cItem.desc}}</p>
          </template>

          <!--<p class="on"><i class="el-icon-success"></i> <span>2</span> 提醒发货</p>
          <p class="color_666"><i></i> <span></span> 接单后超过24小时未发货</p>

          <p class="on"><i class="el-icon-success"></i> <span>3</span> 取消订单</p>
          <p class="color_666"><i></i> <span></span> 买家取消已付款订单</p>

          <p><i></i> <span>4</span> 申请退款</p>
          <p class="color_666"><i></i> <span></span> 买家提交退款申请</p>

          <p><i></i> <span>5</span> 确认收货</p>
          <p class="color_666"><i></i> <span></span> 买家点击确认收货</p>-->
        </div>

        <!--<div class="left">
          <h3>账户</h3>
          <p class="on"><i class="el-icon-success"></i> <span>1</span> 关闭店铺</p>
          <p class="color_666"><i></i> <span></span> 提交关店申请</p>
        </div>

        <div class="left">
          <h3>财务</h3>
          <p class="on"><i class="el-icon-success"></i> <span>1</span> 申请提现</p>
          <p class="color_666"><i></i> <span></span> 提现申请及提现状态变动</p>

          <p class="on"><i class="el-icon-success"></i> <span>1</span> 纠纷冻结</p>
          <p class="color_666"><i></i> <span></span> 银行卡更改成功或银行卡信息错误</p>

          <p class="on"><i class="el-icon-success"></i> <span>1</span> 转账</p>
          <p class="color_666"><i></i> <span></span> 转账给用户</p>
        </div>-->

        <div class="left_btn">
          <div>
            <el-button type="primary" size="small" @click="msgNodeVisible = true">编辑</el-button>
          </div>
        </div>
      </div>
    </div>

    <div class="box">
      <div class="top">
        <span>短信申请情况</span>
      </div>

      <div class="box_table">
        <p>剩余短信条数：<span>{{residueNumber}}条</span></p>
        <el-table
          :data="msgData"
          style="width: 60%">
          <el-table-column
            prop="number"
            label="购买条数"
            align="center">
          </el-table-column>
          <el-table-column
            prop="time"
            label="购买日期"
            align="center">
          </el-table-column>
          <el-table-column
            prop="money"
            align="center"
            label="价格(元)">
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!--短信发送节点弹框 start-->
    <el-dialog
      title="短信发送节点"
      :visible.sync="msgNodeVisible"
      width="500px">
      <div class="msg_dialog">
        <ul>
          <li v-for="(node,nIndex) in nodeData">
            <div class="left">
              <small class="trade_icon"></small>
              <span>{{node.title}}</span>
            </div>
            <div class="right">
              <span v-for="(ch,index) in node.children" :class="ch.isSelect===0?'on':''" @click="isSelected(index,nIndex)">{{ch.title}}</span>
              <!--<span>发货</span>
              <span>取消订单</span>
              <span>申请退款</span>
              <span>确认收货</span>-->
            </div>
          </li>

          <!--<li>
            <div class="left">
              <small class="count_icon"></small>
              <span>账户</span>
            </div>
            <div class="right">
              <span>关闭店铺</span>
              <span>活动发布提醒</span>
            </div>
          </li>

          <li>
            <div class="left">
              <small class="finance_icon"></small>
              <span>财务</span>
            </div>
            <div class="right">
              <span class="on">申请提现</span>
              <span>银行卡</span>
              <span>纠纷冻结</span>
              <span class="disabled">转账</span>
            </div>
          </li>-->
        </ul>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="msgNodeVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSmsNode()">确 定</el-button>
      </span>
    </el-dialog>
    <!--短信发送节点弹框 end-->

    <!--续费弹框 start-->
    <el-dialog
      title="短信发送节点"
      :visible.sync="renewVisible"
      width="500px">
      <div>短信剩余条数为 {{residueNumber}}<span v-if="residueNumber<100">， 请续费</span></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="renewVisible = false">取 消</el-button>
        <el-button type="primary" @click="renew">确 定</el-button>
      </span>
    </el-dialog>
    <!--续费弹框 end-->

    <!--立即购买弹框 start-->
    <el-dialog
      title="购买"
      :visible.sync="buyNowVisible"
      width="500px">
      <div class="buyNow_box">
        <span v-for="price in priceInfo"><el-radio v-model="radio" :label="price.setMealId"><i>{{price.number}} 条</i> {{price.money}}元</el-radio></span>
        <!--<span><el-radio v-model="radio" label="2"><i>1000 条</i> 100.00元</el-radio></span>
        <span><el-radio v-model="radio" label="3"><i>1000 条</i> 100.00元</el-radio></span>-->
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="buyNowVisible = false">取 消</el-button>
        <el-button type="primary" @click="buyNow">确 定</el-button>
      </span>
    </el-dialog>
    <!--立即购买弹框 end-->

    <!--增值服务说明弹框 start-->
    <el-dialog
      title="增值服务说明"
      :visible.sync="explainVisible"
      width="500px">
      <div class="explain_box">
        <p>1、短信提醒由商家主动自愿申请</p>
        <p>2、谁受益谁申请，谁受益谁承担</p>
        <p>3、满集网平台限量赠送短信服务</p>
        <p>4、短信由平台代通信运营商代</p>
        <p>5、全国统一服务热线：400-6766-999</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="explainVisible = false" >确 定</el-button>
      </span>
    </el-dialog>
    <!--增值服务说明弹框 end-->
  </div>
</template>

<script>
  import GetSmsInfo from '../../../api/added_service/GetSmsInfo';
  import BuySms from '../../../api/added_service/BuySms';
  import EditSmsNode from '../../../api/added_service/EditSmsNode';

  export default {
    data() {
      return {
        msgNodeVisible: false, // 短信发送节点弹框是否显示
        renewVisible: false, // 续费弹框是否显示
        buyNowVisible: false, // 立即购买弹框是否显示
        explainVisible: false, // 增值服务说明弹框是否显示
        tableData: [{
          type: '短信',
          typeCont: '可勾选不同节点接收短信通知',
          node: 1,
          state: 0,//是否购买 0未购买 1已购买 ,
        }, // {
          //   type: '电话通知',
          //   typeCont: '未接单电话通知',
          //   node: 2,
          //   state: 1,
          // }
        ],

        msgData: [/*{
          count: '1000条',
          time: '2016-05-04',
          price: '100.00',
        }, {
          count: '1000条',
          time: '2016-05-04',
          price: '100.00',
        }, {
          count: '1000条',
          time: '2016-05-04',
          price: '100.00',
        }, {
          count: '1000条',
          time: '2016-05-04',
          price: '100.00',
        }*/],
        radio: 1,//立即购买默认选中款
        clientVersion: 1,
        clientTimespan: this.$Tool.formatDate(new Date()),
        residueNumber: 0,//短信剩余条数
        /*smsLog: { 这条信息对应msgData
          //短信购买日志
          number: 0,//购买条数
          time: '',//购买日期
          money: '',//价格
        },*/
        nodes: [],
        priceInfo: [/*{
          //价格信息
          setMealId: 0,//套餐id
          money: 0,//短信价格
          number: 0,//短信条数
        },*/],
        nodeData: [{
          mbId: 0,
          title: "交易",
          desc: "string",
          type: 0,
          isSelect: 0,
          children: [
            {
              sort: 1,
              title: '提醒接单',
              desc: '买家支付成功',
              isSelect: 0,
            }, {
              sort: 2,
              title: '提醒发货',
              desc: '接单后超过24小时未发货',
              isSelect: 1,
            }, {
              sort: 3,
              title: '取消订单',
              desc: '买家取消已付款订单',
              isSelect: 0,
            }, {
              sort: 4,
              title: '申请退款',
              desc: '买家提交退款申请',
              isSelect: 1,
            }, {
              sort: 5,
              title: '确认收货',
              desc: '买家点击确认收货',
              isSelect: 0,
            }
          ]
        }, {
          mbId: 1,
          title: "账户",
          desc: "string",
          type: 0,
          isSelect: 0,
          children: [
            {
              sort: 1,
              title: '关闭店铺',
              desc: '提交关店申请',
              isSelect: 0,
            },
            {
              sort: 2,
              title: '活动发布提醒',
              desc: '开启/关闭活动发布短信提醒',
              isSelect: 0,
            }
          ]
        }, {
          mbId: 2,
          title: "财务",
          desc: "string",
          type: 0,
          isSelect: 0,
          children: [
            {
              sort: 1,
              title: '申请提现',
              desc: '提现申请及提现状态变动',
              isSelect: 0,
            }, {
              sort: 2,
              title: '纠纷冻结',
              desc: '账户异常、账户冻结',
              isSelect: 0,
            }
          ]
        }],  // 短信发送节点
      }
    },
    methods: {
      //获取信息
      getSmsInfo() {
        GetSmsInfo.call(this, '?clientVersion=' + this.clientVersion + '&clientTimespan=' + this.clientTimespan)
          .then(
            res => {
              if (res.data.code === 1) {
                this.tableData[0].state=res.data.data.state;
                this.residueNumber=res.data.data.residueNumber;
                //console.log(res.data.data);
                this.getNodes(res.data.data.nodes);
                this.getPriceInfo(res.data.data.priceInfo);
                this.getSmsLog(res.data.data.smsLog);
              }
            }
          )
      },
      //导入短信节点信息
      getNodes(node){
        this.nodes=[];
        for (let i = 0; i < node.length; i++) {
          let res_children=node[i].children;
          let _children = [];
          if (res_children.length > 0) {
          for (let j = 0; j < res_children.length; j++) {
            _children.push({
              mbId:res_children[j].mbId,
              title:res_children[j].title,
              desc:res_children[j].desc,
              type:res_children[j].type,
              isSelect:res_children[j].isSelect,
            });
            this.nodeData[i].children[j].isSelect=res_children[j].isSelect;
          }
          }
          let res_node = {
            mbId: node[i].mbId,
            title: node[i].title,
            desc: node[i].desc,
            type: node[i].type,
            isSelect: node[i].isSelect,
            children:_children,
          };
          this.nodes.push(res_node);
        }
      },
      //导入价格信息
      getPriceInfo(priceInfo){
        this.priceInfo=[];
        for (let i = 0; i < priceInfo.length; i++) {
          this.priceInfo.push({
            money:priceInfo[i].money,
            number:priceInfo[i].number,
            setMealId:priceInfo[i].setMealId,
          })
        }
      },
      //短信申请记录
      getSmsLog(smsLog){
        this.msgData=[];
        for (let i = 0; i < smsLog.length; i++) {
          this.msgData.push({
            money:smsLog[i].money,
            number:smsLog[i].number,
            time:smsLog[i].time,
          })
        }
      },
      //判断短信套餐
      isPackage(str,arr){
        for (let i = 0; i < arr.length; i++) {
          if (this.radio === arr[i].setMealId) {
            console.log(arr[i]);
            this.buySms(arr[i].setMealId, arr[i].number, arr[i].money);
            break;
          }
        }
      },
      //购买短信
      buySms(setMealId,number,money){
        BuySms.call(this,{
          clientVersion: 1,
          clientTimespan: this.$Tool.formatDate(new Date()),
          setMealId:setMealId,
          number:number,
          money:money,
        }).then(
          res=>{
            if (res.data.code===1){
              console.log('购买短信返回信息',res.data.data);
              /*
              * 开发：http://192.168.0.48:8044/
                测试：http://192.168.0.177:8044/
                预发布：http://prezuul.manjiwang.com/
                正式：http://uipay.manjiwang.com/
                /CommonTools.ashx?clientType=&sessionId=&queryNo=&returnUrl=&backUrl=

                clientType：展示方式 wap 或者 pc
                sessionId：当前用户会话ID
                queryNo：  收银台单号
                returnUrl：账户扣款成功后的跳转地址，各业务端需要在这个地址里面判断自己的业务状态是成功或者是异常，使用js的escape函数编码
                backUrl：  支付途中取消支付或者在收银台点击返回时跳转的地址，使用js的escape函数编码
                           escape不会编码字母数字还有常用字符
              * */
              let url=window.location.href;
              let queryNo=res.data.data.payOrderNo;
              let sessionId=res.data.data.sessionId;
              this.$message.success('下单成功');
              let payUrl = this.$store.state.api.payUrl;
              //console.log('即将跳转的地址', payUrl);
               window.open(payUrl + '/CommonTools.ashx?clientType=pc&sessionId='+sessionId+'&queryNo='+queryNo+'&returnUrl='+url+'&backUrl='+url+'');
              //console.log('跳转地址',payUrl + '/CommonTools.ashx?clientType=pc&sessionId=' + sessionId + '&queryNo=' + queryNo + '&returnUrl=' + url + '&backUrl=' + url + '');
            }else {
              this.$message.error('购买失败');
            }
          }
        )
      },
      //选中切换方法
      isSelected(index,nIndex){
        let num = this.nodeData[nIndex].children[index].isSelect;
        if (num === 1) {
          this.nodeData[nIndex].children[index].isSelect=0;
          this.nodes[nIndex].children[index].isSelect=0;
        }else {
          this.nodeData[nIndex].children[index].isSelect=1;
          this.nodes[nIndex].children[index].isSelect=1;
        }
      },
      //修改短信节点
      editSmsNode(){
        this.msgNodeVisible = false;
        let model={
          nodes:this.nodes,
        clientVersion:this.clientVersion,
        clientTimespan:this.clientTimespan,
        };
        EditSmsNode.call(this,model)
          .then(
            res=>{
              if (res.data.code===1){
                this.$message.success('修改节点成功');
                this.getSmsInfo();
              }else {
                this.$message.error('修改失败'+res.data.desc)
              }
            }
          )
      },

      //续费弹窗
      renew(){
        this.renewVisible = false;
        this.buyNowVisible = true;
      },

      //立即购买短信
      buyNow(){
        this.isPackage(this.radio, this.priceInfo);
        this.buyNowVisible = false;
      },
    },

      /*watch:{
        buyNowVisible:function (nb, ob) {
          if (!nb) {

          }
        }
      },*/
    created() {
      this.getSmsInfo();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import './less/style.less';
</style>
