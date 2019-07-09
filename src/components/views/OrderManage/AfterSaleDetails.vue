<template>
  <div class="warp_bg">

    <div class="main_left">
      <div class="end_time">待处理，剩余3天2小时15分，系统自动不发货申请，请及时处理。</div>

      <!--详情开始-->
      <div class="goods">
        <div class="title">补发货详情</div>
        <div class="goods_det">
          <div class="left">
            <img src="./img/pic1.jpg" alt="">
          </div>
          <div class="right">
            <p>MISSILE米赛尔把套 山地车把套自行车 单车锁死橡胶把 套特价包邮  *  2件</p>
            <span>颜色分类:黑色</span>
          </div>
        </div>
      </div>
      <!--详情结束-->

      <!--买家信息开始-->
      <div class="information">
        <div class="title">买家信息</div>
        <ul>
          <li>
            <label>买家：</label>小丸子
            <i class="iconfont icon-xinxi">联系买家</i>
          </li>
          <li>
            <label>订单编号：</label>12345644967896
          </li>
          <li>
            <label>下单时间：</label>2019.04.27
          </li>
          <li>
            <label>补发货原因：</label>发错货
          </li>
          <li>
            <label>补发货数量：</label>2
          </li>
          <li>
            <label>原因：</label>多拍/拍错/不想要
          </li>
          <li>
            <label>补发货说明：</label>因为卖家服务态度恶劣，并且商品质量不 好，我要申请退款，不再购买。
          </li>
          <li>
            <label>补发货凭证：</label>
            <img src="./img/pic1.jpg" alt="">
            <img src="./img/pic1.jpg" alt="">
            <img src="./img/pic1.jpg" alt="">
            <img src="./img/pic1.jpg" alt="">
            <img src="./img/pic1.jpg" alt="">
          </li>
          <li>
            <label>买家留言：</label>
            <p class="tacell">
              <span class="ly_cont">请商家尽快处理请商家尽快处理请商家尽快处理请商家尽快处理请商家尽快处理请商家尽快处理请商家尽快处理</span>
              <span class="ly_time">2019-02-28 12:12:00</span>
            </p>
          </li>
        </ul>
      </div>
      <!--买家信息结束-->


      <!--处理历史开始-->
      <div class="history">
        <div class="title">处理历史</div>
        <div class="history_list">
          <div class="top">
            <span><i class=""></i>2016-08-01 11:09:59</span>
            <p>补发货成功</p>
          </div>
          <div class="content">

          </div>
        </div>
        <div class="history_list">
          <div class="top">
            <span><i class=""></i>2016-08-01 11:09:59</span>
            <p>买家确认已收货</p>
          </div>
          <div class="content">
            买家收到更换后的商品
          </div>
        </div>
        <div class="history_list">
          <div class="top">
            <span><i class=""></i>2016-08-01 11:09:59</span>
            <p>卖家已发货</p>
          </div>
          <div class="content">
            <p>卖家发出更换后的商品  物流公司：圆通快递</p>
            <p>物流单号：32836472364</p>
          </div>
        </div>
        <div class="history_list">
          <div class="top">
            <span><i class=""></i>2016-08-01 11:09:59</span>
            <p>卖家同意补发货</p>
          </div>
          <div class="content">
            卖家同意本次补发货申请
          </div>
        </div>
      </div>
      <!--处理历史结束-->


    </div>

    <div class="main_right">
      <div class="dispose">卖家处理</div>
      <div class="dispose_list">
        <div class="left_num"><i>1</i></div>
        <div class="right_cont">
          <div class="title">是否同意补发货：</div>
          <template>
            <el-radio v-model="radio" label="1">同意</el-radio>
            <el-radio v-model="radio" label="2">不同意</el-radio>
          </template>
          <div class="arrow_left"><img src="./img/left.png" alt=""></div>
        </div>
      </div>
      <div v-if=" radio === '1' ">
        <div class="dispose_list dispose_list_last">
          <div class="left_num"><i>2</i></div>
          <div class="right_cont">
            <div class="title">点击同意-卖家寄货：</div>
            <el-form :model="repairRuleForm" :rules="repairRules" ref="repairRuleForm" label-width="130px" class="demo-repairRuleForm">

              <el-form-item label="寄送方式" prop="logistics">
                <el-radio-group v-model="repairRuleForm.logistics">
                  <el-radio label="快递物流"></el-radio>
                  <el-radio label="商家自送"></el-radio>
                </el-radio-group>
              </el-form-item>

              <!--点击快递物流开始-->
              <div v-if=" repairRuleForm.logistics === '快递物流' ">
                <el-form-item label="物流公司" prop="logisticsList">
                  <el-select v-model="repairRuleForm.logisticsList" placeholder="请选择活动区域">
                    <el-option label="中通" value="shanghai"></el-option>
                    <el-option label="申通" value="beijing"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="快递单号" prop="courierNumber">
                  <el-input v-model="repairRuleForm.courierNumber"></el-input>
                </el-form-item>
              </div>
              <!--点击快递物流开始-->

              <!--点击商家自送开始-->
              <div v-if="repairRuleForm.logistics === '商家自送'">
                <el-form-item label="联系电话" prop="tel">
                  <el-input v-model="repairRuleForm.tel"></el-input>
                </el-form-item>
                <el-form-item label="联系人姓名" prop="name">
                  <el-input v-model="repairRuleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="预计送达时间" prop="time">
                  <el-input v-model="repairRuleForm.time"></el-input>
                </el-form-item>
              </div>
              <!--点击商家自送结束-->

              <el-form-item>
                <el-button type="primary" @click="submitForm('repairRuleForm')">确定</el-button>
                <el-button @click="resetForm('repairRuleForm')">重置</el-button>
              </el-form-item>

            </el-form>
            <div class="arrow_left"><img src="./img/leftbg.png" alt=""></div>
          </div>
        </div>
      </div>
      <div v-if=" radio === '2' ">
        <div class="dispose_list">
          <div class="left_num"><i>2</i></div>
          <div class="right_cont">
            <div class="bfh_cont">
              <ul>
                <li>退款金额：<span class="price">{{tkPrice}}元</span> <img src="./img/bfh_tips.png" alt=""></li>
                <li>
                  <el-form ref="form" :model="form" label-width="120px">
                    <el-form-item label="修改退款金额：">
                      <el-input v-model="tkPrice"></el-input>
                      <span class="max_price"> <img src="./img/max_tips.png" alt="">退款金额不能大于 XX 元</span>
                    </el-form-item>
                    <span class="consult_tips">请在与买家协商一致后修改，以免引起交易纠纷</span>
                  </el-form>
                </li>
              </ul>
            </div>
            <!--<div style="margin-top: 15px;"><el-button type="primary" size="small">确定</el-button></div>-->
            <div class="arrow_left"><img src="./img/left.png" alt=""></div>
          </div>
        </div>
        <div class="dispose_list">
          <div class="left_num"><i>3</i></div>
          <div class="right_cont">
            <div class="bfh_cont">
              <div class="title">不同意理由：</div>
              <ul>
                <li><el-input type="textarea" placeholder="请输入不同意理由" v-model="textarea" maxlength="200" show-word-limit></el-input></li>
                <li>
                  <el-upload
                    action="https://jsonplaceholder.typicode.com/posts/"
                    list-type="picture-card"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove">
                    <i class="el-icon-plus"></i>
                  </el-upload>
                  <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                  </el-dialog>
                </li>
              </ul>
              <div>
                <el-button type="info">取消</el-button>
                <el-button type="primary">提交</el-button>
              </div>
            </div>
            <div class="arrow_left"><img src="./img/left.png" alt=""></div>
          </div>
        </div>
        <div class="dispose_list dispose_list_last">
          <div class="left_num"><i>4</i></div>
          <div class="right_cont">
            <div class="bfh_cont">
              <div class="title">已拒绝补发货申请-已自动退款</div>
              <ul>
                <li>退款金额：<span class="de_price">25.00元</span></li>
                <li>拒绝理由：商品在发出时已检查过，不会存在商品质量问题</li>
              </ul>
              <div class="img_list">
                <img src="./img/pic1.jpg" alt="">
                <img src="./img/pic1.jpg" alt="">
                <img src="./img/pic1.jpg" alt="">
              </div>
            </div>
            <div class="arrow_left"><img src="./img/leftbg.png" alt=""></div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  export default {

    data(){
      return{

        radio: '2',//是否同意补发货
        repairRuleForm: {
          courierNumber: '',//快递单号
          logisticsList: '',//选择物流公司
          logistics: '',//寄送方式
          tel: '',
          name: '',
          time: '',
        },
        repairRules: {
          courierNumber: [
            { required: true, message: '请输入快递单号', trigger: 'blur' },
          ],
          logisticsList: [
            { required: true, message: '请选择物流公司', trigger: 'change' }
          ],
          logistics: [
            { required: true, message: '请选择寄送方式', trigger: 'change' }
          ],
          tel: [
            { required: true, message: '请输入联系电话', trigger: 'blur' },
          ],
          name: [
            { required: true, message: '请输入联系人姓名', trigger: 'blur' },
          ],
          time: [
            { required: true, message: '请输入预计送达时间', trigger: 'blur' },
          ],
        },

        tkPrice: '30.00',//修改退款金额
        textarea: '',//补发货不同意理由
        dialogImageUrl: '',
        dialogVisible: false

      }
    },

    methods:{

      /**
       *同意补发货确定按钮
       */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },

      /**
       * 补发货不同意上传图片
       * @param file
       * @param fileList
       */
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      }



    }


  }
