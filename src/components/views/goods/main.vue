<template>
  <div>
    <div class="main_message">
      <div>
        <h3>商品调价</h3>
        <p><span>{{goodsStatisticeCount.waitCount}}</span> 个改价待审核</p>
        <p><span>{{goodsStatisticeCount.failCount}}</span> 个改价审核未通过，价格未更新</p>
        <p><span>{{goodsStatisticeCount.successCount}}</span> 个改动审核已通过，价格已更新 <a href="javascript: void(0);"
                                                                                @click="getRevisePriceList()">查看详情</a>
        </p>
      </div>

      <div>
        <h3>商品上架提醒</h3>
        <p>{{remainNotice}}</p>
        <div>
          <a href="javascript: void(0);" @click="shelfReminderVisible = true">查看全部</a>
        </div>
      </div>
    </div>
    <div class="main_table">
      <!--操作按钮切换 start-->
      <div class="main_top">
        <div class="radio_left">
          <el-radio-group v-model="queryCondition.type" @change="page.currentPage = 1; initTableDataByGoods()">
            <el-radio-button label="0" :value="0">出售中的商品({{goodsStatisticeCount.onOffer}})</el-radio-button>
            <el-radio-button label="1" :value="1">仓库中的商品({{goodsStatisticeCount.warehouse}})</el-radio-button>
            <el-radio-button label="2" :value="2">强制下架的商品({{goodsStatisticeCount.soldOut}})</el-radio-button>
            <!--<el-radio-button label="3" :value="3">待核对商品({{goodsStatisticeCount.awaitAudit}})</el-radio-button>-->
          </el-radio-group>
        </div>

        <div class="radio_left">
          <span>商品总数：{{goodsAmount}}</span>
        </div>

        <div class="radio_right">
          <a href="javascript: void(0);" @click="goRecycleBin">商品回收站</a>
        </div>
      </div>
      <!--操作按钮切换 end-->

      <!--条件筛选开始-->
      <div class="screen">
        <el-form :inline="true" class="demo-form-inline" label-width="120px">

          <el-form-item label="商品分类：">
            <el-cascader
              v-model="queryCondition.systemCategory"
              :options="shopOptions"
              @active-item-change="shopOptionsHander"
              :props="shopOptionProps"
              :show-all-levels="false"
              :clearable="true">
            </el-cascader>
          </el-form-item>

          <el-form-item label="自定义分类：">
            <el-cascader v-model="queryCondition.userCategory"
                         :options="customOptions"
                         :show-all-levels="false"
                         :clearable="true">
            </el-cascader>
          </el-form-item>

          <el-form-item label="商品名称：">
            <el-input placeholder="请输入商品名称" v-model="queryCondition.title"></el-input>
          </el-form-item>

          <el-form-item label="审核状态：">
            <el-select v-model="queryCondition.auditState" placeholder="请选择">
              <el-option
                v-for="(item, i) in auditOptions"
                :key="i"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="销售价：">
            <el-input style="width: 92px" v-model="queryCondition.minSellPrice"></el-input>
            <span style="display: inline-block; margin: 0 6px;">到</span>
            <el-input style="width: 92px" v-model="queryCondition.maxSellPrice"></el-input>
          </el-form-item>

          <el-form-item label="已售数量：">
            <el-input style="width: 92px" v-model="queryCondition.minSellCount"></el-input>
            <span style="display: inline-block; margin: 0 6px;">到</span>
            <el-input style="width: 92px" v-model="queryCondition.maxSellCount"></el-input>
          </el-form-item>

          <el-form-item>
            <div class="searchMean">
              <el-checkbox v-model="queryCondition.isJoinActivity">参加活动商品</el-checkbox>
            </div>
          </el-form-item>

          <el-form-item>
            <div class="searchMean">
              <el-button type="primary" @click="initTableDataByGoods()">搜索商品</el-button>
            </div>
          </el-form-item>

          <el-form-item>
            <el-button type="default" @click="goodsExport()">导出库存</el-button>
          </el-form-item>

          <el-form-item>
            <el-upload
              ref="goodsImportUpload"
              action=""
              :multiple="false"
              :show-file-list="false"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              :before-upload="goodsImport">
              <el-button type="default">导入库存</el-button>
            </el-upload>

          </el-form-item>

          <el-form-item>
            <el-button type="default" v-if="queryCondition.type == 1" @click="showPutawayDialog()">已核对，批量上架</el-button>
          </el-form-item>

          <el-form-item>
            <div class="searchMean">
              <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                  更多操作<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="cate">批量设置自定义分类</el-dropdown-item>
                  <el-dropdown-item command="stock">批量设置库存</el-dropdown-item>
                  <el-dropdown-item command="price">批量调整价格</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <!--条件筛选结束-->
      <!--表格 start-->
      <div class="table">
        <el-table ref="multipleGoodsTable"
                  :data="tableData"
                  row-key="id"
                  @select="selectHander"
                  @select-all="selectAllHander"
                  @sort-change="setSortField"
                  v-loading="tableLoading"
                  border
                  tooltip-effect="dark"
                  style="width: 100%">

          <el-table-column type="selection" align="center" width="55"></el-table-column>
          <el-table-column
            label="商品图片"
            fixed
            align="center"
            width="80">
            <template slot-scope="scope">
              <viewer :images="scope.row.pic">
                <img class="vue-lazyload pic" v-lazy="scope.row.img" :key="scope.row.img" alt="" title="点击查看大图">
              </viewer>
            </template>
          </el-table-column>

          <el-table-column
            label="商品名称"
            align="center"
            width="320">
            <template slot-scope="scope">
              <div class="shopName">
                <p style="text-align: left;">
                  <a href="javascript: void(0);" @click="goDetail(scope.row.id)">{{scope.row.title}}</a>
                  <span v-show="scope.row.isJoinActivity == 1" class="acitivity">活动中</span>
                </p>
                <i class="el-icon-edit"
                   @click="showUpdateGoodsNameDialog(scope.row.id, scope.row.title, scope.row.soldoutStatus)"></i>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="自定义分类"
            align="center"
            width="110">
            <template slot-scope="scope">
              <div class="shopName">
                <p
                  style="width: 56px; text-align: center; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
                  <em :title="scope.row.userCategory">{{scope.row.userCategory}}</em>
                </p>
                <i class="el-icon-edit"
                   @click="showUpdateCustomClassDialog(scope.row.id, scope.row.userCategoryClassList, scope.row.soldoutStatus)"></i>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="已售数量" sortable="custom" width="150">
            <template slot-scope="scope">
              <a style="text-decoration: underline;" href="javascript: void(0);"
                 @click="getSellDetailList(scope.row.id)">{{scope.row.sellCount}}</a>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="市场价(元)" width="130">
            <template slot-scope="scope">
              <div>{{scope.row.marketPrice}}</div>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="销售价(元)" width="130">
            <template slot-scope="scope">
              <div>{{scope.row.sellPrice}}</div>
            </template>
          </el-table-column>

          <el-table-column
            label="库存"
            align="center"
            width="110" sortable="custom">
            <template slot-scope="scope">
              <div class="shopName">
                <p style="width: 60px;"><em>{{scope.row.store}}</em></p>
                <i class="el-icon-edit" @click="showSetSepPriceDialog(scope.row.id, scope.row.soldoutStatus)"></i>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="更新时间" sortable="custom" width="160">
            <template slot-scope="scope">
              <div>{{scope.row.updateTime}}</div>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="审核状态">
            <template slot-scope="scope">
              <div>{{scope.row.statusDesc}}</div>
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            align="center"
            fixed="right"
            width="170">
            <template slot-scope="scope">
              <el-button v-if="queryCondition.type != 0" 
                        :disabled="scope.row.status != 0" 
                        size="mini" type="text" 
                        @click="showPutawayDialog(scope.row.id)">上架
              </el-button>
              <el-button v-if="queryCondition.type == 0"
                         :disabled="scope.row.isJoinActivity == 1 || scope.row.soldoutStatus != 1"
                         :title="scope.row.isJoinActivity == 1 ? '商品已参加活动不可下架' : scope.row.soldoutStatus == 2 ? '商品下架审核中' : '' "
                         size="mini" type="text" @click="showSoldoutDialog(scope.row.id)">下架
              </el-button>
              <el-button :disabled="scope.row.status == 1 || scope.row.soldoutStatus == 2" 
                         :title="scope.row.status == 1 ? '商品审核中，不可编辑' : scope.row.soldoutStatus == 2 ? '商品下架审核中，不可编辑' : ''" 
                         size="mini" type="text" @click="edit(scope.row.id)">编辑
              </el-button>
              <el-button :disabled="scope.row.status == 1 || scope.row.soldoutStatus == 2" 
                         :title="scope.row.status == 1 ? '商品审核中，不可删除' : scope.row.soldoutStatus == 2 ? '商品下架审核中，不可删除' : ''" 
                         size="mini" type="text" @click="goodsDelete(scope.row.id)">删除
              </el-button>
              <!--<el-button v-if="scope.row.soldoutStatus === 0 && scope.row.status === 0" size="mini" type="text" @click="showPutawayDialog(scope.row.id)">上架</el-button>
              <el-button v-if="queryCondition.type == 0 && scope.row.soldoutStatus === 1" size="mini" type="text" @click="showSoldoutDialog(scope.row.id)">下架</el-button>
              <el-button v-if="scope.row.status != 1" size="mini" type="text" @click="edit(scope.row.id)">编辑</el-button>
              <el-button v-if="scope.row.status != 1 && ((scope.row.soldoutStatus === 0 || scope.row.soldoutStatus === 2) || scope.row.status === 3)" size="mini" type="text" @click="goodsDelete(scope.row.id)">删除</el-button>-->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--表格 end-->

      <!--页码开始-->
      <div class="page">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page.currentPage"
          :page-sizes="[10, 30, 50, 100]"
          :page-size="page.currentPageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page.listTotal">
        </el-pagination>
      </div>
      <!--页码结束-->
    </div>

    <!--商品调价列表弹框 start-->
    <el-dialog
      title="商品调价列表"
      :visible.sync="modifyPriceDetailVisible"
      @close="dialogClose()"
      width="85%">
      <div class="modifyPriceDetail_box">
        <el-table
          :data="modifyPriceData"
          :span-method="merge"
          border
          tooltip-effect="dark"
          style="width: 100%;">
          <el-table-column
            label="商品名称"
            align="center"
            width="260">
            <template slot-scope="scope">
              <a style="text-decoration: underline;" href="javascript: void(0);" @click="goDetail(scope.row.articleId)">{{scope.row.articleName}}</a>
            </template>
          </el-table-column>
          <el-table-column
            prop="specText"
            label="商品规格"
            align="center">
          </el-table-column>
          <el-table-column
            prop="expectPrice"
            label="原售价（元）"
            align="center"
            width="115">
          </el-table-column>
          <el-table-column
            prop="currentPrice"
            label="申请售价（元）"
            align="center"
            width="120">
          </el-table-column>
          <el-table-column
            prop="statusTip"
            label="审核状态"
            align="center"
            width="100">
          </el-table-column>
          <el-table-column
            prop="reason"
            label="原因"
            align="center" show-overflow-tooltip>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="modifyPriceDetailVisible = false">知道了</el-button>
        </span>
    </el-dialog>
    <!--商品调价详情弹框 end-->

    <!--商品上架提醒弹框 start-->
    <el-dialog
      title="商品上架提醒"
      :visible.sync="shelfReminderVisible"
      @close="dialogClose()"
      width="600px">
      <div class="modifyPriceDetail_box">
        <el-table
          :data="remainList"
          border
          style="width: 100%;">
          <el-table-column
            label="商品"
            align="center">
            <template slot-scope="scope">
              <a style="text-decoration: underline;" href="javascript: void(0);" @click="goDetail(scope.row.articleId)">{{scope.row.title}}</a>
            </template>
          </el-table-column>
          <el-table-column
            prop="remindUptime"
            label="上架提醒日期"
            align="center"
            width="180">
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="shelfReminderVisible = false">知道了</el-button>
        </span>
    </el-dialog>
    <!--商品上架提醒弹框 end-->

    <!--批量设置自定义分类弹框 start-->
    <el-dialog
      :title="setCustomClassStr"
      :visible.sync="settingCustomizationVisible"
      @close="dialogClose()"
      width="600px">
      <el-form :model="customOptionsModel" ref="customOptionsSelectBatch" :rules="customOptionsValid">
        <el-form-item label="一级分类：" prop="customOptionsFirstValue" label-width="120px">
          <el-select style="width: 350px;" v-model="customOptionsModel.customOptionsFirstValue" placeholder="请选择">
            <el-option
              v-for="item in customOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="二级分类：" prop="customOptionsTwoValue" label-width="120px">
          <el-select style="width: 350px;" v-model="customOptionsModel.customOptionsTwoValue" placeholder="请选择">
            <el-option
              v-for="item in customOptionsTwo"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <div class="settingCustomization_div">
          <span class="icon">未找到自定义分类？</span>
          <a href="javascript:void(0);" @click="toGoodsClass()">点击设置分类</a>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="settingCustomizationVisible = false;clearSelectGoodsIds()">取 消</el-button>
        <el-button type="primary" @click="submitUpdateCustom">确 定</el-button>
      </div>
    </el-dialog>
    <!--批量设置自定义分类弹框 end-->

    <!--批量设置库存弹框 start-->
    <el-dialog
      title="批量设置库存 [已选38个商品]"
      :visible.sync="setStockVisible"
      @close="dialogClose()"
      width="600px">
      <el-form :model="inventoryModel" :rules="inventoryValid" ref="inventoryInput">
        <el-form-item label="库存：" label-width="120px" prop="inventory">
          <el-input style="width: 300px;" v-model="inventoryModel.inventory"></el-input>
        </el-form-item>
        <div class="settingCustomization_div">
          <span>设置后，已选择的商品每个规格的库存将调整至填写数字，请谨慎操作</span>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setStockVisible = false;clearSelectGoodsIds()">取 消</el-button>
        <el-button type="primary" @click="submitUpdateInventory">确 定</el-button>
      </div>
    </el-dialog>
    <!--批量设置库存弹框 end-->

    <!--批量调整售价弹框 start-->
    <el-dialog
      :title="revisePriceStr"
      :visible.sync="setPriceVisible"
      @close="dialogClose()"
      width="650px">
      <el-form :model="revisePriceModel" ref="revisePriceInput" :rules="revisePriceValid">
        <el-form-item label="降价百分比：" prop="priceValue" label-width="120px">
          <el-input-number v-model="revisePriceModel.priceValue" :max="100" :min="0.01" :step="0.01"
                           controls-position="right"></el-input-number>
          <!--<el-input v-model="revisePriceModel.priceValue" style="width: 200px;" placeholder="只能输入数字" max="100" min="0.01" :step="0.01"></el-input>-->
          <span class="color_666"> % </span>
        </el-form-item>
        <div class="settingCustomization_div">
          <span>设置后，已选择的商品每个规格的价格将会调低相应百分比，请谨慎操作！
            <br/>
            例如售价10.00元，降价百分比为10%，则调价后，售价为9.00元</span>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setPriceVisible = false;clearSelectGoodsIds()">取 消</el-button>
        <el-button type="primary" @click="submitRevisePrice()">确 定</el-button>
      </div>
    </el-dialog>
    <!--批量调整售价弹框 end-->

    <!--修改商品名称弹框 start-->
    <el-dialog
      title="修改商品名称"
      :visible.sync="uploadShopNameVisible"
      @close="dialogClose()"
      width="600px">
      <el-form>
        <el-form-item label="商品名称：" label-width="120px">
          <div>
            <el-input style="width: 350px;" v-model="shopName" maxlength="30"></el-input>
            <span class="color_666">
              <i class="color_ff1f02">{{shopName.length}}</i> /
              <i class="color_333">30</i>
            </span>
            <p v-if="'' == shopName" style="color: #ff1f02;">请输入商品名称</p>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="uploadShopNameVisible = false;clearSelectGoodsIds()">取 消</el-button>
        <el-button type="primary" @click="submitUpdateName()">确 定</el-button>
      </div>
    </el-dialog>
    <!--修改商品名称弹框 end-->

    <!--已售数量弹框 start-->
    <el-dialog
      title="售卖详情"
      :visible.sync="sellDetailVisible"
      @close="dialogClose()"
      width="90%">
      <div class="sellDetail">
        <div class="top">
          <div class="left">
            <div>
              <img v-lazy="sellDetailData.img" alt="商品大图" :key="sellDetailData.id" class="vue-lazyload"/>
            </div>
            <p>{{sellDetailData.title}}</p>
          </div>
          <div class="right">
            <span>总售量：{{sellDetailData.sellCount}}</span>
            <span>总库存：{{sellDetailData.store}}</span>
          </div>
        </div>

        <div>
          <el-table
            :data="sellDetailData.specList"
            style="width: 100%">
            <el-table-column
              prop="goodsId"
              label="编号"
              align="center">
            </el-table-column>
            <el-table-column
              prop="spec"
              label="商品规格"
              align="center">
            </el-table-column>
            <el-table-column
              prop="sellCount"
              align="center"
              label="已售量">
            </el-table-column>
            <el-table-column
              prop="marketPirce"
              align="center"
              label="市场价(元)">
            </el-table-column>
            <el-table-column
              prop="sellPrice"
              align="center"
              label="销售价(元)">
            </el-table-column>
            <el-table-column
              prop="store"
              align="center"
              label="库存">
            </el-table-column>
          </el-table>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sellDetailVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <!--已售数量弹框 end-->

    <!--调价弹框 start-->
    <el-dialog
      title="调价"
      :visible.sync="modifyPriceVisible"
      @close="dialogClose()"
      width="800px">
      <div class="sellDetail">
        <div class="top">
          <div class="left">
            <div><img v-for="item in goodsDetailInfo.photos" v-lazy="item" :key="item" alt="商品大图" class="vue-lazyload"/>
            </div>
            <p>{{goodsDetailInfo.title}}</p>
          </div>
        </div>
        <div class="opera">
          <el-form ref="batchSetSpecPriceInput" :inline="true" :model="batchSetSpecPriceModel"
                   :rules="batchSetSpecPriceValid">
            <el-form-item label="市场价(元)：" prop="marketPrice">
              <el-input v-model="batchSetSpecPriceModel.marketPrice" style="width:100px;"></el-input>
            </el-form-item>
            <el-form-item label="销售价(元)：" prop="sellPrice">
              <el-input v-model="batchSetSpecPriceModel.sellPrice" style="width:100px;"></el-input>
            </el-form-item>
            <el-form-item label="库存：" prop="store">
              <el-input v-model="batchSetSpecPriceModel.store" style="width:100px;"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="batchSetSpecPrice()">批量设置</el-button>
            </el-form-item>
          </el-form>
        </div>

        <div>
          <el-table
            :data="goodsDetailInfo.specList"
            style="width: 100%">
            <el-table-column v-for="(item, index) in titleHeaders" :key="index" :label="item" :prop="item"
                             align="center"></el-table-column>
            <el-table-column prop="goodsNo" label="编号" align="center" width="150"></el-table-column>
            <el-table-column prop="marketPrice" align="center" label="市场价(元)">
              <template slot-scope="scope">
                <div class="inputAlign">
                  <el-input v-model="scope.row.marketPrice"></el-input>
                  <!--<el-tooltip class="item" effect="dark" :value="true" content="高于当前价30%" placement="top">
                    <el-input v-model="scope.row.marketPrice"></el-input>
                  </el-tooltip>-->
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="sellPrice" align="center" label="销售价(元)">
              <template slot-scope="scope">
                <div class="inputAlign">
                  <el-input v-model="scope.row.sellPrice"></el-input>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="store" align="center" label="库存">
              <template slot-scope="scope">
                <div class="inputAlign">
                  <el-input v-model="scope.row.store"></el-input>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="modifyPriceVisible = false;clearSelectGoodsIds()">取 消</el-button>
        <el-button type="primary" @click="checkSubmitSureModifyPrice()">确 定</el-button>
      </div>
    </el-dialog>
    <!--调价弹框 end-->

    <!--调价确定提示弹框 start-->
    <el-dialog
      title="提示"
      :visible.sync="sureModifyPriceVisible"
      width="600px">
      <div class="commodityShelves">
        <el-form>
          <div class="p_style">
            <p>温馨提示：下架商品后，您也可以手动上架该商品</p>
            <p class="color_dd0000">核价通过后售价将更新，不通过则不更新售价</p>
            <p>确定提交吗？</p>
          </div>
          <el-form-item>
            <div>
              <el-input v-model="raisePriceReason" rows="6" type="textarea" placeholder="请输入调价原因"></el-input>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="sureModifyPriceVisible = false;">取 消</el-button>
        <el-button type="primary" @click="sureModifyPrice()">确 定</el-button>
      </div>
    </el-dialog>
    <!--调价确定提示弹框 end-->

    <!--商品下架弹框 start-->
    <el-dialog title="商品下架" :visible.sync="goodsSoldout.commodityShelvesVisible" @close="dialogClose()" width="600px">
      <div class="commodityShelves">
        <el-form>
          <div class="p_style">
            <p>温馨提示：下架商品后，您也可以手动上架该商品</p>
          </div>
          <div class="radio_btn">
            <el-radio-group v-model="goodsSoldout.commodityShelvesReason">
              <el-radio :label="1">临时下架</el-radio>
              <el-radio :label="2">永久下架</el-radio>
            </el-radio-group>
          </div>

          <div v-if="goodsSoldout.commodityShelvesReason === 2">
            <div class="checkbox_style">
              <span><el-checkbox label="不经营此商品" v-model="goodsSoldout.reason">不经营此商品</el-checkbox></span>
              <span><el-checkbox label="过季商品下架" v-model="goodsSoldout.reason">过季商品下架</el-checkbox></span>
              <span><el-checkbox label="店面暂停营业" v-model="goodsSoldout.reason">店面暂停营业</el-checkbox></span>
              <span><el-checkbox v-model="goodsSoldout.commodityShelvesOther">其他</el-checkbox></span>
            </div>
            <el-form-item v-if="goodsSoldout.commodityShelvesOther">
              <!--commodityShelvesVisible :  {{goodsSoldout.commodityShelvesVisible}}
              commodityShelvesReason : {{goodsSoldout.commodityShelvesReason}}
              commodityShelvesOther : {{goodsSoldout.commodityShelvesOther}}
              reason : {{goodsSoldout.reason}}
              otherReason : {{goodsSoldout.otherReason}}
              commodityTime : {{goodsSoldout.commodityTime}} -->
              <el-input v-model="goodsSoldout.otherReason" rows="6" type="textarea"
                        placeholder="请输入下架原因（必填）"></el-input>
            </el-form-item>
          </div>

          <div class="style_span" v-if="goodsSoldout.commodityShelvesReason === 1">
            <span class="marRight_10">请于</span>
            <el-date-picker v-model="goodsSoldout.commodityTime" type="datetime" placeholder="选择日期时间"
                            value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            <span class="marLeft_10">提醒我上架该商品</span>
          </div>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="goodsSoldout.commodityShelvesVisible = false;clearSelectGoodsIds()">取 消</el-button>
        <el-button type="primary" @click="submitSoldout()">确 定</el-button>
      </div>
    </el-dialog>
    <!--商品下架弹框 end-->

    <!--删除弹框 start-->
    <el-dialog
      title="删除"
      :visible.sync="deleteVisible"
      @close="dialogClose()"
      width="600px">
      <div class="commodityShelves">
        <el-form>
          <div class="p_style">
            <p>温馨提示：删除后，您可以在商品回收站还原商品信息</p>
          </div>

          <p class="">请选择删除原因：</p>
          <div style="padding: 20px 20px 0;">
            <div class="checkbox_style">
              <span><el-checkbox>不经营此商品</el-checkbox></span>
              <span><el-checkbox>过季，商品下架</el-checkbox></span>
              <span><el-checkbox>店面暂停营业</el-checkbox></span>
              <span><el-checkbox>生产厂家停产</el-checkbox></span>
              <span><el-checkbox v-model="deleteOther">其他</el-checkbox></span>
            </div>

            <el-form-item v-if="deleteOther">
              <el-input rows="6" type="textarea" placeholder="请输入删除原因（必填）"></el-input>
            </el-form-item>
          </div>

        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteVisible = false;clearSelectGoodsIds()">取 消</el-button>
        <el-button type="primary" @click="deleteVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!--删除弹框 end-->

    <!--上架弹框 start-->
    <el-dialog :title="selectGoodsCountStr" :visible.sync="goodsPutaway.upperShelfVisible" @close="dialogClose()"
               width="500px">
      <p>是否已确定商品售价，并上架商品？</p>
      <span slot="footer" class="dialog-footer">
            <el-button @click="goodsPutaway.upperShelfVisible = false;clearSelectGoodsIds()">取 消</el-button>
            <el-button type="primary" @click="submitPutaway()">确 定</el-button>
        </span>
    </el-dialog>
    <!--上架弹框 end-->

  </div>
