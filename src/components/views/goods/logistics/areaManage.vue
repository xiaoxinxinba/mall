<template>
  <!--地址管理-->
  <div class="container">
    <div class="main">
      <h2>新增地址</h2>
      <div class="form">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

          <el-form-item label="联  系  人：" prop="name">
            <el-input style="width: 247px;" v-model="ruleForm.name" maxlength="10"></el-input>
          </el-form-item>

          <el-form-item label="联系手机：" prop="mobile" >
            <div class="input_num">
              <el-input @keyup.native="numRule('ruleForm','mobile')" style="width: 247px;" v-model="ruleForm.mobile" maxlength="11"></el-input>
            </div>
          </el-form-item>

          <el-form-item label="联系座机：">
            <div class="tel-area tel">
              <el-form-item prop="telAreaCode">
                <el-input style="width: 80px;" @keyup.native="numRule('ruleForm','telAreaCode')" maxlength="5" v-model="ruleForm.telAreaCode"></el-input>
              </el-form-item>
            </div>
            <div class="tel">—</div>
            <div class="tel-num tel">
              <el-form-item prop="telNum">
                <el-input style="width: 247px;" @keyup.native="numRule('ruleForm','telNum')" maxlength="8" v-model="ruleForm.telNum"></el-input>
              </el-form-item>
            </div>
          </el-form-item>

          <el-form-item label="发货地址：" required>
            <div class="area">
              <el-form-item prop="province">
                <el-select style="width: 138px;" v-model="ruleForm.province" @change="provinceChange(ruleForm.province,'1')" placeholder="请选择省"><el-option v-for="item in provinceList"  :key="item.code" :label="item.name" :value="item.code"></el-option></el-select>
              </el-form-item>
            </div>

            <div class="area">
              <el-form-item prop="city">
                <el-select style="width: 138px;" v-model="ruleForm.city" @change="cityChange(ruleForm.city,'1')" placeholder="请选择市"><el-option v-for="item in cityList" :key="item.code" :label="item.name" :value="item.code"></el-option></el-select>
              </el-form-item>
            </div>

            <div class="area">
              <el-form-item prop="county">
                <el-select style="width: 138px;" v-model="ruleForm.county" @change="countyChange(ruleForm.county,'1')" placeholder="请选择区"><el-option v-for="item in countyList" :key="item.code" :label="item.name" :value="item.code"></el-option></el-select>
              </el-form-item>
            </div>

            <div class="area-textarea">
              <el-form-item prop="detail">
                <el-input type="textarea" style="width: 435px;"  :autosize="{minRows:4}" resize="none" maxlength="30"  v-model="ruleForm.detail" placeholder="详细地址"></el-input>
              </el-form-item>
            </div>

          </el-form-item>

          <el-form-item label="邮编：" prop="zipCode ">
            <el-input style="width: 247px;" @keyup.native="numRule('ruleForm','zipCode')" v-model="ruleForm.zipCode"  maxlength="6"></el-input>
          </el-form-item>

          <el-form-item>
            <el-checkbox v-model="ruleForm.defaultSend">默认发货地址</el-checkbox>
            <el-checkbox v-model="ruleForm.defaultReturn">默认退货地址</el-checkbox>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm','1')">保存</el-button>
          </el-form-item>


        </el-form>


      </div>
    </div>

    <div class="table">
      <div class="remind">提示：列表中包含默认的发货、退货地址，最多保存10条地址。</div>
      <div class="table-list">
        <el-table :data="tableData" style="width: 100%" :border="true">
          <el-table-column label="联系人">
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column label="联系电话">
            <template slot-scope="scope">
              <span>{{scope.row.mobile}}</span>
            </template>
          </el-table-column>

          <el-table-column label="地址">
            <template slot-scope="scope">
              <span>{{scope.row.address}}</span>
            </template>
          </el-table-column>

          <el-table-column label="邮编">
            <template slot-scope="scope">
              <span>{{scope.row.zipCode}}</span>
            </template>
          </el-table-column>

          <el-table-column label="发货地址">
            <template slot-scope="scope">
              <el-radio v-model="sendGoods" @change="handleSendRadio(scope.$index, scope.row)" :label="scope.row.id">默认</el-radio>
            </template>
          </el-table-column>

          <el-table-column label="退货地址">
            <template slot-scope="scope">
              <el-radio v-model="backGoods" @change="handleReturnRadio(scope.$index, scope.row)" :label="scope.row.id">默认</el-radio>
            </template>
          </el-table-column>


          <el-table-column label="操作">
            <template slot-scope="scope">
              <span class="table-btn" @click="handleEdit(scope.$index, scope.row)">编辑</span>
              <span class="table-btn" @click="handleDelete(scope.$index, scope.row)">删除</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>



    <el-dialog title="编辑地址" :visible.sync="dialogFlag" width="700px" center>
      <div>
        <el-form :model="ruleFormDialog" :rules="rulesDialog" ref="ruleFormDialog" label-width="100px" class="demo-ruleForm-dialog">

          <el-form-item label="联  系  人：" prop="name">
            <el-input style="width: 247px;" v-model="ruleFormDialog.name" ></el-input>
          </el-form-item>

          <el-form-item label="联系电话：" prop="mobile">
            <el-input style="width: 247px;" v-model="ruleFormDialog.mobile" maxlength="11"></el-input>
          </el-form-item>

          <el-form-item label="联系座机：">
            <div class="tel">
              <el-form-item prop="telAreaCode">
                <el-input style="width: 80px;" v-model="ruleFormDialog.telAreaCode"  @keyup.native="numRule('ruleFormDialog','telAreaCode')" maxlength="5"></el-input>
              </el-form-item>
            </div>
            <div class="tel">—</div>
            <div class="tel">
              <el-form-item prop="telNum">
                <el-input style="width: 247px;" v-model="ruleFormDialog.telNum"  @keyup.native="numRule('ruleFormDialog','telNum')" maxlength="8"></el-input>
              </el-form-item>
            </div>
          </el-form-item>

          <el-form-item label="发货地址：">
            <div class="area">
              <el-form-item prop="province">
                <el-select style="width: 138px;" v-model="ruleFormDialog.province"  @change="provinceChange(ruleFormDialog.province,'2')" placeholder="请选择省"><el-option v-for="item in provinceList" :key="item.code" :label="item.name" :value="item.code"></el-option></el-select>
              </el-form-item>
            </div>

            <div class="area">
              <el-form-item prop="city">
                <el-select style="width: 138px;" v-model="ruleFormDialog.city"  @change="cityChange(ruleFormDialog.city,'2')" placeholder="请选择市"><el-option v-for="item in editCityList" :key="item.code" :label="item.name" :value="item.code"></el-option></el-select>
              </el-form-item>
            </div>

            <div class="area">
              <el-form-item prop="county">
                <el-select style="width: 138px;" v-model="ruleFormDialog.county"  @change="countyChange(ruleFormDialog.county,'2')" placeholder="请选择区"><el-option v-for="item in editCountyList" :key="item.code" :label="item.name" :value="item.code"></el-option></el-select>
              </el-form-item>
            </div>
            <div class="area-textarea">
              <el-form-item prop="detail">
                <el-input type="textarea" style="width: 435px;"  :autosize="{minRows:4}" resize="none"   maxlength="30" v-model="ruleFormDialog.detail"   placeholder="详细地址"></el-input>
              </el-form-item>
            </div>

          </el-form-item>

          <el-form-item label="邮编：" prop="zipCode">
            <el-input style="width: 247px;" v-model="ruleFormDialog.zipCode"  maxlength="6"></el-input>
          </el-form-item>

          <el-form-item prop="radio">
            <el-checkbox v-model="ruleFormDialog.defaultSend">默认发货地址</el-checkbox>
            <el-checkbox v-model="ruleFormDialog.defaultReturn">默认退货地址</el-checkbox>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleFormDialog','2')">保存</el-button>
          </el-form-item>


        </el-form>
      </div>
    </el-dialog>


  </div>