</script>

<style lang="less" scoped>
  .warp_bg{
    background: #fff;
    .main_left{
      width: 47%;
      padding: 1%;
      background: #fff;
      float: left;
      margin-right: 1%;
      .end_time{
        height: auto;
        padding: 10px 20px;
        color: #ff6600;
        background: #fff7e6;
        border: 1px #ffc89c dashed;
      }
      .goods{
        margin: 20px 0;
        .title{
          font-size: 16px;
          color: #333333;
          font-weight: 600;
          padding-left: 10px;
          border-left: 2px #00a2ff solid;
        }
        .goods_det{
          padding: 10px;
          box-sizing: border-box;
          display: table;
          .left{
            padding: 10px;
            display: table-cell;
            vertical-align: middle;
            img{
              width: 100px;
              height: 100px;
            }
          }
          .right{
            padding: 10px;
            display: table-cell;
            vertical-align: middle;
            p{
              color: #333;
              font-size: 14px;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;
            }
            span{
              margin-top: 10px;
              display: inline-block;
              color: #666;
              font-size: 14px;
            }
          }
        }
      }
      .information{
        padding: 20px 20px 20px 0;
        border-top: 1px #e1e1e1 solid;
        .title{
          font-size: 16px;
          color: #333;
          font-weight: 600;
        }
        ul{
          margin-top: 15px;
          li{
            width: 100%;
            margin: 10px 0;
            color: #666;
            label{
              vertical-align: top;
              color: #333;
              float: left;
            }
            img{
              width: 90px;
              height: 90px;
              float: left;
              margin-right: 10px;
              margin-bottom: 10px;
            }
            &:after{
              content: '';
              clear: both;
              display: block;
            }
            i{
              color: #00a2ff;
              margin-left: 20px;
            }
            .tacell{
              display: flex;
              .ly_cont{
                flex: 1;
              }
            }
          }
          &:after{
            content: '';
            clear: both;
            display: block;
          }
        }
      }
      .history{
        border-top: 1px #e1e1e1 solid;
        .title{
          color: #333333;
          font-weight: 600;
          font-size: 16px;
          margin: 15px 0;
        }
        .history_list{
          .top{
            display: table;
            margin: 1px 0;
            span{
              width: 150px;
              color: #999999;
              display: table-cell;
              vertical-align: top;
              padding: 0 20px 0 0;
              i{
                width: 10px;
                height: 10px;
                border-radius: 5px;
                background: #d9d9d9;
                font-style: normal;
                margin-right: 10px;
                display: inline-block;
              }
            }
            p{
              display: table-cell;
              vertical-align: middle;
              color: #333333;
            }
          }
          .content{
            width: auto;
            min-height: 60px;
            padding-left: 165px;
            margin-left: 4px;
            padding-top: 10px;
            border-left: 1px #eaeaea solid;
          }
        }
      }
    }
    .main_right{
      width: 48%;
      padding: 1%;
      background: #fff;
      float: right;
      .dispose{
        color: #333;
        font-weight: 600;
        font-size: 16px;
      }
      .dispose_list{
        width: 100%;
        display: table;
        box-sizing: border-box;
        margin-top: 25px;
        background: #fff;
        border-radius: 5px;
        .left_num{
          width: 60px;
          display: table-cell;
          vertical-align: top;
          i{
            width: 40px;
            height: 40px;
            display: inline-block;
            font-style: normal;
            border-radius: 50%;
            text-align: center;
            line-height: 40px;
            background: #e7f4fe;
            color: #4fb4ff;
          }
        }
        .right_cont{
          display: table-cell;
          vertical-align: top;
          background: #eeeeee;
          border-radius: 5px;
          padding: 25px;
          border: 1px #e1e1e1 dashed;
          position: relative;
          .title{
            font-weight: 600;
            color: #333;
            margin-bottom: 20px;
          }
          .arrow_left{
            position: absolute;
            left: -8px;
            top: 14px;
            img{
              width: 8px;
              height: 10px;
              display: block;
            }
          }
          .bfh_cont{
            ul{
              li{
                margin: 10px 0;
                display: flex;
                .price{
                  color: #e60012;
                }
                img{
                  vertical-align: middle;
                }
                input{
                  flex: 1;
                }
                .el-form-item{
                  margin-bottom: 0 !important;
                }
                .max_price{
                  color: #e60012;
                  img{
                    margin-right: 5px;
                    vertical-align: sub;
                  }
                }
                .consult_tips{
                  color: #999999;
                }
                .de_price{
                  color: #e60012;
                }
              }
            }
            .img_list{
              img{
                width: 90px;
                height: 90px;
                float: left;
                margin-right: 10px;
                margin-top: 10px;
              }
            }
          }
        }
      }
      .dispose_list_last{
        .right_cont{
          background: #e6f3fd;
          border: 1px #8cc5ef dashed;
          .arrow_left{
            position: absolute;
            left: -8px;
            top: 14px;
            img{
              width: 8px;
              height: 10px;
              display: block;
            }
          }
        }
      }
    }
  }

</style>
