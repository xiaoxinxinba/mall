<template>
  <!--商品分类-->
  <div class="container">
    <div class="title-btn">
      <el-button type="primary" @click="classifyAdd">添加分类</el-button>
      <el-button type="info" @click="adjustSort">{{sortTitle}}</el-button>
    </div>

    <div class="main">
      <div class="main-title"><span>分类名称</span><span>操作</span></div>

      <ul class="parent-ul">
        <li v-for="(item,index) in tableData" :key="item.id">
          <div class="parent">
            <div  @click="show(index)">{{item.title}}</div>
            <div v-show="!isAdjustSort">
              <span @click="handleCompile(1, index,'', item.id)">编辑</span>
              <span v-if="item.childCategory == null || item.childCategory.length == 0" @click="handleDelete(item.id,item.parentId)">删除</span>
            </div>
            <div v-show="isAdjustSort"><i class="el-icon-top" v-show="index!==0"  @click="sortTop(1,index)"></i><i class="el-icon-bottom" v-show="index!==tableData.length-1" @click="sortBottom(1,index)"></i></div>
          </div>


          <ul v-show="isShow[index]">
            <li v-for="(item2,indexs) in item.childCategory" :key="item2.id">
              <div class="child">
                <div><div class="child-left"><span class="line"></span><span :class="indexs !== item.childCategory.length-1?'isline':''"></span>{{item2.title}}</div></div>
                <div v-show="!isAdjustSort">
                  <span @click="handleCompile(2,index, indexs, item.id)">编辑</span>
                  <span @click="handleDelete(item2.id, item2.parentId)">删除</span>
                </div>
                <div v-show="isAdjustSort"><i class="el-icon-top" v-show="indexs!==0" @click="sortTop(2,index,indexs)"></i><i class="el-icon-bottom" v-show="indexs!==item.childCategory.length-1" @click="sortBottom(2,index,indexs)"></i></div>
              </div>

            </li>
          </ul>
        </li>
      </ul>
    </div>


    <el-dialog
      title="添加自定义分类"
      :visible.sync="dialogFlag"
      width="420px"
      center>
      <div class="dialog-main">
        <div><span class="dialog-title">
          <span>*</span>分类名称：</span>
          <el-input v-model="classifyName" placeholder="请输入分类名称" @input="classifyNameChange" maxlength="8"></el-input>
          <div class="dialog-warn" v-show="classifyNameWarn">请输入分类名称</div>
        </div>
        <div>
          <span class="dialog-title"><span>*</span>分类层级：</span>
          <el-radio v-model="classifyTier" label="一级分类">一级分类</el-radio>
          <el-radio v-model="classifyTier" label="二级分类">二级分类</el-radio>
        </div>
        <div v-show="classifyTier!=='一级分类'">
          <span class="dialog-title"><span>*</span>一级分类：</span>
          <el-select v-model="classifyLayer" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="{'value':item.value,'id':item.id}"></el-option>
          </el-select>
          <div class="dialog-warn" v-show="classifyTier==='二级分类'&&classifyLayer===''">请选择一级分类</div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSave">保存</el-button>
        <el-button @click="dialogFlag = false">取消</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
  import dataGetList from '../../../../src/api/goods/goodsClassList';
  import dataGetPost from '../../../../src/api/goods/goodsClassPost';
  import dataGetUpdate from '../../../../src/api/goods/goodsClassUpdate';
  import dataGetDelete from '../../../../src/api/goods/goodsClassDelete';
  import dataGetSort from '../../../../src/api/goods/goodsClassSort';

  export default {
    name: "goodsClassify",
    data(){
      return{
        tableData: [],/*[
          {id:5,title:"服饰箱包",sortId:0,parentId:0,childCategory:[{id:100,title:"拉杆箱",sortId:0,parentId:5,childCategory:null},{id:101,title:"手提包",sortId:0,parentId:5,childCategory:null}]},
          {id:6,title:"男装",sortId:0,parentId:0,childCategory:[{id:102,title:"时尚男装",sortId:0,parentId:6,childCategory:null},{id:103,title:"中年男装",sortId:0,parentId:6,childCategory:null},{id:104,title:"老年男装",sortId:0,parentId:6,childCategory:null}]},
          {id:8,title:"家电",sortId:0,parentId:0,childCategory:null},
        ],*/
        isShow:[],     //控制伸缩展开
        dialogFlag:false,    //弹框
        classifyName:'',    //分类名称
        classifyNameWarn:false,     //控制分类名称显示
        classifyTier:'一级分类',    //分类层级（第二个框）
        options: [],          //一级选项
        classifyLayer:'',   //分类层级（第三个框）
        dialogState:'编辑',   //弹框类型
        state:0,              //编辑的几级  1一级  2二级
        parentIndex:-1,     //编辑状态一级下标
        childIndex:-1,      //编辑状态二级下标
        sortTitle:'调整排序',   //顺序按钮名称
        isAdjustSort:false,    //调整顺序
        selectUpdateId: 0
      }
    },
    mounted: function(){
      this.initData()
    },
    computed:{

    },
    created(){
      /*this.optionsInit();
      this.tableData.map((item)=>{
        this.isShow.push(false);
      })*/

    },
    methods:{
      initData: function(){
        var $vm = this;
        dataGetList.call(this,'?clientVersion=1.0.0&clientTimespan=' + this.$Tool.formatDate(new Date())).then(res => {
          $vm.tableData = res.data.data;
          if($vm.tableData.length != 0){
            $vm.optionsInit();
            $vm.tableData.map((item)=>{
              $vm.isShow.push(false);
            })
          }
        })
      },
      getSeleteClassData: function(ele){
        console.log(ele)
        //this.selectParentId = val.id
        //this.selected = ele.target.id;
      },
      //初始化，options
      optionsInit(){
        this.options=[];
        this.tableData.map((item)=>{
          this.isShow.push(false);
          this.options.push({id:item.id,value:item.title,label:item.title});
        })
      },
      //添加分类
      classifyAdd(){
        this.dialogState='添加';
        this.dialogFlag=true;
        this.classifyName='';
        this.classifyLayer='';
      },
      //调整排序
      adjustSort(){
        this.isAdjustSort=!this.isAdjustSort;
        if(this.isAdjustSort){
          this.sortTitle='保存排序';
        }else{
          this.sortTitle='调整排序';
          var res = new Array();
          for(var i = 0; i < this.tableData.length; i++){
            var o = {};
            o.id = this.tableData[i].id;
            o.sortId = i+1;
            res.push(o);
            var child = this.tableData[i].childCategory;
            if(child == null || child.length == 0){
              continue;
            }
            for(var j = 0; j < child.length; j++){
              var o2 = {};
              o2.id = child[j].id;
              o2.sortId = j+1;
              res.push(o2);
            }
          }
          dataGetSort.call(this,{
            sortInfo: res,
            clientVersion: '1.0.0',
            clientTimespan: this.$Tool.formatDate(new Date())
          }).then(res => {})

        }
      },

      //展示子级
      show(index){
        this.isShow[index]=!this.isShow[index];
        this.$forceUpdate();
      },
      //编辑    state 1父级的编辑 2子级的编辑   index 一级下标    idx二级下标
      handleCompile(state,index,idx, selectUpdateId){
        this.dialogState='编辑';
        this.selectUpdateId = selectUpdateId;
        if(state===1){
          this.dialogFlag=true;
          this.classifyName=this.tableData[index].title;
          this.classifyTier='一级分类';
          this.parentIndex=index;
          this.state=1;
        }else if(state===2){
          this.dialogFlag=true;
          this.classifyName=this.tableData[index].childCategory[idx].title;
          this.classifyTier='二级分类';
          this.classifyLayer=this.tableData[index].title;
          this.parentIndex=index;
          this.childIndex=idx;
          this.state=2;
        }
      },
      //删除      id  选中的id   parentId 父级ID
      handleDelete(id,parentId){
        this.$confirm('确定删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          dataGetDelete.call(this,{
            categoryId: id,
            clientVersion: '1.0.0',
            clientTimespan: this.$Tool.formatDate(new Date())
          }).then(res => {
              if(res.data.code == 1){
                  this.initData();
                  this.$message.success('删除成功');
              }else{
                  this.$message.warning(res.code.desc)
              }
          })
        })

        /*console.log(id,parentId)
        this.tableData.map((item,index)=>{
          if(item.id===id&&item.parentId===parentId){
            this.tableData.splice(index,1);
            this.isShow.splice(index,1);  //控制展开伸缩的也要删除
          }else{
            if(item.childCategory!==null){
              item.childCategory.map((items,indexs)=>{
                if(items.id===id&&items.parentId===parentId){
                  this.tableData[index].childCategory.splice(indexs,1);
                }
              })
            }
          }
        })*/
      },

      //弹框
      classifyNameChange(){
        if(this.classifyName===''){
          this.classifyNameWarn=true;
        }else{
          this.classifyNameWarn=false;
        }
      },
      //保存
      handleSave(){

        var $vm = this;
        var obj = this.classifyLayer;
        var parentId = obj == '' ? 0 : obj.id;
        $vm.classifyLayer = obj == '' ? '' : obj.value
        var classLayer = obj == '' ? 1 : 0;

        if(this.dialogState === '添加'){
          dataGetPost.call(this, {
            title: $vm.classifyName,
            parentId: parentId,
            classLayer: classLayer,
            clientVersion: '1.0.0',
            clientTimespan: this.$Tool.formatDate(new Date())
          }).then(res => {
            this.initData();
            this.dialogFlag=false;
          })
        }else if(this.dialogState === '编辑'){
            dataGetUpdate.call(this,{
              id: $vm.selectUpdateId,
              title: $vm.classifyName,
              parentId: parentId,
              classLayer: classLayer,
              clientVersion: '1.0.0',
              clientTimespan: this.$Tool.formatDate(new Date())
            }).then(res => {
              this.initData();
              this.dialogFlag=false;
            })
        }





        /*if(this.dialogState==='编辑'){
            if(this.classifyTier==='一级分类'){
              if(this.state===1){   //原来是一级，编辑之后也是一级
                this.tableData[this.parentIndex].title=this.classifyName;
              }else if(this.state===2){   //原来是二级，编辑之后是一级
                this.tableData.push({
                  id:this.tableData[this.parentIndex].childCategory[this.childIndex].id,
                  title:this.tableData[this.parentIndex].childCategory[this.childIndex].title,
                  sortId:0,
                  parentId:0,
                  childCategory:null,
                });   //添加到一级
                this.tableData[this.parentIndex].childCategory.splice(this.childIndex,1);    //删除原来二级的位置
                this.isShow.push(false);    //展开最后添加
              }
            }else if(this.classifyTier==='二级分类'){
              if(this.state===1){     //原来是一级，想编辑成二级，提醒弹框不允许
                this.$message.error('一级分类不能降为二级分类');
              }else if(this.state===2){   //原来是二级，编辑之后成二级
                if(this.classifyLayer===this.tableData[this.parentIndex].title){  //一级没变化
                  this.tableData[this.parentIndex].childCategory[this.childIndex].title=this.classifyName;
                }else{    //一级变化了
                  this.tableData.map((item,index)=>{
                    if(item.title===this.classifyLayer){
                      if(this.tableData[index].childCategory===null){
                        this.tableData[index].childCategory=[];
                      }
                      this.tableData[index].childCategory.push({
                        id:this.tableData[this.parentIndex].childCategory[this.childIndex].id,
                        title:this.tableData[this.parentIndex].childCategory[this.childIndex].title,
                        sortId:0,
                        parentId:item.id,
                        childCategory:null,
                      })
                      this.tableData[this.parentIndex].childCategory.splice(this.childIndex,1);    //删除原来二级的位置
                    }
                  })
                }
              }
            }
            var $vm = this;
            dataGetUpdate.call(this,{
              id: 0,
              title: $vm.classifyName,
              parentId: 0,
              classLayer: '',
              clientVersion: '1.0.0',
              clientTimespan: '2019-05-15 17:28:00'
            }).then(res => {

            })


          }else if(this.dialogState==='添加'){
            if(this.classifyTier==='一级分类'){
              this.tableData.push({
                id:this.random(10),
                title:this.classifyName,
                sortId:0,
                parentId:0,
                childCategory:null,
              });
              this.isShow.push(false);
            }else if(this.classifyTier==='二级分类'){
              this.tableData.map((item,index)=>{
                if(item.title===this.classifyLayer){
                  if(this.tableData[index].childCategory===null){
                    this.tableData[index].childCategory=[]
                  }
                  this.tableData[index].childCategory.push({
                    id:this.random(10),
                    title:this.classifyName,
                    sortId:0,
                    parentId:item.id,
                    childCategory:null,
                  })
                }
              })
            }
          }*/
      },

      //向上调整    state 1一级向上 2二级向上  parentIndex一级下标  childIndex二级下标
      sortTop(state,parentIndex,childIndex){
        if(state===1){
          this.tableData.splice(parentIndex-1,0,this.tableData[parentIndex]);
          this.tableData.splice(parentIndex+1,1);
          this.isShow.splice(parentIndex-1,0,this.isShow[parentIndex]);
          this.isShow.splice(parentIndex+1,1);
        }else if(state===2){
          this.tableData[parentIndex].childCategory.splice(childIndex-1,0,this.tableData[parentIndex].childCategory[childIndex]);
          this.tableData[parentIndex].childCategory.splice(childIndex+1,1);
        }
        console.log(this.tableData);
      },
      //向下调整    state 1一级向下 2二级向下  parentIndex一级下标  childIndex二级下标
      sortBottom(state,parentIndex,childIndex){
        if(state===1){
          this.tableData.splice(parentIndex+2,0,this.tableData[parentIndex]);
          this.tableData.splice(parentIndex,1);
          this.isShow.splice(parentIndex+2,0,this.isShow[parentIndex]);
          this.isShow.splice(parentIndex,1);
        }else if(state===2){
          this.tableData[parentIndex].childCategory.splice(childIndex+2,0,this.tableData[parentIndex].childCategory[childIndex]);
          this.tableData[parentIndex].childCategory.splice(childIndex,1);
        }
        console.log(this.tableData);
      },

      //随机数
      random(len) {
        len = len || 32;
        let chars = '0123456789';
        let maxPos = chars.length;
        let pwd = '';
        for (let i = 0; i < len; i++) {
          pwd += chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
      },
    }
  }
</script>

<style lang="less" scoped>
  @import "less/goodsClassify.less";
</style>
