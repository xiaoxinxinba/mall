<template>
  <div>
    <!--更改收货地址-->
    <el-dialog title="提示" :visible.sync="dialog.dialogVisible" width="1180px" class="dialog">
      <div class="dialog_title"><span>请选择以下退货地址</span><span @click="addDialog">新增退货地址</span></div>
      <div class="dialog_tabel">
        <el-table :data="tableData" style="width: 100%" :border="true">
          <el-table-column label="" width="85">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.roleValue" @change="handleCheck(scope.row.roleValue,scope.$index)"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="联系人">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="联系电话">
            <template slot-scope="scope">
              <span>{{ scope.row.mobile}}</span>
            </template>
          </el-table-column>
          <el-table-column label="地址" width="290">
            <template slot-scope="scope">
              <span>{{scope.row.fullAddress.split(',').join('')}}{{ scope.row.address}}</span>
            </template>
          </el-table-column>
          <el-table-column label="邮编">
            <template slot-scope="scope">
              <span>{{ scope.row.zipCode }}</span>
            </template>
          </el-table-column>
          <el-table-column label="退货地址">
            <template slot-scope="scope">
              <el-radio v-model="defaultRadio" @change="handleReturnRadio(scope.$index, scope.row)" :label="scope.row.id">默认</el-radio>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span class="operation" @click="handleEdit(scope.$index, scope.row)">编辑</span>
              <span class="operation" @click="handleDelete(scope.$index, scope.row)">删除</span>
            </template>
          </el-table-column>
        </el-table>

      </div>

      <span slot="footer" class="dialog-footer">
        <div>
          <el-button type="primary" @click="handleSure">确定</el-button>
          <el-button @click="dialog.dialogVisible = false">取消</el-button>
        </div>
      </span>
    </el-dialog>

    <!--新增退货地址-->
    <el-dialog title="新增地址" :visible.sync="addDialogVisible" width="600px" center class="dialog_add">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="联系人" prop="name">
          <el-input v-model="ruleForm.name" style="width: 360px" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="联系手机" prop="mobile">
          <el-input v-model="ruleForm.mobile" @keyup.native="numRule('ruleForm','mobile')" maxlength="11" style="width: 360px"></el-input>
        </el-form-item>
        <el-form-item label="联系座机">
          <div class="phone">
            <div>
              <el-form-item label="" prop="telAreaCode">
                <el-input v-model="ruleForm.telAreaCode" @keyup.native="numRule('ruleForm','telAreaCode')" maxlength="5"></el-input>
              </el-form-item>
            </div>
            <div>——</div>
            <div>
              <el-form-item label="" prop="telNum">
                <el-input v-model="ruleForm.telNum" @keyup.native="numRule('ruleForm','telNum')" maxlength="8"></el-input>
              </el-form-item>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="地址" required>
          <div class="area">
            <div>
              <el-form-item label="" prop="province">
                <el-select v-model="ruleForm.province" @change="provinceChange(ruleForm.province,'1')" placeholder="请选择"><el-option v-for="item in provinceList" :key="item.code" :label="item.name" :value="item.code"></el-option></el-select>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="" prop="city">
                <el-select v-model="ruleForm.city" @change="cityChange(ruleForm.city,'1')" placeholder="请选择" ><el-option v-for="item in cityList" :key="item.code" :label="item.name" :value="item.code"></el-option></el-select>
              </el-form-item>
            </div>
            <div class="area_last">
              <el-form-item label="" prop="county">
                <el-select v-model="ruleForm.county" @change="countyChange(ruleForm.county,'1')" placeholder="请选择"><el-option v-for="item in countyList" :key="item.code" :label="item.name" :value="item.code"></el-option></el-select>
              </el-form-item>
            </div>
            <div class="area_textarea">
              <el-form-item label="" prop="detail">
                <el-input type="textarea"  style="width: 360px" v-model="ruleForm.detail" resize="none" maxlength="30" :autosize="{ minRows: 4}" placeholder="详细地址"></el-input>
              </el-form-item>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="邮编" prop="zipCode">
          <el-input v-model="ruleForm.zipCode" style="width: 360px" @keyup.native="numRule('ruleForm','zipCode')" maxlength="6"></el-input>
        </el-form-item>
        <el-form-item label="" prop="defaultReturn">
          <el-checkbox v-model="ruleForm.defaultReturn">默认退货地址</el-checkbox>
        </el-form-item>

        <el-form-item>
          <div class="dialog_add_bnt">
            <el-button type="primary" @click="submitForm('ruleForm')">保存并使用</el-button>
            <el-button @click="resetForm('ruleForm')">取消</el-button>
          </div>
        </el-form-item>
      </el-form>

    </el-dialog>
  </div>
