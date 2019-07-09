<template>
  <!-- 咨询管理 -->
  <div class="zhiXunGuanLi" v-loading="!friendList.length">
    <div class="box_left">
      <search></search>
      <ul>
        <li v-for="(item, index) of friendList" :key="index">
          <img :src="userValue(item.SnsProfileItem, 'Tag_Profile_IM_Image')"/>
          <span>{{userValue(item.SnsProfileItem, 'Tag_Profile_IM_Nick')}}</span>
        </li>
      </ul>
    </div>
    <div class="box_main">
      <div class="chat_title"></div>
      <div class="chat_message">
        <el-scrollbar style='height:490px;'>
        <ul>
          <li v-for="(item, index) of chatList" :key="index">
            <p><span>{{$Tool.formatDate(item.time*1000, 'YYYY年MM月DD hh:mm')}}</span></p>
            <div :class="infoFace(item.id)">
              <img class="header" :src="item.id === identifier ? loginInfo.headurl : userValue(item.SnsProfileItem, 'Tag_Profile_IM_Image')">
              <span>
                <img v-if="item.img" :src="item.img" class="img">
                {{item.text}}
              </span>
            </div>
          </li>
        </ul>
        </el-scrollbar>
      </div>
      <div class="chat_edit">
        <div class="edit_oper clearfix">
          <!-- <div class="edit_expression">
            <i @click="$message.warning('对不起，此功能暂未开放')"></i>
          </div> -->
          <div class="edit_picture">
            <i @click="dialogVisible = true"><img src="./img/picture.png"></i>
          </div>
        </div>
        <div class="edit_txt">
          <textarea class="edit_textarea" v-model="myMessage" @keyup.enter.exact="toSend('Enter')" @keyup.ctrl.enter.exact="toSend('Ctrl+Enter')"></textarea>
        </div>
        <div class="edit_ent">
          <el-dropdown size="mini" split-button @click="toSend('')" @command="handleCommand">
            发送
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command = "Enter">
                <i :class="command === 'Enter' ? 'el-icon-check' : 'el-icon-circle-check-outline'"></i>按Eenter键发送消息
              </el-dropdown-item>
              <el-dropdown-item command = "Ctrl+Enter">
                <i :class="command === 'Ctrl+Enter' ? 'el-icon-check' : 'el-icon-circle-check-outline'"></i>按Ctrl+Eenter键发送消息
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
     <div class="box_right">
      <tab @setTabData="getTabData"></tab>
    </div>
    <el-dialog
      title="发送图片"
      :visible.sync="dialogVisible"
      width="30%">
      <ul class="window">
        <li>
          <span>选择</span>
          <el-button size="small" type="primary"><label for="file">点击上传</label></el-button>
				  <input type="file" accept="image/png, image/jpeg, image/gif, image/jpg" style="display:none" id="file" name="file" @change="changepic"/>
        </li>
        <li>
          <span>预览</span>
          <img style="verticalAlign:top" :src="imgUrl">
        </li>
        <li>
          <span>进度</span>
          <div class="progress">
            <el-progress :text-inside="true" :stroke-width="18" :percentage="progress" status="success"></el-progress>
          </div>
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="sendImg">发 送</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import search from "./zhiXunGuanLi/search";
import tab from "./zhiXunGuanLi/tab";
import GetPlatfromAccount from '@/api/Txy/GetPlatfromAccount';
import GetChatAcctount from '@/api/Txy/GetChatAcctount';

