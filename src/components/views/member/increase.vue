<template>
<div class="increase">
        <ul class="title"><li>用户增长</li><li @click="member">用户属性</li></ul>
    <div class="box">

         <div class="header">
            <img src="./img/jinggao.png" alt="">
            <p>本页根据昨日数据来计算，而用户管理页根据当前数据计算，两者不一致</p>
         </div>

        <div class="statistics">
         <div class="head">
         <p>昨日关键指标</p>
         </div>
         <div class="content">
          <div class="list">
              <div class="yang">
             <p>新关注人数</p>
             <p style="textAlign:center;fontSize:24px;color:#f19393;fontWeight:bolder;">1</p>
             <p>日 <span style="marginLeft:35px;">--</span></p>
             <p>周 <span style="marginLeft:35px;">0.5%</span><img src="./img/shangsheng.png" alt="" style="width:14px;height:14px;"></p>
             <p>月 <span style="marginLeft:35px;">--</span></p>
              </div>
          </div>
           <div class="list">
              <div class="yang">
             <p>取消关注人数</p>
             <p style="textAlign:center;fontSize:24px;color:#67a2e5;fontWeight:bolder;">1</p>
             <p>日 <span style="marginLeft:35px;">--</span></p>
             <p>周 <span style="marginLeft:35px;">0.5%</span><img src="./img/xiajiang.png" alt="" style="width:14px;height:14px;"></p>
             <p>月 <span style="marginLeft:35px;">--</span></p>
              </div>
          </div>
           <div class="list">
              <div class="yang">
             <p>净增关注人数</p>
             <p style="textAlign:center;fontSize:24px;color:#86c9ca;fontWeight:bolder;">1</p>
             <p>日 <span style="marginLeft:35px;">--</span></p>
             <p>周 <span style="marginLeft:35px;">0.5%</span></p>
             <p>月 <span style="marginLeft:35px;">--</span></p>
              </div>
          </div>
           <div class="list">
              <div class="yang">
             <p>累计关注人数</p>
             <p style="textAlign:center;fontSize:24px;color:#fcbe82;fontWeight:bolder;">1</p>
             <p>日 <span style="marginLeft:35px;">--</span></p>
             <p>周 <span style="marginLeft:35px;">0.5%</span></p>
             <p>月 <span style="marginLeft:35px;">--</span></p>
              </div>
          </div>
         </div>
        </div>
    </div>

    <div class="middle">
         <div class="title">
         <el-breadcrumb separator="|">
        <el-breadcrumb-item>新增人数</el-breadcrumb-item>
        <el-breadcrumb-item>取消关注人数</el-breadcrumb-item>
        <el-breadcrumb-item>净增人数</el-breadcrumb-item>
        <el-breadcrumb-item>累计人数</el-breadcrumb-item>
        </el-breadcrumb>
         </div>
            <div class="statistics">
                <div class="head">
                    <el-form ref="form" :model="form" label-width="80px">

                    <el-form-item>
                    <el-select v-model="form.region" placeholder="最近30天">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                    </el-form-item>
                    <el-form-item>
                    <el-col :span="11">
                        <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
                    </el-col>
                    <el-col class="line" :span="1" style="textAlign:center;">-</el-col>
                    <el-col :span="11">
                        <el-time-picker type="fixed-time" placeholder="选择时间" v-model="form.date2" style="width: 100%;"></el-time-picker>
                    </el-col>
                    </el-form-item>

                    <el-form-item>
                    <el-select v-model="form.region" placeholder="全部来源">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                    </el-form-item>


                    <el-form-item>
                    <el-button type="primary" @click="onSubmit">按时间对比</el-button>
                    </el-form-item>
                    </el-form>
                </div>
                    <div id="content">
                    
                    </div>
            </div>
    </div>

    <div class="table">
          <el-form ref="form" :model="form" label-width="80px">
          <el-form-item>
                    <el-col :span="11">
                        <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
                    </el-col>
                    <el-col class="line" :span="1" style="textAlign:center;">-</el-col>
                    <el-col :span="11">
                        <el-time-picker type="fixed-time" placeholder="选择时间" v-model="form.date2" style="width: 100%;"></el-time-picker>
                    </el-col>
                    </el-form-item>
                    <el-button type="text">下载表格</el-button>
          </el-form>   
    <div class="tablelist">
   <el-table
    :data="tableData"
    border
    style="width: 100%">

    <el-table-column
      prop="date"
      label="时间"
      >
    </el-table-column>
    
    <el-table-column
      prop="name"
      label="新关注人数"
      >
    </el-table-column>

    <el-table-column
      prop="address"
      label="取消关注人数">
    </el-table-column>

       <el-table-column
      prop="aa"
      label="净增关注人数">
    </el-table-column>

       <el-table-column
      prop="bb"
      label="累计关注人数">
    </el-table-column>
  </el-table>
        </div>      
    </div>
   </div>
