<template>
  <div class="addDiscount_box">

    <div class="title_box">
      <ul>
        <li class="active">添加满额返券</li>
      </ul>
      <div class="ribbon"></div>
    </div>

    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm" label-width="100px">
      <el-form-item label="活动名称" prop="title">
        <el-input style="width: 400px;" v-model="ruleForm.title"
                  :disabled="pageType === 'detail' ? true : false"></el-input>
        <span class="add_font">（限20字）</span>
      </el-form-item>

      <el-form-item label="活动时间" required>
        <div class="add_line">
          <span>
            <el-form-item prop="date1">
              <el-date-picker
                v-model="ruleForm.date1"
                :disabled="pageType === 'detail' ? true : false"
                type="date"
                value-format="yyyy-MM-dd"
                :picker-options="startMonthOption" @change="selectStartMonth"
                placeholder="请选择开始时间">
              </el-date-picker>
            </el-form-item>
          </span>
          <span class="add_span"> 至 </span>
          <span>
            <el-form-item prop="date2">
              <el-date-picker
                v-model="ruleForm.date2"
                :disabled="pageType === 'detail' ? true : false"
                type="date"
                value-format="yyyy-MM-dd"
                :picker-options="endMonthOption" @change="selectEndMonth"
                placeholder="请选择结束时间">
              </el-date-picker>
            </el-form-item>
          </span>
          <span class="add_span">共</span>
          <el-input style="width: 100px;" disabled v-model="ruleForm.dayNum"></el-input>
          <span class="add_span">天</span>
          <i>（活动时间7-30天，从开始日00:00:00生效，结束日23:59:59失效）</i>
        </div>
      </el-form-item>

      <el-form-item label="返券规则">
        <div class="add_prepend">
          <el-input style="width: 200px;" placeholder="输入金额" type="number" v-model.number="rulesModel.receive_meetprice"
                    @blur="m1" :disabled="pageType === 'detail' ? true : false">
            <template slot="prepend">购物满</template>
          </el-input>
          <i>元 &nbsp;</i>
          <el-input style="width: 200px; margin-left: -5px;" placeholder="输入金额" type="number"
                    v-model.number="rulesModel.discount" @blur="m2" :disabled="pageType === 'detail' ? true : false">
            <template slot="prepend">赠送</template>
          </el-input>
          <i>元优惠券 &nbsp;</i>
          <el-input style="width: 200px; margin-left: -5px;" placeholder="输入金额" type="number"
                    v-model.number="rulesModel.meet_price" @blur="m3"
                    :disabled="pageType === 'detail' ? true : false">
            <template slot="prepend">下次购物满</template>
          </el-input>
          <i>元可用</i>
          <span @click="addfullRefound">+ 添加</span>

          <i>（满金额最高100元，减金额最低10元且应为5的倍数）</i>
        </div>

        <div class="add_tag">
          <el-tag
            v-for="(tag, index) in tags"
            :key="tag.name"
            :closable="pageType !== 'detail' ? true : false"
            @close="fullRefoundClose(index)"
            :type="tag.type">
            {{tag.name}}
          </el-tag>
        </div>
      </el-form-item>

      <el-form-item label="使用规则" prop="valid_days">
        <div class="add_prepend">
          <!--<i>购物满 </i>
          <el-input style="width: 120px;" placeholder="请输入金额" :disabled="pageType === 'detail' ? true : false"></el-input>
          <i>元可使用，使用日期自赠送时间起 &nbsp;</i>-->
          <i>使用日期自赠送时间起 &nbsp;</i>
          <el-input style="width: 120px; margin-left: -5px;" placeholder="请输入天数" type="number"
                    v-model.number="ruleForm.valid_days"
                    :disabled="pageType === 'detail' ? true : false"></el-input>
          <i> 天内有效（有效期为30-60天）</i>
        </div>
      </el-form-item>

      <el-form-item label="领券详情" v-if="pageType === 'detail'">
        <div class="table1">
          <el-table
            :data="quanTableData"
            border
            tooltip-effect="dark"
            style="width: 80%">
            <el-table-column
              label="满减金额"
              align="center"
              width="350">
              <template slot-scope="scope">
                <span class="look_span">满{{scope.row.receive_meetprice}}减{{scope.row.derate_amount}}元，下次购物满{{scope.row.use_meetprice}}元可使用</span>
              </template>
            </el-table-column>

            <!--<el-table-column
              prop="give_number"
              label="发放总张数"
              align="center">
            </el-table-column>-->

            <el-table-column
              prop="receive_number"
              label="已领取张数"
              align="center">
            </el-table-column>

            <el-table-column
              prop="user_number"
              align="center"
              label="已使用张数">
            </el-table-column>
          </el-table>
        </div>
      </el-form-item>

      <el-form-item style="margin-top: 60px;">
        <el-button type="primary" @click="submitForm('ruleForm')" v-if="pageType !== 'detail'">确 定</el-button>
        <el-button @click="calcle" v-if="pageType !== 'detail'">返 回</el-button>
        <el-button @click="goBack" v-if="pageType === 'detail'">返 回</el-button>
      </el-form-item>
    </el-form>

    <el-dialog
      title="提示"
      :visible.sync="sureDialogVisible"
      width="500px">
      <div>
        <p>活动将在开始时间自动发布，发布后将不能修改，确认添加？</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="sureDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="提示"
      :visible.sync="cancleDialogVisible"
      width="500px">
      <div>
        <p>你已编辑了活动信息，确认放弃？</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="goBack">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import insertReturnCouponActivities from '../../../../../src/api/ShopActivity/insertReturnCouponActivities.js'
  import getReturnCouponDetail from '../../../../../src/api/ShopActivity/getReturnCouponDetail.js'

  export default {
    mounted() {
      if (this.pageId !== undefined) {
        this.getReturnCouponDetail();
      }
    },
    data() {
      return {
        pageType: this.$route.query.type,
        pageId: this.$route.query.id,
        sureDialogVisible: false, // 点击确定的提示框
        cancleDialogVisible: false, // 点击取消的提示框
        ruleForm: {
          title: '',
          date1: '',
          date2: '',
          dayNum: '',
          valid_days: '',
        },
        rules: {
          title: [
            {required: true, message: '请输入活动名称', trigger: 'blur'},
            {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
          ],
          valid_days: [
            {required: true, message: '请输入有效期', trigger: 'blur'},
            {type: 'number', min: 30, max: 60, message: '有效期必须为30~60的数字'}
          ],
          date1: [
            {type: 'string', required: true, message: '请选择日期', trigger: 'change'}
          ],
          date2: [
            {type: 'string', required: true, message: '请选择时间', trigger: 'change'}
          ]
        },
        tags: [
          /*{ name: '买100返5块 | 100张', type: '' },*/
        ],
        quanTableData: [/*{ // 领券详情数据
          fullDiscuse: '满500减90元 | 100张',
          giveCount: '100',
          getCount: '40',
          usedCount: '10',
        }*/],
        rulesModel: {
          meet_price: '', //满
          discount: '', //减
          receive_meetprice: '' //条件
        },
        startMonthOption: {
          disabledDate(time) {
            // 一天是24*60*60*1000 = 86400000 = 8.64e7
            return time.getTime() < Date.now();
          }
        },
        endMonthOption: {
          disabledDate(time) {
            return time.getTime() < Date.now() + (86400000 * 6) || time.getTime() > Date.now() + (86400000 * 30);
          }
        },
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.sureDialogVisible = true;
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      save() {
        this.sureDialogVisible = false;
        let _input = {
          clientVersion: '1.0.0',
          clientTimespan: '2019-05-16 11:13:00'
        };
        let _successMsg = '活动修改成功！';
        if (this.pageType === 'edit') {
          //修改
          _input.type = 1;
        } else if (this.pageType === 'add') {
          //新增
          _input.type = 0;
          _successMsg = '优惠活动已创建成功，订单正在向您靠近！';
        }
        if (this.tags.length <= 0) {
          this.$message.warning('活动规则不能为空!');
          return;
        }
        let _rules = new Array();
        this.tags.map(item => {
          _rules.push({
            meet_price: item.meet_price,
            discount: item.discount,
            receive_meetprice: item.receive_meetprice
          })
        });
        let _returnCouponModel = {
          rules: _rules,
          title: this.ruleForm.title,
          begin_time: this.ruleForm.date1 + ' 00:00:00',
          end_time: this.ruleForm.date2 + ' 23:59:59',
          shop_id: JSON.parse(sessionStorage.getItem('tokenInfo')).shopId,
          valid_days: this.ruleForm.valid_days,
          id: this.pageId
        };
        _input.returncoupon = _returnCouponModel;
        // console.log('满折对象: ',_input);
        insertReturnCouponActivities.call(this, _input).then(res => {
          if (res.data.code === 1) {
            //成功
            this.$message.success(_successMsg);
            this.$router.push({
              name: 'FullRefundList'
            });
          } else {
            //失败
            this.$message.error(res.data.desc);
          }
        });
      },
      getReturnCouponDetail() {
        getReturnCouponDetail.call(this, `?clientVersion=1.0.0&clientTimespan=2019-05-16 11:13:00&activityId=${this.pageId}`).then(res => {
          if (res.data.code === 1) {
            //成功
            let _data = res.data.data;
            this.ruleForm.title = _data.title;
            let _beginTime = _data.begin_time;
            this.ruleForm.date1 = _beginTime.split(" ")[0];
            let _endTime = _data.end_time;
            this.ruleForm.date2 = _endTime.split(" ")[0];
            //计算时间
            this.calculatingTime();
            this.ruleForm.valid_days = _data.valid_days;
            let _tags = new Array()
            _data.coupnlist.map(item => {
              _tags.push({
                name: `满${item.receive_meetprice}赠送${item.derate_amount}元，下次购物满${item.use_meetprice}元可使用`,
                type: '',
                meet_price: item.use_meetprice,
                discount: item.derate_amount,
                receive_meetprice: item.receive_meetprice
              })
            });
            this.tags = _tags;
            this.quanTableData = _data.coupnlist;
          } else {
            //失败
            this.$message.error(res.data.desc);
          }
        });
      },
      calcle() {
        this.cancleDialogVisible = true;
      },

      goBack() {
        this.$router.go(-1);
      },

      /**
       * 跳转到商品详情页
       */
      goDetail() {
        this.$router.push({name: 'GoodsDetail'});
      },
      selectStartMonth() {
        this.endMonthOption = {
          disabledDate: (time) => {
            if (this.ruleForm.date1 === '' || this.ruleForm.date1 === null) {
              return time.getTime() < Date.now() + (86400000 * 6) || time.getTime() > Date.now() + (86400000 * 30);
            } else {
              return time.getTime() < new Date(this.ruleForm.date1).getTime() + (86400000 * 5) || time.getTime() > new Date(this.ruleForm.date1).getTime() + (86400000 * 29);
            }
          }
        };
        this.calculatingTime();
      },
      selectEndMonth() {
        this.startMonthOption = {
          disabledDate: (time) => {
            if (this.ruleForm.date2 === '' || this.ruleForm.date2 === null) {
              return time.getTime() < Date.now();
            } else {
              return time.getTime() > new Date(this.ruleForm.date2).getTime() - (86400000 * 6) || time.getTime() < Date.now() || time.getTime() < new Date(this.ruleForm.date2).getTime() - (86400000 * 30);
            }
          }
        };
        this.calculatingTime();
      },
      calculatingTime() {
        let day = '';
        if (this.ruleForm.date1 !== '' && this.ruleForm.date2 !== '' && this.ruleForm.date1 !== null && this.ruleForm.date2 !== null) {
          day = (new Date(this.ruleForm.date2).getTime() - new Date(this.ruleForm.date1).getTime()) / 86400000 + 1;
        }
        this.ruleForm.dayNum = day;
      },
      addfullRefound() {
        if (this.rulesModel.discount === '' || this.rulesModel.meet_price === '' || this.rulesModel.receive_meetprice === '') {
          this.$message.warning('满返金额,下次购物满金额不能为空!');
        } else {
          this.tags.push({
            name: `满${this.rulesModel.receive_meetprice}赠送${this.rulesModel.discount}元，下次购物满${this.rulesModel.meet_price}元可使用`,
            type: '',
            meet_price: this.rulesModel.meet_price,
            discount: this.rulesModel.discount,
            receive_meetprice: this.rulesModel.receive_meetprice
          });
          this.rulesModel.discount = '';
          this.rulesModel.meet_price = '';
          this.rulesModel.receive_meetprice = '';
        }
      },
      fullRefoundClose(index) {
        this.tags.splice(index, 1);
      },
      m1() {
        if (!(this.rulesModel.receive_meetprice > 0 && this.rulesModel.receive_meetprice <= 100)) {
          this.$message.warning('满额最高100元!');
          this.rulesModel.receive_meetprice = '';
        }
      },
      m2() {
        if (!(this.rulesModel.discount >= 10 && this.rulesModel.discount % 5 === 0)) {
          this.$message.warning('赠送金额最低10元且应为5的倍数!');
          this.rulesModel.discount = '';
        }
      },
      m3() {
        if (!(this.rulesModel.meet_price > 0 && this.rulesModel.meet_price <= 100)) {
          this.$message.warning('返券满额最高100元!');
          this.rulesModel.meet_price = '';
        }
      },
      /*m4() {
        if (!(this.ruleForm.valid_days >= 30 && this.ruleForm.valid_days <= 60)) {
          this.$message.warning('有效期为30-60天');
          this.ruleForm.valid_days = '';
        }
      },*/
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "./less/style.less";
</style>
