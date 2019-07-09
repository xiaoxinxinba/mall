<template>
    <div class="attribute">
        <ul class="title"><li  @click="member">用户增长</li><li>用户属性</li></ul>
        <div class="statistics">
         <div class="head">
         <p>用户属性</p>
         </div>
          <div class="content">
        <ve-bar :data="chartData" :settings="chartSettings"></ve-bar>
        </div>
        </div>
        <div id="terminal">
         <p>终端分布</p>
         <ve-bar :data="phonedata" :settings="phone"></ve-bar>
        </div>
        <div id="map">
          <p>省份分布</p>
          <div class="top">
              <div class="left">
               <ve-map :data="mapData" :settings="mapSettings"></ve-map>
              </div>
              <div class="right">

              </div>
          </div>
           <div class="bottom">

           </div>

        </div>
        <div id="model">
          <p>机型分布</p>
          <img src="./img/jinggao.png" alt=""><span>由于Android机型的版本编码复杂多变，无法合并Android机型的不同版本，请知悉</span>
          <div class="left">
          <ve-pie :data="Phonedata"></ve-pie>
          </div>
          <div class="right">

          </div>
        </div>
        <div id="people">
            <p>属性分布表</p>
            <div class="mianbao">
             <el-breadcrumb separator="|">
  <el-breadcrumb-item>性别</el-breadcrumb-item>
  <el-breadcrumb-item>语言</el-breadcrumb-item>
  <el-breadcrumb-item>省份</el-breadcrumb-item>
  <el-breadcrumb-item>城市</el-breadcrumb-item>
  <el-breadcrumb-item>终端</el-breadcrumb-item>
  <el-breadcrumb-item>机型</el-breadcrumb-item>
</el-breadcrumb>
            </div>
            <div class="table">
                <el-table
    :data="tableData"
    border
    style="width: 100%">
    <el-table-column
      prop="date"
      label="性别"
     >
    </el-table-column>
    <el-table-column
      prop="name"
      label="用户数"
    >
    </el-table-column>
    <el-table-column
      prop="address"
      label="占比">
    </el-table-column>
  </el-table>
            </div>
        </div>
    </div>
</template>

<script>
export default {
data(){
    this.chartSettings =  {
        stack: {
          'xxx': ['男', '女']
        }
    },
    this.phone =  {
        stack: {
          'xxx': ['iPhone', 'Android']
        }
    },
    this.mapSettings = {
        position: 'china',
        label: false,
        itemStyle: {
          normal: {
            borderColor: '#00f'
          }
        },
        zoom: 1.2
      }
    return {
tableData: [{
          date: '男',
          name: '1',
          address: '66%'
        }, {
          date: '女',
          name: '1',
          address: '34%'
        }, 
        ],
        chartData: {
          columns: ['日期', '男', '女'],
          rows: [
            { '日期': '1/1', '男': 12, '女': 25,},
            { '日期': '1/2', '男': 44, '女': 12,},
            { '日期': '1/3', '男': 11, '女': 55,},
          ]
        },
        phonedata: {
          columns: ['日期', 'iPhone', 'Android'],
          rows: [
            { '日期': '1/1', 'iPhone': 12, 'Android': 25,},
            { '日期': '1/2', 'iPhone': 44, 'Android': 12,},
          ]
        },
         Phonedata: {
          columns: ['日期', '访问用户'],
          rows: [
            { '访问用户': 80000 },
            { '访问用户': 3530 },
            { '访问用户': 2923 },
            { '访问用户': 1723 },
            { '访问用户': 3792 },
            { '访问用户': 4593 },
            { '访问用户': 4593 },
            { '访问用户': 4593 },
            { '访问用户': 4593 },
            { '访问用户': 4593 }
          ]
        },
        mapData: {
          columns: ['位置', '人口'],
          rows: [
            { '位置': '吉林', ' 人口': 123 },
            { '位置': '北京', ' 人口': 1223 },
            { '位置': '上海', ' 人口': 2123 },
            { '位置': '浙江', ' 人口': 4123 }
          ]
        }

    }
},
methods: {
    member(){
        this.$router.push({name:'increase'})
    }
},
}
</script>

<style lang="less">
.attribute{
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
  li:nth-of-type(2){
    color: #ffffff;
    background: #00a2ff;
  }
}
 .statistics{
        margin-top: 20px;
        background: #fff;
        height: 500px;
        padding: 20px 15px 0 15px;
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
            border: 1px solid #ccc;
            border-top: none;
            height: 410px;
            background: #fff;
        }
    }
    #terminal{
        height: 500px;
        background: #fff;
        margin-top: 20px;
        padding: 20px 15px 0 15px;
        p{
            color: #00a2ff;
        }
    }
    #map{
        height: 1000px;
        background: #fff;
        margin-top: 20px;
        padding: 20px 15px 0 15px;
        p{
            color: #00a2ff;
        }
        .left{
            width: 400px;
            height: 500px;
        }
    }
    #model{
        height: 500px;
        background: #fff;
        margin-top: 20px;
        padding: 20px 15px 0 15px;
        .left{
            width: 50%;
            height: 450px;
        }
        p{
            color: #00a2ff;
            margin-bottom: 15px;
        }
        img{
            width: 14px;
            height: 14px;
        }
        span{
            margin-left: 20px;
        }
    }
    #people{
        height: 500px;
        background: #fff;
        margin-top: 20px;
        padding: 20px 15px 0 15px;
        p{
            color: #00a2ff;
            margin-bottom: 20px;
        }
        .table{
            margin-top: 20px;
            .cell{
                text-align: center;
            }
        }
    }
}
</style>
