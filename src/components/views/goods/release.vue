<template>
  <div style="position: relative;">
    <div v-if="id > 0 && goodsRejectReason.length > 0" class="shop_audit">
      <h3>审核结果</h3>
      <div>
        <p v-for="(item, i) in goodsRejectReason">{{i + 1}}、{{item.reason === '' ? item.type : item.reason}}</p>
      </div>
    </div>

    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
      <div>
        <div class="form_wrap">

          <!--商品基本信息-->
          <div class="form_span">
            <span>商品基本信息 </span>
            <i>不知道怎么录入商品？<a href="#">点击查看录入帮助</a></i>
          </div>
          <div class="form_box" style="margin-bottom: 20px;">
            <el-form-item label="商品类目：">
              <span>{{goodsCate.title}}</span>
              <a href="javascript: void(0);" @click="goCateClass" class="release_a">切换类目</a>
            </el-form-item>

            <el-form-item label="商品名称：" prop="title">
              <el-input ref="title" style="width: 440px;" maxlength="50" v-model="ruleForm.title" clearable placeholder="为增加搜索/导购机会，建议输入15字以上"></el-input>
              <label class="shop_count"><i>{{ruleForm.title ? ruleForm.title.length : 0}}</i>/<i>50</i></label>
            </el-form-item>

            <el-form-item label="商品卖点：">
              <el-input
                style="width: 440px;"
                type="textarea"
                :rows="6"
                maxlength="30"
                placeholder="为增加搜索/导购机会，请输入商品的特色、卖点"
                v-model="ruleForm.sellPoint">
              </el-input>
              <label class="shop_count"><i>{{ruleForm.sellPoint ? ruleForm.sellPoint.length : 0}}</i>/<i>30</i></label>
            </el-form-item>

            <el-form-item label="商品品牌：">
              <el-select v-model="ruleForm.brand" clearable placeholder="请选择" style="width: 440px;">
                <el-option
                  v-for="(item, i) in shopBrandList"
                  :key="i"
                  :label="item.name"
                  :value="item.systemBrandId">
                </el-option>
              </el-select>

              <small class="refresh_icon" @click="getShopBrandList">刷新</small>
              <span class="release_span1">未找到需要的品牌？</span>
              <a href="/goods/brandManage" target="_blank" class="release_a marLeft_0">点此申请</a>
            </el-form-item>

            <el-form-item label="商品自定义分类：">
              <el-select v-model="ruleForm.userCategoryId" @change="getShopCategoryList(ruleForm.userCategoryId, 0)" placeholder="请选择" style="width: 200px;">
                <el-option
                  v-for="(item, i) in userCategoryIdData"
                  :key="i"
                  :label="item.title"
                  :value="item.id">
                </el-option>
              </el-select>

              <el-select v-if="userChildCategoryIdData.length" v-model="ruleForm.userChildCategoryId" placeholder="请选择" style="width: 200px;">
                <el-option
                  v-for="(item, i) in userChildCategoryIdData"
                  :key="i"
                  :label="item.title"
                  :value="item.id">
                </el-option>
              </el-select>

              <small class="refresh_icon" @click="getShopCategoryList(0, 0)">刷新</small>
              <span class="release_span1">未找到自定义分类？</span>
              <a href="/goods/goodsClassify" target="_blank" class="release_a marLeft_0">点此设置</a>
            </el-form-item>

            <div class="before_span">
              <el-form-item label="商品规格：">
                <div class="specs_box">
                  <div class="specs_top">
                    <span>颜色/规格</span>
                    <p>
                      选择标准颜色可增加搜索/导购机会，标准颜色还可填写颜色备注信息（偏深、偏亮等）
                      建议上传 <i>600*600</i> 像素的图片，支持<i>JPG，JEPG，PNG</i>格式
                    </p>
                  </div>

                  <ul class="specs_color" v-if="shopSpecsData.length > 0">
                    <li v-for="(colorItem, i) in specColorData">
                      <div>
                        <span v-if="i === 0" @click="addSpecs">添加</span>
                        <span v-if="i !== 0" @click="deleteSpecs(i, colorItem.title)">删除</span>
                        <span class="specs_input">
                          <el-autocomplete
                            style="width: 350px;"
                            class="inline-input"
                            v-model="colorItem.title"
                            :fetch-suggestions="querySearch"
                            @blur="specsInputBlur(colorItem.title)"
                            @select="specsInputBlur"
                            :maxlength="20"
                            placeholder="请输入内容"
                          ></el-autocomplete>
                        </span>

                        <div class="specsPic" :style="colorItem.img.imgArr.length > 0 ? {'border': 'none'} : {}" style="height: 40px; overflow: hidden;">
                          <CustomUpload :img="colorItem.img"></CustomUpload>
                        </div>
                        <em v-if="!(colorItem.img.imgArr.length > 0)">请上传图片</em>
                      </div>
                    </li>
                  </ul>

                  <div class="size_box" v-if="specSizeData.length > 0">
                    <div class="size_top">
                      <span>尺码</span>
                    </div>
                    <div class="size_center">
                      <el-checkbox-group v-model="specSizeSelectSpecid" @change="specSizeChanges">
                        <span v-for="(item, i) in specSizeData" :key="i">
                          <el-checkbox :label="item.specId">
                            <template v-if="item.specId >= 0">{{item.title}}</template>
                            <template v-else>
                              <el-input style="width: 120px;" v-model="item.title" placeholder="请输入尺码"></el-input>
                              <em @click="deteleSpecsSize(i)">删除</em>
                            </template>
                          </el-checkbox>
                        </span>
                      </el-checkbox-group>

                      <i @click="addSpecsSize">+ 添加</i>
                    </div>
                  </div>

                </div>
              </el-form-item>
            </div>

            <div class="before_span">
              <el-form-item label="价格及库存：">
                <div class="price_box">
                  <div class="price_box_top">
                    <el-button type="primary" @click="batchFilling">批量填写</el-button>
                    <span>请在表格中填写商品价格及库存信息，或者批量填写</span>
                  </div>

                  <div class="price_box_center">
                    <div class="price_table">
                      <div class="price_table_top">
                        <span>{{specsTitle ? specsTitle : '颜色/规格'}}</span>
                        <span v-if="goodsSpecInfo.length > 0 && goodsSpecInfo[0].spec.length > 1">尺码</span>
                        <!--<span><i>*</i>单位</span>-->
                        <span><i>*</i>原价(元)</span>
                        <span><i>*</i>售价(元)</span>
                        <span><i>*</i>库存</span>
                        <span><i>*</i>商品编码</span>
                        <!--<span>操作</span>-->
                      </div>
                      <div class="price_table_center">
                        <ul>
                          <li v-for="(item, i) in goodsSpecInfo" :key="i">
                            <span v-if="item.spec[0]">{{item.spec[0].title}}</span>
                            <span v-if="item.spec[1]">{{item.spec[1].title}}</span>
                            <!--<span><input v-model="item.expect" type="text"></span>-->
                            <span><input v-model="item.market" placeholder="请输入数字" type="number"></span>
                            <span><input v-model="item.sell" placeholder="请输入数字" type="number"></span>
                            <span><input v-model="item.store" placeholder="请输入数字" type="number"></span>
                            <span><input v-model="item.no" placeholder="请输入" type="text"></span>
                            <!--<span><button type="button" @click="deleteGoodsSpec(i)">删除</button></span>-->
                          </li>
                        </ul>
                      </div>
                      <!--<div class="price_table_bottom">
                        <div class="price_bottom_left">
                          <i>*</i>单位换算
                        </div>
                        <div class="price_bottom_right">
                          <span>
                            <label><i>*</i> 最小单位</label>
                            <el-select placeholder="请选择" style="width: 100px;">
                              <el-option
                                v-for="item in unitOption"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-select>
                          </span>
                          <span>
                            <el-input style="width: 100px;"></el-input>
                            <span>箱 = </span>
                            <el-input style="width: 100px;"></el-input>
                            <span>瓶</span>
                          </span>
                          <span>
                            <el-input style="width: 100px;"></el-input>
                            <span>打 = </span>
                            <el-input style="width: 100px;"></el-input>
                            <span>瓶</span>
                          </span>
                        </div>
                      </div>-->
                    </div>

                    <p v-if="id > 0">调高售价将提交平台审核 库存为 0 的商品规格，在商品详情页不展示</p>
                  </div>
                </div>
              </el-form-item>
            </div>

            <div class="before_span">
              <el-form-item label="商品属性：">
                <div class="shop_attr_box">
                  <p>商品属性需要设置5个及以上!错误填写商品属性，可能会引起搜索流量减少，影响您的正常销售，请认真准确填写！</p>
                  <div class="shop_attr">
                    <ul>
                      <li v-for="(item, i) in goodAttributesData">
                        <span :title="item.key">{{item.key}}</span>
                        <span class="shop_attr_select">
                        <!--<input type="text" v-model="item.inpVal" />-->
                        <el-autocomplete
                          style="width: 370px;"
                          class="inline-input"
                          v-model="item.value"
                          :fetch-suggestions="queryAttrSearch"
                          @focus="queryAttrFocus(i)"
                        ></el-autocomplete>
                      </span>
                      </li>
                    </ul>
                  </div>

                  <div class="shop_attr_add">
                    <p>如上述列表缺少想要的属性，请自行添加</p>
                    <div>
                    <span>
                      <label>属性名称</label>
                      <el-input style="width: 180px;" v-model="attrName" clearable placeholder="例如：颜色"></el-input>
                    </span>
                      <span>
                      <label>属性内容</label>
                      <el-input style="width: 180px;" v-model="attrValue" clearable placeholder="例如：深红色"></el-input>
                    </span>
                      <el-button type="primary" @click="addGoodAttributes">添加属性</el-button>
                    </div>
                  </div>

                </div>
              </el-form-item>
            </div>

            <!--<el-form-item label="体积重量：">
              <div class="shop_vh">
                <div>
                  <span>
                    <label> <i>*</i> 包装重量（kg）</label>
                  </span>
                  <el-input style="width: 200px;" clearable></el-input>
                  <span class="tips lineHeight_16">如果未设置商品包邮，运费将按照设置的运费模板里的重量和体积（折算成重量）进行计算</span>
                </div>

                <div>
                  <span>
                    <label> <i>*</i> 包装体积（cm³）</label>
                  </span>
                  <el-input style="width: 100px;" clearable></el-input>
                  <i> - </i>
                  <el-input style="width: 100px;" clearable></el-input>
                  <i> - </i>
                  <el-input style="width: 100px;" clearable></el-input>
                  <span class="tips">体积将换算成重量进行计算，公式为：（长*宽*高）/6000</span>
                </div>
              </div>
            </el-form-item>-->
          </div>

          <!--商品详情-->
          <div class="form_span">
            <span>商品详情</span>
          </div>
          <div class="form_box" style="margin-bottom: 20px;">
            <div class="shop_detail">
              <div class="shop_detail_left">
                <div class="left_box">
                  <template v-if="album.imgArr.length > 0">
                    <span v-for="(item, i) in album.imgArr">
                    <span>
                      <!--<i class="on">上移</i>
                      <i>下移</i>
                      <i>
                        <em>替换</em>
                        <input type="file">
                      </i>-->
                      <i @click="shopPicDelete(i)">删除</i>
                    </span>
                    <img :src="item" alt="">
                  </span>
                  </template>
                </div>
              </div>

              <div class="shop_detail_right">
                <h3>图片上传说明</h3>
                <p>1、图片总张数建议大于 5 张，但不超过 10 张</p>
                <p>2、图片大小：每张图片不可超过 3M</p>
                <p>3，图片尺寸：宽度建议 750 ~ 900 像素之间，所有图片宽度一致，单张图片高度不超过 6000 像素</p>
                <p>4、支持格式：JPG，JEPG，PNG</p>

                <h3 class="marTop_20">图片质量说明：</h3>
                <p>1、请尽量上传商品各个角度拍摄的照片，比如：正面，侧面，背面，内部等</p>
                <p>2、请确保图片美观度高，品质感强，构图明快简洁，商品主体突出，每张图片中不可出现 过多相同主体，建议不大于3个</p>
                <p>3、图片中商品主体完整，不要产品的一部分不在图片中，商品展现比例不要过小，要居中 不要靠边</p>
                <p>4、建议上传商品及包装内附件，比如：商品说明书，品牌证书，配件，以及面料展示等</p>
                <p>5、建议上传商品的使用场景图，引起用户共鸣，增加购买欲望，比如将食品放置在精致餐盘精美餐桌上拍摄</p>

                <div class="marginTop_30 shop_detail_upload">
                  <el-button type="primary">添加图片</el-button>
                  <CustomUpload :img="album"></CustomUpload>
                </div>
              </div>
            </div>
          </div>

          <!--商品主图-->
          <div class="form_span">
            <span>商品主图</span>
          </div>
          <div class="form_box" style="margin-bottom: 20px; padding-top: 10px;">
            <div class="shop_main_pic">
              <ul> <!--拖动调整图片顺序（vue.Draggable ）-->
                <draggable
                  :list="photos"
                  :disabled="!enabled"
                  class="list-group"
                  ghost-class="ghost"
                  @start="dragging = true"
                  @end="dragging = false"
                >
                  <li v-for="(item, index) in photos">
                    <CustomUpload :img="item"></CustomUpload>

                    <span v-if="index === 0 && item.imgArr.length > 0">商品主图</span>
                    <span v-if="item.imgArr.length <= 0">上传图片</span>
                  </li>
                </draggable>
              </ul>
              <div class="main_pic_tips">
                <h3>图片上传说明</h3>
                <p>1、最少上传3张商品主图，最多上传 5 张商品主图</p>
                <p>2、建议上传 600*600 像素的图片，支持JPG，JEPG，PNG格式</p>
                <p>3、点击拖动调整图片顺序</p>
              </div>
            </div>
          </div>

          <!--商品物流服务-->
          <div class="form_span">
            <span>商品物流服务</span>
          </div>
          <div class="form_box" style="margin-bottom: 20px;">
            <div class="shop_logistics">
              <div class="shop_vh">
                <div>
                  <span>
                    <label><i>*</i> 发货地</label>
                  </span>

                  <el-select v-model="ruleForm.provinceCode" @change="getCityList(ruleForm.provinceCode)" placeholder="请选择" style="width: 200px; margin-right: 10px;">
                    <el-option
                      v-for="(item, i) in provinceData"
                      :key="i"
                      :label="item.name"
                      :value="item.code">
                    </el-option>
                  </el-select>

                  <el-select v-if="cityData.length > 0" v-model="ruleForm.cityCode" placeholder="请选择" style="width: 200px;">
                    <el-option
                      v-for="(item, i) in cityData"
                      :key="i"
                      :label="item.name"
                      :value="item.code">
                    </el-option>
                  </el-select>
                </div>

                <div>
                  <span>
                    <label><i>*</i> 运费模板</label>
                  </span>

                  <el-select v-model="ruleForm.expressInfoValue" @change="expressSelect(ruleForm.expressInfoValue)" placeholder="请选择" style="width: 200px; margin-right: 10px;">
                    <el-option
                      v-for="(item, i) in expressInfoData"
                      :key="i"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                  <small class="refresh_icon">刷新</small>
                  <a href="/goods/logisticsIndex" target="_blank" class="release_a" style="margin-left: 20px;">点此前往设置</a>
                </div>

                <div class="logistics_tips">
                  <p>默认运费：{{ruleForm.expressInfoDesc}}</p>
                </div>

                <div>
                  <span>
                    <label> <i>*</i> 物流重量（kg）</label>
                  </span>
                  <el-input style="width: 200px;" type="number" v-model="logisticsWeight" @input="numRule('logisticsWeight')" clearable></el-input>
                  <span class="tips">当前运费模板，按物流重量（含包装）计费</span>
                </div>

                <div>
                  <span>
                    <label> <i>*</i> 物流体积（cm³）</label>
                  </span>
                  <el-input style="width: 100px;" type="number" v-model="logisticsWidth" @input="numRule('logisticsWidth')" clearable></el-input>
                  <i> - </i>
                  <el-input style="width: 100px;" type="number" v-model="logisticsHeight" @input="numRule('logisticsHeight')" clearable></el-input>
                  <i> - </i>
                  <el-input style="width: 100px;" type="number" v-model="logisticsHigh" @input="numRule('logisticsHigh')" clearable></el-input>
                  <span class="tips lineHeight_16">当前运费模板，按物流重量（含包装）计费。体积将换算成重量进行计算，公式为：（长*宽*高）/6000</span>
                </div>
              </div>
            </div>
          </div>

          <!--安装服务-->
          <!--<template v-if="installationTemplateData && installationTemplateData.length > 0">
            <div class="form_span">
              <span>安装服务</span>
            </div>
            <div class="form_box" style="margin-bottom: 20px;">
              <div class="shop_vh">
                <div>
                <span>
                  <label></label> &lt;!&ndash;用于占位&ndash;&gt;
                </span>

                  <el-radio-group v-model="taxationValue">
                    <el-radio :label="1">提供安装服务</el-radio>
                    <el-radio :label="2">不提供安装服务</el-radio>
                  </el-radio-group>
                </div>

                <div v-if="taxationValue === 1">
                  <span>
                    <label>安装模板</label>
                  </span>

                  <el-select v-model="ruleForm.installationValue" @change="installationTemplateSelect" placeholder="请选择" style="width: 300px; margin-right: 10px;">
                    <el-option
                      v-for="(item,i) in installationTemplateData"
                      :key="i"
                      :label="item.title"
                      :value="item.id">
                    </el-option>
                  </el-select>
                  <a href="#" class="release_a" style="margin-left: 10px;">点击前往设置</a>
                </div>
              </div>
            </div>
          </template>-->

          <!--服装裁剪服务-->
          <!--<div class="form_span">
            <span>服装裁剪服务</span>
            <em>请选择店铺所支持的服务，裁剪后不能退换货</em>
          </div>
          <div class="form_box" style="margin-bottom: 20px;">
            <div class="shop_tailoring">
              <div>
                <el-checkbox>裤脚裁剪费用（元）</el-checkbox>
                <el-input style="width: 100px;"></el-input>
              </div>

              <div>
                <el-checkbox>裤腰裁剪费用（元）</el-checkbox>
                <el-input style="width: 100px;"></el-input>
              </div>
            </div>
          </div>-->

          <!--全球购商品-->
          <!--<div class="form_span">
            <span>全球购商品</span>
          </div>
          <div class="form_box" style="margin-bottom: 20px;">
            <div class="shop_vh">
              <div>
                <span>
                  <label>国家或地区</label>
                </span>

                <el-select v-model="ruleForm.shopBrand" placeholder="请选择" style="width: 440px; margin-right: 10px;">
                  <el-option
                    v-for="(item,i) in brandOptions"
                    :key="i"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>

              <div>
                <span style="position: relative; top: -110px;">
                  <label>中国说明书</label>
                </span>

                <el-input
                  style="width: 440px;"
                  type="textarea"
                  :rows="6"
                  placeholder="请输入说明书">
                </el-input>
              </div>

              <div>
                <span>
                  <label>税费</label>
                </span>

                <el-radio-group v-model="taxationValue">
                  <el-radio :label="1">商家承担</el-radio>
                  <el-radio :label="2">额外税费需用户承担</el-radio>
                </el-radio-group>
              </div>

              <div>
                <span>
                  <label>保险</label>
                </span>

                <el-input style="width: 200px;"></el-input>
                <span class="tips">金额（元）</span>
              </div>

              <div>
                <span>
                  <label></label> &lt;!&ndash;用于占位&ndash;&gt;
                </span>

                <el-radio-group v-model="taxationValue">
                  <el-radio :label="1">商家承保</el-radio>
                  <el-radio :label="2">商家代买，用户需额外支付保险费用</el-radio>
                </el-radio-group>
              </div>
            </div>
          </div>-->

          <!--服无承诺-->
          <div class="form_span">
            <span>服务承诺</span>
          </div>
          <div class="form_box">
            <div class="shop_service">
              <div class="service_part1">
                <div>
                  <span class="icon1">
                    <i>正品保障</i>
                    <i>保证出售商品是正品</i>
                  </span>
                </div>
                <div>
                  <span class="icon2">
                    <i>售后包修服务</i>
                    <i>提供售后保修期包修服务</i>
                  </span>
                </div>
              </div>

              <div class="service_part2">
                <div>
                  <label>请选择服务承诺：</label>
                  <el-checkbox v-model="isSevenDay">支持七天无理由退换货</el-checkbox>
                </div>
                <div>
                  <label>请选择售后保修服务：</label>
                  <el-radio-group v-model="saleRule">
                    <el-radio :label="1">全国联保</el-radio>
                    <el-radio :label="0">商家售后</el-radio>
                  </el-radio-group>
                </div>
              </div>

              <div class="service_part3">
                <p>一、售后服务规则</p>
                <p>1、正品保障：我们承诺：平台上所售商品均为正品行货，并由平台商家提供相应的售后服务，其中符合全国联保均有注明。请您放心购买！</p>
                <p>2、提供发票：对于在满集网平台购物的买家均提供商品发票。</p>
                <p>3、七天无忧退换货：该商品自签收之日起7天内支持7天无理由退货：</p>
                 <p>（1）商品外包装完整，（若有）塑封包装未拆封；相关附（配）件齐全；</p>
                 <p>（2）商品表面无划痕、无磨损、无磕碰、无使用、无拆卸等痕迹；（若有）原厂屏幕贴膜不能被撕毁；</p>
                 <p>（3）（若有）防伪标识码未刮开或撕损；</p>
                 <p>（4）可申请无理由退货，包邮商品需要买家承担退货邮费，非包邮商品需要买家承担发货和退货邮费。</p>
                 <p>（5）具体详情请仔细阅读《食品茶酒至宠物用品退换货规则》</p>
                <p>4、售后保修服务：</p>
                 <p>商家售后：客户在满集网购买商品后，除按照《中华人民共和国产品质量法》、《中华人民共和国消费者权益保护法》以及国家关于产品修理、更换、退货的规定，享受商家提供的相应服务。</p>
                 <p>温馨提示：若商家不履行上诉服务义务，满集网将按照《满集网商家管理办法》进行相应处理。客户在购物过程中对商家服务不满意，可向满集网发起投诉，满集网将依据客观事实，公正且透明的处理，保障双方的正当权益。</p>
              </div>

              <div class="service_part2">
                <el-checkbox :value="ruleForm.isSeason === 0 ? false : true" @change="isSeasonFun">是否是季节性商品</el-checkbox>
              </div>

              <div class="service_part4" v-if="ruleForm.isSeason === 1">
                <div>
                  <label>设置自动上架时间：</label>
                  <el-date-picker
                    v-model="ruleForm.autoPutaway"
                    type="date"
                    value-format="yyyy-MM-dd hh:mm:ss"
                    placeholder="选择日期">
                  </el-date-picker>
                  <label>系统会在该时间自动执行上架操作。</label>
                </div>

                <div>
                  <label>设置自动下架时间：</label>
                  <el-date-picker
                    v-model="ruleForm.autoSoldout"
                    type="date"
                    value-format="yyyy-MM-dd hh:mm:ss"
                    placeholder="选择日期">
                  </el-date-picker>
                  <label>系统会在该时间自动执行下架操作。</label>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div class="marginTop_30">
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">发布商品</el-button>
            <span class="btn_draft">
              <div class="exist_draft" v-if="isShowDraft" @mouseenter="showDraft" @mouseleave="hideDraft">
                <p>你在当前目录下的草稿（<span>{{draftNum}}</span>）</p>
                <template v-if="draftData.length > 0">
                  <ul v-for="(item, i) in draftData">
                    <li>
                      <span class="color_00a2ff" @click="selectDraft(item.data)">{{item.name}}</span>
                      <i class="delete_draft" @click="deleteDraft(item.name)">删除</i>
                    </li>
                    <li>
                      <i>{{item.tIme}}</i>
                    </li>
                  </ul>
                </template>
                <template v-else>
                  <p class="draft_p">暂无草稿</p>
                </template>
              </div>

              <el-button>
                <span class="release_btn">
                  <span>
                    <span @click="saveDraft">
                      <i>保存草稿</i>
                      <em>最多是10条</em>
                    </span>
                    <small @mouseenter="showDraft" @mouseleave="hideDraft"></small>
                  </span>
                  <small>{{draftNum}}</small>
                </span>
              </el-button>
            </span>
            <el-button @click="goBack">上一步</el-button>
          </el-form-item>
        </div>
      </div>
    </el-form>

    <!--价格及库存批量填写的弹框-->
    <el-dialog
      title="批量填写"
      :visible.sync="dialogFormVisible"
      width="600px">
      <el-form :model="form" :rules="formRules" ref="form">
        <el-form-item label="原价：" label-width="100px" prop="originalPrice">
          <el-input v-model="form.originalPrice"></el-input>
        </el-form-item>
        <el-form-item label="现价：" label-width="100px" prop="salePrice">
          <el-input v-model="form.salePrice"></el-input>
        </el-form-item>
        <el-form-item label="库存：" label-width="100px" prop="stock">
          <el-input v-model="form.stock"></el-input>
        </el-form-item>
        <el-form-item label="商品编码：" label-width="100px" prop="code">
          <el-input v-model="form.code"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="$refs['form'].resetFields(); dialogFormVisible = false;">取 消</el-button>
        <el-button type="primary" @click="batchSetup('form')">确 定</el-button>
      </div>
    </el-dialog>

    <!--发布商品时，上传了资质证件的弹框-->
    <el-dialog
      title="温馨提示"
      :visible.sync="dialogVisible"
      width="500px">
      <span v-if="id > 0">需提交平台审核，确定修改商品信息吗？</span>
      <span v-else>需提交平台审核，确定发布商品吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitData">确 定</el-button>
      </span>
    </el-dialog>

    <!--发布商品时，没有上传资质证件的弹框-->
    <!--<el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="780px">

      <div class="uploadDialog">
        <h3>该商品需上传以下资质证件，否则将审核不通过</h3>
        <p>如有疑问请致电全国统一服务热线：400-6766-999</p>
        <div class="upload">
          <div>
            <viewer :images="['https://picsum.photos/600/500']">
              <img class="vue-lazyload avatar" v-lazy="`https://picsum.photos/340/200`" alt="" title="点击查看大图">
            </viewer>
            <span>
              <i>婴儿食品：食品经营许可证/食品流通许可证</i>
              <label>
                <button>点击上传</button>
                <input type="file" title="请选择图片" />
              </label>
            </span>
          </div>

          <div>
            <viewer :images="['https://picsum.photos/600/500']">
              <img class="vue-lazyload avatar" v-lazy="`https://picsum.photos/340/200`" alt="" title="点击查看大图">
            </viewer>
            <span>
              <i>婴儿食品：食品经营许可证/食品流通许可证</i>
              <label>
                <button>点击上传</button>
                <input type="file" title="请选择图片" />
              </label>
            </span>
          </div>
        </div>
        <span class="tips">资质证件图片上传要求：尺寸800x800像素以上、大小不超过5M的正方形图片若使用手机照，请采用横屏拍摄，请确保图片清晰。</span>
        <div class="upload_btn">
          <el-button type="default" @click="dialogVisible = false">仅发布商品，稍后上传证件</el-button>
          <el-button type="primary" @click="dialogVisible = false">提交证件，并发布商品</el-button>
        </div>
      </div>
    </el-dialog>-->

    <!--输入草稿名称弹框-->
    <el-dialog
      title="草稿名称"
      :visible.sync="draftVisible"
      width="500px">
      <div>
        <el-form :model="draftForm" :rules="draftFormRules" ref="draftForm">
          <el-form-item label="草稿名称：" label-width="100px" prop="cacheName">
            <el-input v-model="draftForm.cacheName" placeholder="请输入草稿名称"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="draftVisible = false">取 消</el-button>
        <el-button type="primary" @click="goSaveDraft('draftForm')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import draggable from "vuedraggable";
  import GetShopBrandList from '@/api/ShopBrand/GetShopBrandList';
  import GetShopCategoryListByParentId from '@/api/ShopInfo/GetShopCategoryListByParentId';
  import GetPublishGoodsSpecs from '@/api/goods/goodsPublish/getPublishGoodsSpecs';
  import GetShopArticlePublishAttributes from '@/api/goods/goodsPublish/getShopArticlePublishAttributes';
  import GetGoodsPublishExpressInfo from '@/api/goods/goodsPublish/getGoodsPublishExpressInfo';
  import SavePublishGoods from '@/api/goods/goodsPublish/savePublishGoods';
  import EditPublishGoodsInfo from '@/api/goods/goodsPublish/editPublishGoodsInfo';
  import CacheArticleGoods from '@/api/goods/goodsPublish/CacheArticleGoods';
  import GetCacheArticleGoodsList from '@/api/goods/goodsPublish/GetCacheArticleGoodsList';
  import RemoveGoodsCache from '@/api/goods/goodsPublish/RemoveGoodsCache';
  import GetDeliveryInstallationTemplateList from '@/api/goods/logistics/GetDeliveryInstallationTemplateList';
  import GetProvinceList from '@/api/base/provinceList';
  import GetCityList from '@/api/base/cityList';
  import CustomUpload from '@/components/public/customUpload';
  import GetShopExpenseInfo from '@/api/goods/areaManage/GetShopExpenseInfo.js';

  export default {
    components: {
      draggable,
      CustomUpload
    },
    data () {
      // 价格的验证
      let checkPrice = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入价格'));
        }
        let reg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/; // 任意正整数，正小数（小数位不超过2位）
        if (!reg.test(value)) {
          callback(new Error('不能超过两位小数且大于0'));
        } else {
          callback();
        }
      };

      let checkStock = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入库存'));
        }
        let reg = /^[0-9]*[1-9][0-9]*$/; // 验证正整数的正则表达式
        if (!reg.test(value)) {
          callback(new Error('请输入整数且大于0'));
        } else {
          callback();
        }
      };
      return {
        id: parseInt(this.$route.query.id), // 页面id
        index: -1, // 用于自增的变量
        clientTimespan: '', // 系统当前时间
        goodsCate: {},
        dialogVisible: false, // 点击修改时的确认提示
        draftVisible: false, // 设置草稿名称弹框
        isShowDraft: false, // 当前草稿箱是否显示
        ruleForm: {
          title: '', // 商品名称
          sellPoint: '', // 商品卖点
          brand: '', // 商品品牌
          userCategoryId: '', // 商品自定义分类一级
          userChildCategoryId: '', // 商品自定义分类二级
          provinceCode: '', // 发货地-省(code)
          cityCode: '', // 发货地-市(code)
          expressInfoValue: '', // 运费模板
          expressInfoDesc: '', // 运费模板信息提示
          isSystem: 0, // 运费模板是否是默认模板
          installationValue: '', // 安装模板
          isSeason: 0, // 是否是季节性商品
          autoPutaway: '', // 自动上架时间
          autoSoldout: '', // 自动下架时间
        },
        rules: {
          title: [
            { required: true, message: '请输入商品名称', trigger: 'blur' },
            { min: 15, max: 50, message: '长度在 15 到 50 个字符', trigger: 'blur' }
          ],
        },
        shopBrandList: [], // 商品品牌选项
        userCategoryIdData: [], // 商品自定义分类一级数据
        userChildCategoryIdData: [], // 商品自定义分类二级数据
        /*colorData: [{ // 颜色板数据
          name: '白色系',
          value: '#fff',
          children: [{
            name: '乳白色',
            value: ''
          }],
        }, {
          name: '红色系',
          value: '#ff0100',
          children: [{
            name: '橘红色',
            value: '#ff7500'
          }, {
            name: '玫红色',
            value: '#df1b76'
          }, {
            name: '粉红色',
            value: '#ffb6c1'
          }, {
            name: '红色',
            value: '#ff0000'
          }, {
            name: '藕粉色',
            value: '#eed0d8'
          }],
        }],*/
        shopSpecsData: [], // 商品规格的整体数据（只用于做规格显示的判断）
        specsData: [], // 商品规格的数据
        colorCystemValue: '', // 选中的色系值
        colorCystemIndex: 0, // 选中的色系值的下标
        transparent_bg: require('./img/transparent_icon.png'),
        // standardColorVisible: false,
        colorVisible: false,
        specIndex: 0, // 商品规格当前编辑项
        specColorIsSelect: [], // 商品规格已选中的颜色
        specColorData: [{ // 商品规格-颜色数据
          id: 0,
          pid: 0,
          title: '',
          img: {
            idName: 'img', // 类似于页面的ID，做组件的区分（一个页面多次调用上传组件时，要赋不同的值）
            limit: 1, // 上传图片的最大限制个数
            imgArr: [], // 上传成功返回的数组，默认传空
          },
        }],
        specSizeData: [], // 商品规格-尺码数据
        specsPid: 0, // 商品规格-颜色口味等pid
        specsTitle: '', // 商品规格-价格及库存表头显示的规格名称（颜色/规格）
        specSizeId: 0, // 商品规格-尺寸-pid

        goodsSpecInfo: [], // 商品规格数据
        specSizeSelectData: [], // 商品规格，选中尺码的数据
        specSizeSelectSpecid: [], // 商品规格-选中尺码的id
        goodAttributesData: [], // 商品属性的数据
        queryAttrIndex: '', // 获取焦点时商品属性当前的下标
        attrName: '', // 添加的商品属性-名称
        attrValue: '', // 添加的商品属性-值
        album: { idName: 'www', limit: 999, imgArr: [] }, // 商品相册

        provinceData: [], // 省级数据
        cityData: [], // 市级数据
        dialogFormVisible: false, // 批量填写弹框
        photos: [{ // 商品主图图片数据
          idName: 'photo1', limit: 1, imgArr: []
        }, {
          idName: 'photo2', limit: 1, imgArr: []
        }, {
          idName: 'photo3', limit: 1, imgArr: []
        }, {
          idName: 'photo4', limit: 1, imgArr: []
        }, {
          idName: 'photo5', limit: 1, imgArr: []
        }],
        enabled: true, // 图片拖动参数
        dragging: false,
        expressInfoData: [], // 运费模板的数据
        expressInfoItemData: [], // 选中的运费模板信息
        installationTemplateData: [], // 安装模板的数据
        installationItemData: [], // 选中的安装模板数据
        taxationValue: 1, // 税费（全球购模块）
        saleRule: 1, // 售后保修服务值
        isSevenDay: true, // 是否支持7天无理由退货
        form: {
          originalPrice: '',
          salePrice: '',
          stock: '',
          code: ''
        },
        formRules: {
          originalPrice: [
            { required: true, validator: checkPrice, trigger: 'blur' },
          ],
          salePrice: [
            { required: true, validator: checkPrice, trigger: 'blur' },
          ],
          stock: [
            { required: true, validator: checkStock, trigger: 'blur' },
          ],
          code: [
            { required: true, message: '请输入商品编码', trigger: 'blur' },
          ],
        },
        logisticsWeight: 0, // 物流信息-重量
        logisticsWidth: 0, // 物流信息-长度
        logisticsHeight: 0, // 物流信息-宽度
        logisticsHigh: 0, // 物流信息-高度
        formData: {}, // 提交的数据
        goodsRejectReason: [], // 编辑时审核结果的对象
        draftNum: 0, // 草稿数量
        draftFormData: {}, // 保存草稿时提交的数据
        draftForm: {
          cacheName: '', // 草稿名称
        },
        draftFormRules: {
          cacheName: [
            { required: true, message: '请输入草稿名称', trigger: 'blur' },
          ],
        },
        draftData: [], // 获取到的草稿数据



        brandOptions: [{ // 后期会删除
          value: '选项1',
          label: '宝马'
        }, {
          value: '选项2',
          label: '奔驰'
        }],

        unitOption: [{ // 单位选择的数据（后期会删除）
          value: '选项1',
          label: '瓶'
        }, {
          value: '选项2',
          label: '箱'
        }, {
          value: '选项3',
          label: '打'
        }],

      };
    },

    methods: {
      numRule(params) {
        console.log(this[params])
        this[params] = this[params].replace(/[^\.\d]/g,'');
        this[params] = this[params].replace(/\.{2,}/g,".");
        this[params] = this[params].replace(".","$#$").replace(/\./g,"").replace("$#$",".");
        this[params] = this[params].replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');
      },
      /**
       * 表单提交
       * @param formName
       */
      submitForm(formName) {
        this.$refs[formName].validate((valid, arr) => {
          if (valid) {
            console.log(this.goodsSpecInfo, "商品规格");
            console.log(this.goodAttributesData, "商品属性");

            if (this.goodsSpecInfo.length > 0) {
              const goodsSpecInfoArr = [];
              this.goodsSpecInfo.map(item => {
                const _specInfo = {};
                Object.assign(_specInfo, {
                  spec: [],
                  market: item.market, // 原价
                  sell: item.sell, // 售价
                  expect: item.expect,
                  store: item.store, // 库存
                  no: item.no, // 商品编码
                });
                item.spec.map(items => {
                  const _spec = {};
                  Object.assign(_spec, {
                    id: items.specId ? items.specId : 0,
                    pid: items.pid,
                    title: items.title
                  });

                  if ( items.img && items.img.imgArr.length > 0 ) {
                    Object.assign(_spec, {img: items.img.imgArr[0]});
                  } else {
                    Object.assign(_spec, {img: null});
                  }
                  _specInfo.spec.push(_spec);
                });
                goodsSpecInfoArr.push(_specInfo);
              });
              console.log(goodsSpecInfoArr, "提交时重组的商品规格");

              // 价格及库存做验证
              let isVerify = false;
              for ( var i = 0; i < goodsSpecInfoArr.length; i++ ) {
                if (goodsSpecInfoArr[i].market && goodsSpecInfoArr[i].sell && goodsSpecInfoArr[i].store && goodsSpecInfoArr[i].no) {
                  isVerify = false;
                } else {
                  isVerify = true;
                  break;
                }
              }

              if (isVerify) {
                this.$message.error("请输入正确的价格及库存");
                return;
              }

              let goodAttributesArr = [];
              let haveValue = []; // 把有值的属性push到数组中
              if ( this.goodAttributesData.length < 5 ) {
                this.$message.error("请至少添加5条商品属性");
                return;
              } else {
                // 判断商品属性-数量是否为空，且商品属性必须设置5个及以上
                let numIsNull = false; // 属性数量是否有值（true是有值，false是没值）
                this.goodAttributesData.map(item => {
                  if (item.value) {
                    haveValue.push({
                      key: item.key,
                      value: item.value
                    });
                  }
                  if (item.key.trim() === '数量') {
                    if (item.value === '') {
                      numIsNull = false;
                    } else {
                      numIsNull = true;
                    }
                  }
                });

                haveValue.map(item => {
                  goodAttributesArr.push( ( item.key ? item.key.trim() : item.key ) + ":" + ( item.value ? item.value.trim() : item.value ) );
                });

                if ( !numIsNull ) {
                  this.$message.error("商品属性-数量不能为空");
                  return;
                }

                if (haveValue.length < 5) {
                  this.$message.error("商品属性需设置5个及以上");
                  return;
                }
              }
              console.log(goodAttributesArr, "提交时重组的商品属性");

              // 商品主图
              let content = [];
              this.photos.map(item => {
                if ( item.imgArr.length > 0 ) {
                  content.push( item.imgArr[0] );
                }
              });
              console.log(content, "提交时重组的商品主图");
              if ( content.length < 3 ) {
                this.$message.error( "请至少上传3张主图" );
                return;
              }

              if (!this.ruleForm.cityCode) {
                this.$message.error("请选择发货地");
                return;
              }

              console.log(this.expressInfoItemData, "运费模板信息");
              if ( !this.expressInfoItemData ) {
                this.$message.error( "请选择运费模板" );
                return;
              }

              if ( this.logisticsWeight === '' || this.logisticsWidth === '' || this.logisticsHeight === '' || this.logisticsHigh === '' ) {
                this.$message.error( "请完善重量/体积的信息" );
                return;
              }

              let goodsData = {
                title: this.ruleForm.title,
                img: null,
                sellPoint: this.ruleForm.sellPoint,
                goodsSpecInfo: goodsSpecInfoArr,
                brand: this.ruleForm.brand ? this.ruleForm.brand : 0,
                categoryFullName: this.goodsCate.title,
                userCategoryId: this.ruleForm.userCategoryId === '' ? 0 : this.ruleForm.userCategoryId,
                userChildCategoryId: this.ruleForm.userChildCategoryId === '' ? 0 : this.ruleForm.userChildCategoryId,
                sysCategoryId: parseInt(this.goodsCate.cid.split(",")[2]) === 0 ? parseInt(this.goodsCate.cid.split(",")[1]) : parseInt(this.goodsCate.cid.split(",")[2]),
                photos: null,
                attributes: goodAttributesArr,
                album: content, // 商品主图
                content: this.album.imgArr, // 商品详情图片
                expressInfo: {
                  kg: this.logisticsWeight,
                  cm: this.logisticsWidth * this.logisticsHeight * this.logisticsHigh,
                  cmExpression: this.logisticsWidth + '*' + this.logisticsHeight + '*' + this.logisticsHigh,
                  areaCode: this.ruleForm.cityCode,
                  isSystem: this.expressInfoItemData.isSystem,
                  expressTempleId: this.expressInfoItemData.id,
                  expressTempleDesc: this.expressInfoItemData.desc
                },
                saleRule: this.saleRule,
                isSeason: this.ruleForm.isSeason,
                autoPutaway: this.ruleForm.autoPutaway,
                autoSoldout: this.ruleForm.autoSoldout,
                credentials: null,
                raiseGoodsPriceReason: '',
                isSevenDay: +this.isSevenDay
              };

              let formData = {
                publishGoodsDetailsResult: goodsData,
                type: 0,
                articleId: this.id,
                delarticleId: 0,
                clientTimespan: this.clientTimespan
              };
              console.log(formData, "商品发布提交的数据");
              this.formData = formData;
              this.dialogVisible = true;
            } else {
              this.$message.error( "请选择商品规格" );
            }
          } else {
            this.$message.error("请完善商品信息");
            return false;
          }
        });
      },

      /**
       * 跳转到切换类目的页面
       */
      goCateClass() {
        this.$router.push({ name: 'GoodsReleaseClass' });
      },

      /**
       * 请求接口，提交数据
       */
      submitData() {
        console.log(this.formData, "提交的数据");

        SavePublishGoods.call(this, this.formData).then( res => {
          console.log(res, "商品发布返回的值");
          if (res.data.code === 1) {
            this.dialogVisible = false;
            this.$message.success( res.data.data );
            let goodsManagePageCacheData = {
              currentPage: 1,
              currentPageSize: 10,
              queryType: 1
            };
            sessionStorage.setItem('GOODS_MANAGE_PAGE_DATA', JSON.stringify(goodsManagePageCacheData));
            this.$router.push({ name: 'GoodsMain' });
          } else {
            this.$message.error( res.data.desc );
          }
        });
      },

      /**
       * 获取商品品牌
       */
      getShopBrandList() {
        let valid = 1;

        GetShopBrandList.call(this, `?clientTimespan=${this.clientTimespan}&valid=${valid}&pageIndex=1&pageSize=9999`).then( res => {
          console.log(res, "获取到的商品品牌数据");
          if (res.data.code === 1) {
            this.shopBrandList = res.data.data.shopBrandList;
          }
        });
      },

      /**
       * 获取商品自定义分类
       * parentId: 父级ID
       * type: 只是作为标识（在编辑页时第一次显示二级分类的数据）
       */
      getShopCategoryList( parentId, type ) {
        GetShopCategoryListByParentId.call(this, `?clientTimespan=${this.clientTimespan}&parentId=${parentId}`).then( res => {
          console.log(res, "商品自定义分类数据");
          if (res.data.code === 1) {
            if ( parentId === 0 ) {
              this.userCategoryIdData = res.data.data;
            } else {
              if (type === 0) {
                this.ruleForm.userChildCategoryId = '';
              }
              this.userChildCategoryIdData = res.data.data;
            }
          }
        });
      },

      /**
       * 添加商品规格
       */
      addSpecs () {
        this.specColorData.push({
          id: 0,
          pid: this.specsPid,
          title: '',
          img: {
            idName: 'img' + Math.random(),
            limit: 1,
            imgArr: [],
          },
        });
      },

      /**
       * 删除商品规格
       */
      deleteSpecs( i, title ) {
        this.specColorData.map((item, index) => {
          if (index === i) {
            this.specColorData.splice(i, 1);
          }
        });
        this.specColorIsSelect.map((item, index) => {
          if ( item === title ) {
            this.specColorIsSelect.splice(index, 1);
          }
        });
      },

      /**
       * 规格失去焦点事件和新增的商品规格，直接选择检索内容时执行的方法
       */
      // 最后生成的数组 goodsSpecInfo
      specsInputBlur( title ) {
        this.goodsSpecInfo = [];
        if ( title ) {
          console.log(this.specColorData, "颜色/规格值");

          let specColorArr = [];
          this.specColorData.map(item => {
            if ( item.title ) {
              specColorArr.push( item );
            }
          });
          console.log(specColorArr, this.specSizeSelectSpecid, "有值的颜色/规格值======选中的尺码数据");

          if (this.specSizeSelectData.length > 0) {
            specColorArr.map(specItem => {
              this.specSizeSelectData.map(sizeItem => {
                this.goodsSpecInfo.push({
                  spec: [
                    specItem,
                    sizeItem
                  ],
                  market: '',
                  sell: '',
                  expect: 0,
                  store: '',
                  no: ""
                });
              });
            });
          } else {
            specColorArr.map(specItem => {
              this.goodsSpecInfo.push({
                spec: [
                  specItem
                ],
                market: '',
                sell: '',
                expect: 0,
                store: '',
                no: ""
              });
            });
          }
          console.log(this.goodsSpecInfo, 'this.goodsSpecInfo');
        }
      },

      /**
       * 鼠标滑动色系改变，设置当前选中的色系值
       */
      colorSystemChange( name, index ) {
        console.log(name, index, "当前选中的色系值");
        this.colorCystemValue = name;
        this.colorCystemIndex = index;
      },

      /**
       * 通过色系值，显示不同的色值
       */
      systemColorSearch( colorData, title ) {
        console.log(colorData, title);
        return colorData.filter(res => res.name.indexOf(title) !== -1);
      },

      /**
       * 颜色规格获取焦点事件
       */
      colorFocus ( index ) {
        this.colorVisible = true;
        // this.standardColorVisible = false;
        this.specIndex = index;
      },

      /**
       * 颜色规格改变事件
       */
      colorChange ( index ) {
        this.specIndex = index;
      },

      /**
       * 颜色值的筛选
       */
      colorValueData( value ) {
        return value.filter(res => this.specColorIsSelect.indexOf(res.name) === -1);
      },

      /**
       * 颜色值选中事件
       */
      colorValueSelect( i, name ) {
        this.specColorData[i].title = name;
        this.specColorIsSelect.push( name );
        this.colorVisible = false;
      },

      /**
       * 获取商品规格数据
       */
      getSpecSizeData() {
        let categoryId = parseInt(this.goodsCate.cid.split(",")[2]) === 0 ? parseInt(this.goodsCate.cid.split(",")[1]) : parseInt(this.goodsCate.cid.split(",")[2]);

        GetPublishGoodsSpecs.call(this, `?clientTimespan=${this.clientTimespan}&categoryId=${categoryId}`).then( res => {
          console.log(res, "商品规格数据");
          if ( res.data.code === 1 ) {
            this.shopSpecsData = res.data.data;
            res.data.data.map((item, i) => {
              if ( item.isImgSpec === 1 ) {
              // if ( res.data.data.length <= 1 ) {
                this.specsData = item.children;
                this.specsPid = item.specId;
                this.specColorData[0].pid = item.specId;
                this.specsTitle = item.title;
              } else {
                this.specSizeData = item.children;
                this.specSizeId = item.specId;
                this.specsTitle = item.title;
              }
            });
            // this.specsTitle = res.data.data.length > 0 ? res.data.data[0].title : '颜色/规格';
          } else {
            this.$message.error( res.data.desc );
          }
        });
      },

      querySearch(queryString, cb) {
        let arr = [];
        this.specsData.map(res => {
          res.value = res.title;
          let flag = this.specColorData.every(item => item.title !== res.value);
          if (flag) {
            arr.push(res);
          }
          return res;
        });
        cb(arr);
      },

      /**
       * 商品属性数据加载
       */
      queryAttrSearch(queryString, cb) {
        let index = this.queryAttrIndex;
        let value = [];
        this.goodAttributesData.map((f, _index)=>{
          if (_index === index) {
            value = f.inpVal;
          }
        });
        let newValue = [];
        value.map(item => {
          newValue.push({
            value: item
          });
        });
        cb ( newValue );
      },

      /**
       * 商品属性获取焦点时保存当前下标
       */
      queryAttrFocus( i ) {
        this.queryAttrIndex = i;
      },

      /**
       * 添加商品规格-尺码数据
       */
      addSpecsSize() {
        this.specSizeData.push({
          specId: this.index,
          title: '',
          pid: this.specSizeId
        });
        this.index--;
      },

      /**
       * 删除商品规格-尺码数据
       */
      deteleSpecsSize( i ) {
        this.specSizeData.map((item, index) => {
          if (i === index) {
            this.specSizeData.splice(i, 1);
          }
        });
      },

      /**
       * 商品规格-尺码选中事件
       */
      specSizeChanges() {
        // 最后生成的数组 goodsSpecInfo
        this.specSizeSelectData = [];
        this.goodsSpecInfo = [];
        let specColorArr = []; // 存放title不为空的颜色/规格数组
        this.specColorData.map(item => {
          if ( item.title !== '' ) {
            specColorArr.push( item );
          }
        });

        this.specSizeData.map((item, i) => {
          item.pid = this.specSizeId;
          if (this.specSizeSelectSpecid.indexOf(item.specId) !== -1 && item.title !== '') {
            this.specSizeSelectData.push( item );
          }
        });

        console.log(specColorArr, this.specSizeSelectData, "选中的颜色值===选中的尺码值");

        if ( specColorArr.length <= 0 ) {
          this.$message.error("请先输入颜色");
          return;
        }

        specColorArr.map(specItem => {
          this.specSizeSelectData.map(sizeItem => {
            this.goodsSpecInfo.push({
              spec: [
                specItem,
                sizeItem
              ],
              market: '',
              sell: '',
              expect: 0,
              store: '',
              no: ""
            });
          });
        });

        console.log(this.goodsSpecInfo, 'this.goodsSpecInfo');
      },

      /**
       * 批量填写事件
       */
      batchFilling () {
        if (this.goodsSpecInfo.length > 0) {
          this.dialogFormVisible = true;
        } else {
          this.$message.error( "请先选择商品规格" );
        }
      },

      /**
       * 确定批量设置价格及库存
       */
      batchSetup(formName) {
        this.$refs[formName].validate((valid, x) => {
          if (valid) {
            this.goodsSpecInfo.map((item, i) => {
              item.market = this.form.originalPrice;
              item.sell = this.form.salePrice;
              item.store = this.form.stock;
              item.no = this.form.code + ' - ' + i;
            });
            this.dialogFormVisible = false;
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

      /**
       * 删除商品规格属性
       */
      deleteGoodsSpec( i ) {
        this.goodsSpecInfo.map((item, index) => {
          if ( i === index ) {
            this.goodsSpecInfo.splice( index, 1 );
          }
        });
      },

      /**
       * 获取商品属性的数据
       */
      getShopArticlePublishAttributes() {
        let categoryId = parseInt(this.goodsCate.cid.split(",")[2]) === 0 ? parseInt(this.goodsCate.cid.split(",")[1]) : parseInt(this.goodsCate.cid.split(",")[2]);

        GetShopArticlePublishAttributes.call(this, `?clientTimespan=${this.clientTimespan}&categoryId=${categoryId}`).then( res => {
          if (res.data.code === 1) {
            let goodAttrData = res.data.data;

            goodAttrData.map(item => {
              this.goodAttributesData.push({
                key: item.key,
                value: '',
                inpVal: item.value
              });
            });
            console.log(this.goodAttributesData, "商品属性的数据");
          } else {
            this.$message.error( res.data.desc );
          }

        });
      },

      /**
       * 添加商品属性
       */
      addGoodAttributes() {
        if (this.attrName !== '') {
          let isRepeat = false; // 用来判断新加的属性名是否重复
          this.goodAttributesData.map(item => {
            if (this.attrName === item.key) {
              isRepeat = true;
            }
          });

          if ( isRepeat ) {
            this.$message.error("属性名称不能相同");
            return;
          } else {
            this.goodAttributesData.push({
              key: this.attrName,
              value: this.attrValue,
              inpVal: [],
            });
          }
          this.attrName = '';
          this.attrValue = '';
        } else {
          this.$message.error("请先填写属性名称");
        }
      },

      /**
       * 商品详情图片-删除
       */
      shopPicDelete( index ) {
        this.album.imgArr.map((item, i) => {
          if ( i === index ) {
            this.album.imgArr.splice(i, 1);
          }
        });
      },

      /**
       * 获取省级数据
       */
      getProvinceList() {
        GetProvinceList.call(this, `?clientTimespan=${this.clientTimespan}`).then( res => {
          console.log(res, "获取省级数据");
          if (res.data.code === 1) {
            this.provinceData = res.data.data;
          } else {
            this.$message.error( res.data.desc );
          }
        });
      },

      /**
       * 获取市级数据
       */
      getCityList( provinceCode ) {
        this.ruleForm.cityCode = '';
        GetCityList.call(this, `?clientTimespan=${this.clientTimespan}&parentCode=${provinceCode}`).then( res => {
          console.log(res, "获取市级数据");
          if (res.data.code === 1) {
            this.cityData = res.data.data;
          } else {
            this.$message.error( res.data.desc );
          }
        });
      },

      /**
       * 获取运费模板数据
       */
      getGoodsPublishExpressInfo() {
        GetGoodsPublishExpressInfo.call(this, `?clientTimespan=${this.clientTimespan}`).then( res => {
          console.log(res, "获取运费模板数据");
          if (res.data.code === 1) {
            this.expressInfoData = res.data.data.templateList;
          } else {
            this.$message.error( res.data.desc );
          }
        });
      },

      /**
       * 选择运费模板
       */
      expressSelect( expressInfoValue ) {
        this.expressInfoData.map((item, i) => {
          if ( item.id === expressInfoValue ) {
            this.expressInfoItemData = item;
            this.ruleForm.expressInfoDesc = item.desc;
            this.ruleForm.isSystem = item.isSystem;
          }
        });
      },

      /**
       * 获取商家地址信息列表
       */
      getShopExpenseInfo() {
        GetShopExpenseInfo.call(this, `?clientTimespan=${this.clientTimespan}`).then( res => {
          console.log(res, "获取商家地址信息列表");
          if ( res.data.code === 1 ) {
            let defShippingAdd = res.data.data.filter(val => val.type === 0);
            if ( defShippingAdd.length > 0 ) {
              this.ruleForm.provinceCode = defShippingAdd[0].areaCode.substring(0, 2);
              this.getCityList( defShippingAdd[0].areaCode.substring(0, 2) ); // 根据省的code获取市级列表
              this.ruleForm.cityCode = defShippingAdd[0].areaCode.substring(0, 4);
            } else {
              this.ruleForm.provinceCode = '';
              this.ruleForm.cityCode = '';
            }
          } else {
            this.$message.error( res.data.desc );
          }
        });
      },

      /**
       * 获取安装模板数据
       */
      getDeliveryInstallationTemplateList() {
        let categoryId = parseInt(this.goodsCate.cid.split(",")[2]) === 0 ? parseInt(this.goodsCate.cid.split(",")[1]) : parseInt(this.goodsCate.cid.split(",")[2]);

        GetDeliveryInstallationTemplateList.call(this, `?clientTimespan=${this.clientTimespan}&categoryId=${categoryId}`).then( res => {
          console.log(res, "获取安装模板数据");
          if (res.data.code === 1) {
            this.installationTemplateData = res.data.data.deliveryInstallations;
          } else {
            this.$message.error( res.data.desc );
          }
        });
      },

      /**
       * 选择安装模板
       */
      installationTemplateSelect() {
        this.installationTemplateData.map((item, i) => {
          if ( item.id === this.ruleForm.installationValue ) {
            this.installationItemData = item;
          }
        });

        console.log(this.installationItemData, "当前选择的安装模板的信息");
      },

      /**
       * 获取商品编辑信息
       */
      editPublishGoodsInfo() {
        if (this.id > 0) {
          // 审核未通过时显示的数据
          let rejectReason = sessionStorage.getItem('GoodsRejectReason') !== '' ? JSON.parse(sessionStorage.getItem('GoodsRejectReason')) : { goodsReasons: [] };
          this.goodsRejectReason = rejectReason.goodsReasons;

          EditPublishGoodsInfo.call(this, `?clientTimespan=${this.clientTimespan}&articleId=${this.id}`).then( res => {
            console.log(res, "返回的商品编辑的数据");
            if (res.data.code === 1) {
              this.editDataSwitch( res.data.data );
            }
          });
        }
      },

      /**
       * 获取到的编辑数据转换
       */
      async editDataSwitch( editGoodsData ) {
        this.ruleForm.title = editGoodsData.title;
        this.ruleForm.sellPoint = editGoodsData.sellPoint;
        this.ruleForm.brand = parseInt(editGoodsData.brand) === 0 ? '' : parseInt(editGoodsData.brand);
        this.ruleForm.userCategoryId = editGoodsData.userCategoryId === 0 ? '' : editGoodsData.userCategoryId;

        // 编辑时根据商品自定义一级分类获取二级分类的数据
        if ( editGoodsData.userChildCategoryId ) {
          this.getShopCategoryList( editGoodsData.userCategoryId, 1 );
          this.ruleForm.userChildCategoryId = editGoodsData.userChildCategoryId;
        }

        this.ruleForm.provinceCode = editGoodsData.provinceCode;
        this.ruleForm.cityCode = editGoodsData.cityCode;
        this.ruleForm.expressInfoValue = editGoodsData.expressInfoValue;
        this.ruleForm.installationValue = editGoodsData.installationValue;
        this.ruleForm.isSeason = editGoodsData.isSeason;
        this.ruleForm.autoPutaway = editGoodsData.autoPutaway;
        this.ruleForm.autoSoldout = editGoodsData.autoSoldout;

        this.goodsSpecInfo = editGoodsData.goodsSpecInfo; // 编辑详情显示还需转换(商品规格)

        console.log(this.goodsSpecInfo, "编辑重组后的商品规格数据");

        // 转换商品规格数据(这块可以问下成永豪)
        // specColorData // 颜色数据
        // specSizeSelectData // 尺码选中的数据
        // specSizeSelectSpecid // 尺码选中的id
        if ( editGoodsData.goodsSpecInfo.length > 0 ) {
          const arr = []; //需要上传图片的数据数组
          const hasSize = []; // 去重的尺码数据
          this.goodsSpecInfo.forEach(res => {
            Object.assign(res, {
              market: res.market !== 0 ? res.market : '',
              sell: res.sell !== 0 ? res.sell : '',
              store: res.store !== 0 ? res.store : ''
            });

            Object.assign(res.spec[0], {
              img: {
                idName: 'img' + Math.random(),
                imgArr: res.spec[0].img ? [res.spec[0].img] : [],
                limit: 1
              }
            });

            if ( res.spec[1] ) {
              Object.assign(res.spec[1], {
                specId: res.spec[1].id
              });

              let hasTwo = hasSize.some(val => val.specId === res.spec[1].specId);
              if (!hasTwo) {
                hasSize.push( res.spec[1] );
              }
            }

            let hasOne = arr.some(val => val.spec[0].title === res.spec[0].title);

            console.log(hasOne, "^^^^^^^^^^^^^^^^^^6");

            if (hasOne) {
              // const obj = arr.find(val => val.spec[0].title === res.spec[0].title);
              //
              // console.log(obj, "obj===============");
              //
              // obj.spec.push(res.spec[1]);
            } else {
              arr.push(res);
            }
          });
          this.specColorData = arr.map(res => {
            return res.spec[0];
          });

          // 自己添加的尺码追加到尺码数据中
          hasSize.map(res => {
            if (res.specId < 0) {
              this.specSizeData.push({
                specId: res.specId,
                title: res.title,
                pid: res.pid
              });
            }
          });

          const arr2 = this.goodsSpecInfo.map(res => {
            return res.spec[1] ? res.spec[1].id : 0;
          });

          this.specSizeSelectSpecid = [...new Set(arr2)];
          console.log(this.specSizeSelectSpecid);
        }

        // 商品属性值的转换
        const newGoodsSpecInfo = [];
        editGoodsData.attributes.map(item => {
          newGoodsSpecInfo.push({
            key: item.split(":")[0],
            value: item.split(":")[1],
            inpVal: []
          });
        });

        if ( this.goodAttributesData.length > 0 ) {
          const arr = newGoodsSpecInfo.filter(res => {
            return this.goodAttributesData.every(val => {
              return res.key !== val.key;
            });
          });
          this.goodAttributesData.push(...arr);
          this.goodAttributesData.map(res => {
            const obj = newGoodsSpecInfo.find( val => {
              return res.key === val.key;
            }) || {};
            res.value = obj.value || '';
          });
        } else {
          this.goodAttributesData = newGoodsSpecInfo;
        }

        console.log(this.goodAttributesData, "编辑重组后的商品属性数据");

        // 商品详情图片
        this.album.imgArr = editGoodsData.content;
        // 商品主图图片
        this.photos.map((item, i) => {
          editGoodsData.album.map((cItem, index) => {
            if ( index === i ) {
              item.imgArr.push(cItem);
            }
          });
        });

        // 商品物流服务信息
        // 根据返回的运费模板id查询当前运费模板数据
        await this.expressSelect(editGoodsData.expressInfo.expressTempleId);

        // 根据运费地址设置provinceCode 和 cityCode
        if (editGoodsData.expressInfo.areaCode) {
          this.ruleForm.provinceCode = editGoodsData.expressInfo.areaCode.substring(0, 2);
          this.getCityList( editGoodsData.expressInfo.areaCode.substring(0, 2) ); // 根据省的code获取市级列表
          this.ruleForm.cityCode = editGoodsData.expressInfo.areaCode;
        } else {
          this.ruleForm.provinceCode = '';
          this.ruleForm.cityCode = '';
        }

        this.ruleForm.expressInfoValue = editGoodsData.expressInfo.expressTempleId;
        this.ruleForm.expressInfoDesc = editGoodsData.expressInfo.expressTempleDesc; // 运费模板提示信息
        this.logisticsWeight = editGoodsData.expressInfo.kg;
        let cmExpression = editGoodsData.expressInfo.cmExpression ? editGoodsData.expressInfo.cmExpression.split("*") : '0*0*0'.split("*");
        this.logisticsWidth = cmExpression[0];
        this.logisticsHeight = cmExpression[1];
        this.logisticsHigh = cmExpression[2];

        // 服务承诺信息
        this.isSevenDay = editGoodsData.isSevenDay === 1 ? true : false;
        this.saleRule = editGoodsData.saleRule;
        this.ruleForm.isSeason = editGoodsData.isSeason;
        this.ruleForm.autoPutaway = editGoodsData.autoPutaway;
        this.ruleForm.autoSoldout = editGoodsData.autoSoldout;
      },

      /**
       * 点击保存草稿，显示对话框
       */
      saveDraft () {
        const goodsSpecInfoArr = [];
        if (this.goodsSpecInfo.length > 0) {
          this.goodsSpecInfo.map(item => {
            const _specInfo = {};
            Object.assign(_specInfo, {
              spec: [],
              market: item.market ? item.market : 0, // 原价
              sell: item.sell ? item.sell : 0, // 售价
              expect: item.expect,
              store: item.store ? item.store : 0, // 库存
              no: item.no // 商品编码
            });
            item.spec.map(items => {
              const _spec = {};
              Object.assign(_spec, {
                id: items.specId ? items.specId : 0,
                pid: items.pid,
                title: items.title
              });

              if ( items.img && items.img.imgArr.length > 0 ) {
                Object.assign(_spec, {img: items.img.imgArr[0]});
              } else {
                Object.assign(_spec, {img: null});
              }
              _specInfo.spec.push(_spec);
            });
            goodsSpecInfoArr.push(_specInfo);
          });
        }
        console.log(goodsSpecInfoArr, "提交时重组的商品规格");


        let goodAttributesArr = [];
        if ( this.goodAttributesData.length > 0 ) {
          this.goodAttributesData.map(item => {
            goodAttributesArr.push( item.key.trim() + ":" + item.value.trim() );
          });
        }
        console.log(goodAttributesArr, "提交时重组的商品属性");

        let content = [];
        this.photos.map(item => {
          if ( item.imgArr.length > 0 ) {
            content.push( item.imgArr[0] );
          }
        });
        console.log(content, "提交时重组的商品主图");

        let goodsData = {
          title: this.ruleForm.title,
          img: null,
          sellPoint: this.ruleForm.sellPoint,
          goodsSpecInfo: goodsSpecInfoArr,
          brand: this.ruleForm.brand ? this.ruleForm.brand : 0,
          categoryFullName: this.goodsCate.title,
          userCategoryId: this.ruleForm.userCategoryId === '' ? 0 : this.ruleForm.userCategoryId,
          userChildCategoryId: this.ruleForm.userChildCategoryId === '' ? 0 : this.ruleForm.userChildCategoryId,
          sysCategoryId: parseInt(this.goodsCate.cid.split(",")[2]) === 0 ? parseInt(this.goodsCate.cid.split(",")[1]) : parseInt(this.goodsCate.cid.split(",")[2]),
          photos: null,
          attributes: goodAttributesArr,
          album: content,
          content: this.album.imgArr,
          expressInfo: {
            kg: this.logisticsWeight,
            cm: this.logisticsWidth * this.logisticsHeight * this.logisticsHigh,
            cmExpression: this.logisticsWidth + '*' + this.logisticsHeight + '*' + this.logisticsHigh,
            areaCode: this.ruleForm.cityCode,
            isSystem: this.ruleForm.isSystem,
            expressTempleId: this.ruleForm.expressInfoValue === '' ? 0 : this.ruleForm.expressInfoValue,
            expressTempleDesc: this.ruleForm.expressInfoDesc
          },
          saleRule: this.saleRule,
          isSeason: this.ruleForm.isSeason,
          autoPutaway: this.ruleForm.isSeason === 0 ? '' : this.ruleForm.autoPutaway,
          autoSoldout: this.ruleForm.isSeason === 0 ? '' : this.ruleForm.autoSoldout,
          credentials: null,
          raiseGoodsPriceReason: '',
          isSevenDay: +this.isSevenDay
        };

        let draftFormData = {
          publishGoodsDefaultData: goodsData,
          clientTimespan: this.clientTimespan
        };
        this.draftFormData = draftFormData;
        this.draftVisible = true;

      },

      /**
       * 保存草稿
       */
      goSaveDraft(formName) {
        this.$refs[formName].validate((valid, x) => {
          if (valid) {

            this.draftFormData.cacheName = this.draftForm.cacheName;
            console.log(this.draftFormData, "保存草稿提交的数据");

            CacheArticleGoods.call(this, this.draftFormData).then( res => {
              console.log(res, "保存草稿返回的数据");
              if ( res.data.code === 1 ) {
                this.getCacheArticleGoodsList();
                this.draftVisible = false;
                this.$message.success("草稿保存成功");
              } else {
                this.$message.error(res.data.desc);
              }
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

      /**
       * 获取草稿列表
       */
      getCacheArticleGoodsList() {
        let categoryId = parseInt(this.goodsCate.cid.split(",")[2]) === 0 ? parseInt(this.goodsCate.cid.split(",")[1]) : parseInt(this.goodsCate.cid.split(",")[2]);

        GetCacheArticleGoodsList.call(this, `?clientTimespan=${this.clientTimespan}&categoryId=${categoryId}`).then( res => {
          console.log(res, "获取到的草稿列表");
          if (res.data.code === 1) {
            this.draftData = res.data.data;
            this.draftNum = res.data.data.length;
          } else {
            this.$message.error(res.data.desc);
          }
        });
      },


      /**
       * 当前草稿箱显示
       */
      showDraft () {
        this.isShowDraft = true;
      },

      /**
       * 当前草稿箱隐藏
       */
      hideDraft () {
        this.isShowDraft = false;
      },

      /**
       * 选择草稿
       */
      selectDraft( data ) {
        this.$confirm('加载草稿将覆盖页面上您已编辑的内容, 是否继续?', '提示', {
          confirmButtonText: '加载草稿',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '加载成功'
          });
          this.editDataSwitch( data );
          this.$refs.title.focus();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消选择'
          });
        });
      },

      /**
       * 删除草稿
       */
      deleteDraft( name ) {
        const delDraftData = {
          key: name,
          sysCategory: parseInt(this.goodsCate.cid.split(",")[2]) === 0 ? parseInt(this.goodsCate.cid.split(",")[1]) : parseInt(this.goodsCate.cid.split(",")[2]),
          clientTimespan: this.clientTimespan
        };
        RemoveGoodsCache.call(this, delDraftData).then( res => {
          console.log(res);
          if (res.data.code === 1) {
            this.$message.success(res.data.data);
            this.getCacheArticleGoodsList();
          } else {
            this.$message.error(res.data.data);
          }
        });
      },

      /**
       * 是否选中是否是季节性商品的操作
       */
      isSeasonFun() {
        if ( this.ruleForm.isSeason === 0 ) {
          this.ruleForm.isSeason = 1;
        } else {
          this.ruleForm.isSeason = 0;
        }
      },

      /**
       * 上一步（返回）
       */
      goBack() {
        this.$router.go( -1 );
      },
    },
    created() {
      this.goodsCate = JSON.parse(sessionStorage.getItem('goodsCate')); // 获取商品类目的对象
      this.clientTimespan = this.$Tool.formatDate(new Date());
      this.getShopBrandList(); // 获取商品品牌数据
      this.getShopCategoryList( 0, 0 ); // 获取自定义分类数据
      this.getSpecSizeData(); // 获取商品规格数据
      this.getShopArticlePublishAttributes(); // 获取商品属性数据
      this.getProvinceList(); // 获取省级数据
      this.getGoodsPublishExpressInfo(); // 获取运费模板数据
      this.getShopExpenseInfo(); // 获取商家地址信息列表
      this.getDeliveryInstallationTemplateList(); // 获取安装模板数据
      this.editPublishGoodsInfo(); // 获取商品编辑信息
      this.getCacheArticleGoodsList(); // 获取草稿信息
    },


  }
</script>

<style lang="less" scoped>
  @import "./less/release.less";

  /deep/ input::-webkit-outer-spin-button,
  /deep/ input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  /deep/ input[type="number"]{
    -moz-appearance: textfield;
  }
  .price_table_center input::placeholder {
    color: red;
  }
</style>