export default {
  name: "zhiXunGuanLi",
  components: {
    search,
    tab
  },
  data() {
    return {
      identifier: '',
      userSig: '',
      custIdentifier: '',       //动态客服用户账户
      friendList: [],           //好友列表
      chatList: [],             //聊天列表
      dialogVisible: false,     //上传图片弹框
      command: 'Enter',         //发送方式
      myMessage: '',            //我将要发送的消息
      imgUrl: '',               //我将要发送的图片
      progress: 0,              //图片上传进度条
      imgObj: {},               //腾讯云上传图片后返回的格式 用来发送
      isSend:true,              //是否为自己发送
	    seq:-1,                   //消息序列，-1表示sdk自动生成，用于去重
    };
  },
  computed: {
    loginInfo() {  //当前用户身份
      return  {
        sdkAppID: 1400065004, //用户所属应用id,必填
        identifier: this.identifier, //当前用户ID,必须是否字符串类型，必填
        accountType: 22165, //用户所属应用帐号类型，必填
        userSig: this.userSig, //当前用户身份凭证，必须是字符串类型，必填
        identifierNick: this.$store.state.account.storeName, //当前用户昵称，不用填写，登录接口会返回用户的昵称，如果没有设置，则返回用户的id
        headurl: this.$store.state.account.pcLogo //当前用户默认头像，选填，如果设置过头像，则可以通过拉取个人资料接口来得到头像信息
      }
    },
    selSess() {   // 聊天对象
      return new webim.Session('C2C', this.identifier, this.$store.state.account.storeName, this.$store.state.account.pcLogo, Math.round(new Date().getTime() / 1000))
    },
    infoFace() {   //根据用户id判断当前消息是靠左还是靠右
      return function (id) {
        if (id === this.identifier) {
          return 'right'
        } else if (id === this.custIdentifier) {
          return 'left'
        }
      }
    },
    userValue() {   //动态显示好友列表的图片 名字
      return function(arr, Tag) {
        const obj = arr.find(res => res.Tag === Tag)
        return obj.Value
      }
    },
  },
  async created() {
    const resArr = await this.getChatInfo()   //获取到两个接口返回的数据组成的数组
    const obj1 = resArr[0].data
    const obj2 = resArr[1].data
    if (obj1.code !== 1 || obj2.code !== 1) {
      this.$message.error(obj1.desc || obj2.desc)
      return false
    }
    const { qc_account, qc_sign } = obj1.data
    this.identifier = qc_account
    this.userSig = qc_sign
    this.custIdentifier = obj2.data
    this.login()  //去登录webSDK
  },
  methods: {
    handleCommand(command) {    // 切换发送方式
      this.command = command
      this.$message.success('成功：设置发送方式为' + command)
    },
    getTabData(val) {
      this.myMessage = val
    },
    toSend(type) {   //发送消息
      if (type && (type !== this.command)) {   //为设置的发送方式才行
        return false
      }
      if (this.myMessage) {
        let random = Math.round(Math.random() * 4294967296);   //消息随机数，用于去重
        let msgTime = Math.round(new Date().getTime() / 1000); //消息时间戳
        let msg = new webim.Msg(this.selSess, this.isSend, this.seq, random, msgTime, this.identifier, 0, this.loginInfo.identifierNick);
        let text_obj = new webim.Msg.Elem.Text(this.myMessage);
        msg.addText(text_obj);
        msg.sending = 1;
        msg.originContent = this.myMessage;
        webim.sendMsg(msg, (resp) => {   //发送成功
          console.log(resp)
          this.chatList.push({
            id: this.identifier,
            text: this.myMessage,
            time: resp.MsgTime
          })
          this.myMessage = ''
        }, function(err) {
          console.log(err)
        })
      } else {
        this.$message.warning('不能发送空消息')
      }
    },
    changepic(e){         //选择图片后
      this.progress = 0
      let file = e.target.files[0]
      let url;
      if (window.createObjectURL != undefined) { // basic
        url = window.createObjectURL(file) ;
      } else if (window.URL != undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file) ;
      } else if (window.webkitURL != undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file) ;
      }
      const opt = {
        'file': file,
        'From_Account': this.identifier,
        'To_Account': this.custIdentifier,
        'businessType': 2
      }
      const timer = setInterval(() => {    // 上传慢的情况 进度条慢慢加载
        this.progress += 10
      }, 500)
      webim.uploadPic(opt,
        (resp) => {
          clearInterval(timer)
          this.progress = 100
          this.imgUrl = url
          console.log(resp)
          this.imgObj = resp
        },
        function (err) {
          clearInterval(timer)
          console.log(err.ErrorInfo);
        }
      );
    },
    async sendImg() {  //点击发送按钮
      if (!this.imgUrl) {
        this.$message.warning('请选择要上传的图片')
        return false
      }
      await this.sendfile(this.imgObj)
      const mydate = Math.round(new Date().getTime() / 1000)
      const obj = {
        id: this.identifier,
        img: this.imgUrl,
        time: mydate,
      }
      this.chatList.push(obj)
      this.dialogVisible = false
    },
    sendfile(res) {  // 发送图片
      let random = Math.round(Math.random() * 4294967296);   //消息随机数，用于去重
      let msgTime = Math.round(new Date().getTime() / 1000); //消息时间戳
      let msg = new webim.Msg(this.selSess, this.isSend, this.seq, random, msgTime, this.identifier, 0, this.loginInfo.identifierNick);
      let images_obj = new webim.Msg.Elem.Images(res.File_UUID);
      for (let i in res.URL_INFO) {
        let img = res.URL_INFO[i];
        let newImg;
        let type;
        switch (img.PIC_TYPE) {
          case 1://原图
            type = 1;//原图
            break;
          case 2://小图（缩略图）
            type = 3;//小图
            break;
          case 4://大图
            type = 2;//大图
            break;
        }
        newImg = new webim.Msg.Elem.Images.Image(type, img.PIC_Size, img.PIC_Width, img.PIC_Height, img.DownUrl);
        images_obj.addImage(newImg);
      }
      msg.addImage(images_obj);
      return new Promise((resolve, reject) => {
        webim.sendMsg(msg, function (resp) {
          console.log(resp)
          resolve()
        }, function (err) {
          console.log(err)
          resolve()
        });
      })
    },
    getChatInfo() {   //获取当前商家的账户和签名 以及动态客服的账户
      let promise1 = GetChatAcctount.call(this, `?clientTimespan=${this.$Tool.formatDate(new Date)}`)
      let promise2 = GetPlatfromAccount.call(this, `?clientTimespan=${this.$Tool.formatDate(new Date)}`)
      return Promise.all([promise1, promise2])
    },
    login() {  //websdk 登录
      let self = this
      function onConnNotify(resp) {   //连接状态
        let info;
        switch (resp.ErrorCode) {
          case webim.CONNECTION_STATUS.ON:
            webim.Log.warn('建立连接成功: ' + resp.ErrorInfo);
            break;
          case webim.CONNECTION_STATUS.OFF:
            info = '连接已断开，无法收到新消息，请检查下您的网络是否正常: ' + resp.ErrorInfo;
            console.log(info);
            webim.Log.warn(info);
            break;
          case webim.CONNECTION_STATUS.RECONNECT:
            info = '连接状态恢复正常: ' + resp.ErrorInfo;
            console.log(info);
            webim.Log.warn(info);
            break;
          default:
            webim.Log.error('未知连接状态: =' + resp.ErrorInfo);
            break;
        }
      }
      function jsonpCallback(rspData) {   //兼容IE9
        webim.setJsonpLastRspData(rspData);
      }
      function onMsgNotify(newMsgList) {   //监听新消息（刷新就没了哦）
        for(let msg of newMsgList) {
          let id = msg.getSession().id()
          let time = msg.getTime()
          let type, content, text, img
          let elems = msg.getElems()
          for(let i of elems) {
            type = i.getType()
            content = i.getContent()
            switch (type) {
              case webim.MSG_ELEMENT_TYPE.TEXT:
                text = content.getText();
                break;
              case webim.MSG_ELEMENT_TYPE.IMAGE:
                img = content.getImage(webim.IMAGE_TYPE.SMALL).getUrl()
            }
          }
          let obj={ id, time, text, img }
          self.chatList.push(obj)
        }
      }
      const listeners = {
        onConnNotify: onConnNotify,  //监听连接状态回调变化事件,必填
        jsonpCallback: jsonpCallback,  //IE9(含)以下浏览器用到的 jsonp 回调函数，
        onMsgNotify: onMsgNotify  //监听新消息(私聊，普通群(非直播聊天室)消息，全员推送消息)事件，必填
      }
      webim.login(     //登录
        this.loginInfo, listeners,
        {   //控制台不要打印日志
          isLogOn:false,
        },
        async (resp) => {
          console.log(resp)
          const { FriendNum, InfoItem = [] } = await this.getAllFriend()   // 好友数量
          if (!FriendNum) {   //没好友就去添加
            this.addFriend()
          } else {     //有好友做判断
            console.log(InfoItem[0].Info_Account, this.custIdentifier)
            if (InfoItem[0].Info_Account === this.custIdentifier) {  //是当前客服（即动态客服账户未被刷新掉）
              this.friendList = InfoItem
            } else {          // 不是当前客服
              webim.deleteFriend({     //删除
                From_Account: this.identifier,
                To_Account: [InfoItem[0].Info_Account],
                DeleteType: 'Delete_Type_Both'
              }, (resp) => {
                console.log(resp)
                this.addFriend()    //再添加新好友
              }, function(err){
                console.log(err)
              })
            }
          }
        },
        function (err) {
          console.log(err);
        }
      )
    },
    addFriend() {    //添加好友
      webim.applyAddFriend({
        From_Account: this.identifier,
        AddFriendItem: [{
          To_Account: this.custIdentifier,
          AddSource: "AddSource_Type_Unknow",
        }]
      }, async (resp) => {    //成功后再获取所有好友
        console.log(resp)
        const { InfoItem } = await this.getAllFriend()
        this.friendList = InfoItem
      }, (err) => {
        console.log(err)
      })
    },
    getAllFriend() {   //获取我的所有好友
      return new Promise((resolve, reject) => {
        webim.getAllFriend({   //必要的参数
          'From_Account': this.identifier,
          'TimeStamp': 0,
          'StartIndex': 0,
          'GetCount': 100,
          'LastStandardSequence': 0,
          "TagList":
          [
            "Tag_Profile_IM_Nick",
            "Tag_SNS_IM_Remark",
            "Tag_Profile_IM_Image"
          ]
        }, function(resp) {
          console.log(resp)
          resolve(resp)
        }, function(err) {
          console.log(error)
          resolve({})
        })
      })
    }
  },
  destroyed() {
    webim.logout()
  },
  watch: {
    chatList(val,oldval) {           //发送新消息和接收新消息时，平滑滚动到底部
			if (val.length) {
				let list = this.$el.querySelectorAll('.el-scrollbar__view')[0]
				this.$nextTick(() => {
					list.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
				})
			}
    },
    dialogVisible(val) {
      if (!val) {
        this.imgUrl = ''
        this.progress = 0
      }
    }
  }
};
</script>

<style lang="less" scoped>
  @import "less/zhiXunGuanLi.less";
  /deep/ .el-dialog {
    max-width: 600px;
    .window {
      li {
        padding: 10px 0;
        >span {
          color: #000;
          font-weight: bold;
          width: 10%;
          display: inline-block;
        }
        label {
          cursor: pointer;
        }
        .progress {
          width: 80%;
          display: inline-block;
        }
      }
    }
  }

</style>
