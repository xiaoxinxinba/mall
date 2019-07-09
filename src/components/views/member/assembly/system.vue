<template>
    <div class="system">
      <ul class="box">
          <li style="background:#f19393" @click="member" title="点击查看全部会员">
               店铺会员
              <div class="font">
                 {{userCount}}
              </div> 
          </li>
            <li style="background:#86c9ca">
               今日新增
              <div class="font">
                 {{todayUserCount}}
              </div> 
          </li>
            <li style="background:#fcbe82">
               今日成交额
              <div class="font">
                {{tradingVolume.toFixed(2)}}
              </div> 
          </li>
            <li style="background:#67a2e5">
               近七天生日人数
              <div class="font">
                 {{birthdayCount}}
              </div> 
          </li>
      </ul>
      <div id="addmember" v-if="showDiv">
         <div class="touxiang">
           <img src="../img/xiatian.jpg" alt="" style="width:70px;height:70px;">
         </div>
         <div class="text">
        <p>店铺会员设置<span style="color:red;marginLeft:30px;">未开通</span></p> 
         设置您的会员规则、会员等级，及各等级会员对应信息。开启店铺会员功能后，店铺首页将展示【店铺会员】模块。
         </div>
         <div class="right">
           <el-button @click="open">开通店铺会员</el-button>
         </div>
      </div>
      <div id="modify" v-if="showdiv">
        <div class="touxiang">
           <img src="../img/xiatian.jpg" alt="" style="width:70px;height:70px;">
         </div>
         <div class="text">
       <p>店铺会员设置<span style="color:green;marginLeft:30px;">已完成</span></p> 
       <p>设置您的会员规则、会员等级，及各等级会员对应信息。</p>
       <p style="color:green;">●店铺已开通会员充值功能</p>
        </div>
        <div class="right">
        <el-button @click="modify">修改设置</el-button>
        </div>
      </div>
    </div>
</template>

<script>
  import System from '../../../../api/Member/System';
export default {
  data(){
      return {
        status:0,//是否开通会员 0否 1是
        userCount:0,//会员数量
        yesterdayUserCount:0,//昨日会员数量
        todayUserCount:0,//今日会员数据
        tradingVolume:0,//交易金额
        birthdayCount:0,//生日人数
        clientVersion: 1,
        clientTimespan: new Date().toLocaleString(),
        showDiv:false,
        showdiv:false,
      }
  },
  methods: {
    //获取店铺会员信息
    getMemberInfo(){
      System.call(this,'?clientVersion=' + this.clientVersion + '&clientTimespan=' + this.clientTimespan)
        .then(
          res=>{
              console.log(res)
            if (res.data.code === 1) {
                this.status=res.data.data.status;
                this.userCount=res.data.data.userCount;
                // this.yesterdayUserCount=res.data.data.yesterdayUserCount;
                this.todayUserCount=res.data.data.todayUserCount;
                this.tradingVolume=res.data.data.tradingVolume;
                this.birthdayCount=res.data.data.birthdayCount;
            }
            // console.log(this.status)
            if(this.status===1){
                  this.showdiv = true
            }else{
                this.showDiv = true
            }
          }
        )
        .catch(err=>{
           
        })
    },
      open(){
        this.$router.push({name:'addmember'})
      },
      modify(){
     this.$router.push({name:"setup"})
      },
      member(){
    this.$router.push({name:"shopmember"})
      },
  },
  created(){
    this.getMemberInfo();
  },
  mounted() {
  
  },
}
</script>

<style lang="less">
.system{
    margin-top: 20px;
    .box{
        display: flex;
        li{
            height: 69px;
            width: 158px;
            background: #ff6600;
            margin-right: 20px;
            border-radius: 10px;
            font-size:16px;
            color:#fff;
            text-align:center;
            .font{
                font-size:16px;
                color:#fff;
                margin-top:10px;
                font-weight:bolder;
            }
        } 
        li:nth-of-type(1){
            &:hover{
                cursor: pointer;
            }
        }
    }
    #addmember{
        width: 100%;
        height: 200px;
        background: rgb(241, 239, 239);
        margin-top: 20px;
        display: flex;
        position: relative;
        .touxiang{
           img{
               margin-top: 70px;
               margin-left: 70px;
           }
        }
        .text{
            margin-top: 70px;
            margin-left: 40px;
            font-size: 14px;
        }
        .right{
            position: absolute;
            right: 30px;
            top: 40%;
        }
    }
    #modify{
        width: 100%;
        height: 200px;
        background: rgb(241, 239, 239);
        margin-top: 20px;
        display: flex;
        position: relative;
        .touxiang{
           img{
               margin-top: 70px;
               margin-left: 70px;
           }
        }
        .text{
            margin-top: 70px;
            margin-left: 40px;
            font-size: 14px;
        }
        .right{
            position: absolute;
            right: 30px;
            top: 40%;
        }
    }
}

</style>