</template>

<script>
  //调的goods areaManage里面的接口  物流设置地址管理的接口
  import GetShopExpenseInfo from '@/api/goods/areaManage/GetShopExpenseInfo.js';   //获取退货地址信息列表
  import GetProvinceList from '@/api/goods/areaManage/GetProvinceList.js';       //获取省份
  import GetCityList from '@/api/goods/areaManage/GetCityList.js';       //获取城市
  import GetCountyList from '@/api/goods/areaManage/GetCountyList.js';       //获取行政区信息
  import AddOrUpdateShopExpenseInfo from '@/api/goods/areaManage/AddOrUpdateShopExpenseInfo.js';       //添加或编辑商家地址信息
  import DelShopExpenseInfo from '@/api/goods/areaManage/DelShopExpenseInfo.js';    //删除商家地址信息
  import EditShopExpenseInfoType from '@/api/goods/areaManage/EditShopExpenseInfoType.js';    //修改地址信息类型



  export default {
    props:['dialog'],
    name: "saleAfterAddress",
    data() {
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
        chooseIndex:'',
        dialogVisible:true,
        tableData: [],
        defaultRadio:'0',
        state:-1,      //0新增  1编辑
        addDialogVisible:false,
        provinceList:[],    //省
        cityList:[],      //市
        countyList:[],     //区
        provinceName:'',  //市名
        cityName:'',      //市名
        countyName:'',    //区名
        ruleForm: {
          name:'',
          mobile:'',
          telAreaCode:'',
          telNum:'',
          province:'',
          city:'',
          county:'',
          detail:'',
          zipCode:'',
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
        editId:0,   //编辑的id
        editIndex:-1,  //编辑的下标
      }
    },
    methods:{
      //只能输入数字限制
      numRule(obj,param) {
        this[obj][param]=this[obj][param].replace(/[^\.\d]/g,'');
        this[obj][param]=this[obj][param].replace('.','');
      },
      //点击新增地址框
      addDialog:async function(){
        this.provinceList=await this.getProvinceList();
        this.cityList=[];
        this.countyList=[];
        this.addDialogVisible=true;
        this.state=1;
      },
      //获取城市
      provinceChange(parentCode,state) {
        console.log(state)
        GetCityList.call(this,`?clientTimespan=${this.$Tool.formatDate(new Date())}&parentCode=${parentCode}`).then(res=>{
          console.log('城市',res);
          if(res.data.code === 1){
            this.cityList=res.data.data;
            this.countyList=[];
            this.ruleForm.city='';
            this.ruleForm.county='';
            this.ruleForm.zipCode='';
          }
        })
        this.provinceName=this.provinceList.find(item=>{
          return  item.code===parentCode
        }).name;
      },
      //获取行政区
      cityChange(parentCode,state) {
        GetCountyList.call(this,`?clientTimespan=${this.$Tool.formatDate(new Date())}&parentCode=${parentCode}`).then(res=>{
          // console.log('行政区',res);
          if(res.data.code === 1){
            this.countyList=res.data.data;
            this.ruleForm.county='';
            this.ruleForm.zipCode='';
            this.cityName=this.cityList.find(item=>{
              return  item.code===parentCode
            }).name;
          }
        })
      },
      //获取邮编
      countyChange(parentCode,state) {
        const row=this.countyList.find(item=>{
          return item.code===parentCode
        });
        this.ruleForm.zipCode=row.zipCode;
        this.countyName=row.name;
      },
      //表格前面的单选
      handleCheck(bool,index) {
        this.chooseIndex=index;
        console.log('555555555')
        this.tableData.map((item,idx)=>{
          if(idx !== index){
            item.roleValue=false;
          }
        })
      },
      //获取编辑的城市列表
      getEditCityList() {
        return new Promise((resolve,reject)=>{
          GetCityList.call(this,`?clientTimespan=${this.$Tool.formatDate(new Date())}&parentCode=${this.ruleForm.province}`).then(res=>{
            if(res.data.code === 1){
              resolve(res.data.data);
            }
          })
        })
      },
      //获取编辑区的列表
      getEditCountyList() {
        return new Promise((resolve,reject)=>{
          GetCountyList.call(this,`?clientTimespan=${this.$Tool.formatDate(new Date())}&parentCode=${this.ruleForm.city}`).then(res=>{
            if(res.data.code === 1){
              resolve(res.data.data);
            }
          })
        })
      },
      //编辑
      handleEdit: async function(index, row) {
        // console.log(index, row);
        //清空数据
        for(let value in this.ruleFormDialog){
          this.ruleForm[value]='';
        }
        this.ruleForm.defaultReturn=false;
        this.editId=row.id;
        this.ruleForm.name=row.name;
        this.ruleForm.mobile=row.mobile;
        if(row.telephone !== null){
          const telArr=row.telephone.split('-');
          this.ruleForm.telAreaCode=telArr[0];
          this.ruleForm.telNum = telArr[1] === undefined?'':telArr[1];
        }
        this.provinceList=await this.getProvinceList();
        this.ruleForm.province=row.areaCode.substr(0,2);
        this.cityList=await this.getEditCityList();
        this.ruleForm.city=row.areaCode.substr(0,4);
        this.countyList=await this.getEditCountyList();
        this.ruleForm.county=row.areaCode.substr(0,6);
        this.ruleForm.detail=row.address;
        this.ruleForm.zipCode=row.zipCode;
        if(row.type === 1 || row.type === 2){
          this.ruleForm.defaultReturn=true;
        }
        this.state=1;
        this.editIndex=index;
        this.addDialogVisible=true;

      },
      handleDelete(index, row) {
        if(row.type ===0){
          this.$message.error('默认的发货不能删除，请先设置其他地址为默认再执行删除操作');
        }else if(row.type===1){
          this.$message.error('默认退货地址不能删除，请先设置其他地址为默认再执行删除操作');
        }else if(row.type===2){
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
      //保存
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.state === 0 && this.tableData.length>9){
              this.$message.error('最多保存10条地址信息');
              return
            }
            let params={};
            (this.state === 1)&&(params.id=this.editId);
            params.name=this[formName].name;
            params.mobile=this[formName].mobile;
            if(this[formName].telAreaCode !=='' && this[formName].telNum !==''){
              params.telephone=`${this[formName].telAreaCode}-${this[formName].telNum}`;
            }
            params.areaCode=this[formName].county;
            params.address=this[formName].detail;
            params.fullAddress=`${this.provinceName},${this.cityName},${this.countyName}`;
            params.zipCode=this[formName].zipCode;
            params.type= this[formName].defaultReturn?1:3;
            if((this.state === 1) && (this.tableData[this.editIndex].type === 0)){
              params.type=2;
            }
            params.clientTimespan=this.$Tool.formatDate(new Date());
            // console.log(params);
            AddOrUpdateShopExpenseInfo.call(this,params).then(res=>{
              // console.log('保存成功',res)
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
                this.addDialogVisible=false;
              }
            })
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.addDialogVisible=false;
      },
      //列表的确认按钮
      handleSure() {
        if(this.chooseIndex === ''){
          this.$message.error('请选择一条退货地址');
        }else {
          this.$emit('sendAddress',this.tableData[this.chooseIndex]);
          this.dialog.dialogVisible = false;
        }
        console.log(this.tableData[this.chooseIndex]);
      },


      //改变默认退货地址
      handleReturnRadio(index,row) {
        let params={};
        params.type=this.tableData[index].type === 0?2:1;
        params.id=this.defaultRadio;
        params.clientTimespan=this.$Tool.formatDate(new Date());
        EditShopExpenseInfoType.call(this,params).then(res=>{
          this.getTableData();
        })
      },
      //获取退货地址列表
      getTableData() {
        GetShopExpenseInfo.call(this,`?clientTimespan=${this.$Tool.formatDate(new Date())}`).then(res=>{
          // console.log('地址',res);
          if(res.data.code === 1){
            this.tableData=res.data.data;
            this.tableData.map(item=>{
              item.roleValue=false;
            });
            if(this.state === 0){this.tableData[this.tableData.length-1].roleValue=true;};
            if(this.state === 1){this.tableData[this.editIndex].roleValue=true;};
            this.defaultRadio=this.tableData.find(item=>{
              return (item.type===2)||(item.type===1)
            }).id;
          }
        })
      },
      //获取省份列表
      getProvinceList() {
        return new Promise((resolve,reject)=>{
          GetProvinceList.call(this,`?clientTimespan=${this.$Tool.formatDate(new Date())}`).then(res=>{
            // console.log('省份',res)
            if(res.data.code === 1){
              resolve(res.data.data);
            }
          })
        })
      },
    },
    created() {
      this.getTableData();
      this.getProvinceList();
    },
  }
