<template>
  <div>
    <change-step :active-index="3"></change-step>
    <div style="padding: 15px;margin-bottom: 20px;background-color: #fff">
      <strong>已寄出纸质档资料的，请填写以下物流信息：</strong>
      <strong style="float: right;color: #00a2ff;cursor: pointer;" @click="$router.push({name: 'SendDesc'})"><img src="../../img/shuoming.png" alt="" style="vertical-align: middle;margin-right: 5px">寄送说明</strong>
    </div>
    <div class="title">
      <!--      <p>公司/法人信息</p>-->
    </div>
    <div class="main">
      <el-form label-width="120px" size="medium">
        <el-form-item label="寄送方式：" class="custom-require">
          <el-radio-group v-model="send_type">
            <el-radio :label="1">快递</el-radio>
            <el-radio :label="2">自送</el-radio>
          </el-radio-group>
          <div style="font-size: 0.8em;color: #999">离寄送地址较近的可选择自送</div>
        </el-form-item>

        <div v-if="send_type === 1">
          <el-form-item label="快递公司：" class="custom-require">
            <el-select style="width: 300px" v-model="express_info.company">
              <el-option v-for="item in express_list" :key="item.id" :label="item.title" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="快递单号：" class="custom-require">
            <el-input style="width: 300px;" v-model="express_info.num" placeholder="请填写快递单号"></el-input>
          </el-form-item>
        </div>
        <div v-else>
          <el-form-item label="联系人姓名：" class="custom-require">
            <el-input style="width: 300px;" v-model="self_info.num" placeholder="请输入送资料人姓名"></el-input>
          </el-form-item>
          <el-form-item label="联系电话：" class="custom-require">
            <el-input style="width: 300px;" v-model="self_info.phone" placeholder="请输入送资料人联系电话"></el-input>
          </el-form-item>
          <el-form-item label="预计送达时间：" class="custom-require">
            <el-date-picker
              style="width: 300px;"
              v-model="self_info.time"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="请选择预计送达时间"
            >
            </el-date-picker>
          </el-form-item>
        </div>
        <el-form-item label="">
          <el-button type="info" @click="$router.go(-1)">取消</el-button>
          <el-button type="primary" @click="submit">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import changeStep from '@/components/views/capital/cash/bankChange/changeStep'
  import GetExpressListByPage from '@/api/AfterSale/GetExpressListByPage'
  export default {
    name: "sendInfo",
    components: {
      changeStep
    },
    data() {
      return {
        send_type: 1, //1快递 2自送
        express_info: {
          company: '',
          num: '',
        },
        self_info: {
          name: '',
          phone: '',
          time: '',
        },
        express_list: [],//快递公司
      }
    },
    created() {
      this.getExpressList();
    },
    methods: {
      submit() {
        this.$router.push({name: 'ReviewStatus', query: {
            status: 3,
            active: 3,
          }})
      },
      getExpressList() {
        GetExpressListByPage.call(this, `?input.clientTimespan=${this.$Tool.formatDate(new Date())}`).then(res => {
          if (res.data.code === 1) {
            this.express_list = res.data.data.list;
          } else {
            this.$message.error(res.data.desc);
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .title {
    border-bottom: 2px solid #00a2ff;

    p {
      width: 6.1rem;
      height: 2.3rem;
      background-color: #00a2ff;
      border-radius: 0.2rem 0.2rem 0rem 0rem;
      color: #fff;
      text-align: center;
      line-height: 2.3rem;
    }
  }
  .main {
    padding: 20px;
    background-color: #fff;

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
