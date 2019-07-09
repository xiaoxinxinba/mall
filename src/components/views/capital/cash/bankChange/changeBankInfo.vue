<template>
  <div>
    <change-step :active-index="1"></change-step>
    <div style="padding: 15px;margin-bottom: 20px;background-color: #fff">
      <strong>银行卡信息变更</strong>
      <strong style="float: right;color: #00a2ff;cursor: pointer;" @click="$router.push({name: 'ChangeDesc'})"><img src="../../img/shuoming.png" alt="" style="vertical-align: middle;margin-right: 5px">变更说明</strong>
    </div>
    <div class="title">
      <!--      <p>公司/法人信息</p>-->
    </div>
    <div class="main">
      <el-form label-width="150px" size="medium">
        <el-form-item label="账户类型：">
          <el-select v-model="bank_type_selected">
            <el-option v-for="item in bank_type_list" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="持卡人姓名：" v-if="bank_type_selected !== 2">
          <el-input style="width: 300px;" v-model="account_name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="公司名称：" v-else>
          <el-input style="width: 300px;" v-model="account_name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="银行卡号：">
          <div class="old-value">{{bank_num.value}}<i class="el-icon-edit-outline"
                                                      @click="changeSwitchOn('bank_num')"></i></div>
          <div class="new-value" v-show="bank_num.is_edit">
            <span class="t">变更后：</span>
            <el-input style="width: 300px;" placeholder="请输入变更后银行卡号 (仅限储蓄卡）" v-model="bank_num.new_value"></el-input>
            <i class="el-icon-error" @click="changeSwitchOff('bank_num')"></i>
          </div>
        </el-form-item>
        <el-form-item label="开户银行：">
          <div class="old-value">{{bank_selected.value}}<i class="el-icon-edit-outline"
                                                           @click="changeSwitchOn('bank_selected')"></i></div>
          <div class="new-value" v-show="bank_selected.is_edit">
            <span class="t">变更后：</span>
            <el-select filterable style="width: 300px;" placeholder="请选择变更后开户银行" v-model="bank_selected.new_value">
              <el-option v-for="item in bank_system_list" :key="item.id" :label="item.title"
                         :value="item.title"></el-option>
            </el-select>
            <i class="el-icon-error" @click="changeSwitchOff('bank_selected')"></i>
          </div>
        </el-form-item>
        <el-form-item label="开户银行省市：">
          <div class="old-value">{{bank_address.value}}<i class="el-icon-edit-outline"
                                                          @click="changeSwitchOn('bank_address')"></i></div>
          <div class="new-value" v-show="bank_address.is_edit">
            <span class="t">变更后：</span>
            <el-select style="width: 150px;margin-right: 10px;" v-model="bank_address.new_value.province"
                       value-key="code"
                       @change="(val) => getCityList(val)">
              <el-option v-for="item in province_list" :key="item.code" :label="item.fullName"
                         :value="item"></el-option>
            </el-select>
            <el-select style="width: 150px;margin-right: 10px;" v-model="bank_address.new_value.city" value-key="code">
              <el-option v-for="item in city_list" :key="item.code" :label="item.fullName" :value="item"></el-option>
            </el-select>
            <i class="el-icon-error" @click="changeSwitchOff('bank_address')"></i>
          </div>
        </el-form-item>
        <el-form-item label="所属支行：">
          <div class="old-value">{{bank_branch.value}}<i class="el-icon-edit-outline"
                                                         @click="changeSwitchOn('bank_branch')"></i></div>
          <div class="new-value" v-show="bank_branch.is_edit">
            <span class="t">变更后：</span>
            <el-input style="width: 300px;" placeholder="请输入变更后所属支行" v-model="bank_branch.new_value"></el-input>
            <i class="el-icon-error" @click="changeSwitchOff('bank_branch')"></i>
          </div>
        </el-form-item>
        <el-form-item label="银行预留手机号：">
          <div class="old-value">{{bank_phone.value}}<i class="el-icon-edit-outline"
                                                        @click="changeSwitchOn('bank_phone')"></i></div>
          <div class="new-value" v-show="bank_phone.is_edit">
            <span class="t">变更后：</span>
            <el-input style="width: 300px;" placeholder="请输入变更后银行预留手机号" v-model="bank_phone.new_value"></el-input>
            <i class="el-icon-error" @click="changeSwitchOff('bank_phone')"></i>
          </div>
        </el-form-item>
        <el-form-item label="银行卡照片：" v-if="bank_type_selected !== 2">
          <div class="old-value">
            <div style="margin-right: 10px;" class="id-card-box">
              <viewer :images="bank_img.value.positive">
                <img class="vue-lazyload" v-lazy="bank_img.value.positive" alt="" title="点击查看大图" width="150"/>
                <p>银行卡正面</p>
              </viewer>
            </div>
            <div class="id-card-box">
              <viewer :images="bank_img.value.negative">
                <img class="vue-lazyload" v-lazy="bank_img.value.negative" alt="" title="点击查看大图" width="150"/>
                <p>银行卡反面</p>
              </viewer>
            </div>
            <i class="el-icon-edit-outline"
               @click="changeSwitchOn('bank_img')"></i>
          </div>
          <div class="new-value" v-show="bank_img.is_edit">
            <span class="t">变更后：</span>
            <div class="id-card-box" style="margin-right: 10px;">
              <custom-upload :img="bank_img.new_value.positive"></custom-upload>
              <p>银行卡正面</p>
            </div>
            <div class="id-card-box" style="margin-right: 10px;">
              <custom-upload :img="bank_img.new_value.negative"></custom-upload>
              <p>银行卡反面</p>
            </div>
            <i class="el-icon-error" @click="changeSwitchOff('bank_img')"></i>
          </div>
        </el-form-item>
        <el-form-item label="开户许可证或印鉴卡照片：" v-else>
          <div class="old-value">
            <div>
              <viewer :images="license_img.value">
                <img class="vue-lazyload" v-lazy="license_img.value" alt="" title="点击查看大图" width="150"/>
              </viewer>
            </div>
            <i class="el-icon-edit-outline"
               @click="changeSwitchOn('license_img')"></i>
          </div>
          <div class="new-value" v-show="license_img.is_edit">
            <span class="t">变更后：</span>
            <div>
              <custom-upload :img="license_img.new_value"></custom-upload>
            </div>
            <i class="el-icon-error" @click="changeSwitchOff('license_img')"></i>
          </div>
        </el-form-item>
        <el-form-item label="变更理由：">
          <el-input type="textarea" v-model="reason_change" :rows="5" style="width: 400px;" placeholder="请输入变更理由 （若有变更项，请务必输入变更理由）"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="info" @click="$router.go(-1)">上一步</el-button>
          <el-button type="primary" @click="nextStep">下一步</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import changeStep from '@/components/views/capital/cash/bankChange/changeStep'
  import GetProvinceList from '@/api/AreaInfo/GetProvinceList'
  import GetCityList from '@/api/AreaInfo/GetCityList'
  import GetSystemBankList from '@/api/BankInfo/GetSystemBankList'
  import CustomUpload from '@/components/public/customUpload'
  import SupplementInformation from '@/api/ShopInfo/SupplementInformation'

  export default {
    name: "changeBankInfo",
    components: {
      changeStep,
      CustomUpload,
    },
    data() {
      return {
        bank_type_selected: 0,
        bank_type_list: [
          {value: 0, label: '小微商户'},
          {value: 1, label: '个体商户'},
          {value: 2, label: '企业商户'},
        ],
        account_name: '姓名姓名',
        bank_num: {
          value: '123456798',
          is_edit: false,
          new_value: ''
        },
        bank_system_list: [],
        bank_selected: {
          value: '中国银行',
          is_edit: false,
          new_value: '',
        },
        bank_address: {
          value: '重庆市江北区',
          is_edit: false,
          new_value: {
            province: '',
            city: '',
          }
        },
        province_list: [],
        city_list: [],
        bank_branch: {
          value: '江北支行',
          is_edit: false,
          new_value: '',
        },
        bank_phone: {
          value: '123456798',
          is_edit: false,
          new_value: '',
        },
        bank_img: {
          value: {
            positive: 'http://kuailian-upload.oss-cn-shenzhen.aliyuncs.com/upload/201904/12/Gcuiv3d9BEf.jpg',
            negative: 'http://kuailian-upload.oss-cn-shenzhen.aliyuncs.com/upload/201904/12/Gcuiv3d9BEf.jpg',
          },
          is_edit: false,
          new_value: {
            positive: {
              idName: 'positive', // 类似于页面的ID，做组件的区分（一个页面多次调用上传组件时，要赋不同的值）
              limit: 1, // 上传图片的最大限制个数
              imgArr: [], // 上传成功返回的数组，默认传空
            },
            negative: {
              idName: 'negative', // 类似于页面的ID，做组件的区分（一个页面多次调用上传组件时，要赋不同的值）
              limit: 1, // 上传图片的最大限制个数
              imgArr: [], // 上传成功返回的数组，默认传空
            },
          }
        },
        license_img: {
          value: 'http://kuailian-upload.oss-cn-shenzhen.aliyuncs.com/upload/201904/12/Gcuiv3d9BEf.jpg',
          is_edit: false,
          new_value: {
            idName: 'license', // 类似于页面的ID，做组件的区分（一个页面多次调用上传组件时，要赋不同的值）
            limit: 1, // 上传图片的最大限制个数
            imgArr: [], // 上传成功返回的数组，默认传空
          },
        },
        reason_change: '',
      }
    },
    created() {
      this.getProvinceList();
      this.getSystemBankList();
    },
    methods: {
      //验证手机号
      validatePhone(value, match_name) {
        if (value.new_value === '' || value.is_edit === false) {//为空不判断或没处于编辑状态不判断
          return true;
        }
        if (!(/^1[3456789]\d{9}$/.test(value.new_value))) {
          this.$message.error(`${match_name}手机号格式有误`);
          return false;
        } else {
          return true;
        }
      },
      //验证省市区
      validateArea() {
        if (!this.bank_address.is_edit) {//未处于编辑状态
          return true;
        } else {
          let flag = true;
          for (let key in this.bank_address.new_value) {
            if (this.bank_address.new_value[key] === '') {
              this.$message.error('请选择开户银行省市');
              flag = false;
            }
          }
          return flag;
        }
      },
      //验证银行卡照片
      validateBankImg() {
        if (!this.bank_img.is_edit) {//未处于编辑状态
          return true;
        } else if (this.bank_img.new_value.positive.imgArr.length === 0 || this.bank_img.new_value.negative.imgArr.length === 0) {
          this.$message.error('请上传银行卡照片');
          return false;
        } else {
          return true;
        }
      },
      //验证开户许可证或印鉴卡照片
      validateLicenseImg() {
        if (!this.license_img.is_edit) {//未处于编辑状态
          return true;
        } else if (this.license_img.new_value.imgArr.length === 0) {
          this.$message.error('请上传开户许可证或印鉴卡照片');
          return false;
        } else {
          return true;
        }
      },
      getEditData(match_name) {
        let data;
        let old_data = this[match_name];
        //未处于编辑状态
        if (match_name === 'bank_positive' && !this.bank_img.is_edit) { //银行卡正面
          return this.bank_img.value.positive;
        } else if (match_name === 'bank_negative' && !this.bank_img.is_edit) {//银行卡反面
          return this.bank_img.value.negative;
        } else if (old_data && !old_data.is_edit) {
          return old_data.value;
        }
        //处于修改状态
        //特殊的值
        if (match_name === 'bank_province') { //银行省
          data = this.bank_address.new_value.province;
        } else if (match_name === 'bank_city') {//银行市
          data = this.bank_address.new_value.city;
        } else if (match_name === 'bank_positive') {//银行市
          data = this.bank_img.new_value.positive.imgArr[0];
        } else if (match_name === 'bank_negative') {//银行市
          data = this.bank_img.new_value.negative.imgArr[0];
        } else if (match_name === 'license_img') {//银行市
          data = this.license_img.new_value.imgArr[0];
        } else {
          data = old_data.new_value;
        }
        return data;
      },
      nextStep() {
        if (!this.validatePhone(this.bank_phone, '银行预留')) {
          return;
        }
        if (!this.validateArea()) {
          return;
        }
        if (!this.validateBankImg()) {
          return;
        }
        if (!this.validateLicenseImg()) {
          return;
        }
        //提交服务器数据
        let data = {
          "accountType": this.bank_type_selected,
          "accountName": this.account_name,
          "card": this.getEditData('bank_num'),
          "province": this.getEditData('bank_province'),
          "city": this.getEditData('bank_city'),
          "bankName": this.getEditData('bank_selected'),
          "branchName": this.getEditData('bank_branch'),
          "mobile": this.getEditData('bank_phone'),
          "positiveImg": this.getEditData('bank_positive'),
          "negativeImg": this.getEditData('bank_negative'),
          "bankLicenseImg": this.getEditData('license_img'),
          // "status": 0,
          "changeRemark": this.reason_change,
        };
        console.log('bankData:', data);
        let company_data = JSON.parse(localStorage.getItem('ChangeBankInfo'));
        console.log('companyData:', company_data);

        SupplementInformation.call(this, {
          clientTimespan: this.$Tool.formatDate(new Date()),
          bank: data,
          company: company_data,
        }).then(res => {
          if (res.data.code === 1) {

            this.$router.push({name: 'ApplyUpload'});
          } else {
            this.$message.error(res.data.desc);
          }
        });

      },
      //获取银行卡列表
      getSystemBankList() {
        GetSystemBankList.call(this, `?input.clientTimespan=${this.$Tool.formatDate(new Date())}`).then(res => {
          if (res.data.code === 1) {
            this.bank_system_list = res.data.data;
          } else {
            this.$message.error(res.data.desc);
          }
        })
      },
      changeSwitchOn(name) {
        this[name].is_edit = true;
      },
      changeSwitchOff(name) {
        this[name].is_edit = false;
      },
      //获取省市区数据
      getProvinceList() {
        GetProvinceList.call(this, `?input.clientTimespan=${this.$Tool.formatDate(new Date())}`).then(res => {
          if (res.data.code === 1) {
            this.province_list = res.data.data;
          } else {
            this.$message.error(res.data.desc);
          }
        })
      },
      //获取城市数据
      getCityList(val) {
        this.bank_address.new_value.city = '';
        GetCityList.call(this, `?input.parentCode=${val.code}&input.clientTimespan=${this.$Tool.formatDate(new Date())}`).then(res => {
          if (res.data.code === 1) {
            this.city_list = res.data.data;
          } else {
            this.$message.error(res.data.desc);
          }
        })
      },
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
    background-color: #fff;
    padding: 20px;
    margin-bottom: 20px;

    .old-value {
      position: relative;
      display: inline-block;
      min-width: 200px;
      margin-right: 40px;
      vertical-align: top;
    }

    .new-value {
      position: relative;
      display: inline-block;
      margin-left: 70px;
      vertical-align: top;

      .t {
        position: absolute;
        left: -60px;
      }
    }

    i {
      position: absolute;
      right: -25px;
      top: 10px;
      font-size: 20px;
      color: #00a2ff;
      cursor: pointer;
    }

    i.el-icon-error {
      color: #a8a8a8;
    }

    .id-card-box {
      display: inline-block;
      vertical-align: top;
      text-align: center;
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
