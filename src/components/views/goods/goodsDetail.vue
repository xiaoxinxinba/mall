<template>
  <div class="goodsDetail_box">
    <div class="top">
      <el-button :type="active === 'basic' ? 'primary' : 'default'" size="small" @click="active = 'basic'">基本信息</el-button>
      <el-button :type="active === 'pic' ? 'primary' : 'default'" size="small" @click="active = 'pic'">图文详情</el-button>
    </div>

    <!--基本信息 start-->
    <template v-if="active === 'basic'">
      <div class="box_flex">
        <div class="box_flex_div">
          <div>
            <ul>
              <li>
                <span>商品类目：</span>
                <span>{{detailData.sysCategoryNodeList}}</span>
              </li>
              <li>
                <span>商品标题：</span>
                <span>{{detailData.title}}</span>
              </li>
              <li>
                <span>商品品牌：</span>
                <span>{{detailData.brand}}</span>
              </li>
            </ul>
          </div>
          <div>
            <ul>
              <li>
                <span>商品类目：</span>
                <span>{{detailData.userCategory}}</span>
              </li>
              <li>
                <span>商品卖点：</span>
                <span>{{detailData.sellPoint}}</span>
              </li>
              <li>
                <span>是否是活动商品：</span>
                <span>是（商家：满折、特价促销|平台：抽奖、满减）</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="box">
        <h3>商品规格</h3>
        <div class="table">
          <el-table :data="sepTableData" :span-method="mergeCells" border style="width: 100%;">
            <el-table-column v-for="(item, index) in titleHeaders" :key="index" :label="item" :prop="item" align="center"></el-table-column>
            <el-table-column
              prop="marketPrice"
              label="原价（元）"
              align="center">
            </el-table-column>
            <el-table-column
              prop="sellPrice"
              label="售价（元）"
              align="center">
            </el-table-column>
            <el-table-column
              prop="store"
              label="库存"
              align="center">
            </el-table-column>
            <el-table-column
              prop="goodsNo"
              label="商品编码"
              align="center">
            </el-table-column>
          </el-table>
        </div>
      </div>

      <div class="box_flex">
        <h3>商品属性</h3>
        <div class="box_flex_div">
            <ul class="attributes_list">
                <li v-for="(item, index) in attributes" :key="index">
                    <span>{{item.title}}：</span>
                    <span>{{item.value}}</span>
                </li>
            </ul>
          <!--<div>
            <ul>
              <li>
                <span>尺码：</span>
                <span>XXL</span>
              </li>
              <li>
                <span>材质成分：</span>
                <span>涤纶+纯棉100%</span>
              </li>
            </ul>
          </div>
          <div>
            <ul>
              <li>
                <span>主要 颜色：</span>
                <span>灰色、白色、蓝色</span>
              </li>
            </ul>
          </div>-->
        </div>
      </div>

      <div class="box_flex">
        <h3>重量/体积</h3>
        <div class="box_flex_div">
          <div>
            <ul>
              <li>
                <span>重量（KG）：</span>
                <span>{{detailData.weight}}</span>
              </li>
            </ul>
          </div>
          <div>
            <ul>
              <li>
                <span>体积（m³）：</span>
                <span>{{detailData.volume}}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="box_flex">
        <h3>物流服务</h3>
        <div class="box_flex_div">
          <div>
            <ul>
              <li>
                <span>快递公司：</span>
                <span>{{detailData.expressCompany == null ? '' : detailData.expressCompany}}</span>
              </li>
            </ul>
          </div>
          <div>
            <ul>
              <li>
                <span>运费模板：</span>
                <span>{{detailData.expressTemp == null ? '' : detailData.expressTemp}}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="box_flex">
        <h3>服务承诺</h3>
        <div class="box_flex_div">
          <div>
            <ul>
              <li>
                <span>服务承诺：</span>
                <span>{{detailData.isSevenDay == 1 ? '支持7天无理由退换货' : ''}}</span>
              </li>
            </ul>
          </div>
          <div>
            <ul>
              <li>
                <span>售后保修服务：</span>
                <span>{{detailData.saleRules == 1 ? '全国联保' : '商家售后'}}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </template>
    <!--基本信息 end-->

    <!--图文详情 start-->
    <template v-if="active === 'pic'">
      <div class="box_flex">
        <h3>商品规格</h3>
        <div class="box_flex_img">
          <viewer>
              <img class="vue-lazyload avatar" v-for="item in detailData.photos" :key="item" v-lazy="item" title="点击查看大图"/>
          </viewer>
        </div>
      </div>

      <div class="box_flex">
        <h3>商品介绍</h3>
        <div class="box_flex_pic">
          <div>
              <img class="vue-lazyload" v-for="(item, index) in detailImages" :key="index" v-lazy="item.value"/>
          </div>
        </div>
      </div>
    </template>
    <!--图文详情 end-->

    <div class="btn">
      <el-button @click="goBack">返回</el-button>
    </div>

  </div>
