<template>
  <div class="warp_bg">
    <div class="now">
      <div class="top">
        <p>
          <el-button size="mini" type="primary">当前合约</el-button>
          合约期：2017年6月15日 至 2018年6月14日
        </p>
        <span>如有疑问，请致电统一服务热线：400-6766-999</span>
      </div>
      <table class="nowContract" border="0" cellpadding="0" cellspacing="0">
        <thead>
          <tr>
            <td>一级类别</td>
            <td>二级类别</td>
            <td>保证金</td>
            <td>平台使用年费</td>
            <td>合计</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th rowspan="100">食品茶酒</th>
            <th>休闲零食</th>
            <th rowspan="100">2000.00 </th>
            <th rowspan="100">2000.00</th>
            <th rowspan="100">4000.00</th>
          </tr>
          <tr>
            <th>糕点饼干</th>
          </tr>
          <tr>
            <th>糖果/巧克力</th>
          </tr>
          <tr>
            <th>冲调</th>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <th rowspan="100">食品茶酒</th>
            <th>休闲零食</th>
            <th rowspan="100">2000.00 </th>
            <th rowspan="100">2000.00</th>
            <th rowspan="100">4000.00</th>
          </tr>
          <tr>
            <th>糕点饼干</th>
          </tr>
          <tr>
            <th>糖果/巧克力</th>
          </tr>
          <tr>
            <th>冲调</th>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="5">
              应缴总金额：4000.00 元  |   已缴：0.00 元   |   保证金余额：0.00 元
              <p class="tips">此合约，已享受平台免费入驻政策</p>
            </td>
          </tr>
        </tfoot>
      </table>
      <div class="top" style="margin-top: 20px;">
        <p>
          <el-button size="mini" type="primary">续费合约</el-button>
          合约期：2017年6月15日 至 2018年6月14日
        </p>
      </div>
      <table class="nowContract" border="0" cellpadding="0" cellspacing="0">
        <thead>
          <tr>
            <td>一级类别</td>
            <td>二级类别</td>
            <td>保证金</td>
            <td>平台使用年费</td>
            <td>合计</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th rowspan="100">食品茶酒</th>
            <th>休闲零食</th>
            <th rowspan="100">2000.00 </th>
            <th rowspan="100">2000.00</th>
            <th rowspan="100">4000.00</th>
          </tr>
          <tr>
            <th>糕点饼干</th>
          </tr>
          <tr>
            <th>糖果/巧克力</th>
          </tr>
          <tr>
            <th>冲调</th>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <th rowspan="100">食品茶酒</th>
            <th>休闲零食</th>
            <th rowspan="100">2000.00 </th>
            <th rowspan="100">2000.00</th>
            <th rowspan="100">4000.00</th>
          </tr>
          <tr>
            <th>糕点饼干</th>
          </tr>
          <tr>
            <th>糖果/巧克力</th>
          </tr>
          <tr>
            <th>冲调</th>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="5">
              <p class="tips">合计：8000.00元 </p>
            </td>
          </tr>
        </tfoot>
      </table>
      <div class="settlement">
        <p><el-checkbox v-model="checked1">使用上一年保证金余额抵扣 ： 500.00元</el-checkbox></p>
        <p><el-checkbox v-model="checked2">使用账户余额抵扣： 500.00元</el-checkbox></p>
        <div class="tallPrice">应缴总金额：<span>4600.00</span>元</div>
        <div class="submission">
          <el-button size="small" type="primary">下一步</el-button>
          <el-button size="small" type="info">返回</el-button>
        </div>
      </div>

    </div>
  </div>
</template>

<script>

  export default {

    data(){
      return{
        checked1: true,
        checked2: true,
      }
    },

    methods: {



    }


  }
</script>

<style lang="less" scoped>


  .warp_bg{
    background: #fff;
    padding: 20px;
    .now{
      .top{
        width: 100%;
        display: table;
        p{
          display: table-cell;
        }
        span{
          display: table-cell;
          text-align: right;
        }
      }
    }
  }

  .nowContract{
    width: 100%;
    margin-top: 10px;
    border-collapse: collapse;
    thead{
      width: 100%;
      tr{
        width: 100%;
        td{
          width: auto;
          height: 35px;
          border: 1px #ddd solid;
          background: #eaeaea;
          text-align: center;
        }
      }
    }
    tbody{
      width: 100%;
      tr{
        width: 100%;
        th{
          height: 35px;
          border: 1px #eaeaea solid;
          font-weight: normal;
          color: #666;
        }
      }
    }
    tfoot{
      tr{
        td{
          border: 1px #eaeaea solid;
          text-align: right;
          padding: 20px;
          .tips{
            color: #ff6600;
            margin-top: 10px;
          }
        }
      }
    }
  }

  .settlement{
    text-align: right;
    padding-top: 20px;
    p{
      margin-top: 10px;
    }
    .submission{
      margin-top: 20px;
    }
    .tallPrice{
      font-size: 16px;
      margin-top: 10px;
      span{
        color: #f00;
        font-weight: 600;
      }
    }
  }


</style>