</script>

<style lang="less" scoped>
  //更换收货地址弹框
  .dialog{
    /deep/ .el-dialog__header{
      padding:0px 20px;
      height: 40px;
      line-height: 40px;
      background: #f0f0f0;
      .el-dialog__title{
        color: #333333;
        font-size: 14px;
      }
      .el-dialog__headerbtn{
        top: 12px;
      }
      .el-dialog__close{
        color: #ff0000;
      }
    }
    /deep/ .el-dialog__body{
      padding: 0px;
      padding: 0px 20px;
    }
    .dialog_title{
      margin-top: 10px;
      padding: 0px 10px;
      span{
        color: #00a2ff;
      }
      span:nth-of-type(2){
        text-decoration: underline;
        float: right;
        cursor: pointer;
      }
    }

    .dialog_tabel{
      margin-top: 10px;
      /deep/ .cell{
        text-align: center;
        font-size: 14px;
      }
      /deep/ .has-gutter{
        .cell{
          color: #333333;
          font-weight: 600;
        }
        th{
          background: #f1f1f3;
        }
      }
      .operation{
        color: #00a2ff;
        text-decoration: underline;
        margin: 0px 10px;
        cursor: pointer;
      }
    }
    /deep/ .el-dialog__footer{
      padding: 20px 0px;
    }
    .dialog-footer{
      >div{
        text-align: center;
        /deep/ button{
          padding: 0px;
          width: 86px;
          height: 32px;
          //margin-right: 10px;
        }
      }
    }
  }

  //新增收货地址弹框
  .phone{
    font-size: 0px;
    >div{
      display: inline-block;
      font-size: 14px;
    }
    div:nth-of-type(1){
      width: 100px;
    }
    div:nth-of-type(2){
      width: 20px;
    }
    div:nth-of-type(3){
      /deep/ .el-input{
        width: 240px;
      }
    }
  }
  .area{
    font-size: 0px;
    >div{
      display: inline-block;
      width: 110px;
      margin-right: 15px;
    }
    .area_last{
      margin-right: 0px;
    }
    .area_textarea{
      margin-top: 18px;
      display:block;
      margin-right: 0px;
      /deep/ .el-form-item{
        display: inline-block;
      }
    }
  }
  .dialog_add_bnt{
    /deep/ button{
      padding: 0px;
      width: 100px;
      height: 36px;
    }
  }

</style>
