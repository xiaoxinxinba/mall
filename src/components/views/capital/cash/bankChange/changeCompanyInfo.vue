<template>
  <div>
    <change-step :active-index="1"></change-step>
    <div style="padding: 15px;margin-bottom: 20px;background-color: #fff">
      <strong>公司信息变更</strong>
      <strong style="float: right;color: #00a2ff;cursor: pointer;" @click="$router.push({name: 'ChangeDesc'})"><img
        src="../../img/shuoming.png" alt="" style="vertical-align: middle;margin-right: 5px">变更说明</strong>
    </div>
    <div class="title">
      <p>联系方式</p>
    </div>
    <el-form :model="company_info" :rules="company_info_rule" ref="company_info" label-width="150px" size="medium">
      <div class="main">
        <el-form-item label="经办人姓名：" class="old-value">
          <div class="old-value">{{company_info.manager_name.value}}<i class="el-icon-edit-outline"
                                                                       @click="changeSwitchOn('manager_name')"></i>
          </div>
          <div class="new-value" v-show="company_info.manager_name.is_edit">
            <span class="t">变更后：</span>
            <el-input style="width: 200px;" v-model="company_info.manager_name.new_value"></el-input>
            <i class="el-icon-error" @click="changeSwitchOff('manager_name')"></i>
          </div>
        </el-form-item>
        <el-form-item label="经办人手机：">
          <div class="old-value">{{company_info.manager_phone.value}}<i class="el-icon-edit-outline"
                                                                        @click="changeSwitchOn('manager_phone')"></i>
          </div>
          <div class="new-value" v-show="company_info.manager_phone.is_edit">
            <span class="t">变更后：</span>
            <el-input style="width: 200px;" v-model="company_info.manager_phone.new_value"></el-input>
            <i class="el-icon-error" @click="changeSwitchOff('manager_phone')"></i>
          </div>
        </el-form-item>
        <el-form-item label="负责人姓名：">
          <div class="old-value">{{company_info.principal_name.value}}<i class="el-icon-edit-outline"
                                                                         @click="changeSwitchOn('principal_name')"></i>
          </div>
          <div class="new-value" v-show="company_info.principal_name.is_edit">
            <span class="t">变更后：</span>
            <el-input style="width: 200px;" v-model="company_info.principal_name.new_value"></el-input>
            <i class="el-icon-error" @click="changeSwitchOff('principal_name')"></i>
          </div>
        </el-form-item>
        <el-form-item label="负责人电话：">
          <div class="old-value">{{company_info.principal_phone.value}}<i class="el-icon-edit-outline"
                                                                          @click="changeSwitchOn('principal_phone')"></i>
          </div>
          <div class="new-value" v-show="company_info.principal_phone.is_edit">
            <span class="t">变更后：</span>
            <el-input style="width: 200px;" v-model="company_info.principal_phone.new_value"></el-input>
            <i class="el-icon-error" @click="changeSwitchOff('principal_phone')"></i>
          </div>
        </el-form-item>
        <el-form-item label="集团/公司座机号：">
          <div class="old-value">{{company_info.company_phone.value}}<i class="el-icon-edit-outline"
                                                                        @click="changeSwitchOn('company_phone')"></i>
          </div>
          <div class="new-value" v-show="company_info.company_phone.is_edit">
            <span class="t">变更后：</span>
            <el-input style="width: 80px;" v-model="company_info.company_phone.new_value.area"></el-input>
            -
            <el-input style="width: 200px;" v-model="company_info.company_phone.new_value.phone"></el-input>
            <i class="el-icon-error" @click="changeSwitchOff('company_phone')"></i>
          </div>
        </el-form-item>
      </div>
      <div class="title">
        <p>公司/法人信息</p>
      </div>
      <div class="main">
        <el-form-item label="公司类型：">
          <div class="old-value">{{company_info.company_type.value}}<i class="el-icon-edit-outline"
                                                                       @click="changeSwitchOn('company_type')"></i>
          </div>
          <div class="new-value" v-show="company_info.company_type.is_edit">
            <span class="t">变更后：</span>
            <el-select style="width: 200px;" v-model="company_info.company_type.new_value">
              <el-option v-for="item in company_info.company_type_options" :label="item.label" :value="item.value"
                         :key="item.value"></el-option>
            </el-select>
            <i class="el-icon-error" @click="changeSwitchOff('company_type')"></i>
          </div>
        </el-form-item>
        <el-form-item label="公司名称：">
          <div class="old-value">{{company_info.company_name.value}}<i class="el-icon-edit-outline"
                                                                       @click="changeSwitchOn('company_name')"></i>
          </div>
          <div class="new-value" v-show="company_info.company_name.is_edit">
            <span class="t">变更后：</span>
            <el-input style="width: 200px;" v-model="company_info.company_name.new_value"></el-input>
            <i class="el-icon-error" @click="changeSwitchOff('company_name')"></i>
          </div>
        </el-form-item>
        <el-form-item label="公司地址：">
          <div class="old-value">{{company_info.company_address.value}}<i class="el-icon-edit-outline"
                                                                          @click="changeSwitchOn('company_address')"></i>
          </div>
          <div class="new-value" v-show="company_info.company_address.is_edit">
            <span class="t">变更后：</span>
            <el-select style="width: 150px;margin-right: 10px;"
                       v-model="company_info.company_address.new_value.province"
                       value-key="code"
                       @change="(val) => getCityList(val)">
              <el-option v-for="item in company_info.province_list" :key="item.code" :label="item.fullName"
                         :value="item"></el-option>
            </el-select>
            <el-select style="width: 150px;margin-right: 10px;" v-model="company_info.company_address.new_value.city"
                       value-key="code"
                       @change="(val) => getCountyList(val)">
              <el-option v-for="item in company_info.city_list" :key="item.code" :label="item.fullName"
                         :value="item"></el-option>
            </el-select>
            <el-select style="width: 150px;" v-model="company_info.company_address.new_value.region" value-key="code">
              <el-option v-for="item in company_info.region_list" :key="item.code" :label="item.fullName"
                         :value="item"></el-option>
            </el-select>
            <div style="margin-top: 10px;">
              <el-input v-model="company_info.company_address.new_value.area" placeholder="请输入详细地址"></el-input>
            </div>
            <i class="el-icon-error" @click="changeSwitchOff('company_address')"></i>
          </div>
        </el-form-item>
        <el-form-item label="法人姓名：">
          <div class="old-value">{{company_info.legal_name.value}}<i class="el-icon-edit-outline"
                                                                     @click="changeSwitchOn('legal_name')"></i></div>
          <div class="new-value" v-show="company_info.legal_name.is_edit">
            <span class="t">变更后：</span>
            <el-input style="width: 200px;" v-model="company_info.legal_name.new_value"></el-input>
            <i class="el-icon-error" @click="changeSwitchOff('legal_name')"></i>
          </div>
        </el-form-item>
        <el-form-item label="法人手机：">
          <div class="old-value">{{company_info.legal_phone.value}}<i class="el-icon-edit-outline"
                                                                      @click="changeSwitchOn('legal_phone')"></i></div>
          <div class="new-value" v-show="company_info.legal_phone.is_edit">
            <span class="t">变更后：</span>
            <el-input style="width: 200px;" v-model="company_info.legal_phone.new_value"></el-input>
            <i class="el-icon-error" @click="changeSwitchOff('legal_phone')"></i>
          </div>
        </el-form-item>
        <el-form-item label="法人身份证号：">
          <div class="old-value">{{company_info.legal_idCard.value}}<i class="el-icon-edit-outline"
                                                                       @click="changeSwitchOn('legal_idCard')"></i>
          </div>
          <div class="new-value" v-show="company_info.legal_idCard.is_edit">
            <span class="t">变更后：</span>
            <el-input style="width: 200px;" v-model="company_info.legal_idCard.new_value"></el-input>
            <i class="el-icon-error" @click="changeSwitchOff('legal_idCard')"></i>
          </div>
        </el-form-item>
        <el-form-item label="上传法人身份证：">
          <div class="old-value">
            <div style="margin-right: 10px;" class="id-card-box">
              <viewer :images="company_info.legal_idCard_img.value.positive">
                <img class="vue-lazyload" v-lazy="company_info.legal_idCard_img.value.positive" alt="" title="点击查看大图"
                     width="150">
                <p>身份证正面</p>
              </viewer>
            </div>
            <div class="id-card-box">
              <viewer :images="company_info.legal_idCard_img.value.negative">
                <img class="vue-lazyload" v-lazy="company_info.legal_idCard_img.value.negative" alt="" title="点击查看大图"
                     width="150">
                <p>身份证反面</p>
              </viewer>
            </div>
            <i class="el-icon-edit-outline"
               @click="changeSwitchOn('legal_idCard_img')"></i>
          </div>
          <div class="new-value" v-show="company_info.legal_idCard_img.is_edit">
            <span class="t">变更后：</span>
            <div class="id-card-box" style="margin-right: 10px;">
              <custom-upload :img="company_info.legal_idCard_img.new_value.positive"></custom-upload>
              <p>身份证正面</p>
            </div>
            <div class="id-card-box" style="margin-right: 10px;">
              <custom-upload :img="company_info.legal_idCard_img.new_value.negative"></custom-upload>
              <p>身份证反面</p>
            </div>
            <i class="el-icon-error" @click="changeSwitchOff('legal_idCard_img')"></i>
          </div>
        </el-form-item>
        <el-form-item label="营业执照：">
          <div class="old-value">
            <span>{{company_info.license_info.value.num}}</span>
            <viewer :images="company_info.license_info.value.img">
              <img class="vue-lazyload" v-lazy="company_info.license_info.value.img" alt="" title="点击查看大图" width="150">
            </viewer>
            <div>成立日期：{{company_info.license_info.value.start_time}}</div>
            <div>有效期：{{company_info.license_info.value.end_time_type === 1 ? '长期有效' :
              company_info.license_info.value.end_time}}
            </div>
            <i class="el-icon-edit-outline"
               @click="changeSwitchOn('license_info')"></i></div>
          <div class="new-value" v-show="company_info.license_info.is_edit">
            <span class="t">变更后：</span>
            <el-input style="width: 300px" v-model="company_info.license_info.new_value.num"
                      :disabled="true"></el-input>
            <div style="margin-top: 10px;">
              <div class="id-card-box">
                <custom-upload :img="company_info.license_info.new_value.img"></custom-upload>
              </div>
              <div class="id-card-box"
                   style="width: 300px;background-color: #f8f8f8;padding: 10px;color: #666;line-height: 1.5;text-align: left;">
                <div>营业执照需满足以下要求，否则会影响店铺销售：</div>
                <div>1、影印件图片必须是营业执照副本。</div>
                <div>2、影印件要求必须为彩色、清晰的数码相机拍摄件或扫描件，涂改后无效（或黑白影印件加盖公司红色公章）。</div>
                <div>3、影印件上的公司名称必须与你公司信息中填写的公司名称完全一致。</div>
                <div>4、证件须在有效期之内。</div>
                <div>5、图片必须清晰、完整、方向正确，不能带有无关的水印、标记或者其他网站的logo。</div>
                <div>6、支持jpg、png、bmp的图片格式，大小不超过3M。</div>
              </div>
            </div>
            <div style="margin: 10px 0;">
              成立日期：
              <el-date-picker
                v-model="company_info.license_info.new_value.start_time"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
              >
              </el-date-picker>
            </div>
            <div>
              有效期：
              <el-radio-group v-model="company_info.license_info.new_value.end_time_type">
                <el-radio :label="1">长期有效</el-radio>
                <el-radio :label="2">有效期至</el-radio>
              </el-radio-group>
              <el-date-picker
                v-if="company_info.license_info.new_value.end_time_type === 2"
                v-model="company_info.license_info.new_value.end_time"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
              >
              </el-date-picker>
            </div>
            <i class="el-icon-error" @click="changeSwitchOff('license_info')"></i>
          </div>
        </el-form-item>
        <el-form-item label="变更理由：">
          <el-input type="textarea" v-model="company_info.reason_change" :rows="5" style="width: 400px;"
                    placeholder="请输入变更理由 （若有变更项，请务必输入变更理由）"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="info" @click="$router.go(-1)">上一步</el-button>
          <el-button type="primary" @click="nextStep">下一步</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
  import changeStep from '@/components/views/capital/cash/bankChange/changeStep'
  import GetProvinceList from '@/api/AreaInfo/GetProvinceList'
  import GetCityList from '@/api/AreaInfo/GetCityList'
  import GetCountyList from '@/api/AreaInfo/GetCountyList'
  import CustomUpload from '@/components/public/customUpload'

  export default {
    name: "changeCompanyInfo",
    components: {
      changeStep,
      CustomUpload,
    },
    data() {
      return {
        company_info: {
          manager_name: {
            value: '123456',
            is_edit: false,
            new_value: '',
          },
          manager_phone: {
            value: 'xxxxxxx',
            is_edit: false,
            new_value: '',
          },
          principal_name: {
            value: '123qwerqwe',
            is_edit: false,
            new_value: '',
          },
          principal_phone: {
            value: '18989898989',
            is_edit: false,
            new_value: '',
          },
          company_phone: {
            value: '023-123464',
            is_edit: false,
            new_value: {
              area: '',
              phone: '',
            },
          },
          company_type: {
            value: '私营企业',
            is_edit: false,
            new_value: '',
          },
          company_type_options: [
            {value: '个体户', label: '个体户'},
            {value: '私营企业', label: '私营企业'},
            {value: '国营企业', label: '国营企业'},
            {value: '合资企业', label: '合资企业'},
            {value: '上市公司', label: '上市公司'},
            {value: '政府机构', label: '政府机构'},
            {value: '事业单位', label: '事业单位'},
            {value: '公益机构', label: '公益机构'}
          ],
          company_name: {
            value: 'xx科技公司',
            is_edit: false,
            new_value: '',
          },
          company_address: {
            value: '重庆市 江北区',
            is_edit: false,
            new_value: {
              province: '',
              city: '',
              region: '',
              area: '',//详细地址
            }
          },
          province_list: [],
          city_list: [],
          region_list: [],
          legal_name: {
            value: '法人姓名',
            is_edit: false,
            new_value: '',
          },
          legal_phone: {
            value: '法人手机',
            is_edit: false,
            new_value: '',
          },
          legal_idCard: {
            value: '500101111111',
            is_edit: false,
            new_value: '',
          },
          legal_idCard_img: {
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
            },
          },
          license_info: {
            value: {
              num: 'qwer45a64d87v2',
              img: 'http://kuailian-upload.oss-cn-shenzhen.aliyuncs.com/upload/201904/12/Gcuiv3d9BEf.jpg',
              start_time: '9102-02-02',
              end_time_type: 1,//1 长期有效 2 有效期至
              end_time: '2019-09-09',
            },
            is_edit: false,
            new_value: {
              num: 'qwer45a64d87v2',
              img: {
                idName: 'license_info', // 类似于页面的ID，做组件的区分（一个页面多次调用上传组件时，要赋不同的值）
                limit: 1, // 上传图片的最大限制个数
                imgArr: [], // 上传成功返回的数组，默认传空
              },
              start_time: '',
              end_time_type: 1,
              end_time: '',
            }
          },
          reason_change: '',
        },
        company_info_rule: {}
      }
    },
    created() {
      this.getProvinceList();
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
      //验证身份证号
      validateIdCard(value, match_name) {
        if (value.new_value === '' || value.is_edit === false) {//为空不判断或没处于编辑状态不判断
          return true;
        }
        if (!(/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(value.new_value))) {
          this.$message.error(`${match_name}身份证号格式有误`);
          return false;
        } else {
          return true;
        }
      },
      //验证省市区
      validateArea() {
        if (!this.company_info.company_address.is_edit) {//未处于编辑状态
          return true
        } else {
          let flag = true;
          for (let key in this.company_info.company_address.new_value) {
            if (this.company_info.company_address.new_value[key] === '') {
              this.$message.error('请选择省市区以及输入详细地址');
              flag = false;
            }
          }
          return flag;
        }
      },
      //验证座机号
      validateCompanyPhone() {
        if (!this.company_info.company_phone.is_edit) {//未处于编辑状态
          return true;
        } else if (this.company_info.company_phone.new_value.area === '' || this.company_info.company_phone.new_value.phone === '') {
          this.$message.error('请将集团/公司座机号填写完整');
          return false;
        } else {
          return true;
        }
      },
      //营业执照信息验证
      validateLicense() {
        let new_value = this.company_info.license_info.new_value;
        if (!this.company_info.license_info.is_edit) {//未处于编辑状态
          return true;
        } else if (new_value.num === '' || new_value.img.imgArr.length === 0 || new_value.start_time === '' || (new_value.end_time_type === 2 && new_value.end_time === '')) {
          this.$message.error('请将营业执照信息填写完整');
          return false;
        } else {
          return true;
        }
      },
      //法人身份证验证
      validateLegalId() {
        let new_value = this.company_info.legal_idCard_img.new_value;
        if (!new_value.is_edit) {//未处于编辑状态
          return true;
        } else if (new_value.positive.imgArr.length === 0 || new_value.negative.imgArr.length === 0) {
          this.$message.error('请上传法人身份证照片');
          return false;
        } else {
          return true;
        }
      },
      //获取具体的值
      getEditData(match_name) {
        let data;
        let old_data = this.company_info[match_name];
        //未处于编辑状态
        if (match_name === 'license_info_img' && !this.company_info.license_info.is_edit) { //营业执照照片
          return this.company_info.license_info.value.img;
        } else if (match_name === 'license_info_num' && !this.company_info.license_info.is_edit) {//营业执照号
          return this.company_info.license_info.value.num;
        } else if (match_name === 'license_info_start' && !this.company_info.license_info.is_edit) {//营业执照开始时间
          return this.company_info.license_info.value.start_time;
        } else if (match_name === 'license_info_end' && !this.company_info.license_info.is_edit) {//营业执照到期时间
          return this.company_info.license_info.value.end_time;
        } else if (match_name === 'license_info_end_type' && !this.company_info.license_info.is_edit) {//营业执照到期时间
          return this.company_info.license_info.value.end_time_type;
        } else if (match_name === 'legal_idCard_positive' && !this.company_info.license_info.is_edit) {//法人身份证正面
          return this.company_info.legal_idCard_img.value.positive;
        } else if (match_name === 'legal_idCard_negative' && !this.company_info.license_info.is_edit) {//法人身份证反面
          return this.company_info.legal_idCard_img.value.negative;
        } else if (old_data && !old_data.is_edit) {
          return old_data.value;
        }
        //处于修改状态
        //特殊的值
        if (match_name === 'company_phone') { //公司集团电话
          data = `${old_data.new_value.area}-${old_data.new_value.phone}`;
        } else if (match_name === 'company_address') {//公司省市区
          data = `${old_data.new_value.province},${old_data.new_value.city},${old_data.new_value.region}`;
        } else if (match_name === 'company_address_detail') {//公司详细地址
          data = this.company_info.company_address.new_value.area;
        } else if (match_name === 'license_info_img') {//营业执照照片
          data = this.company_info.license_info.new_value.img.imgArr[0];
        } else if (match_name === 'license_info_num') {//营业执照号
          data = this.company_info.license_info.new_value.num;
        } else if (match_name === 'license_info_start') {//营业执照成立时间
          data = this.company_info.license_info.new_value.start_time;
        } else if (match_name === 'license_info_end') {//营业执照到期时间
          data = this.company_info.license_info.new_value.end_time;
        } else if (match_name === 'license_info_end_type') {//营业执照到期类型
          data = this.company_info.license_info.new_value.end_time_type;
        } else if (match_name === 'legal_idCard_positive') {//法人身份证正面
          data = this.company_info.legal_idCard_img.new_value.positive.imgArr[0];
        } else if (match_name === 'legal_idCard_negative') {//法人身份证反面
          data = this.company_info.legal_idCard_img.new_value.negative.imgArr[0];
        } else {
          data = old_data.new_value;
        }
        return data;
      },
      nextStep() {
        if (!this.validatePhone(this.company_info.manager_phone, '经办人')) {
          return;
        }
        if (!this.validatePhone(this.company_info.principal_phone, '负责人')) {
          return;
        }
        if (!this.validatePhone(this.company_info.legal_phone, '法人')) {
          return;
        }
        if (!this.validateIdCard(this.company_info.legal_idCard, '法人')) {
          return;
        }
        if (!this.validateArea()) {
          return;
        }
        if (!this.validateCompanyPhone()) {
          return;
        }
        if (!this.validateLicense()) {
          return;
        }
        if (!this.validateLegalId()) {
          return;
        }
        //构造提交服务器数据
        let data = {
          "operatorName": this.getEditData('manager_name'),
          "operatorMobile": this.getEditData('manager_phone'),
          "managerName": this.getEditData('principal_name'),
          "mangeMobile": this.getEditData('principal_phone'),
          "telephone": this.getEditData('company_phone'),
          "type": this.getEditData('company_type'),
          "name": this.getEditData('company_name'),
          "area": this.getEditData('company_address'),
          "address": this.getEditData('company_address_detail'),
          "businesLicenseImg": this.getEditData('license_info_img'),
          "businesLicenseCard": this.getEditData('license_info_num'),
          "businesLicenseCreateTime": this.getEditData('license_info_start'),
          "businesLicenseValidTime": this.getEditData('license_info_end'),
          "businessLicenseValidType": this.getEditData('license_info_end_type'),
          "legalPersonName": this.getEditData('legal_name'),
          "legalPersonMobile": this.getEditData('legal_phone'),
          "legalPersonIdCard": this.getEditData('legal_idCard'),
          "legalPersonIdCardPositiveImg": this.getEditData('legal_idCard_positive'),
          "legalPersonIdCardNegativeImg": this.getEditData('legal_idCard_negative'),
          // "status": this.getEditData(),
          "changeRemark": this.company_info.reason_change,
        };
        console.log('company_data:', data);
        localStorage.setItem('ChangeBankInfo', JSON.stringify(data));
        this.$router.push({name: 'ChangeBankInfo'});
      },
      changeSwitchOn(name) {
        this.company_info[name].is_edit = true;
      },
      changeSwitchOff(name) {
        this.company_info[name].is_edit = false;
      },
      //获取省市区数据
      getProvinceList() {
        GetProvinceList.call(this, `?input.clientTimespan=${this.$Tool.formatDate(new Date())}`).then(res => {
          if (res.data.code === 1) {
            this.company_info.province_list = res.data.data;
          } else {
            this.$message.error(res.data.desc);
          }
        })
      },
      //获取城市数据
      getCityList(val) {
        this.company_info.company_address.new_value.city = '';
        this.company_info.company_address.new_value.region = '';
        GetCityList.call(this, `?input.parentCode=${val.code}&input.clientTimespan=${this.$Tool.formatDate(new Date())}`).then(res => {
          if (res.data.code === 1) {
            this.company_info.city_list = res.data.data;
          } else {
            this.$message.error(res.data.desc);
          }
        })
      },
      //获取行政区数据
      getCountyList(val) {
        this.company_info.company_address.new_value.region = '';
        GetCountyList.call(this, `?input.parentCode=${val.code}&input.clientTimespan=${this.$Tool.formatDate(new Date())}`).then(res => {
          if (res.data.code === 1) {
            this.company_info.region_list = res.data.data;
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