</template>

<script>
import GoodsDetail from '../../../api/goods/goodsDetail';
export default {
    data() {
      return {
        active: 'basic', // 'basic' => 基本信息； 'pic' => 图文详情
        rulesData: [
          {
            shop_number: '20190411',
            color: '黑色',
            size: '165/80A',
            originalSellPrice: '100.00',
            auditSellPrice: '88.00',
            stock: '12',
            code: 'SD123456'
          }, {
            shop_number: '20190411',
            color: '黑色',
            size: '170/84A',
            originalSellPrice: '100.00',
            auditSellPrice: '88.00',
            stock: '12',
            code: 'SD123457'
          }, {
            shop_number: '20190411',
            color: '黑色',
            size: '175/88A',
            originalSellPrice: '100.00',
            auditSellPrice: '88.00',
            stock: '12',
            code: 'SD123458'
          }, {
            shop_number: '20190412',
            color: '红色',
            size: '165/80A',
            originalSellPrice: '100.00',
            auditSellPrice: '88.00',
            stock: '12',
            code: 'SD123459'
          }, {
            shop_number: '20190412',
            color: '红色',
            size: '170/84A',
            originalSellPrice: '100.00',
            auditSellPrice: '88.00',
            stock: '12',
            code: 'SD123460'
          }
        ],
        rowIndex: '-1',
        OrderIndexArr: [], // 存放需要合并的项
        detailData: {},
        sepTableData: [], //规格列表
        detailImages: [],
        titleHeaders: [], //规格标题 例如：'颜色','规格','其他'
        attributes: [] //商品属性
      }
    },
    mounted: function(){
        this.initDetailData();
        //this.getOrderNumber();
    },
    methods: {
        initDetailData: function(){
            GoodsDetail.call(this,
                '?articleId=' + this.$route.query.goodsId +
                '&clientVersion=1.0.0' +
                '&clientTimespan=' + this.$Tool.formatDate(new Date())
            ).then(res => {
                console.log(res, "商品详情返回的数据");
                if(res.data.code === 1){
                    this.constructionData(res.data.data.specList);
                    this.detailData = res.data.data;
                    this.constructionAttrData(res.data.data.attribute);
                    this.detailImages = eval('(' + this.detailData.goodsDetails + ')');
                } else {
                    // this.$router.go( -1 );
                    this.$message.error('查询失败');
                }
            })
        },
        constructionAttrData: function(attribute){
            for (let key in attribute) {
                let o = {
                    title: key,
                    value: attribute[key]
                }
                this.attributes.push(o);
            }
        },
        constructionData: function(specList){
            specList.forEach((ele, index) => {
                let dynamicSpec = ele.dynamicSpec;
                for (let key in dynamicSpec) {
                    if(this.titleHeaders.indexOf(key) == -1){
                        this.titleHeaders.push(key);
                    }
                    ele[key] = dynamicSpec[key];
                }
            });
            this.sepTableData = specList;
        },
        mergeCells: function({row, column, rowIndex, columnIndex}){
            //console.log(o);
        },
      /**
       * 获取相同编号的数组
       */
      getOrderNumber() {
        let OrderObj = {};
        this.rulesData.forEach( (element, index) => {
          element.rowIndex = index;
          if (OrderObj[element.shop_number]) {
            OrderObj[element.shop_number].push(index);
          } else {
            OrderObj[element.shop_number] = [];
            OrderObj[element.shop_number].push(index);
          }
        } ); // 将数组长度大于1的值 存储到this.OrderIndexArr（也就是需要合并的项）

        for ( let k in OrderObj ) {
          if ( OrderObj[k].length > 1 ) {
            this.OrderIndexArr.push(OrderObj[k]);
          }
        }
      },

      /**
       * 合并单元格
       * @param row
       * @param column
       * @param rowIndex
       * @param columnIndex
       * @returns {*}
       */
      modifyPriceMethod ( {row, column, rowIndex, columnIndex} ) {
        if (columnIndex === 0) {
          for (let i = 0; i < this.OrderIndexArr.length; i++) {
            let element = this.OrderIndexArr[i];
            for (let j = 0; j < element.length; j++) {
              let item = element[j];
              if (rowIndex == item) {
                if (j == 0) {
                  return {
                    rowspan: element.length, colspan: 1
                  }
                } else if (j != 0) {
                  return {
                    rowspan: 0, colspan: 0
                  }
                }
              }
            }
          }
        }
      },

      /**
       * 返回操作
       */
      goBack() {
        this.$router.go( -1 );
      },

    }
  }
</script>

<style lang="less" scoped>
  @import "./less/goodsDetail.less";
  .box_flex_pic>div>img {
      width: 100%;
      display: block;
  }
  .attributes_list li{
      width: 50%;
      display: inline-block;
      line-height: 25px;
  }
</style>