</template>

<script>
  import GoodsList from '../../../api/goods/goodsList';
  import GoodsStatisticeCount from '../../../api/goods/goodsStatisticeCount';
  import GoodsPutaway from '../../../api/goods/goodsPutaway';
  import GoodsSoldout from '../../../api/goods/goodsSoldout';
  import GoodsBatchPutawayOrSoldout from '../../../api/goods/goodsBatchPutawayOrSoldout';
  import GoodsRevisePrice from '../../../api/goods/goodsRevisePrice';
  import GoodsClassify from '../../../api/goods/goodsClassList';
  import GoodsPublishCategory from '../../../api/goods/goodsPublish/getGoodsPublishCategory';
  import GoodsDetail from '../../../api/goods/goodsDetail';
  import GoodsBatchUpdateInfo from '../../../api/goods/goodsBatchUpdateInfo';
  import GoodsDelete from '../../../api/goods/goodsDelete';
  import GoodsRevisePricePost from '../../../api/goods/goodsRevisePricePost';
  import GoodsSellDetailList from '../../../api/goods/goodsSellDetailList';
  import GoodsUpdateName from '../../../api/goods/goodsUpdateName';
  import GoodsExport from '../../../api/goods/goodsExport';
  import GoodsImport from '../../../api/goods/goodsImport';
  import axios from 'axios';

  export default {
    data() {
      return {
        batchSetSpecPriceModel: { // 批量设置商品规格价格
          marketPrice: 0,
          sellPrice: 0,
          store: 0
        },
        batchSetSpecPriceValid: {
          marketPrice: [{
            required: true,
            message: '必须输入值'
          }],
          sellPrice: [{
            required: true,
            message: '必须输入值'
          }],
          store: [{
            required: true,
            message: '必须输入值'
          }]
        },
        raisePriceReason: '', // 调价理由
        titleHeaders: [], //'颜色','规格','其他'
        shopOptions: [], // 搜索条件-商品分类的选项
        shopOptionProps: {
          value: 'cid',
          label: 'title',
          children: 'children',
          disabled: 'disabled'
        },
        customOptions: [], // 搜索条件-自定义分类的选项
        customOptionsTwo: [], //自定义分类 - 二级
        customOptionsModel: {
          customOptionsFirstValue: '', //自定义一级分类选择值
          customOptionsTwoValue: '', //自定义二级分类选择值
        },
        customOptionsValid: {
          customOptionsFirstValue: [{
            required: true,
            message: '请选择一级分类',
            trigger: 'blur'
          }],
          customOptionsTwoValue: [{
            required: true,
            message: '请选择二级分类',
            trigger: 'blur'
          }]
        },
        auditOptions: [], //查询条件 - 审核状态选项列表
        tableData: [], //商品列表
        tableLoading: false, //商品列表显示加载条
        goodsDetailInfo: {}, //某一个商品的商品详情信息
        modifyPriceDetailVisible: false, // 调价审核详情弹框显示
        sinkIndexs: [], //商品调价列表，合并单元格需要合并的下标和下沉几格
        mergeIndex: [], // 需要合并或隐藏的单元格的下标和合并数据
        modifyPriceData: [], // 商品调价审核列表
        shelfReminderVisible: false, // 商品上架提醒弹框显示
        shelfReminderData: [], // 商品上架提醒列表
        settingCustomizationVisible: false, // 批量设置自定义分类弹框显示
        cateValue: '',
        setStockVisible: false, // 批量调整库存弹框显示
        inventoryModel: {
          inventory: '', //批量修改商品库存的值
        },
        inventoryValid: {
          inventory: [{
            required: true,
            message: '请输入库存值',
            trigger: 'blur'
          }]
        },
        setPriceVisible: false, // 批量调整价格弹框显示
        revisePriceModel: {
          priceValue: 10
        },
        revisePriceValid: {
          priceValue: [{
            required: true,
            message: '请输入调价百分比',
            trigger: 'blur'
          }, {
            type: 'number',
            message: '值必须为数字'
          }]
        },
        uploadShopNameVisible: false, // 修改商品名称弹框显示
        shopName: '', // 修改商品名称 - 商品名称值
        setCustomizationVisible: false, // 修改自定义分类弹框显示
        sellDetailVisible: false, // 售卖详情弹框显示
        sellDetailData: [], // 售卖详情弹框数据
        modifyPriceByPriceChange: false, // 调价时是否改变了价格，如果没有改变价格，则不弹出下架原因输入框
        modifyPriceVisible: false, // 调价弹框数据
        sureModifyPriceVisible: false, // 调价确定提示弹框显示
        deleteVisible: false, // 删除弹框显示
        deleteOther: false, // 删除-其他操作
        goodsPutaway: { //商品上架信息
          upperShelfVisible: false, // 上架弹框显示
        },
        goodsSoldout: { //商品下架信息
          commodityShelvesVisible: false, // 商品下架弹框显示
          commodityShelvesReason: 1, // 商品下架 1：暂时下架 2：永久下架
          commodityShelvesOther: false, // 商品下架 - 永久下架 - 其他 - 显示下架原因输入框
          reason: [], //永久下架原因
          otherReason: '', //永久下架其他原因
          commodityTime: '', //提醒时间
        },
        selectGoodsIds: [], //当前选择的商品ID列表
        selectActivityGoodsIds: [], //当前选择的活动商品ID列表
        goodsStatisticeCount: {
          onOffer: 0, //出售中的商品
          warehouse: 0, //仓库中的商品
          soldOut: 0, //强制下架的商品
          awaitAudit: 0, //待核对的商品
          failCount: 0, //商品调价审核未通过数量
          successCount: 0, //商品调价审核通过数量
          waitCount: 0 //商品调价待审核数量
        },
        remainList: [],
        remainNotice: '',
        queryCondition: { //查询条件
          type: 0,
          title: '',
          auditState: '',
          minSellPrice: '', //最小销售价
          maxSellPrice: '', //最大销售价
          minSellCount: '',
          maxSellCount: '',
          isJoinActivity: false, //是否参加活动
          orderByType: 0, //0倒叙 1升序
          orderByField: 0, //排序字段 0更新时间 1库存 2销量
          systemCategory: [],
          userCategory: []
        },
        page: { //分页参数
          listTotal: 0,
          currentPage: 1,
          currentPageSize: 10
        }
      }
    },
    computed: {
      goodsAmount: function () {
        return this.goodsStatisticeCount.onOffer + this.goodsStatisticeCount.warehouse + this.goodsStatisticeCount.soldOut;
      },
      selectGoodsCountStr: function () {
        return '提示 【已选' + this.selectGoodsIds.length + '个商品】';
      },
      setCustomClassStr: function () {
        return '批量设置自定义分类 【已选' + this.selectGoodsIds.length + '个商品】';
      },
      revisePriceStr: function () {
        let str = '批量调整售价 【已选' + this.selectGoodsIds.length + '个商品';
        if (this.selectActivityGoodsIds.length != 0) {
          str += '，其中有' + this.selectActivityGoodsIds.length + '个是平台活动商品，不能调价';
        }
        str += '】';
        return str;
      },
      newCustomOptionsFirstValue: function () { //用于监听对象值的变化
        return this.customOptionsModel.customOptionsFirstValue;
      }
    },
    created() {
      this.queryCondition.type = this.$route.query.type ? this.$route.query.type : 0;
    },
    mounted() {
      let cacheData = sessionStorage.getItem('GOODS_MANAGE_PAGE_DATA');
      if (undefined != cacheData && null != cacheData) {
        let d = eval('(' + cacheData + ')');
        this.page.currentPage = d.currentPage;
        this.page.currentPageSize = d.currentPageSize;
        this.queryCondition.type = d.queryType;
        sessionStorage.removeItem('GOODS_MANAGE_PAGE_DATA');
      }
      this.initGoodsStatisticeCount();
      this.initTableDataByGoods();
      this.initGoodsCustomClass();
      this.initGoodsSystemClass(0, null, true); // 加载系统商品分类第一级数据
    },
    methods: {
      initGoodsStatisticeCount: function () { // 加载商品上架提醒数据
        GoodsStatisticeCount.call(this,
          '?clientVersion=1.0.0' +
          '&clientTimespan=' + this.$Tool.formatDate(new Date())
        ).then(res => {
          if (res.data.code == 1) {
            this.goodsStatisticeCount.onOffer = res.data.data.putaway;
            this.goodsStatisticeCount.warehouse = res.data.data.soldout;
            this.goodsStatisticeCount.soldOut = res.data.data.sysSlodout;
            this.goodsStatisticeCount.awaitAudit = res.data.data.waitCheck;
            this.goodsStatisticeCount.failCount = res.data.data.priceAuditInfo.failCount;
            this.goodsStatisticeCount.successCount = res.data.data.priceAuditInfo.successCount;
            this.goodsStatisticeCount.waitCount = res.data.data.priceAuditInfo.waitCount;
            if (res.data.data.reminList.length > 0) {
              this.remainList = res.data.data.reminList;
              this.remainNotice = this.remainList[0].notice;
            }
          }
        })
      },
      initTableDataByGoods: function () { //加载商品列表
        this.tableLoading = true;
        GoodsList.call(this, '?title=' + this.queryCondition.title +
          '&status=' + ('' == this.queryCondition.auditState ? 99 : this.queryCondition.auditState) +
          '&type=' + this.queryCondition.type +
          '&orderByType=' + this.queryCondition.orderByType +
          '&orderByField=' + this.queryCondition.orderByField +
          '&systemCategory=' + (this.queryCondition.systemCategory.length == 0 ? '' : this.queryCondition.systemCategory[this.queryCondition.systemCategory.length - 1]) +
          '&userCategory=' + (this.queryCondition.userCategory.length == 0 ? '' : this.queryCondition.userCategory[this.queryCondition.userCategory.length - 1]) +
          '&minSellPrice=' + this.queryCondition.minSellPrice +
          '&maxSellPrice=' + this.queryCondition.maxSellPrice +
          '&minSellCount=' + this.queryCondition.minSellCount +
          '&maxSellCount=' + this.queryCondition.maxSellCount +
          '&isJoinActivity=' + (this.queryCondition.isJoinActivity ? 1 : '') +
          '&pageIndex=' + this.page.currentPage +
          '&pageSize=' + this.page.currentPageSize +
          '&clientVersion=1.0.0' +
          '&clientTimespan=' + this.$Tool.formatDate(new Date())
        ).then(res => {
          if (res.data.code == 1) {
            if (this.auditOptions.length == 0) {
              var statusData = res.data.data.selectData.statusData;
              for (var i = 0; i < statusData.length; i++) {
                var o = {};
                o.label = statusData[i].text;
                o.value = statusData[i].value
                this.auditOptions.push(o);
              }
              this.queryCondition.auditState = '99';
            }
            //this.shopOptions = res.data.data.selectData.systemCategoryData;
            if (null != res.data.data.goodsList) {
              this.tableData = res.data.data.goodsList.articleList;
              this.page.listTotal = res.data.data.goodsList.totalCount;
              this.$nextTick(function () { // 设定选中值（之前选中的值回显）
                if (this.selectGoodsIds.length != 0) {
                  for (let i = 0; i < this.tableData.length; i++) {
                    let gi = this.tableData[i];
                    if (this.selectGoodsIds.indexOf(gi.id) != -1) {
                      this.$refs.multipleGoodsTable.toggleRowSelection(gi);
                    }
                  }
                }
              });
            }
          }
          this.tableLoading = false;
        })
      },
      initGoodsCustomClass: function () { // 加载自定义分类
        GoodsClassify.call(this,
          '?clientVersion=1.0.0' +
          '&clientTimespan=' + this.$Tool.formatDate(new Date())
        ).then(res => {
          if (res.data.code == 1) {
            let dgParse = function (list) { //递归改变JSON数据格式
              let arr = new Array();
              for (let i = 0; i < list.length; i++) {
                let o = {
                  value: list[i].id,
                  label: list[i].title,
                  children: list[i].childCategory == null ? null : dgParse(list[i].childCategory)
                }
                arr.push(o);
              }
              return arr;
            }
            this.customOptions = dgParse(res.data.data);
          }
        })
      },
      initGoodsSystemClass: function (parentId, parent, isChildren) { // 异步加载系统商品分类 params: 上级ID, 上级对象（没有为null）, 是否还有下级（预计）
        GoodsPublishCategory.call(this,
          '?parentId=' + parentId +
          '&clientVersion=1.0.0' +
          '&clientTimespan=' + this.$Tool.formatDate(new Date())
        ).then(res => {
          if (res.data.code == 1) {
            if (isChildren) {
              for (let i = 0; i < res.data.data.length; i++) {
                (res.data.data)[i].children = [];
              }
            }
            if (parentId == 0) {
              this.shopOptions = res.data.data;
            } else {
              let children = res.data.data;
              parent.children = children.length == 0 ? null : children;
            }
          }
        })
      },
      shopOptionsHander: function (val) {
        let id = val[val.length - 1];
        let flag = val.length == 2 ? false : true;
        // 递归查询
        let dgFind = function (list, id) {
          let o = null;
          o = list.find(x => x.cid == id);
          if (undefined == o || null == o) {
            for (let i = 0; i < list.length; i++) {
              if (null != list[i].children) {
                o = dgFind(list[i].children, id);
                if (null != o) break;
              }
            }
          }
          return o;
        }
        let o = dgFind(this.shopOptions, id);
        this.initGoodsSystemClass(id, o, flag);
      },
      getRevisePriceList: function () { //商品调价列表数据获取
        this.modifyPriceDetailVisible = true;
        if (this.modifyPriceData.length <= 0) {
          GoodsRevisePrice.call(this,
            '?clientVersion=1.0.0' +
            '&clientTimespan=' + this.$Tool.formatDate(new Date())
          ).then(res => {
            if (res.data.code == 1) {

              let idx = 0;
              let needChange = new Array();

              let parse = function (list) {
                let arr = new Array();
                list.forEach(res => {
                  let children = res.specInfo;
                  children.forEach(c => {
                    c.articleId = res.articleId;
                    c.articleName = res.articleName;
                    arr.push(c);
                    // ==================================== 只有需要合并或隐藏的行/列才会加入数组中 ==============================================
                    if (children.length > 1) {
                      let sink = [0, 0];
                      if (-1 === needChange.findIndex(ri => ri.gi == res.articleId)) sink = [children.length, 1];
                      needChange.push({
                        gi: res.articleId,
                        idx: idx,
                        column: 0,
                        sink: sink
                      });
                    }
                    idx++;
                  })
                });
                return arr;
              }
              this.mergeIndex = needChange;
              this.modifyPriceData = parse(res.data.data);
            }
          });
        }
      },
      merge: function ({row, column, rowIndex, columnIndex}) {
        let o = this.mergeIndex.find(res => (res.idx == rowIndex && res.column == columnIndex));
        if (undefined != o && null != o) return o.sink;
        else return [1, 1];
      },
      updateQueryType: function (val) { //切换仓库
        this.queryCondition.type = val;
        this.queryCondition.currentPage = 1;
        this.initTableDataByGoods();
      },
      showPutawayDialog: function (goodsId) { //打开上架窗口
        if (undefined == goodsId || null == goodsId) {
          if (this.selectGoodsIds.length == 0) {
            this.$message.warning('还未选择商品');
            return;
          }
        } else {
          this.clearSelectGoodsIds();
          this.selectGoodsIds.push(goodsId);
        }
        this.goodsPutaway.upperShelfVisible = true;
      },
      submitPutaway: function () { //提交上架
        if (this.selectGoodsIds.length == 0) {
          this.$message.warning('至少选择一件商品');
          return;
        }
        let putaways = new Array();
        for (let i = 0; i < this.selectGoodsIds.length; i++) {
          let o = {
            articleId: this.selectGoodsIds[i],
            isShow: 1
          }
          putaways.push(o);
        }
        GoodsBatchPutawayOrSoldout.call(this, {
          soldOutInfo: putaways,
          clientVersion: '1.0.0',
          clientTimespan: this.$Tool.formatDate(new Date())
        }).then(res => {
          if (res.data.code == 1) {
            this.initGoodsStatisticeCount();
            this.initTableDataByGoods();
            this.goodsPutaway.upperShelfVisible = false;
            this.clearSelectGoodsIds();
          }
        });
      },
      clearSoldoutData: function () { //清理下架时选择的数据
        this.goodsSoldout.commodityShelvesReason = 1;
        this.goodsSoldout.reason = [];
        this.goodsSoldout.otherReason = '';
        this.goodsSoldout.commodityTime = '';
        this.goodsSoldout.commodityShelvesOther = false;
      },
      showSoldoutDialog: function (goodsId) { //打开下架窗口
        if (undefined == goodsId || null == goodsId) {
          this.$message.error('商品ID有误');
          return;
        }
        this.clearSoldoutData();
        this.clearSelectGoodsIds(); //选择新商品时先清空之前的选择
        this.goodsSoldout.commodityShelvesVisible = true;
        this.selectGoodsIds.push(goodsId);
      },
      submitSoldout: function () { //提交下架申请
        if (this.selectGoodsIds.length == 0) {
          this.$message.error('至少选择一个商品');
          return;
        }
        if (this.goodsSoldout.commodityShelvesReason == 1) {
          if (null == this.goodsSoldout.commodityTime || '' == this.goodsSoldout.commodityTime) {
            this.$message.warning('请选择提醒上架时间');
            return;
          }
        } else if (this.goodsSoldout.commodityShelvesReason == 2) {
          if (true == this.goodsSoldout.commodityShelvesOther) {
            if ('' == this.goodsSoldout.otherReason) {
              this.$message.warning('请输入下架原因');
              return;
            }
            this.goodsSoldout.reason.push(this.goodsSoldout.otherReason);
          }
          if (this.goodsSoldout.reason.length == 0) {
            this.$message.warning('请选择或输入下架原因');
            return;
          }
        }
        GoodsSoldout.call(this, {
          articleId: this.selectGoodsIds.join(','),
          downType: this.goodsSoldout.commodityShelvesReason,
          reason: this.goodsSoldout.reason.join(','),
          dateTime: this.goodsSoldout.commodityTime,
          clientVersion: '1.0.0',
          clientTimespan: this.$Tool.formatDate(new Date())
        }).then(res => {
          if (res.data.code == 1) {
            this.initGoodsStatisticeCount();
            this.initTableDataByGoods();
            this.$message.success('下架成功');
            this.goodsSoldout.commodityShelvesVisible = false;
            this.clearSoldoutData();
            this.clearSelectGoodsIds();
          } else {
            this.$message.error(res.data.desc);
          }
        })
      },
      selectHander: function (allRows, row) { //选择数据操作
        if (this.selectGoodsIds.indexOf(row.id) == -1) {
          this.selectGoodsIds.push(row.id);
          // 是否是活动商品
          if (row.isJoinActivity == 1) {
            this.selectActivityGoodsIds.push(row.id);
          }
        } else {
          this.selectGoodsIds.splice(this.selectGoodsIds.indexOf(row.id), 1);
          this.selectActivityGoodsIds.splice(this.selectActivityGoodsIds.indexOf(row.id), 1);
        }
      },
      selectAllHander: function (allRows) { //全选和取消全选操作
        if (allRows.length == 0) {
          for (let i = 0; i < this.tableData.length; i++) {
            this.selectGoodsIds.splice(this.selectGoodsIds.indexOf(this.tableData[i].id), 1);
            this.selectActivityGoodsIds.splice(this.selectActivityGoodsIds.indexOf(this.tableData[i].id), 1);
          }
        } else {
          for (let i = 0; i < this.tableData.length; i++) {
            if (this.selectGoodsIds.indexOf(this.tableData[i].id) == -1) {
              this.selectGoodsIds.push(this.tableData[i].id);
              // 是否是活动商品
              if (this.tableData[i].isJoinActivity == 1) {
                this.selectActivityGoodsIds.push(this.tableData[i].id);
              }
            }
          }
        }
      },
      setSortField: function (column, prop, order) { //设置排序字段和排序方式
        if (!column || !(column.column)) {
          this.queryCondition.orderByType = 0;
          this.queryCondition.orderByField = 0;
        } else {
          if (column.order === 'ascending') this.queryCondition.orderByType = 1;
          else if (column.order === 'descending') this.queryCondition.orderByType = 0;
          switch (column.column.label) {
            case '已售数量':
              this.queryCondition.orderByField = 2;
              break;
            case '库存':
              this.queryCondition.orderByField = 1;
              break;
            case '更新时间':
              this.queryCondition.orderByField = 0;
              break;
            default:
              this.queryCondition.orderByField = 0;
              break;
          }
        }
        this.initTableDataByGoods();
      },
      showUpdateCustomClassDialog: function (goodsId, userCategoryClassList, soldoutStatus) { //打开修改商品自定义分类窗口
        if (undefined == goodsId || null == goodsId) {
          if (this.selectGoodsIds.length == 0) {
            this.$message.warning('至少选择一个商品');
            return;
          }
        } else {
          if (soldoutStatus == 2) {
            this.$message.error('商品下架审核中，无法编辑');
            return;
          }
          this.clearSelectGoodsIds();
          this.selectGoodsIds.push(goodsId);
        }
        // 先清空之前的数据
        this.customOptionsModel.customOptionsFirstValue = '';
        this.customOptionsModel.customOptionsTwoValue = '';
        if (userCategoryClassList && '' != userCategoryClassList) {
          let ucc = userCategoryClassList.split(',');
          this.customOptionsModel.customOptionsFirstValue = parseInt(ucc[0]) || '';
          this.customOptionsModel.customOptionsTwoValue = parseInt(ucc[1]) || '';
        }
        this.settingCustomizationVisible = true;
      },
      submitUpdateCustom: function () { //修改商品所属的自定义分类
        if (this.selectGoodsIds.length == 0) {
          this.$message.error('至少选择一个商品');
          return;
        }
        this.$refs['customOptionsSelectBatch'].validate((valid) => {
          if (valid) {
            GoodsBatchUpdateInfo.call(this, {
              type: 0,
              articleIds: this.selectGoodsIds.join(','),
              value: this.customOptionsModel.customOptionsTwoValue,
              clientVersion: '1.0.0',
              clientTimespan: this.$Tool.formatDate(new Date())
            }).then(res => {
              if (res.data.code == 1) {
                this.clearSelectGoodsIds();
                this.settingCustomizationVisible = false;
                this.customOptionsModel.customOptionsFirstValue = '';
                this.customOptionsModel.customOptionsTwoValue = '';
                this.initTableDataByGoods();
              } else {
                this.$message.error('修改失败');
              }
            });
          } else {
            this.$message.error('请选择新的自定义分类');
          }
        });
      },
      showUpdateInventoryDialog: function (goodsId) { //打开修改库存窗口
        if (undefined == goodsId || null == goodsId) {
          if (this.selectGoodsIds.length == 0) {
            this.$message.warning('至少选择一个商品');
            return;
          }
        } else {
          this.clearSelectGoodsIds();
          this.selectGoodsIds.push(id);
        }
        this.setStockVisible = true;
      },
      submitUpdateInventory: function () {
        if (this.selectGoodsIds.length == 0) {
          this.$message.warning('至少选择一个商品');
          return;
        }
        this.$refs['inventoryInput'].validate((valid) => {
          if (valid) {
            GoodsBatchUpdateInfo.call(this, {
              type: 1,
              articleIds: this.selectGoodsIds.join(','),
              value: this.inventoryModel.inventory,
              clientVersion: '1.0.0',
              clientTimespan: this.$Tool.formatDate(new Date())
            }).then(res => {
              if (res.data.code == 1) {
                this.clearSelectGoodsIds();
                this.setStockVisible = false;
                this.inventoryModel.inventory = '';
                this.initTableDataByGoods();
              } else {
                this.$message.error('修改失败');
              }
            })
          } else {
            this.$message.warning('请输入库存数量');
          }
        });
      },
      showRevisePriceDialog: function () { //打开商品批量调价窗口
        if (this.selectGoodsIds.length == 0) {
          this.$message.warning('至少选择一个商品');
          return;
        }
        this.setPriceVisible = true;
      },
      submitRevisePrice: function () { // 提交商品批量调价
        if (this.selectGoodsIds.length == 0) {
          this.$message.warning('至少选择一个商品');
          return;
        }
        this.$refs['revisePriceInput'].validate((valid) => {
          if (valid) {
            if (this.selectGoodsIds.length <= this.selectActivityGoodsIds.length) {
              this.$message.warning('所选商品均为活动商品，无法调价');
              return;
            }
            // 剔除活动商品ID
            for (let i = 0; i < this.selectActivityGoodsIds.length; i++) {
              this.selectGoodsIds.splice(this.selectGoodsIds.indexOf(this.selectActivityGoodsIds[i]), 1);
            }
            GoodsBatchUpdateInfo.call(this, {
              type: 2,
              articleIds: this.selectGoodsIds.join(','),
              value: this.revisePriceModel.priceValue,
              clientVersion: '1.0.0',
              clientTimespan: this.$Tool.formatDate(new Date())
            }).then(res => {
              if (res.data.code == 1) {
                this.initTableDataByGoods();
                this.setPriceVisible = false;
                this.clearSelectGoodsIds();
                this.revisePriceModel.priceValue = '';
              } else {
                this.$message.error(res.data.desc);
              }
            });
          } else {
            this.$message.warning('请输入调价百分比');
          }
        })
      },
      showSetSepPriceDialog: function (goodsId, soldoutStatus) { // 打开商品调价接口
        if (undefined == goodsId || null == goodsId) {
          this.$message.warning('商品ID有误');
          return;
        }
        if (soldoutStatus == 2) {
          this.$message.error('商品下架审核中，无法编辑');
          return;
        }
        this.clearSelectGoodsIds();
        this.selectGoodsIds.push(goodsId);
        this.modifyPriceVisible = true;
        // 如果点击的是同一个商品则不重复请求数据
        if (goodsId != this.goodsDetailInfo.goodsId) {
          this.titleHeaders = [];
          this.goodsDetailInfo = {};
          GoodsDetail.call(this,
            '?articleId=' + goodsId +
            '&clientVersion=1.0.0' +
            '&clientTimespan=' + this.$Tool.formatDate(new Date())
          ).then(res => {
            if (res.data.code == 1) {
              let specList = res.data.data.specList;
              specList.forEach(ele => {
                let dynamicSpec = ele.dynamicSpec;
                for (let key in dynamicSpec) {
                  if (this.titleHeaders.indexOf(key) == -1) {
                    this.titleHeaders.push(key);
                  }
                  ele[key] = dynamicSpec[key];
                }
              });
              this.goodsDetailInfo = res.data.data;
              this.goodsDetailInfo.oldSpecList = JSON.parse(JSON.stringify(specList)); // 创建新数组，而不是创建数组引用
              this.goodsDetailInfo.goodsId = goodsId;
              //this.selectGoodsIds.push(goodsId);
            }
          })
        }
      },
      checkSubmitSureModifyPrice() {
        let specListInfo = this.goodsDetailInfo.specList;
        let oldSpecList = this.goodsDetailInfo.oldSpecList;
        if(!oldSpecList || oldSpecList.length == 0){
            this.$message.error('无商品规格信息，无法修改');
            return;
        }
        let mpFlag = false;
        // 需要判断销售价是否大于原售价
        for (let i = 0; i < specListInfo.length; i++) {
          let item = specListInfo[i];
          if (parseFloat(item.sellPrice) > parseFloat(item.marketPrice)) {
            this.$message.error('销售价不能大于市场价');
            return;
          }
          if (item.marketPrice <= 0) {
            this.$message.error('市场价不能小于/等于0');
            return;
          }
          if (item.sellPrice <= 0) {
            this.$message.error('销售价不能小于/等于0');
            return;
          }
          let olo = oldSpecList.find(o => o.goodsId == item.goodsId);
          if (parseFloat(item.sellPrice) > parseFloat(olo.sellPrice)) {
            mpFlag = true;
          }
        }
        // 如果价格不大于当前价格，直接提交，否则需要填写原因
        if (mpFlag) this.sureModifyPriceVisible = true;
        else this.sureModifyPrice();
      },
      sureModifyPrice() { // 提交调价

        if (this.sureModifyPriceVisible) {
          // 如果调价窗口为打开状态，则必须输入调价理由
          if (!this.raisePriceReason || this.raisePriceReason == '') {
            this.$message.error('请输入调价理由');
            return;
          }
        }
        let specListInfo = this.goodsDetailInfo.specList;
        let resArr = new Array();
        specListInfo.forEach(res => {
          let s = new Array()
          for (let key in res.dynamicSpec) {
            s.push(key + ':' + res.dynamicSpec[key]);
          }
          resArr.push({
            spec: s.join(','),
            goodsId: res.goodsId,
            marketPirce: res.marketPrice,
            sellPrice: res.sellPrice,
            store: res.store
          });
        });
        GoodsRevisePricePost.call(this, {
          data: resArr,
          raisePriceReason: this.raisePriceReason,
          articleId: this.selectGoodsIds[0],
          clientVersion: '1.0.0',
          clientTimespan: this.$Tool.formatDate(new Date())
        }).then(res => {
          if (res.data.code == 1) {
            this.initGoodsStatisticeCount();
            this.initTableDataByGoods();
            this.modifyPriceVisible = false;
            this.sureModifyPriceVisible = false;
            this.clearSelectGoodsIds();
          } else {
            this.$message.error('修改失败');
          }
        });
      },
      batchSetSpecPrice: function () { // 批量设置商品规格价格和库存
        this.$refs['batchSetSpecPriceInput'].validate((valid) => {
          if (valid) {
            this.goodsDetailInfo.specList.forEach(res => {
              res.marketPrice = this.batchSetSpecPriceModel.marketPrice;
              res.sellPrice = this.batchSetSpecPriceModel.sellPrice;
              res.store = this.batchSetSpecPriceModel.store;
            });
          }
        })
      },
      getSellDetailList: function (goodsId) { // 获取商品售卖详情并打开商品售卖详情窗口
        this.sellDetailVisible = true;
        this.sellDetailData = {};
        GoodsSellDetailList.call(this,
          '?articleId=' + goodsId +
          '&clientVersion=1.0.0' +
          '&clientTimespan=' + this.$Tool.formatDate(new Date())
        ).then(res => {
          if (res.data.code == 1) {
            this.sellDetailData = res.data.data;
          }
        })
      },
      goodsDelete: function (goodsId) {
        this.$confirm('删除后可以在回收站找回，确定删除商品吗？', '删除提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          GoodsDelete.call(this, {
            articleId: goodsId,
            clientVersion: '1.0.0',
            clientTimespan: this.$Tool.formatDate(new Date())
          }).then(res => {
            if (res.data.code == 1) {
              this.initGoodsStatisticeCount();
              this.initTableDataByGoods();
            } else {
              this.$message.error('删除失败');
            }
          })
        })
      },
      showUpdateGoodsNameDialog: function (goodsId, title, soldoutStatus) {
        if (undefined == goodsId || null == goodsId || isNaN(goodsId)) {
          this.$message.warning('商品ID有误');
          return;
        }
        if (soldoutStatus == 2) {
          this.$message.error('商品下架审核中，无法编辑');
          return;
        }
        this.shopName = title;
        this.clearSelectGoodsIds();
        this.selectGoodsIds.push(goodsId);
        this.uploadShopNameVisible = true;
      },
      submitUpdateName: function () {
        if (this.selectGoodsIds.length == 0) {
          this.$message.warning('还没有选择商品');
          return;
        }
        GoodsUpdateName.call(this, {
          articleId: this.selectGoodsIds[0],
          title: this.shopName,
          clientVersion: '1.0.0',
          clientTimespan: this.$Tool.formatDate(new Date())
        }).then(res => {
          if (res.data.code == 1) {
            this.initGoodsStatisticeCount();
            this.initTableDataByGoods();
            this.uploadShopNameVisible = false;
            this.$message.success('修改成功，商品已提交审核');
          } else {
            this.$message.error('修改失败');
          }
        })
      },
      handleSizeChange(val) { //分页方法 - 改变当前页
        this.page.currentPageSize = val;
        this.initTableDataByGoods();
      },
      handleCurrentChange(val) { //分页方法 - 改变每页数据大小
        this.page.currentPage = val;
        this.initTableDataByGoods();
      },
      handleCommand(command) { //更多操作 - 选择事件
        if (command === 'cate') { //批量设置自定义分类
          this.showUpdateCustomClassDialog();
        } else if (command === 'stock') { //批量设置库存
          this.showUpdateInventoryDialog();
        } else { //批量调整价格
          this.showRevisePriceDialog();
        }
      },
      clearSelectGoodsIds: function () {
        console.log('清空选择的商品ID ==========================================================>> ');
        if (this.selectGoodsIds.length > 0) this.selectGoodsIds = [];
        if (this.selectActivityGoodsIds.length > 0) this.selectActivityGoodsIds = [];
        if (undefined != this.$refs.multipleGoodsTable) this.$refs.multipleGoodsTable.clearSelection();
      },
      cacheDate: function () {
        let goodsManagePageCacheData = {
          currentPage: this.page.currentPage,
          currentPageSize: this.page.currentPageSize,
          queryType: this.queryCondition.type
        }
        sessionStorage.setItem('GOODS_MANAGE_PAGE_DATA', JSON.stringify(goodsManagePageCacheData));
      },
      edit(goodsId) { //跳转到商品编辑页面
        if (undefined == goodsId || null == goodsId) {
          this.$message.error('商品ID错误');
          return;
        }
        let goodsInfo = this.tableData.find(res => res.id === goodsId);
        if (null == goodsInfo) {
          this.$message.error('没找到商品信息');
          return;
        }
        let goodsCate = {
          cid: goodsInfo.oneId + ',' + goodsInfo.twoId + ',' + goodsInfo.threeId,
          title: goodsInfo.oneTitle + ' > ' + goodsInfo.twoTitle + ' > ' + goodsInfo.threeTitle
        }
        sessionStorage.setItem('goodsCate', JSON.stringify(goodsCate));
        // 将审核不通过理由传入编辑页面
        sessionStorage.setItem('GoodsRejectReason', null == goodsInfo.rejectReason ? '' : JSON.stringify(goodsInfo.rejectReason));
        this.cacheDate();
        this.$router.push({name: 'GoodsRelease', query: {id: goodsId}});
      },
      goDetail(goodsId) { //跳转到商品详情页
        this.cacheDate();
        this.$router.push({name: 'GoodsDetail', query: {goodsId: goodsId}});
      },
      goRecycleBin() { //跳转到商品回收站页面
        this.cacheDate();
        this.$router.push({name: 'GoodsRecycleBin'});
      },
      toGoodsClass: function () { //跳转到商品自定义分类管理页面
        this.cacheDate();
        this.$router.push({name: 'GoodsClassify'});
      },
      dialogClose: function () {
        this.clearSelectGoodsIds();
      },
      goodsExport: function () {
        if (this.selectGoodsIds.length == 0) {
          this.$message.warning('至少选择一件商品');
          return;
        }
        const loading = this.$loading({
          lock: true,
          text: '请稍后...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        GoodsExport.call(this,
          '?articleIds=' + this.selectGoodsIds.join(',') +
          '&clientVersion=1.0.0' +
          '&clientTimespan=' + this.$Tool.formatDate(new Date())
        ).then(res => {
          var reader = new FileReader();
          reader.onload = event => {
            let json = null;
            try {
              json = JSON.parse(reader.result);
            } catch (error) {
              json = '';
            }
            if (typeof json == 'object') {
              this.$message.error(json.desc);
            } else {
              let a = document.createElement('a');
              let href = window.URL.createObjectURL(res.data);
              a.href = href;
              a.download = '商品信息.xlsx';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              window.URL.revokeObjectURL(href);
            }
            loading.close();
            this.clearSelectGoodsIds();
          }
          reader.readAsText(res.data);
        })
      },
      goodsImport: function (file) {
        let _t = sessionStorage.getItem('tokenInfo');
        let json = eval('(' + _t + ')');
        let d = new FormData();
        d.append('file', file);
        d.append('sessionId', json.sessionId);
        GoodsImport.call(this, d).then(res => {
          if (res.data.code == 1) {
            this.$message.success('导入成功');
          } else {
            this.$message.error(res.data.desc);
          }
        });
        return false;
      }
    },
    watch: {
      newCustomOptionsFirstValue(val, oldVal) { //监听选择的一级分类值， 如果变化，选取二级分类选项
        this.customOptionsModel.customOptionsTwoValue = '';
        let o = this.customOptions.find(res => res.value === val);
        if (null != o) this.customOptionsTwo = o.children;
      },
      goodsDetailInfo(val, oldVal) {
        console.log(val, oldVal)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "./less/main.less";
</style>
