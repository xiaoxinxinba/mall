<template>
  <div v-loading="page_loading">
    <div v-if="tabsSelected === 'company'">
      <div class="remind" v-if="status_company === 0">请认真核对已有的信息，并补充缺少的信息，否则将影响交易！</div>
      <div class="remind" v-else><i class="el-icon-warning"></i>{{reason_company}}</div>
    </div>
    <div v-if="tabsSelected === 'bank'">
      <div class="remind" v-if="status_bank === 0">请认真核对已有的信息，并补充缺少的信息，否则将影响交易！</div>
      <div class="remind" v-else><i class="el-icon-warning"></i>{{reason_bank}}</div>
    </div>
    <!--公司信息-->
    <div v-show="tabsSelected === 'company'" class="container company">
      <div class="main">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">

          <div>
            <div class="form_wrap">
              <div class="form_span">
                <span>联系方式</span>
                <i>经办人、负责人须填写不同联系方式，否则将影响店铺订单信息接收</i>
              </div>
              <div class="form_box">
                <el-form-item label="经办人姓名：" prop="chargePerple_name">
                  <el-input style="width: 440px;" v-model="ruleForm.chargePerple_name"
                            placeholder="请输入经办人姓名"></el-input>
                </el-form-item>
                <el-form-item label="经办人手机：" prop="chargePerple_phone">
                  <el-input style="width: 440px;" v-model="ruleForm.chargePerple_phone"
                            placeholder="请输入经办人手机"></el-input>
                </el-form-item>
                <el-form-item label="负责人姓名：" prop="responsPerple_name">
                  <el-input style="width: 440px;" v-model="ruleForm.responsPerple_name"
                            placeholder="请输入负责人姓名"></el-input>
                </el-form-item>
                <el-form-item label="负责人手机：" prop="responsPerple_phone">
                  <el-input style="width: 440px;" v-model="ruleForm.responsPerple_phone"
                            placeholder="请输入负责人手机"></el-input>
                </el-form-item>
                <el-form-item label="集团/公司座机号：">
                  <el-input style="width: 100px;" placeholder="023" v-model="ruleForm.tel_areaCode"></el-input>
                  <span> - </span>
                  <el-input style="width: 328px;" placeholder="55555555" v-model="ruleForm.tel_num"></el-input>
                </el-form-item>

              </div>
            </div>

            <div class="form_wrap">
              <div class="form_span">
                <span>公司/法人信息 </span>
                <i>请严格按照相关证件信息，正确填写公司信息</i>
              </div>
              <div class="form_box">
                <el-form-item label="公司类型：">
                  <el-select v-model="ruleForm.companyType" placeholder="请选择公司类型" style="width: 440px;">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="公司名称：" prop="company_name">
                  <el-input style="width: 440px;" placeholder="请与营业执照上的公司名称保持一致"
                            v-model="ruleForm.company_name"></el-input>
                  <span class="company_name_remind">(若是个体经营户，请填写营业执照上的名称)</span>
                </el-form-item>


                <el-form-item label="公司地址：" required>
                  <div class="area-company">
                    <div class="area-select">
                      <el-form-item label="" prop="province">
                        <el-select v-model="ruleForm.province" value-key="code" placeholder="请选择"
                                   @change="(val) => GetCityList(val, 'company')">
                          <el-option v-for="item in areaInfoCompany.province" :key="item.code" :label="item.fullName"
                                     :value="item"></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                    <div class="area-select">
                      <el-form-item label="" prop="city">
                        <el-select v-model="ruleForm.city" value-key="code" placeholder="请选择" @change="GetCountyList">
                          <el-option v-for="item in areaInfoCompany.city" :key="item.code" :label="item.fullName"
                                     :value="item"></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                    <div class="area-select area-select-last">
                      <el-form-item label="" prop="region">
                        <el-select v-model="ruleForm.region" value-key="code" placeholder="请选择">
                          <el-option v-for="item in areaInfoCompany.country" :key="item.code" :label="item.fullName"
                                     :value="item"></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </div>
                </el-form-item>


                <el-form-item prop="particular">
                  <div>
                    <el-input type="textarea" style="width: 440px;" :autosize="{ minRows: 4}" resize="none"
                              placeholder="请输入内容" v-model="ruleForm.particular"></el-input>
                    <span class="particular-remind">公司地址请与营业执照上的住所保持一致</span>
                  </div>
                </el-form-item>


                <el-form-item label="法人姓名：" prop="legalperson_name">
                  <el-input style="width: 440px;" v-model="ruleForm.legalperson_name"
                            placeholder="请与营业执照上的法人姓名保持一致"></el-input>
                </el-form-item>
                <el-form-item label="法人手机：" prop="legalperson_phone">
                  <el-input style="width: 440px;" placeholder="请输入法人电话" v-model="ruleForm.legalperson_phone"></el-input>
                </el-form-item>
                <el-form-item label="法人身份证号：" prop="legalperson_idCard">
                  <el-input style="width: 440px;" placeholder="请输入法人18位身份证号"
                            v-model="ruleForm.legalperson_idCard"></el-input>
                </el-form-item>

                <el-form-item label="法人身份证：" prop="idFacadeImg">
                  <el-input v-if="false" v-model="idFacadeImg"></el-input>
                  <div class="cardImg_style">
                    <div>
                      <CustomUpload :img="idFacadeImg"></CustomUpload>
                    </div>
                    <p>（身份证正面照）</p>
                  </div>

                  <div class="cardImg_style marLeft_40">
                    <div>
                      <CustomUpload :img="idBackImg"></CustomUpload>
                    </div>
                    <p>（身份证反面照）</p>
                  </div>

                  <div class="tip_style">要求：证件文字清新，建议使用原图</div>
                </el-form-item>


                <el-form-item label="营业执照号：" prop="license_code">
                  <el-input style="width: 440px;" placeholder="请输入营业执照号" :disabled="true"
                            v-model="ruleForm.license_code"></el-input>
                </el-form-item>


                <el-form-item label="营业执照：" prop="businesLicense">
                  <el-input v-model="businesLicense" v-if="false"></el-input>
                  <div class="license-style">
                    <div class="upload">
                      <CustomUpload :img="businesLicense"></CustomUpload>
                    </div>
                    <div class="license-explain">
                      <ul>
                        <div>营业执照需满足以下要求，否则会影响店铺销售：</div>
                        <li>1、影印件图片必须是营业执照副本。</li>
                        <li>2、影印件要求必须为彩色、清晰的数码相机拍摄件或扫描件，涂改后无效（或黑白影印件加盖公司红色公章）</li>
                        <li>3、影印件上的公司名称必须与你公司信息中填写的公司名称完全一致。</li>
                        <li>4、证件须在有效期之内。</li>
                        <li>5、图片必须清晰、完整、方向正确，不能带有无关的水印、标记或者其他网站的logo。</li>
                        <li>6、支持jpg、png、bmp的图片格式，大小不超过8M。</li>
                      </ul>
                    </div>
                  </div>
                </el-form-item>


                <el-form-item label="成立日期：" prop="startDate">
                  <el-date-picker style="width: 440px;" v-model="ruleForm.startDate" type="date"
                                  placeholder="选择日期"></el-date-picker>
                </el-form-item>

                <el-form-item label="有效期：">
                  <el-radio v-model="ruleForm.radio" :label="1">长期有效</el-radio>
                  <el-radio v-model="ruleForm.radio" :label="2">有效期至</el-radio>
                  <el-date-picker style="width: 211px;" v-model="ruleForm.endDate" type="date"
                                  placeholder="选择日期"></el-date-picker>
                  <div class="end-date">无营业期限、获取截止日期、或结束日期为永久，请选择长期有效</div>
                </el-form-item>


                <el-form-item label="微信账号：">
                  <el-input style="width: 440px;" placeholder="请输入微信账号" v-model="ruleForm.weChat"></el-input>
                </el-form-item>
                <el-form-item label="支付宝账号：">
                  <el-input style="width: 440px;" placeholder="请输入支付宝账号" v-model="ruleForm.alipay"></el-input>
                </el-form-item>

              </div>
            </div>

            <div class="marginTop_30">
              <el-form-item>
                <el-button type="primary" @click="submitFormCompany('ruleForm')">下一步</el-button>
              </el-form-item>
            </div>
          </div>
        </el-form>


      </div>
    </div>
    <!--    银行卡信息-->
    <div v-show="tabsSelected === 'bank'" class="container bank">
      <div class="main">
        <div class="choose_type">
          <span>请选择绑定的帐户类型（必选）</span>
          <el-select style="width: 150px;" v-model="account" placeholder="请选择">
            <el-option v-for="item in options_bank" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="main_list">
          <div class="main_title">
            <p>{{account === 2 ? '公司账户':'法人账户'}}</p>
            <p>温馨提示：您绑定的{{account === 2 ?'公司账户':'法人账户'}}信息请与《服务合同》上的信息保持一致</p>
          </div>

          <div class="main_from">
            <el-form :model="ruleForm_bank" :rules="rules_bank" ref="ruleForm_bank" label-width="190px"
                     class="demo-ruleForm">
              <el-form-item label="公司名称：" prop="companyName" v-if="account === 2">
                <el-input style="width: 440px;" :disabled="false" placeholder="请输入公司名称"
                          v-model="ruleForm_bank.companyName"></el-input>
              </el-form-item>
              <el-form-item label="持卡人姓名：" prop="name" v-else>
                <el-input style="width: 440px;" :disabled="false" placeholder="请输入持卡人姓名"
                          v-model="ruleForm_bank.name"></el-input>
              </el-form-item>
              <el-form-item label="银行账号：" prop="bankNum">
                <el-input style="width: 440px;" v-model="ruleForm_bank.bankNum"
                          :placeholder="account === 2 ? '请输入公司开户银行账号（仅限储蓄卡）':'请输入法人银行账号（仅限储蓄卡）'"></el-input>
              </el-form-item>
              <el-form-item label="开户银行：" prop="bankOpen">
                <el-select style="width: 440px;" v-model="ruleForm_bank.bankOpen" filterable placeholder="搜索开户银行">
                  <el-option v-for="item in optionsBankOpen" :key="item.id" :label="item.title"
                             :value="item.title"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="开户银行省市：" required>
                <div class="area_company">
                  <div class="area_select">
                    <el-form-item label="" prop="province">
                      <el-select v-model="ruleForm_bank.province" value-key="code" placeholder="请选择省份"
                                 @change="(val) => GetCityList(val, 'bank')">
                        <el-option v-for="item in areaInfoBank.province" :key="item.code" :label="item.fullName"
                                   :value="item"></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                  <div class="area_select area_select_last">
                    <el-form-item label="" prop="city">
                      <el-select v-model="ruleForm_bank.city" value-key="code" placeholder="请选择城市">
                        <el-option v-for="item in areaInfoBank.city" :key="item.code" :label="item.fullName"
                                   :value="item"></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </div>
              </el-form-item>

              <el-form-item label="所属支行：" prop="bankBase">
                <el-input style="width: 440px;" placeholder="请输入所属支行" v-model="ruleForm_bank.bankBase"></el-input>
              </el-form-item>
              <div class="bank_base">准确的所属支行信息，将会加快提现的到账速度</div>


              <el-form-item label="银行预留手机号：" prop="phone">
                <el-input style="width: 440px;" v-model="ruleForm_bank.phone" placeholder="请输入银行预留手机号"></el-input>
              </el-form-item>

              <el-form-item label="银行卡照片：" prop="bank_positive" v-if="account !== 2">
                <el-input v-model="bank_positive" v-if="false"></el-input>
                <div class="cardImg_style">
                  <div>
                    <CustomUpload :img="bank_positive"></CustomUpload>
                  </div>
                  <p>（银行卡正面照）</p>
                </div>

                <div class="cardImg_style marLeft_40">
                  <div>
                    <CustomUpload :img="bank_negative"></CustomUpload>
                  </div>
                  <p>（银行卡反面照）</p>
                </div>

                <div class="tip_style">要求：证件文字清新，建议使用原图</div>
              </el-form-item>


              <el-form-item label="开户许可证或印鉴卡照片：" prop="bank_license" v-else>
                <el-input v-model="bank_license" v-if="false"></el-input>
                <div class="cardImg_style">
                  <div>
                    <CustomUpload :img="bank_license"></CustomUpload>
                  </div>
                </div>
              </el-form-item>

              <el-form-item>
                <el-button @click="goBackToCompany">上一步</el-button>
                <el-button type="primary" @click="submitFormBank('ruleForm_bank')">提交审核</el-button>
              </el-form-item>
            </el-form>

          </div>


        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import GetProvinceList from '@/api/AreaInfo/GetProvinceList'
  import GetCityList from '@/api/AreaInfo/GetCityList'
  import GetCountyList from '@/api/AreaInfo/GetCountyList'
  import GetSystemBankList from '@/api/BankInfo/GetSystemBankList'
  import GetSupplementInformation from '@/api/ShopInfo/GetSupplementInformation'
  import SupplementInformation from '@/api/ShopInfo/SupplementInformation'
  import CustomUpload from '@/components/public/customUpload'

  export default {
    name: "updataCompany",
    components: {
      CustomUpload,
    },
    data() {
      //手机验证规则
      let validatePhone = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入手机号'));
        } else if (!(/^1[3456789]\d{9}$/.test(value))) {
          callback(new Error('手机号格式有误'))
        } else {
          callback()
        }
      };
      //身份证验证规则
      let validateIdCard = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入身份证号'));
        } else if (!(/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(value))) {
          callback(new Error('身份证号格式有误'))
        } else {
          callback()
        }
      };
      //身份证照片规则
      let validateIdCardImg = (rule, value, callback) => {
        if (this.idFacadeImg.imgArr.length === 0 || this.idBackImg.imgArr.length === 0) {
          callback(new Error('请上传身份证照片'));
        } else {
          callback()
        }
      };
      //营业执照照片规则
      let validateLicenseImg = (rule, value, callback) => {
        if (this.businesLicense.imgArr.length === 0) {
          callback(new Error('请上传营业执照照片'));
        } else {
          callback()
        }
      };
      //银行卡照片规则
      let validateBankImg = (rule, value, callback) => {
        if (this.bank_positive.imgArr.length === 0 || this.bank_negative.imgArr.length === 0) {
          callback(new Error('请上传银行卡照片'));
        } else {
          callback()
        }
      };
      //银行卡照片规则
      let validateBankLicenseImg = (rule, value, callback) => {
        if (this.bank_license.imgArr.length === 0) {
          callback(new Error('请上传开户许可证或印鉴卡照片'));
        } else {
          callback()
        }
      };
      return {
        page_loading: false,

        status: 0,
        tabsSelected: 'company',
        status_company: 0, //审核状态 0待审核1通过2未通过
        reason_company: '',//原因
        ruleForm: {
          chargePerple_name: '',
          chargePerple_phone: '',
          responsPerple_name: '',
          responsPerple_phone: '',
          company_name: '',
          legalperson_name: '',
          imageUrl: '',
          companyType: '',
          province: '',
          city: '',
          region: '',
          particular: '',
          tel_areaCode: '',
          tel_num: '',
          idFacadeImg: '', //身份证正面
          idBackImg: '', //身份证背面
          legalperson_phone: '',
          legalperson_idCard: '',
          weChat: '',
          alipay: '',
          license_code: '',
          startDate: '',
          radio: '长期有效',
          endDate: '',
        },
        rules: {
          chargePerple_name: [
            {required: true, message: '请输入经办人姓名', trigger: 'blur'},
            {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
          ],
          chargePerple_phone: [
            {required: true, validator: validatePhone, trigger: 'blur'}
          ],
          responsPerple_name: [
            {required: true, message: '请输入负责人姓名', trigger: 'blur'}
          ],
          responsPerple_phone: [
            {required: true, validator: validatePhone, trigger: 'blur'}
          ],
          legalperson_name: [
            {required: true, message: '请输入法人姓名', trigger: 'blur'}
          ],
          company_name: [
            {required: true, message: '请输入公司名称', trigger: 'blur'}
          ],
          province: [
            {required: true, message: '请选择省', trigger: 'change'}
          ],
          city: [
            {required: true, message: '请选择市', trigger: 'change'}
          ],
          region: [
            {required: true, message: '请选择区', trigger: 'change'}
          ],
          particular: [
            {required: true, message: '请填写详情地址', trigger: 'blur'}
          ],
          legalperson_phone: [
            {required: true, validator: validatePhone, trigger: 'blur'}
          ],
          legalperson_idCard: [
            {required: true, validator: validateIdCard, trigger: 'blur'}
          ],
          license_code: [
            {required: true, message: '请输入营业执照号', trigger: 'blur'}
          ],
          startDate: [
            {required: true, message: '请选择成立日期', trigger: 'blur'}
          ],
          idFacadeImg: [
            {required: true, validator: validateIdCardImg, trigger: 'blur'},
          ],
          businesLicense: [
            {required: true, validator: validateLicenseImg, trigger: 'blur'}
          ]
        },
        options: [{ // 公司类型参数
          value: '个体户', label: '个体户'
        },
          {value: '私营企业', label: '私营企业'},
          {value: '国营企业', label: '国营企业'},
          {value: '合资企业', label: '合资企业'},
          {value: '上市公司', label: '上市公司'},
          {value: '政府机构', label: '政府机构'},
          {value: '事业单位', label: '事业单位'},
          {value: '公益机构', label: '公益机构'}],

        //银行卡
        bankIsInit: false,

        status_bank: 0, //审核状态 0待审核1通过2未通过
        reason_bank: '',//原因
        account: 0,
        options_bank: [{value: 0, label: '小微商户'}, {value: 1, label: '个体商户'}, {value: 2, label: '企业商户'}],
        optionsBankOpen: [],
        ruleForm_bank: {
          companyName: '',
          name: '',
          bankNum: '',
          bankOpen: '',
          province: '',
          city: '',
          bankBase: '',
          phone: '',
          positiveImg: '', //正面照片
          negativeImg: '',//反面照片
          bankLicenseImg: '', //开户许可证或印鉴卡图片（公司）
        },
        rules_bank: {
          companyName: [{required: true, message: '请输入公司名称', trigger: 'blur'}],
          name: [{required: true, message: '请输入持卡人姓名', trigger: 'blur'}],
          bankNum: [{required: true, message: '请输入银行卡账号', trigger: 'blur'}],
          bankOpen: [{required: true, message: '请选择开户银行', trigger: 'change'}],
          province: [{required: true, message: '请选择省份', trigger: 'change'}],
          city: [{required: true, message: '请选择城市', trigger: 'change'}],
          bankBase: [{required: true, message: '请填写所属支行', trigger: 'blur'}],
          phone: [{required: true, validator: validatePhone , trigger: 'blur'}],
          bank_positive: [{required: true,validator: validateBankImg, trigger: 'blur' }],
          bank_license: [{required: true, validator: validateBankLicenseImg, trigger: 'blur'}]
        },
        //上传相关
        //银行卡正面
        bank_positive: {
          idName: 'bank_positive', // 类似于页面的ID，做组件的区分（一个页面多次调用上传组件时，要赋不同的值）
          limit: 1, // 上传图片的最大限制个数
          imgArr: [], // 上传成功返回的数组，默认传空
        },
        //银行卡反面
        bank_negative: {
          idName: 'bank_negative', // 类似于页面的ID，做组件的区分（一个页面多次调用上传组件时，要赋不同的值）
          limit: 1, // 上传图片的最大限制个数
          imgArr: [], // 上传成功返回的数组，默认传空
        },
        //开户许可证或印鉴卡图片
        bank_license: {
          idName: 'bank_license', // 类似于页面的ID，做组件的区分（一个页面多次调用上传组件时，要赋不同的值）
          limit: 1, // 上传图片的最大限制个数
          imgArr: [], // 上传成功返回的数组，默认传空
        },
        //法人身份证正面
        idFacadeImg: {
          idName: 'idFacadeImg', // 类似于页面的ID，做组件的区分（一个页面多次调用上传组件时，要赋不同的值）
          limit: 1, // 上传图片的最大限制个数
          imgArr: [], // 上传成功返回的数组，默认传空
        },
        //法人身份证反面
        idBackImg: {
          idName: 'idBackImg', // 类似于页面的ID，做组件的区分（一个页面多次调用上传组件时，要赋不同的值）
          limit: 1, // 上传图片的最大限制个数
          imgArr: [], // 上传成功返回的数组，默认传空
        },
        businesLicense: {
          idName: 'businesLicense', // 类似于页面的ID，做组件的区分（一个页面多次调用上传组件时，要赋不同的值）
          limit: 1, // 上传图片的最大限制个数
          imgArr: [], // 上传成功返回的数组，默认传空
        },
        //省市区
        areaInfoCompany: {
          province: [],//省
          city: [],//市
          country: [],//行政区
        },
        areaInfoBank: {
          province: [], //省
          city: [], //市
        }

      };
    },
    created() {
      // this.GetProvinceList();
      this.GetSupplementInformation();
      this.$parent.change(1);
    },
    methods: {
      //获取系统配置银行卡
      GetSystemBankList() {
        GetSystemBankList.call(this, `?input.clientTimespan=${this.$Tool.formatDate(new Date())}`).then(res => {
          if (res.data.code === 1) {
            this.optionsBankOpen = res.data.data;
          } else {
            this.$message.error(res.data.desc);
          }
        })
      },
      //获取补充资料
      GetSupplementInformation() {
        this.page_loading = true;
        GetSupplementInformation.call(this, `?input.clientTimespan=${this.$Tool.formatDate(new Date())}`).then(async (res) => {
          this.page_loading = false;
          if (res.data.code === 1) {
            this.status = res.data.data.status;
            let company_data = res.data.data.company;
            this.ruleForm.chargePerple_name = company_data.operatorName;
            this.ruleForm.chargePerple_phone = company_data.operatorMobile;
            this.ruleForm.responsPerple_name = company_data.managerName;
            this.ruleForm.responsPerple_phone = company_data.mangeMobile;
            this.ruleForm.tel_areaCode = company_data.telephone ? company_data.telephone.split('-')[0] : '';
            this.ruleForm.tel_num = company_data.telephone ? company_data.telephone.split('-')[1] : '';
            this.ruleForm.companyType = company_data.type;
            this.ruleForm.company_name = company_data.name;
            //获取省市区数据
            try {
              await this.GetProvinceList();//等待获取城市省份列表
            } catch (e) {
              console.log(e);
            }
            if (company_data.area && company_data.area.length > 0) {
              let province_data = company_data.area.split(',')[0] || '';

              //获取选择省份数据
              this.ruleForm.province = this.areaInfoCompany.province.find(item => item.fullName === province_data);

              let city_data = company_data.area.split(',')[1] || '';
              if (city_data) {
                if (this.ruleForm.province) {
                  //获取选择城市列表
                  try {
                    await this.GetCityList(this.ruleForm.province, 'company', false);
                  } catch (e) {
                    console.log(e);
                  }
                }
                //
                this.ruleForm.city = this.areaInfoCompany.city.find(item => item.fullName === city_data);
              }
              let region_data = company_data.area.split(',')[2] || '';
              if (region_data) {
                if (this.ruleForm.city) {
                  //
                  try {
                    await this.GetCountyList(this.ruleForm.city, false);
                  } catch (e) {
                    console.log(e);
                  }

                }
                this.ruleForm.region = this.areaInfoCompany.country.find(item => item.fullName === region_data);
              }
            }
            //
            this.ruleForm.particular = company_data.address;
            this.ruleForm.legalperson_name = company_data.legalPersonName;
            this.ruleForm.legalperson_phone = company_data.legalPersonMobile;
            this.ruleForm.legalperson_idCard = company_data.legalPersonIdCard;
            this.ruleForm.license_code = company_data.businesLicenseCard;
            this.ruleForm.startDate = company_data.businesLicenseCreateTime;
            this.ruleForm.endDate = company_data.businesLicenseValidTime;
            this.ruleForm.radio = company_data.businessLicenseValidType;
            // this.ruleForm.weChat = company_data.wechatAccount;
            // this.ruleForm.alipay = company_data.alipayAccount;
            this.status_company = company_data.status;
            this.reason_company = company_data.reason;
            //存入已有图片
            company_data.legalPersonIdCardPositiveImg && this.idFacadeImg.imgArr.push(company_data.legalPersonIdCardPositiveImg);
            company_data.legalPersonIdCardNegativeImg && this.idBackImg.imgArr.push(company_data.legalPersonIdCardNegativeImg);
            company_data.businesLicenseImg && this.businesLicense.imgArr.push(company_data.businesLicenseImg);

            let bank_data = res.data.data.bank;
            this.account = bank_data.accountType;
            this.ruleForm_bank.companyName = bank_data.accountName;
            this.ruleForm_bank.name = bank_data.accountName;
            this.ruleForm_bank.bankNum = bank_data.card;
            this.ruleForm_bank.bankOpen = bank_data.bankName;
            this.ruleForm_bank.bankBase = bank_data.branchName;
            this.ruleForm_bank.phone = bank_data.mobile;

            let province_data = bank_data.province;
            if (province_data) {
              //获取选择省份数据
              this.ruleForm_bank.province = this.areaInfoBank.province.find(item => item.fullName === province_data);
            }
            let city_data = bank_data.city;
            if (city_data) {
              if (this.ruleForm_bank.province) {
                //获取选择城市列表
                try {
                  await this.GetCityList(this.ruleForm_bank.province, 'bank', false);
                }catch (e) {
                  console.log(e)
                }
              }
              this.ruleForm_bank.city = this.areaInfoBank.city.find(item => item.fullName === city_data);
            }

            this.status_bank = bank_data.status;
            this.reason_bank = bank_data.reason;
            //存入已有图片
            bank_data.positiveImg && this.bank_positive.imgArr.push(bank_data.positiveImg);
            bank_data.negativeImg && this.bank_negative.imgArr.push(bank_data.negativeImg);
            bank_data.bankLicenseImg && this.bank_license.imgArr.push(bank_data.bankLicenseImg);
          } else {
            this.$message.error(res.data.desc);
          }
        })
      },
      //获取省市区数据
      GetProvinceList() {
        return new Promise((resolve, reject) => {
          GetProvinceList.call(this, `?input.clientTimespan=${this.$Tool.formatDate(new Date())}`).then(res => {
            if (res.data.code === 1) {
              this.areaInfoCompany.province = res.data.data;
              this.areaInfoBank.province = res.data.data;
              resolve();
            } else {
              this.$message.error(res.data.desc);
            }
          })
        })
      },
      //获取城市数据
      GetCityList(val, type, isClear = true) {
        if (isClear) {
          if (type === 'company') {
            this.ruleForm.city = '';
            this.ruleForm.region = '';
          } else {
            this.ruleForm_bank.city = '';
          }
        }
        return new Promise((resolve, reject) => {
          GetCityList.call(this, `?input.parentCode=${val.code}&input.clientTimespan=${this.$Tool.formatDate(new Date())}`).then(res => {
            if (res.data.code === 1) {
              type === 'company' ? this.areaInfoCompany.city = res.data.data : this.areaInfoBank.city = res.data.data;
              resolve()
            } else {
              this.$message.error(res.data.desc);
            }
          })
        })
      },
      //获取行政区数据
      GetCountyList(val, isClear = true) {
        if (isClear) {
          this.ruleForm.region = '';
        }
        return new Promise((resolve, reject) => {
          GetCountyList.call(this, `?input.parentCode=${val.code}&input.clientTimespan=${this.$Tool.formatDate(new Date())}`).then(res => {
            if (res.data.code === 1) {
              this.areaInfoCompany.country = res.data.data;
              resolve()
            } else {
              this.$message.error(res.data.desc);
            }
          })
        })
      },

      //下一步
      submitFormCompany(formName) {
        this.$refs[formName].validate((valid, x) => {
          if (valid) {
            this.tabsSelected = 'bank';
            this.$parent.change(2);
            // this.GetBankInfo();
            this.GetSystemBankList();
          } else {
            this.$message.error('请按规定填写表单');
            return false;
          }
        });
        // this.$router.push({name:'UpdataShop'});    //下一步
      },
      submitFormBank(formName) {
        this.$refs[formName].validate((valid, x) => {
          console.log(x);
          console.log(formName, "formName==================");
          if (valid) {
            this.submitForm()
          } else {
            return false;
          }
        });
        // this.$router.push({name:'UpdataShop'});    //下一步
      },
      //提交数据
      submitForm() {
        SupplementInformation.call(this, {
          "bank": {
            "accountType": this.account,
            "accountName": this.account === 2 ? this.ruleForm_bank.companyName : this.ruleForm_bank.name,
            "card": this.ruleForm_bank.bankNum,
            "province": this.ruleForm_bank.province.fullName,
            "city": this.ruleForm_bank.city.fullName,
            "bankName": this.ruleForm_bank.bankOpen,
            "branchName": this.ruleForm_bank.bankBase,
            "mobile": this.ruleForm_bank.phone,
            "negativeImg": this.bank_negative.imgArr[0] || '',
            "positiveImg": this.bank_positive.imgArr[0] || '',
            "bankLicenseImg": this.bank_license.imgArr[0] || '',
            "status": this.status_bank,
            "remark": this.reason_bank,
          },
          "company": {
            "operatorName": this.ruleForm.chargePerple_name,
            "operatorMobile": this.ruleForm.chargePerple_phone,
            "managerName": this.ruleForm.responsPerple_name,
            "mangeMobile": this.ruleForm.responsPerple_phone,
            "telephone": this.ruleForm.tel_areaCode + '-' + this.ruleForm.tel_num,
            "type": this.ruleForm.companyType,
            "name": this.ruleForm.company_name,
            "area": `${this.ruleForm.province.fullName},${this.ruleForm.city.fullName},${this.ruleForm.region.fullName}`,
            "address": this.ruleForm.particular,
            "businesLicenseImg": this.businesLicense.imgArr[0] || '',
            "businesLicenseCard": this.ruleForm.license_code,
            "businesLicenseCreateTime": this.ruleForm.startDate,
            "businesLicenseValidTime": this.ruleForm.endDate,
            "businessLicenseValidType": this.ruleForm.radio,
            "legalPersonName": this.ruleForm.legalperson_name,
            "legalPersonMobile": this.ruleForm.legalperson_phone,
            "legalPersonIdCard": this.ruleForm.legalperson_idCard,
            "legalPersonIdCardPositiveImg": this.idFacadeImg.imgArr[0] || '',
            "legalPersonIdCardNegativeImg": this.idBackImg.imgArr[0] || '',
            "status": this.status_company,
            "remark": this.reason_company,
          },
          "status": this.status,
          "clientTimespan": this.$Tool.formatDate(new Date()),
        }).then(res => {
          if (res.data.code === 1) {
            this.$router.push({name: 'Basic'});
            this.$message.success('操作成功');
          } else {
            this.$message.error(res.data.desc);
          }
        })
      },

      goBackToCompany() {
        this.tabsSelected = 'company';
        this.$parent.change(1);
      }


    },
  }
</script>

<style lang="less" scoped>
  @import "less/updataCompany.less";
  @import "less/updataBank.less";

  .remind {
    margin-top: 20px;
    color: #ff0000;

    i {
      margin-right: 5px;
    }
  }
</style>
