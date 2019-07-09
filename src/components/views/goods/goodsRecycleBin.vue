<template>
  <div class="goodsRecycleBin_box">
    <div class="tips">
      <p>温馨提示：只有已下架、审核未通过的商品可以移入回收站；商品被永久删除后无法还原。</p>
    </div>

    <div class="btn">
      <!--<el-button type="danger" size="small" @click="submitDelete">批量永久删除</el-button>-->
      <el-button type="default" size="small" @click="submitRestore()">批量还原</el-button>
    </div>

    <div class="table">
      <el-table
        ref="multipleTable"
        :data="recycleBinData"
        border
        tooltip-effect="dark"
        style="width: 100%"
        @select="selectHander"
        @select-all="selectAllHander">
        <el-table-column
          type="selection"
          align="center"
          width="55">
        </el-table-column>
        <el-table-column
          label="商品名称"
          align="center"
          width="360">
          <template slot-scope="scope">
            <div class="goods">
              <span><viewer><img class="vue-lazyload pic" v-lazy="scope.row.img" :key="scope.row.img" alt="" title="点击查看大图"></viewer></span>
              <div>
                <p>{{scope.row.title}}</p>
                <i>{{scope.row.userCategory}}</i>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="市场价(元)"
          align="center">
          <template slot-scope="scope">
            <div>
              ￥ {{ scope.row.marketPrice }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="销售价(元)"
          align="center">
          <template slot-scope="scope">
            <div>
              ￥ {{ scope.row.sellPrice }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="statusDesc"
          label="商品状态"
          align="center">
        </el-table-column>
        <el-table-column
          prop="opera"
          label="操作"
          align="center">
          <template slot-scope="scope">
            <div>
              <el-button type="text" @click="submitRestore(scope.row.id)">还原</el-button>
              <!--<el-button type="text" @click="goodsDelete(scope.row.id)">删除</el-button>-->
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--页码开始-->
    <div class="page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.currentPage"
        :page-sizes="[5, 10, 20, 40]"
        :page-size="page.currentPageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.listTotal">
      </el-pagination>
    </div>
    <!--页码结束-->

  </div>
</template>

<script>
import GoodsList from '../../../api/goods/goodsRecycleBinList';
import GoodsBatchRestore from '../../../api/goods/goodsBatchRestore';
import GoodsBatchEverDelete from '../../../api/goods/goodsBatchEverDelete';
export default {
    data() {
        return {
            recycleBinData: [], //表格数据
            selectGoodsIds: [], //选中的商品ID
            page: { //分页参数
                listTotal: 0,
                currentPage: 1,
                currentPageSize: 10
            }
        }
    },
    mounted: function(){
        this.initTableData();
    },
    methods: {
        initTableData: function(){
            GoodsList.call(this,
                '?pageIndex=' + this.page.currentPage +
                '&pageSize=' + this.page.currentPageSize +
                '&clientVersion=1.0.0' +
                '&clientTimespan=' + this.$Tool.formatDate(new Date())
            ).then(res => {
                if(res.data.code == 1){
                    this.page.listTotal = res.data.data.totalCount;
                    this.recycleBinData = res.data.data.goodsList;
                }
            })
        },
        submitRestore: function(goodsId){
            if(undefined != goodsId || null != goodsId){
                this.clearSelectGoodsIds();
                this.selectGoodsIds.push(goodsId);
            }else{
                if(this.selectGoodsIds.length == 0){
                    this.$message.warning('至少选择一件商品');
                    return;
                }
            }
            console.log(this.selectGoodsIds);
            this.$confirm('确定还原' + (this.selectGoodsIds.length) + '条商品吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                GoodsBatchRestore.call(this, {
                    articleIds: this.selectGoodsIds.join(','),
                    clientVersion: '1.0.0',
                    clientTimespan: this.$Tool.formatDate(new Date())
                }).then(res => {
                    if(res.data.code == 1){
                        this.clearSelectGoodsIds();
                        this.initTableData();
                    }
                })
            }).catch(() => {
                this.clearSelectGoodsIds();
            })
        },
        submitDelete: function(){
            console.log(this.selectGoodsIds)
            if(this.selectGoodsIds.length == 0){
                this.$message.warning('至少选择一件商品');
                return;
            }
            this.$confirm('确定删除' + this.selectGoodsIds.length + '条商品吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                goodsBatchEverDelete.call(this, {
                    clientVersion: '1.0.0',
                    clientTimespan: this.$Tool.formatDate(new Date())
                }).then(res => {
                    if(res.data.code == 1){
                        this.clearSelectGoodsIds();
                        this.initTableData();
                    }
                })
            }).catch(() => {
                this.clearSelectGoodsIds();
            })
        },
        selectHander: function(allRows, row){ //选择数据操作
            console.log(row);
            if(this.selectGoodsIds.indexOf(row.id) == -1){
                this.selectGoodsIds.push(row.id);
            }else{
                this.selectGoodsIds.splice(this.selectGoodsIds.indexOf(row.id), 1);
            }
        },
        selectAllHander: function(allRows){ //全选和取消全选操作
            console.log(allRows);
            if(allRows.length == 0){
                for(let i = 0; i < this.recycleBinData.length; i++){
                    this.selectGoodsIds.splice(this.selectGoodsIds.indexOf(this.recycleBinData[i].id), 1);
                }
            }else{
                for(let i = 0; i < this.recycleBinData.length; i++){
                    if(this.selectGoodsIds.indexOf(this.recycleBinData[i].id) == -1){
                        this.selectGoodsIds.push(this.recycleBinData[i].id);
                    }
                }
            }
            console.log(this.selectGoodsIds)
        },
        clearSelectGoodsIds: function(){
            console.log('清空选择的商品ID ==========================================================>> ');
            this.selectGoodsIds = [];
            this.$refs.multipleTable.clearSelection();
        },
        handleSizeChange(val) {
            this.page.currentPageSize = val;
            this.initTableData();
        },
        handleCurrentChange(val) {
            this.page.currentPage = val;
            this.initTableData();
        }
    }
}
</script>

<style lang="less" scoped>
  @import "./less/goodsRecycleBin.less";
</style>
