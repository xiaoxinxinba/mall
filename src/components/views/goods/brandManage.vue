<template>
  <!--品牌管理-->
  <div class="container">
    <div class="add-btn">
      <span v-show="expireBarnd != -1">
        <i class="el-icon-warning"></i>有已过期品牌，请及时处理，否则此品牌下的商品将无品牌
      </span>

      <router-link to="/goods/brandImpower">
        <el-button type="primary">
          <i class="el-icon-plus"></i>品牌授权
        </el-button>
      </router-link>
    </div>

    <!--品牌信息-->
    <div class="table">
      <el-table :data="goods" style="width: 100%">
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <div class="goods-name">
              <i v-show="scope.row.isExpire == 1"></i>
              <span>{{ scope.row.name}}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="品牌logo" align="center">
          <template slot-scope="scope">
            <img class="table-img" :src="scope.row.logo" alt>
          </template>
        </el-table-column>

        <el-table-column label="申请类型" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.type}}</span>
          </template>
        </el-table-column>

        <el-table-column label="授权到期时间" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.expireDate}}</span>
          </template>
        </el-table-column>

        <el-table-column label="审核状态" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.statusDesc}}</span>
            <el-tooltip class="item" effect="light" content="点击查看原因" placement="bottom-end"
                        v-show="scope.row.status == 2">
              <i class="el-icon-warning" @click="lookReason(scope.row.auditReason)"></i>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div class="operation">
              <span @click="handlelook(scope.$index, scope.row)">查看</span>
              <span @click="handleEdit(scope.$index, scope.row,scope.row.type)" v-show="scope.row.status == 2">编辑</span>
              <span @click="handleDelete(scope.$index, scope.row)"
                    v-show="scope.row.status == 2 ||scope.row.status == 1 || scope.row.isExpire  == 1">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--分页-->
    <div class="paging">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="pageSizes"
        :page-size="itemNum"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>

    <!--查看框-->
    <el-dialog title="提示" :visible.sync="dialogLook" width="428px" center>
      <div class="look-show">
        <div>品牌名称：{{brandDetail.name }}</div>
        <div>授权到期时间：{{brandDetail.expireDate}}</div>
        <ul>
          <li>
            <img :src="lookImgLogo" alt>
            <p>品牌logo</p>
          </li>
          <li>
            <img :src="redactImgLogo" alt>
            <p>商标注册证/品牌授权书</p>
          </li>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer look-show-footer">
        <el-button type="primary" @click="dialogLook = false">关闭</el-button>
      </span>
    </el-dialog>

    <!--编辑框-->
    <el-dialog title="品牌信息" :visible.sync="dialogRedact" width="428px" center>
      <div class="redact-show">
        <div>品牌名称：安踏</div>
        <div>授权到期时间：2017-09-08</div>
        <ul>
          <li>
            <img :src="redactImgLogo" alt>
            <p>品牌logo</p>
          </li>
          <li>
            <img :src="redactImgLogo" alt>
            <p>商标注册证/品牌授权书</p>
          </li>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer look-show-footer">
        <el-button type="primary" @click="dialogRedact = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import GetShopBrandList from '../../../../src/api/ShopBrand/GetShopBrandList'
  import GetShopBrandDetails from '../../../../src/api/ShopBrand/GetShopBrandDetails'
  import DeleteShopBrand from '../../../../src/api/ShopBrand/DeleteShopBrand'
  import _findIndex from 'lodash/findIndex'

  export default {
    name: "brandManage",
    data() {
      return {
        goods: [
          // {name:'1耐克', imgSrc:'http://kuailian-upload.oss-cn-shenzhen.aliyuncs.com/upload/201904/12/Gcuiv3d9BEf.jpg', type:'已有品牌授权', date: '2016-05-02', state:'待审核',},
          // {name:'2耐克', imgSrc:'http://kuailian-upload.oss-cn-shenzhen.aliyuncs.com/upload/201904/12/Gcuiv3d9BEf.jpg', type:'已有品牌授权', date: '2016-05-02', state:'待审核',},
          // {name:'3耐克', imgSrc:'http://kuailian-upload.oss-cn-shenzhen.aliyuncs.com/upload/201904/12/Gcuiv3d9BEf.jpg', type:'已有品牌授权', date: '2016-05-02', state:'待审核',},
          // {name:'4耐克', imgSrc:'http://kuailian-upload.oss-cn-shenzhen.aliyuncs.com/upload/201904/12/Gcuiv3d9BEf.jpg', type:'已有品牌授权', date: '2016-05-02', state:'待审核',},
        ],
        currentPage: 1,
        pageSizes: [8, 10, 20],
        pageNum: 1, //当前页
        itemNum: 8, //每页多少条
        total: 100,
        dialogLook: false, //控制是否显示查看框
        lookImgLogo:
          "http://kuailian-upload.oss-cn-shenzhen.aliyuncs.com/upload/201904/12/Gcuiv3d9BEf.jpg",
        dialogRedact: false, //控制是否显示编辑框
        redactImgLogo:
          "http://kuailian-upload.oss-cn-shenzhen.aliyuncs.com/upload/201904/12/Gcuiv3d9BEf.jpg",
        sessionId: '',
        time: '',
        loginType: "PC",
        clientVersion: "1",
        expireBarnd: 0, //到期的品牌
        brandDetail: {}, //品牌详细信息
      };
    },
    mounted() {
      this.loadBrandList();
    },
    computed: {
      goodsData() {
        let start = (this.pageNum - 1) * this.itemNum;
        let end = start + this.itemNum;
        return this.goods.filter((item, index) => {
          if (index >= start && index < end) {
            return item;
          }
        });
      }
    },
    methods: {
      //加载银行卡列表数据。
      loadBrandList() {
        this.time = new Date().toLocaleString();
        this.sessionId = sessionStorage.getItem('sessionId');
        GetShopBrandList.call(this, `?input.sessionId=${this.sessionId}&input.pageIndex=${this.pageNum}&input.pageSize=${this.itemNum}&input.clientTimespan=${this.time}`).then(res => {
          if (res.data.code === 1) {
            console.log(res.data.data)
            this.goods = res.data.data.shopBrandList; // 填充数据
            this.total = res.data.data.totalCount
            this.expireBarnd = _findIndex(this.goods, function (o) {
              return o.isExpire == 1;
            })
          }
          else return [];
        });
      },

      //查看
      handlelook(index, row) {
        GetShopBrandDetails.call(this, `?input.sessionId=${this.sessionId}&input.brandId=${row.id}&input.clientTimespan=${this.time}`).then(res => {
          if (res.data.code === 1) {
            this.brandDetail = res.data.data; // 详情数据
            this.lookImgLogo = this.brandDetail.logo;
            this.redactImgLogo = this.brandDetail.authorizationImg;
          }
        });
        this.dialogLook = true;
      },
      //编辑
      handleEdit(index, row,typeStr) {
        if (typeStr === "已有品牌授权")
        {
          this.$router.push({path: '/goods/brandImpower', query: {brandInfo: row}})
        }
        else{
          this.$router.push({path: '/goods/brandAdd', query: {brandInfo: row}})
        }
      },
      //删除
      handleDelete(index, row) {
        this.$confirm("删除后，此品牌下的商品将无品牌,确定删除品牌吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.goods.splice(index, 1);
          DeleteShopBrand.call(this, {
            shopBrandId: row.id,
            sessionId: this.sessionId,
            loginType: this.loginType,
            clientVersion: this.clientVersion,
            clientTimespan: this.time
          }).then(res => {
            if (res.data.code === 1) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.loadBrandList();
            }
            else {
              this.$message({
                type: "error",
                message: "删除失败!"
              });
            }
          })
        })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      },
      handleSizeChange(val) {
        this.itemNum = val;
        this.loadBrandList();
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.pageNum = val;
        this.loadBrandList();
        console.log(`当前页: ${val}`);
      },
      lookReason(message) {
        this.$confirm(message, "审核未通过原因", {
          confirmButtonText: "确定",
          type: "warning"
        })
      }
    }
  };
</script>

<style lang="less" scoped>
  @import "less/brandManage.less";
</style>
