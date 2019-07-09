<template>
  <div class="addDiscount_box">

    <div class="title_box">
      <ul>
        <li class="active">添加包邮</li>
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

      <el-form-item label="包邮条件" prop="meet_price">
        <div class="add_prepend">
          <el-input style="width: 200px;" :disabled="pageType === 'detail' ? true : false" type="number"
                    v-model.number="ruleForm.meet_price">
            <template slot="prepend">购物满</template>
          </el-input>
          <i> &nbsp; 元可包邮 &nbsp; （包邮满金额最高100元）</i>
        </div>
      </el-form-item>

      <el-form-item label="包邮地区">
        <div>
          <el-button :type="this.areaLabel === '全国' ? 'primary' : 'default'" size="small" @click="choiceArea(0)"
                     :disabled="pageType === 'detail' ? true : false">请选择包邮地区
          </el-button>
          <el-button :type="this.areaLabel === '除去偏远地区' ? 'primary' : 'default'" size="small" @click="choiceArea(1)"
                     :disabled="pageType === 'detail' ? true : false">除去偏远地区
          </el-button>
        </div>

        <div class="choiceArea">
          <span v-for="item in area1Selected">{{item.name}}</span>
        </div>
      </el-form-item>

      <el-form-item style="margin-top: 60px;">
        <el-button type="primary" @click="submitForm('ruleForm')" v-if="pageType !== 'detail'">确 定</el-button>
        <el-button @click="calcle" v-if="pageType !== 'detail'">返 回</el-button>
        <el-button @click="goBack" v-if="pageType === 'detail'">返 回</el-button>
      </el-form-item>
    </el-form>

    <!--选择地区弹框 start-->
    <el-dialog
      title="选择地区"
      :visible.sync="areaVisible"
      width="800px">
      <div class="areaDialog_box">
        <div class="top">
          <!--{{checkAll}} -&#45;&#45; {{isIndeterminate}} -&#45;&#45; {{this.areaData.length}} -&#45;&#45;{{this.area1.length}} -&#45;&#45;{{this.area2.length}}-->
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">
            {{areaLabel}}
          </el-checkbox>
        </div>
        <div class="center">
          <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="(city,index) in areaData" :label="city" :key="index">{{city.name}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="areaVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveSelect">确 定</el-button>
      </span>
    </el-dialog>
    <!--选择地区弹框 end-->

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
  import editFreepostage from '../../../../../src/api/ShopActivity/editFreepostage.js'
  import getFreeActivityDetail from '../../../../../src/api/ShopActivity/getFreeActivityDetail.js' //查看
  import getShopValidFreepostageDetailPC from '../../../../../src/api/ShopActivity/getShopValidFreepostageDetailPC.js' //编辑
  import getAreaData from '../../../../../src/api/ShopActivity/getAreaData.js'
  import getExcludeArea from '../../../../../src/api/ShopActivity/getExcludeArea.js'

  export default {
    mounted() {
      this.getAreaData();
      if (this.pageType !== 'detail') {
        this.getExcludeArea();
      }
      if (this.pageId !== undefined && this.pageType === 'detail'){
        this.getFreeActivityDetail();
      }else if (this.pageId !== undefined && this.pageType === 'edit') {
        this.getShopValidFreepostageDetailPC();
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
          meet_price: '',
          act_range: 1,
        },
        rules: {
          title: [
            {required: true, message: '请输入活动名称', trigger: 'blur'},
            {min: 0, max: 20, message: '长度在 0 到 20 个字符', trigger: 'blur'}
          ],
          date1: [
            {type: 'string', required: true, message: '请选择日期', trigger: 'change'}
          ],
          date2: [
            {type: 'string', required: true, message: '请选择时间', trigger: 'change'}
          ],
          meet_price: [
            {required: true, message: '请输入包邮满金额', trigger: 'blur'},
            {type: 'number', min: 1, max: 100, message: '包邮满金额必须为1~100的数字'}
          ],
        },
        areaData: [],
        area1: [], //全部的
        area2: [], //偏远地区的
        area1Selected: [],
        area2Selected: [],
        areaVisible: false, // 地区弹框显示
        checkAll: false,
        checkedCities: [],
        isIndeterminate: false,
        areaLabel: '全国',
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
        //地区数据 组装
        if (this.area1Selected.length === 0){
          this.$message.warning('包邮地区不能为空!');
          return;
        }
        let _freepost = {
          title: this.ruleForm.title,
          begin_time: this.ruleForm.date1 + ' 00:00:00',
          end_time: this.ruleForm.date2 + ' 23:59:59',
          shop_id: JSON.parse(sessionStorage.getItem('tokenInfo')).shopId,
          meet_price: this.ruleForm.meet_price, //金额
          area: JSON.stringify(this.area1Selected), //地区
          except: JSON.stringify(this.area2Selected), //偏远地区
          equipment: 0, //0:pc,1:移动
          act_range: this.ruleForm.act_range,
          id: this.pageId
        };
        _input.freepost = _freepost;
        // console.log('满折对象: ',_input);
        editFreepostage.call(this, _input).then(res => {
          if (res.data.code === 1) {
            //成功
            this.$message.success(_successMsg);
            this.$router.push({
              name: 'FreeShippingList'
            });
          } else {
            //失败
            this.$message.error(res.data.desc);
          }
        });
      },
      //查看获取详情
      getFreeActivityDetail(){
        getFreeActivityDetail.call(this, `?clientVersion=1.0.0&clientTimespan=2019-05-16 11:13:00&activityId=${this.pageId}`).then(res => {
          if (res.data.code === 1) {
            //成功
            let _data = res.data.data;
            this.ruleForm.title = _data.title;
            let _beginTime = _data.begin_time;
            this.ruleForm.meet_price = _data.meet_price;
            this.ruleForm.act_range = _data.act_range;
            this.ruleForm.date1 = _beginTime.split(" ")[0];
            let _endTime  = _data.end_time ;
            this.ruleForm.date2 = _endTime.split(" ")[0];
            //计算时间
            this.calculatingTime();
            if (_data.area === '全国') {
              this.area1Selected = this.area1;
            }else {
              let _select = _data.data;
              if (_select != null ) {
                this.area1.map(item=>{
                  let _flag = true;
                  _select.map(it=>{
                    if (item.code === it.code) {
                      _flag = false;
                    }
                  });
                  if (_flag) {
                    this.area1Selected.push(item);
                  }
                });
              }
            }
          } else {
            //失败
            this.$message.error(res.data.desc);
          }
        });
      },
      calcle() {
        this.cancleDialogVisible = true;
      },
      //编辑获取详情
      getShopValidFreepostageDetailPC(){
        getShopValidFreepostageDetailPC.call(this, `?clientVersion=1.0.0&clientTimespan=2019-05-16 11:13:00&activityId=${this.pageId}`).then(res => {
          if (res.data.code === 1) {
            //成功
            let _data = res.data.data;
            this.ruleForm.title = _data.title;
            let _beginTime = _data.begin_time;
            this.ruleForm.meet_price = _data.meet_price;
            this.ruleForm.act_range = _data.act_range;
            this.ruleForm.date1 = _beginTime.split(" ")[0];
            let _endTime  = _data.end_time ;
            this.ruleForm.date2 = _endTime.split(" ")[0];
            //计算时间
            this.calculatingTime();
            if (_data.area === '全国') {
              this.area1Selected = this.area1;
            }else {
              let _select = _data.data;
              if (_select != null ) {
                _select.map(item=>{
                  this.area1.map(it=>{
                    if (item.code===it.code) {
                      this.area1Selected.push(it);
                    }
                  });
                });
              }
            }
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
      /**
       * 时间选择栏  不可选时间
       */
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
      /**
       * 计算天数
       */
      calculatingTime() {
        let day = '';
        if (this.ruleForm.date1 !== '' && this.ruleForm.date2 !== '' && this.ruleForm.date1 !== null && this.ruleForm.date2 !== null) {
          day = (new Date(this.ruleForm.date2).getTime() - new Date(this.ruleForm.date1).getTime()) / 86400000 + 1;
        }
        this.ruleForm.dayNum = day;
      },
      /**
       * 点击选择区域/边远地区
       * type = 0 是全部，1是偏远地区
       */
      choiceArea(type) {
        this.checkAll = false;
        let _list = [];
        if (type === 0) {
          this.areaLabel = '全国';
          this.area1.map(item =>{
            _list.push(item);
          });
          this.areaData = _list;
          this.checkedCities = this.area1Selected;
        } else {
          this.areaLabel = '除去偏远地区';
          this.area2.map(item =>{
            _list.push(item);
          });
          this.areaData = _list;
          this.checkedCities = this.area2Selected;
        }
        if (this.checkedCities.length === this.areaData.length) {
          this.checkAll = true;
        } else if (this.checkedCities.length === 0){
          this.isIndeterminate = false;
        } else {
          this.isIndeterminate = true;
        }
        this.areaVisible = true;
      },
      /**
       * 点击选择区域/边远地区  保存
       */
      saveSelect() {
        this.areaVisible = false;
        if (this.areaLabel === '全国') {
          this.area1Selected = this.checkedCities;
          //去除 偏远地区中的被选中的 有相同的省
          this.area1Selected.map((item, index) => {
            let _index = -1;
            this.area2Selected.map((it, i) => {
              if (it.code === item.code) {
                _index = i;
              }
            });
            if (_index > -1) {
              this.area2Selected.splice(_index, 1);
            }
          });
        } else if (this.areaLabel === '除去偏远地区') {
          this.area2Selected = this.checkedCities;
          //去除 全国中的被选中的 有相同的省
          this.area2Selected.map((item, index) => {
            let _index = -1;
            this.area1Selected.map((it,i) =>{
              if (it.code === item.code) {
                _index = i;
              }
            });
            if (_index > -1){
              this.area1Selected.splice(_index, 1);
            }
          });
        }
      },
      /**
       * 地区全选（全国）
       * @param val
       */
      handleCheckAllChange(val) {
        this.checkedCities = val ? this.areaData : [];
        this.isIndeterminate = false;
      },

      /**
       * 地区选择
       * @param value
       */
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.areaData.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.areaData.length;
      },
      /**
       * 获取包邮地区
       */
      getAreaData() {
        getAreaData.call(this, `?clientVersion=v1&clientTimespan=2019-05-16 11:13:00`).then(res => {
          if (res.data.code === 1) {
            //成功
            let _data = res.data.data;
            this.area1 = _data;
          } else {
            //失败
            this.$message.error(res.data.desc);
          }
        });
      },
      /**
       * 获取偏远地区
       */
      getExcludeArea() {
        getExcludeArea.call(this, `?clientVersion=v1&clientTimespan=2019-05-16 11:13:00`).then(res => {
          if (res.data.code === 1) {
            //成功
            let _data = res.data.data;
            this.area2 = _data;
          } else {
            //失败
            this.$message.error(res.data.desc);
          }
        });
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "./less/style.less";
</style>