</template>

<script>
  import GetShopExpenseInfo from '@/api/goods/areaManage/GetShopExpenseInfo.js';   //获取商家地址信息列表
  import GetProvinceList from '@/api/goods/areaManage/GetProvinceList.js';       //获取省份
  import GetCityList from '@/api/goods/areaManage/GetCityList.js';       //获取城市
  import GetCountyList from '@/api/goods/areaManage/GetCountyList.js';       //获取行政区信息
  import AddOrUpdateShopExpenseInfo from '@/api/goods/areaManage/AddOrUpdateShopExpenseInfo.js';       //添加或编辑商家地址信息
  import DelShopExpenseInfo from '@/api/goods/areaManage/DelShopExpenseInfo.js';    //删除商家地址信息
  import EditShopExpenseInfoType from '@/api/goods/areaManage/EditShopExpenseInfoType.js';    //修改地址信息类型





  export default {
    name: "areaManage",
    data(){
      let mobilePass=(rule,value,callback)=>{
        if((/^1[3456789]\d{9}$/.test(value))){
          callback()
        }else{
          callback(new Error('请输入11位正确手机号'));
        }
      }
      let telAreaCodePass=(rule,value,callback)=>{
        value !==''&&value.length<3?callback(new Error('区号3-5位')):callback();
      };
      let telNumPass=(rule,value,callback)=>{
        value !==''&&value.length<7?callback(new Error('区号7-8位')):callback();
      };
      return{
        ruleForm:{
          name:'',
          mobile:'',
          telAreaCode:'',
          telNum:'',
          province:'',
          city:'',
          county:'',
          detail:'',
          zipCode:'',
          defaultSend:false,
          defaultReturn:false,
        },
        rules:{
          name:[{required: true, message: '请输入联系人姓名', trigger: 'blur'}],
          mobile:[{required: true, validator:mobilePass,trigger: 'blur'}],
          telAreaCode:[{validator:telAreaCodePass,trigger: 'blur'}],
          telNum:[{validator:telNumPass,trigger: 'blur'}],
          province:[{required: true, message: '请选择省份', trigger: 'blur'}],
          city:[{required: true, message: '请选择城市', trigger: 'blur'}],
          county:[{required: true, message: '请选择区', trigger: 'blur'}],
          detail:[
            {required: true, message: '请输入详细地址(5-30字)', trigger: 'blur'},
            { min: 5, max: 30, message: '请输入详细地址(5-30字)', trigger: 'blur' }
            ],
        },
        provinceList:[],  //省
        cityList:[],      //市
        countyList:[],    //区
        provinceName:'',  //省名
        cityName:'',      //市名
        countyName:'',    //区名
        countyCode:'',  //行政区code


        options: [{value: '选项1', label: '黄金糕'},
          {value: '选项2', label: '双皮奶'},
          {value: '选项3', label: '蚵仔煎'},
          {value: '选项4', label: '龙须面'},
          {value: '选项5', label: '北京烤鸭'}],


        sendGoods:0,
        backGoods:1,
        editType:0,  //要修改的类型 0默认发货 1默认退货 2默认发货、退货
        tableData: [],
        dialogFlag:false,

        ruleFormDialog:{
          name:'',
          mobile:'',
          telAreaCode:'',
          telNum:'',
          province:'',
          city:'',
          county:'',
          detail:'',
          zipCode:'',
          defaultSend:false,
          defaultReturn:false,
        },
        rulesDialog:{
          name:[{required: true, message: '请输入联系人姓名', trigger: 'blur'}],
          mobile:[{required: true, validator:mobilePass,trigger: 'blur'}],
          telAreaCode:[{validator:telAreaCodePass,trigger: 'blur'}],
          telNum:[{validator:telNumPass,trigger: 'blur'}],
          province:[{required: true, message: '请选择省份', trigger: 'blur'}],
          city:[{required: true, message: '请选择城市', trigger: 'blur'}],
          county:[{required: true, message: '请选择区', trigger: 'blur'}],
          detail:[
            {required: true, message: '请输入详细地址(5-30字)', trigger: 'blur'},
            { min: 5, max: 30, message: '请输入详细地址(5-30字)', trigger: 'blur' }
          ],
        },

        editCityList:[],
        editCountyList:[],
        editId:0,

      }
    },
    methods:{
      //只能输入数字限制
      numRule(obj,param) {
        this[obj][param]=this[obj][param].replace(/[^\.\d]/g,'');
        this[obj][param]=this[obj][param].replace('.','');
      },
      //获取城市
      provinceChange(parentCode,state) {
        console.log(state)
        GetCityList.call(this,`?clientTimespan=${this.$Tool.formatDate(new Date())}&parentCode=${parentCode}`).then(res=>{
          console.log('城市',res);
          if(res.data.code === 1){
            if(state === '1'){
              this.cityList=res.data.data;
              this.countyList=[];
              this.ruleForm.city='';
              this.ruleForm.county='';
              this.ruleForm.zipCode='';
            }else if(state === '2'){
              this.editCityList=res.data.data;
              this.editCountyList=[];
              this.ruleFormDialog.city='';
              this.ruleFormDialog.county='';
              this.ruleFormDialog.zipCode='';
            }
          }
        })
        this.provinceName=this.provinceList.find(item=>{
          return  item.code===parentCode
        }).name;

      },
      //获取行政区
      cityChange(parentCode,state) {
        GetCountyList.call(this,`?clientTimespan=${this.$Tool.formatDate(new Date())}&parentCode=${parentCode}`).then(res=>{
          console.log('行政区',res);
          if(res.data.code === 1){
            if(state === '1'){
              this.countyList=res.data.data;
              this.ruleForm.county='';
              this.ruleForm.zipCode='';
              this.cityName=this.cityList.find(item=>{
                return  item.code===parentCode
              }).name;
            }else if(state === '2'){
              this.editCountyList=res.data.data;
              this.ruleFormDialog.county='';
              this.ruleFormDialog.zipCode='';
              this.cityName=this.editCityList.find(item=>{
                return  item.code===parentCode
              }).name;
            }
          }
        })

      },
      //获取邮编
      countyChange(parentCode,state) {
        if(state === '1'){
          const row=this.countyList.find(item=>{
            return item.code===parentCode
          });
          this.ruleForm.zipCode=row.zipCode;
          this.countyName=row.name;
        }else if(state === '2'){
          const row=this.editCountyList.find(item=>{
            return item.code===parentCode
          });
          this.ruleFormDialog.zipCode=row.zipCode;
          this.countyName=row.name;
        }

      },

      //保存
      submitForm(formName,state) {
        console.log(formName)
        console.log(this[formName].name);
        console.log(state);
        console.log(this.tableData)
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(state === '1'&&this.tableData.length>9){
              console.log('44444')
              this.$message.error('最多保存10条地址信息');
              return
            }
            let params={};
            (state === '2')&&(params.id=this.editId);
            params.name=this[formName].name;
            params.mobile=this[formName].mobile;
            if(this[formName].telAreaCode !=='' && this[formName].telNum !==''){
              params.telephone=`${this[formName].telAreaCode}-${this[formName].telNum}`;
            }
            params.areaCode=this[formName].county;
            params.address=this[formName].detail;
            params.fullAddress=`${this.provinceName},${this.cityName},${this.countyName}`;
            params.zipCode=this[formName].zipCode;
            if(this[formName].defaultSend){params.type=0};
            if(this[formName].defaultReturn){params.type=1};
            if(this[formName].defaultSend&&this[formName].defaultReturn){params.type=2};
            if(!this[formName].defaultSend&&!this[formName].defaultReturn){params.type=3};
            params.clientTimespan=this.$Tool.formatDate(new Date());
            console.log(params);
            AddOrUpdateShopExpenseInfo.call(this,params).then(res=>{
              console.log('保存成功',res)
              if(res.data.code === 1){
                this.getTableData();    //重新获取列表
                //清空填写的数据

                this.$refs[formName].resetFields();
                this[formName].zipCode='';
                //提示框
                this.$message({
                  message: '保存成功',
                  type: 'success'
                });
                (state === '2')&&(this.dialogFlag=false);
              }
            })
          }
        });
      },


      //修改默认类型
      editShopExpenseInfoType() {
        if(this.sendGoods === this.backGoods){
          this.editType=2;
        }
        let params={};
        params.type=this.editType;
        if(this.editType === 0 || this.editType === 2){
          params.id=this.sendGoods;
        }else{
          params.id=this.backGoods;
        }
        params.clientTimespan=this.$Tool.formatDate(new Date());
        EditShopExpenseInfoType.call(this,params).then(res=>{
          console.log('789999',res)
          this.getTableData();
        })

      },
      //改变默认发货地址
      handleSendRadio(index,row) {
        this.editType=0;
        this.editShopExpenseInfoType();
      },
      //改变默认退货地址
      handleReturnRadio(index,row) {
        this.editType=1;
        this.editShopExpenseInfoType();
      },


      //获取编辑的城市列表
      getEditCityList() {
        return new Promise((resolve,reject)=>{
          GetCityList.call(this,`?clientTimespan=${this.$Tool.formatDate(new Date())}&parentCode=${this.ruleFormDialog.province}`).then(res=>{
            if(res.data.code === 1){
              resolve(res.data.data);
            }
          })
        })
      },
      //获取编辑区的列表
      getEditCountyList() {
        return new Promise((resolve,reject)=>{
          GetCountyList.call(this,`?clientTimespan=${this.$Tool.formatDate(new Date())}&parentCode=${this.ruleFormDialog.city}`).then(res=>{
            if(res.data.code === 1){
              resolve(res.data.data);
            }
          })
        })
      },
      //编辑
      handleEdit: async function(index, row) {
        //清空填写的数据
        for(let value in this.ruleFormDialog){
          this.ruleFormDialog[value]='';
        }
        this.ruleFormDialog.defaultSend=false;
        this.ruleFormDialog.defaultReturn=false;

        this.editId=row.id;
        this.ruleFormDialog.name=row.name;
        this.ruleFormDialog.mobile=row.mobile;
        if(row.telephone !== null){
          const telArr=row.telephone.split('-');
          this.ruleFormDialog.telAreaCode=telArr[0];
          this.ruleFormDialog.telNum = telArr[1] === undefined?'':telArr[1];
        }
        this.ruleFormDialog.province=row.areaCode.substr(0,2);
        this.editCityList=await this.getEditCityList();
        this.ruleFormDialog.city=row.areaCode.substr(0,4);
        this.editCountyList=await this.getEditCountyList();
        this.ruleFormDialog.county=row.areaCode.substr(0,6);
        this.ruleFormDialog.detail=row.address;
        this.ruleFormDialog.zipCode=row.zipCode;
        if(row.type === 0){this.ruleFormDialog.defaultSend = true};
        if(row.type === 1){this.ruleFormDialog.defaultReturn = true};
        if(row.type === 2){this.ruleFormDialog.defaultSend = true;this.ruleFormDialog.defaultReturn = true};


        this.dialogFlag=true;

      },
      //删除商家地址信息
      handleDelete(index, row) {
        if(row.type ===0 || row.type===1 ||row.type===2){
          this.$message.error('默认的发货/退货地址不能删除，请先设置其他地址为默认再执行删除操作');
        }else{
          let params={};
          params.id=row.id;
          params.clientTimespan=this.$Tool.formatDate(new Date());
          DelShopExpenseInfo.call(this,params).then(res=>{
            if(res.data.code === 1){
              this.getTableData();
              this.$message({
                message: '删除成功',
                type: 'success'
              });
            }
          })
        }
      },



      getTableData() {
        GetShopExpenseInfo.call(this,`?clientTimespan=${this.$Tool.formatDate(new Date())}`).then(res=>{
          console.log('111',res);
          if(res.data.code === 1){
            this.tableData=res.data.data;
            this.tableData.map(item=>{
              if(item.type === 0){
                this.sendGoods=item.id;
              }else if(item.type === 1){
                this.backGoods=item.id;
              }else if(item.type === 2){
                this.sendGoods=item.id;
                this.backGoods=item.id;
              }
            })
          }
        })
      },
      getProvinceList() {
        GetProvinceList.call(this,`?clientTimespan=${this.$Tool.formatDate(new Date())}`).then(res=>{
          console.log('省份',res)
          if(res.data.code === 1){
            this.provinceList=res.data.data;
          }
        })
      },
    },
    created(){
      this.$parent.change('地址管理');

      this.getTableData();
      this.getProvinceList();


    },
  }
</script>

<style lang="less" scoped>
  @import "less/areaManage.less";
</style>