</template>

<script>

export default {
data(){
return {
     form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        tableData: [{
          date: '2016-05-02',
          name: '1',
          address: '1',
          aa:'1',
          bb:'小王子'
        },  
        {
          date: '2016-05-02',
          name: '1',
          address: '1',
          aa:'1',
          bb:'小王子'
        }, 
        {
          date: '2016-05-02',
          name: '1',
          address: '1',
          aa:'1',
          bb:'小王子'
        }, 
        {
          date: '2016-05-02',
          name: '1',
          address: '1',
          aa:'1',
          bb:'小王子'
        }, 
        ]
}
},
methods: {
    member(){
        this.$router.push({name:'attribute'})
    },
    onSubmit() {
        console.log('submit!');
      }
},
mounted() {
      const myChart = this.echarts.init(document.getElementById('content'));
 

        // 指定图表的配置项和数据
        var option = {
    xAxis: {
        type: 'category',
        data: [
            '2017-02-01','2017-02-02','2017-02-03','2017-02-04','2017-02-05','2017-02-06','2017-02-07',
            '2017-02-08','2017-02-09','2017-02-10','2017-02-11','2017-02-12','2017-02-13','2017-02-14',
        ]
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        data: [1, 2, 1, 0,4,5,4,3,1,0,0,4,2,7,5,6,2,1,4,2,3],
        type: 'line'
    }]
};
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
},
}
</script>

<style lang="less">
.increase{
    .title{
  li{
    display: inline-block;
    width: 120px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    background: #d5d5d5;
    margin-right: 10px;
    cursor: pointer;
  }
  li:nth-of-type(1){
    color: #ffffff;
    background: #00a2ff;
  }
  }
  .box{
     height: 324px;
     background: #fff;
     margin-top: 15px;
     padding: 20px 15px 0 15px;
    .header{
      display: flex;
      align-items: center;
      img{
          width:14px;
          height:14px;
          margin-right: 20px;
      }
       p{
          color: #333333;
      }
    }
    .statistics{
        margin-top: 20px;
        .head{
            height: 48px;
            background: #f1f1f3;
            line-height: 48px;
            padding-left: 15px;
            border: 1px solid #ccc;
            p{
                font-size: 14px;
            }
        }
        .content{
            display: flex;
            border: 1px solid #ccc;
            border-top: none;
            .list{
                display: flex;
                justify-content: center;
                align-items: center;
                width: 400px;
                .yang{
                    line-height: 42px;
                }
            }
        }
    }
  }
  .middle{
      background: #fff;
      margin-top: 20px;
      padding: 15px;
      .statistics{
        margin-top: 20px;
        .head{
            height: 48px;
            background: #f1f1f3;
            line-height: 48px;
            border: 1px solid #ccc;
            display: flex;
            .el-form{
                width: 100%;
                display: flex;
                align-items: center;
                align-content:flex-start;
                .el-form-item{
                    margin: 0;
                    .el-form-item__content{
                        margin-left: 30px!important;
                    }
                }
            }
            p{
                font-size: 14px;
            }
        }
        #content{
            display: flex;
            border: 1px solid #ccc;
            border-top: none;
            height: 400px;
        }
    }
  }
  .table{
      margin-top: 20px;
      background: #fff;
      padding: 15px;
      .el-form{
          display: flex;
          align-items: center;
          justify-content: space-between;
          .el-form-item{
              margin: 0;
              .el-form-item__content{
                  margin-left: 0!important;
              }
          }
      }
      .tablelist{
          margin-top: 20px;
          .cell{
              text-align: center;
          }
      }
  }
}

</style>
