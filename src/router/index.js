import Vue from 'vue'
import Router from 'vue-router'


import Login from '@/components/views/login/login'

// 首页
import Index from '@/components/views/index'

// 店铺资料
import Shop from '@/components/views/shop/index'
import Basic from '@/components/views/shop/basic/index'
import CompanyInfo from '@/components/views/shop/basic/companyInfo'
import StoreShop from '@/components/views/shop/basic/storeShop'
import AccountInfo from '@/components/views/shop/basic/accountInfo'
import StoreState from '@/components/views/shop/basic/storeState'
import ShopReputation from '@/components/views/shop/basic/shopReputation'
import BelieveRecord from '@/components/views/shop/believeRecord'
import CreditRecord from '@/components/views/shop/creditRecord'

//证照资质
import License from '@/components/views/shop/license/index'
import StateRemind from '@/components/views/shop/license/stateRemind'
import Amend from '@/components/views/shop/license/amend'
import AuditList from '@/components/views/shop/license/auditList'
import ChangeList from '@/components/views/shop/license/changeList'

// 经营范围
import Range from '@/components/views/shop/range/index'
import RangeMain from '@/components/views/shop/rangeMain'
import RangeIndex from '@/components/views/shop/range/rangeIndex'
import Certificates from '@/components/views/shop/range/certificates'

//切换店铺，激活店铺
import ShopChange from  '@/components/views/shop/store/shopChange'
import StoreIndex from '@/components/views/shop/store/index'
import Freeze from  '@/components/views/shop/store/freeze'
import Close from  '@/components/views/shop/store/close'
import StoreCompanyInfor from '@/components/views/shop/store/companyInfor'
import StoreShopInfor from '@/components/views/shop/store/shopInfor'

//更新资料
import UpdataIndex from  '@/components/views/shop/updata/index'
import UpdataCompany from  '@/components/views/shop/updata/updataCompany'
import UpdataShop from  '@/components/views/shop/updata/updataShop'
import UpdataBank from  '@/components/views/shop/updata/updataBank'




// 合同管理
import Contract from '@/components/views/shop/contract/index'
// import ContractIndex from '@/components/views/shop/contract/contractIndex'
import Bond from '@/components/views/shop/contract/bond'
import Fee from '@/components/views/shop/contract/fee'
// import agreement from '@/components/views/shop/contract/agreement'
import costShow from '@/components/views/shop/contract/costShow'

// 商品管理
import Goods from '@/components/views/goods/index'
import GoodsMain from '@/components/views/goods/main'
import GoodsReleaseClass from '@/components/views/goods/releaseClass'
import GoodsRelease from '@/components/views/goods/release'
import GoodsDetail from '@/components/views/goods/goodsDetail'
import GoodsRecycleBin from '@/components/views/goods/goodsRecycleBin'
import GoodsShopAuth from '@/components/views/goods/shopAuth'
import BrandManage  from '@/components/views/goods/brandManage'
import BrandAdd  from '@/components/views/goods/brandAdd'
import BrandImpower  from '@/components/views/goods/brandImpower'
import GoodsClassify  from '@/components/views/goods/goodsClassify'

//物流设置
import LogisticsIndex from  '@/components/views/goods/logistics/index'

//物流
import Logistics from  '@/components/views/goods/logistics/logistics'
import LogisticsFree from  '@/components/views/goods/logistics/logisticsFree'
import LogisticsCharge from  '@/components/views/goods/logistics/logisticsCharge'
import LogisticsList from  '@/components/views/goods/logistics/logisticsList'
// import ExpressFree from  '@/components/views/goods/logistics/expressFree'
// import ExpressCharge from  '@/components/views/goods/logistics/expressCharge'
// import ExpressList from  '@/components/views/goods/logistics/expressList'
import MerchantSend from  '@/components/views/goods/logistics/merchantSend'
import UserReceiveAdd from  '@/components/views/goods/logistics/userReceiveAdd'
import UserReceiveList from  '@/components/views/goods/logistics/userReceiveList'

//配送安装
import DispatchInstall from  '@/components/views/goods/logistics/dispatchInstall'
import DispatchSet from  '@/components/views/goods/logistics/dispatchSet'
import DispatchList from  '@/components/views/goods/logistics/dispatchList'

//地址管理
import AreaManage from  '@/components/views/goods/logistics/areaManage'


//交易管理
import OrderManage from '@/components/views/OrderManage/index'
import OrderList  from '@/components/views/OrderManage/orderManage/'
import AfterSale  from '@/components/views/OrderManage/afterSale/'
import AfterSaleDetails  from '@/components/views/OrderManage/afterSaleDetails/'

import SaleAfter  from '@/components/views/OrderManage/saleAfter/'

import Printer from '@/components/views/OrderManage/printer'
import Details from '@/components/views/OrderManage/Details'
import Ship from '@/components/views/OrderManage/Ship'
import LogisticsDetails from '@/components/views/OrderManage/logisticsDetails'

import zhiXunGuanLi from '@/components/views/OrderManage/zhiXunGuanLi'




//经营分析
import ManageIndex  from '@/components/views/analyze/index'
import ManageAnalyze  from '@/components/views/analyze/manageAnalyze'

//帮助中心
import Help from '@/components/views/help/index'
import Problem from '@/components/views/help/problem'
import RuleHouse  from '@/components/views/help/ruleHouse'
import Menu from '@/components/views/help/common/menu'
import Regularmap from "@/components/views/help/regularmap"
import Issue from "@/components/views/help/issue"

//客户服务
import Client from '@/components/views/client/index'
import CommentManage from '@/components/views/client/commentManage'
import QuestionList from '@/components/views/client/questionList'
import PlatformIntervene from '@/components/views/client/platformIntervene'
import InterveneResult from '@/components/views/client/interveneResult'
import TradeDispute from '@/components/views/client/tradeDispute'
import TradeDisputeDispose from '@/components/views/client/tradeDisputeDispose'
import Suggest from '@/components/views/client/suggest'
import Inform from '@/components/views/client/inform'
import Submit from '@/components/views/client/submit'
import SuggestInformDetails from '@/components/views/client/suggestInformDetails'



// 营销推广
import Market from '@/components/views/market/index'
import MarketPropaganda from '@/components/views/market/propaganda'
import MarketDiscount from '@/components/views/market/discount/index'
import MarketDiscountMain from '@/components/views/market/discount/main'
import GoodsDiscount from '@/components/views/market/discount/goodsDiscount'
import AddDiscount from '@/components/views/market/discount/addDiscount'
import GiftPromotion from '@/components/views/market/discount/giftPromotion'
import AddGift from '@/components/views/market/discount/addGift'
import AddFullGift from '@/components/views/market/discount/addFullGift'
import AddFixedGift from '@/components/views/market/discount/addFixedGift'
import AddBuyAndGift from '@/components/views/market/discount/addBuyAndGift'

import DiscountList from '@/components/views/market/discount/discountList'
import AddGoodsDiscount from '@/components/views/market/discount/addGoodsDiscount'
import LookGoodsDiscount from '@/components/views/market/discount/lookGoodsDiscount'

import CouponList from '@/components/views/market/discount/couponList'
import AddGoodsCoupon from '@/components/views/market/discount/addGoodsCoupon'
import LookGoodsCoupon from '@/components/views/market/discount/lookGoodsCoupon'

import FreeShippingList from '@/components/views/market/discount/freeShippingList'
import AddFreeShipping from '@/components/views/market/discount/addFreeShipping'

import FullRefundList from '@/components/views/market/discount/fullRefundList'
import AddFullRefund from '@/components/views/market/discount/addFullRefund'

import SpecialPromotionList from '@/components/views/market/discount/specialPromotionList'
import AddSpecialPromotion from '@/components/views/market/discount/addSpecialPromotion'

import SetUpShop from '@/components/views/market/setUpShop'
import IncrementService from '@/components/views/market/incrementService'
import MarketArticle from '@/components/views/market/article/index'
import MarketArticleMain from '@/components/views/market/article/articleList'
import AddArticle from '@/components/views/market/article/addArticle'
import ArticleDetail from '@/components/views/market/article/articleDetail'
import MjHeadlines from '@/components/views/market/article/mjHeadlines'


//平台优惠
import MjDiscounts from '@/components/views/market/mjDiscounts/index'
import InfoCenter from '@/components/views/market/mjDiscounts/infoCenter'
import DiscountsList from '@/components/views/market/mjDiscounts/discountsList'
import SetDiscount from '@/components/views/market/mjDiscounts/SetDiscount'
import activity from '@/components/views/market/mjDiscounts/activity'
import FullReduction from '@/components/views/market/mjDiscounts/FullReduction'





// 会员管理
import Membershouye from '@/components/views/member/membershouye'
import Memberindex from '@/components/views/member/memberindex'
import Shopmember from '@/components/views/member/shopmember'
import Discount from '@/components/views/member/discount'
import Addmember from '@/components/views/member/addmember'
import Increase from '@/components/views/member/increase'
import Attribute from '@/components/views/member/attribute'
import Upgrade from '@/components/views/member/upgrade'
import Numberdetails from '@/components/views/member/numberdetails'
import Setup from '@/components/views/member/setup'
import Integral from '@/components/views/member/integral'
import Give from '@/components/views/member/give'
import Addmembers from '@/components/views/member/addmembers'



// 系统消息
import SysMessage from '@/components/views/sysMessage/index'
import SysMessageList from '@/components/views/sysMessage/sysMessageList'
import SysMessageDetail from '@/components/views/sysMessage/sysMessageDetail'
import ChildAccount from '@/components/views/sysMessage/childAccount'
import PermissionManage from '@/components/views/sysMessage/PermissionManage'
import PermissionDetail from '@/components/views/sysMessage/PermissionDetail'

import ConsultingSettings from '@/components/views/sysMessage/ConsultingSettings'

//资金管理
import Capital from '@/components/views/capital/index'
import SettlementManagement from '@/components/views/capital/settlementmanagement'
import CashIndex from '@/components/views/capital/cash/index'
import CashManagement from '@/components/views/capital/cash/cashmanagement'
import AccountFlow from '@/components/views/capital/accountflow'
import Paymentmanagement from '@/components/views/capital/paymentmanagement'
import Zhuanzhang from '@/components/views/capital/transfer/zhuanzhang'
import Xufei from '@/components/views/capital/transfer/xufei'
import Tixian from '@/components/views/capital/cash/tixian'
import bankLegal from '@/components/views/capital/cash/bankLegal'
import accountDetail from '@/components/views/capital/cash/accountDetail'
import TransferList from '@/components/views/capital/transfer/transferList'
import TransferDetail from '@/components/views/capital/transfer/transferDetail'

import bankChange from '@/components/views/capital/cash/bankChange/index'
import changeDesc from '@/components/views/capital/cash/bankChange/changeDesc'
import agentInfo from '@/components/views/capital/cash/bankChange/agentInfo'
import changeCompanyInfo from '@/components/views/capital/cash/bankChange/changeCompanyInfo'
import changeBankInfo from '@/components/views/capital/cash/bankChange/changeBankInfo'
import applyUpload from '@/components/views/capital/cash/bankChange/applyUpload'
import reviewStatus from '@/components/views/capital/cash/bankChange/reviewStatus'
import sendInfo from '@/components/views/capital/cash/bankChange/sendInfo'
import sendDesc from '@/components/views/capital/cash/bankChange/sendDesc'


//平台管理
import FeeStandard from '@/components/views/contractManage/Fee'

//上传图片测试
import test from '@/components/views/goods/test'

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    // 首页（wenpeifan）
    { path: '/', name: 'Login', component: Login, meta: {title: '', hideCrumbs: true} },

    { path: '/index', name: 'Index', component: Index, meta: {title: '首页', hideCrumbs: true} },

    { path: '/test', name: 'test', component: test, meta: {title: 'test', hideCrumbs: true} },


    //切换店铺
    {path: '/shopChange', name: 'ShopChange', component: ShopChange, meta: {title: '关联账户', icon: '', isShow: false},},

    {path: '/storeIndex', component: StoreIndex, meta: {title: '', icon: '', isShow: false },children:
        [
          {path: 'freeze', name:'Freeze', component: Freeze, meta: {title: '冻结', icon: '', isShow: false , }},
          {path: 'close', name:'Close', component: Close, meta: {title: '关闭', icon: '', isShow: false , }},
          {path: 'storeCompanyInfor', name:'StoreCompanyInfor', component: StoreCompanyInfor, meta: {title: '确认公司信息', icon: '', isShow: false }},
          {path: 'storeShopInfor', name:'StoreShopInfor', component: StoreShopInfor, meta: {title: '确认公司信息', icon: '', isShow: false , }},

        ]

    },


    // 店铺资料
    {
      path: '/shop', component: Shop, redirect: '/shop/basic', meta: {title: '店铺资料', icon: '', isShow: true}, children:
        [
          // 基本资料（wenpeifan）
          { path: 'basic', name: 'Basic', component: Basic, meta: {title: '基本资料', isShow: true, id: 23904}, children:
              [
                { path: '/', name: 'CompanyInfo', component: CompanyInfo, meta: {title: '公司信息'} },
                { path: 'storeShop', name: 'StoreShop', component: StoreShop, meta: {title: '店铺信息'} },
                { path: 'accountInfo', name: 'AccountInfo', component: AccountInfo, meta: {title: '账户信息'} },
                { path: 'storeState', name: 'StoreState', component: StoreState, meta: {title: '店铺状态'} },
                { path: 'shopReputation', name: 'ShopReputation', component: ShopReputation, meta: {title: '商家信誉'} },
                {path: '/updataIndex', name:'UpdataIndex',component: UpdataIndex, meta: {title: '资料更新', icon: '', isShow: false},children:
                    [
                      { path: '/', name: 'UpdataCompany', component: UpdataCompany, meta: {title: '资料更新', isShow: false}},
                      { path: 'updataShop', name: 'UpdataShop', component: UpdataShop, meta: {title: '', isShow: false}},
                      { path: 'updataBank', name: 'UpdataBank', component: UpdataBank, meta: {title: '', isShow: false}},

                    ]
                },
              ]
          },
          { path: 'believeRecord', name: 'BelieveRecord', component: BelieveRecord, meta: {title: '查看信用记录', isShow: false} },
          { path: 'creditRecord', name: 'CreditRecord', component: CreditRecord, meta: {title: '查看信誉记录', isShow: false} },


          // 经营范围（LY）
          { path: 'rangeMain', name: 'RangeMain', component: RangeMain, meta: {title: '经营范围', isShow: true, id: 23905} },
          { path: 'range', name: 'Range', component: Range, meta: {title: '经营范围', id: 23905}, children:
              [
                { path: '/', name: 'RangeIndex', component: RangeIndex, meta: {title: '经营范围'} },
                { path: 'certificates', name: 'Certificates', component: Certificates, meta: {title: '资质证件'} },
              ]
          },

          // 合同管理（LY）
          { path: 'contract', name: 'Contract', component: Contract, meta: {title: '合同管理', isShow: true, id: 23906}, children:
              [
                // { path: '/', name: 'ContractIndex', component: ContractIndex, meta: {title: '合同管理'} },
                { path: 'bond', name: 'Bond', component: Bond, meta: {title: '保证金'} },
                { path: 'fee', name: 'Fee', component: Fee, meta: {title: '平台使用年费'} },
              ]
          },
          // { path: 'agreement', name: 'agreement', component: agreement, meta: {title: '合同续约—看合约'} },
          { path: 'costShow', name: 'costShow', component: costShow, meta: {title: '合同续约—费用展示'} },

          //证照资质(AP)
          { path: 'license', name: 'License', component: License, meta: {title: '证照资质', isShow: true, id: 23907},children:
              [
                {path:'/', name: 'StateRemind', component: StateRemind,meta: {title: '证照资质'}},
                {path:'amend', name: 'Amend', component: Amend,meta: {title: '证照资质'}},
                {path:'auditList', name: 'AuditList', component: AuditList,meta: {title: '年审记录'}},
                {path:'changeList', name: 'ChangeList', component: ChangeList,meta: {title: '变更记录'}},

              ]

          },

        ]
    },

    // 发布商品
    {
      path: '/goods', component: Goods, meta: {title: '发布商品', icon: '', isShow: true}, children:
        [
          { path: '/', name: 'GoodsMain', component: GoodsMain, meta: {title: '商品管理', isShow: true, id: 23909,} },
          { path: 'releaseClass', name: 'GoodsReleaseClass', component: GoodsReleaseClass, meta: {title: '商品发布', isShow: true, id: 23910,} },
          { path: 'release', name: 'GoodsRelease', component: GoodsRelease, meta: {title: '发布商品', id: 23910,} },
          { path: 'goodsDetail', name: 'GoodsDetail', component: GoodsDetail, meta: {title: '商品详情', id: 23909,} },
          { path: 'goodsRecycleBin', name: 'GoodsRecycleBin', component: GoodsRecycleBin, meta: {title: '商品回收站', id: 23909,} },
          { path: 'shopAuth', name: 'GoodsShopAuth', component: GoodsShopAuth, meta: {title: '商家认证', id: 23910,} },
          { path: 'brandManage', name: 'BrandManage', component: BrandManage, meta: {title: '发布品牌',isShow:true, id: 23911} },
          { path: 'brandAdd', name: 'BrandAdd', component: BrandAdd, meta: {title: '新增品牌',isShow:false, id: 23911} },
          { path: 'brandImpower', name: 'BrandImpower', component: BrandImpower, meta: {title: '品牌授权',isShow:false, id: 23911} },
          { path: 'goodsClassify', name: 'GoodsClassify', component: GoodsClassify, meta: {title: '商品分类',isShow:true, id: 23912} },

          //物流设置
          { path: 'logisticsIndex', name: 'LogisticsIndex', component: LogisticsIndex, meta: {title: '物流设置',isShow:true, id: 23913},children:
            [
              {path: '/', name: 'Logistics', component: Logistics, meta: {title: '',isShow:false},children:
                [
                  {path: '/', name: 'LogisticsList', component: LogisticsList, meta: {title: '',isShow:false}},
                  {path: 'logisticsFree', name: 'LogisticsFree', component: LogisticsFree, meta: {title: '',isShow:false}},
                  {path: 'logisticsCharge', name: 'LogisticsCharge', component: LogisticsCharge, meta: {title: '',isShow:false}},
                  {path: 'merchantSend', name: 'MerchantSend', component: MerchantSend, meta: {title: '',isShow:false}},
                  {path: 'userReceiveAdd', name: 'UserReceiveAdd', component: UserReceiveAdd, meta: {title: '',isShow:false}},
                  {path: 'userReceiveList', name: 'UserReceiveList', component: UserReceiveList, meta: {title: '',isShow:false}},

                ]
              },
              {path: 'dispatchInstall', name: 'DispatchInstall', component: DispatchInstall, meta: {title: '',isShow:false},children:
                [
                  {path: 'dispatchSet', name: 'DispatchSet', component: DispatchSet, meta: {title: '',isShow:false}},
                  {path: 'dispatchList', name: 'DispatchList', component: DispatchList, meta: {title: '',isShow:false}},
                ]
              },
              {path: 'areaManage', name: 'AreaManage', component: AreaManage, meta: {title: '',isShow:false}}
            ]
          },
        ]
    },

    // 交易管理
    {
      path:'/OrderManage', name: 'OrderManage', component: OrderManage, meta:{title: '交易管理', icon: '', isShow: true}, children:[
        {path:'OrderList', name:'OrderList', component: OrderList, meta: {title: '订单管理', icon: '', isShow: true, id: 23915,}},
        {path:'afterSale', name:'AfterSale', component: AfterSale, meta: {title: '订单管理', icon: '', isShow: false, id: 23915,}},
        // {path:'afterSaleDetails', name: 'AfterSaleDetails', component: AfterSaleDetails, meta: {title: '售后详情', isShow: false}},
        {path:'saleAfter', name: 'SaleAfter', component: SaleAfter, meta: {title: '订单管理', isShow: false, id: 23915,}},
        {path:'zhiXunGuanLi', name: 'zhiXunGuanLi', component: zhiXunGuanLi, meta: {title: '咨询管理', isShow: true, id: 23916,}},




        {path:'Details',name:'Details' ,component: Details, meta: {title: '订单详情', icon: '', isShow: false, id: 23915,}},
        {path:'printer',name:'Printer', component: Printer, meta: {title: '打印发货单', icon: '', isShow: false, id: 23915,}},
        {path:'ship',name:'Ship', component: Ship, meta: {title: '发货', icon: '', isShow: false, id: 23915,}},
        {path:'logisticsDetails',name:'LogisticsDetails', component: LogisticsDetails, meta: {title: '查看物流信息', icon: '', isShow: false, id: 23915,}},

      ]
    },

    //经营分析
    {
      path:'/manageIndex',component:ManageIndex,meta:{title: '经营分析', icon: '', isShow: true},children:[
        {path:'manageAnalyze',name:'ManageAnalyze', component: ManageAnalyze, meta: {title: '经营分析', icon: '', isShow: true, id: 23918}}
        ]
    },

    //帮助中心
    {
      path:'/help',component:Help,meta:{title: '帮助中心', icon: '', isShow: true},children:[
        {path:'problem',name:'Problem', component: Problem, meta: {title: '常见问题', icon: '', isShow: true, id: 23920},children:[
            {path:'/',name:'Regularmap',component:Regularmap,meta:{title:'常见问题',isShow: false}},
            {path:'ruleHouse',name:'RuleHouse', component: RuleHouse, meta: {title: '常见问题', icon: '', isShow: false}},
            {path:'menu',name:'Menu',component:Menu,meta:{title:'导航',isShow: false}},
         ]},
         {path:'issue',name:'issue',component:Issue,meta:{title:'议题详情',isShow: false, id: 23920}},

      ]
    },

    // 营销推广
    {
      path: '/market', component: Market, meta: {title: '营销推广', icon: '', isShow: true}, children:
        [
          { path: 'propaganda', name: 'MarketPropaganda', component: MarketPropaganda, meta: {title: '我要宣传', isShow: true, id: 23922} },
          { path: 'discount', name: 'MarketDiscount', component: MarketDiscount, meta: {title: '发布优惠', isShow: true, id: 23923}, children:
              [
                { path: '/', name: 'MarketDiscountMain', component: MarketDiscountMain, meta: {title: '发布优惠'} },
                { path: 'goodsDiscount', name: 'GoodsDiscount', component: GoodsDiscount, meta: {title: '商品折扣'} },
                { path: 'addDiscount', name: 'AddDiscount', component: AddDiscount, meta: {title: '折扣活动'} },
                { path: 'giftPromotion', name: 'GiftPromotion', component: GiftPromotion, meta: {title: '赠品促销'} },
                { path: 'addGift', name: 'AddGift', component: AddGift, meta: {title: '赠品信息'} },
                { path: 'addFullGift', name: 'AddFullGift', component: AddFullGift, meta: {title: '添加满赠活动'} },
                { path: 'addFixedGift', name: 'AddFixedGift', component: AddFixedGift, meta: {title: '添加指定赠活动'} },
                { path: 'addBuyAndGift', name: 'AddBuyAndGift', component: AddBuyAndGift, meta: {title: '添加买几赠几活动'} },

                { path: 'discountList', name: 'DiscountList', component: DiscountList, meta: {title: '折扣券'} },
                { path: 'addGoodsDiscount', name: 'AddGoodsDiscount', component: AddGoodsDiscount, meta: {title: '添加/编辑折扣券'} },
                { path: 'lookGoodsDiscount', name: 'LookGoodsDiscount', component: LookGoodsDiscount, meta: {title: '查看折扣券'} },

                { path: 'couponList', name: 'CouponList', component: CouponList, meta: {title: '优惠券'} },
                { path: 'addGoodsCoupon', name: 'AddGoodsCoupon', component: AddGoodsCoupon, meta: {title: '添加/编辑优惠券'} },
                { path: 'lookGoodsCoupon', name: 'LookGoodsCoupon', component: LookGoodsCoupon, meta: {title: '查看优惠券'} },

                { path: 'freeShipping', name: 'FreeShippingList', component: FreeShippingList, meta: {title: '包邮促销'} },
                { path: 'addFreeShipping', name: 'AddFreeShipping', component: AddFreeShipping, meta: {title: '添加包邮'} },

                { path: 'fullRefundList', name: 'FullRefundList', component: FullRefundList, meta: {title: '满额返券'} },
                { path: 'addFullRefund', name: 'AddFullRefund', component: AddFullRefund, meta: {title: '满额返券'} },

                { path: 'specialPromotionList', name: 'SpecialPromotionList', component: SpecialPromotionList, meta: {title: '特价促销'} },
                { path: 'addSpecialPromotion', name: 'AddSpecialPromotion', component: AddSpecialPromotion, meta: {title: '添加特价促销'} },
              ]
          },
          { path: 'setUpShop', name: 'SetUpShop', component: SetUpShop, meta: {title: '推荐开店', isShow: true, id: 23924} },
          { path: 'incrementService', name: 'IncrementService', component: IncrementService, meta: {title: '增值服务', isShow: true, id: 23925} },
          { path: 'article', name: 'MarketArticle', component: MarketArticle, meta: {title: '文章分享', isShow: true, id: 23926}, children:
              [
                { path: '/', name: 'MarketArticleMain', component: MarketArticleMain, meta: {title: '文章分享'} },
                { path: 'addArticle', name: 'AddArticle', component: AddArticle, meta: {title: '文章发布/编辑'} },
                { path: 'articleDetail', name: 'ArticleDetail', component: ArticleDetail, meta: {title: '文章详情'} },
                { path: 'mjHeadlines', name: 'MjHeadlines', component: MjHeadlines, meta: {title: '满集头条'} },
              ]
          },
          {path: 'mjDiscounts', name: 'MjDiscounts', component: MjDiscounts, meta: {title: '平台优惠', isShow: true, id: 23927}, children:
            [
              // { path: 'infoCenter', name: 'InfoCenter', component: InfoCenter, meta: {title: '消息中心'} },
              { path: '/', name: 'DiscountsList', component: DiscountsList, meta: {title: '平台优惠'} },
              { path: 'SetDiscount', name: 'SetDiscount', component: SetDiscount, meta: {title: '设置折扣'} },
              { path: 'activity', name: 'activity', component: activity, meta: {title: '活动介绍'} },
            ]
          },



        ]
    },

    //客户服务
	{
      path: '/client', component: Client, meta: {title: '客户服务', icon: '', isShow: true}, children:
        [
          { path: '/', name: 'CommentManage', component: CommentManage, meta: {title: '评论管理', isShow: true, id: 23929,} },
          { path: 'questionList', name: 'QuestionList', component: QuestionList, meta: {title: '评论管理', isShow: false, id: 23929,} },
          { path: 'platformIntervene', name: 'PlatformIntervene', component: PlatformIntervene, meta: {title: '申请介入', isShow: false, id: 23929} },
          { path: 'interveneResult', name: 'InterveneResult', component: InterveneResult, meta: {title: '介入详情', isShow: false, id: 23929} },
          { path: 'tradeDispute', name: 'TradeDispute', component: TradeDispute, meta: {title: '交易纠纷', isShow: true, id: 23929} },
          { path: 'tradeDisputeDispose', name: 'TradeDisputeDispose', component: TradeDisputeDispose, meta: {title: '交易纠纷详情', isShow: false,id: 23929} },
          { path: 'suggest', name: 'Suggest', component: Suggest, meta: {title: '我要建议', isShow: true, id: 23930} },
          { path: 'inform', name: 'Inform', component: Inform, meta: {title: '我要举报', isShow: true, id: 23931} },
          { path: 'submit', name: 'Submit', component: Submit, meta: {title: '我要建议，我要举报', isShow: false, id: 23930} },
          { path: 'suggestInformDetails', name: 'SuggestInformDetails', component: SuggestInformDetails, meta: {title: '建议详情，举报详情', isShow: false, id: 23930} },


        ]
    },
    // 会员管理
    {
      path:'/membershouye',component:Membershouye,meta:{title:'会员管理',icon:'',isShow:true},children:
      [
        {path:'memberindex',name:'memberindex',component:Memberindex,meta: {title: '店铺会员', isShow: true, id: 23934}},
        {path:'integral',name:'integral',component:Integral,meta:{title: '店铺积分', isShow: false, id: 23934}},
        {path:'discount',name:'discount',component:Discount,meta:{title: '会员优惠', isShow: false, id: 23934}},
        {path:'addmember',name:'addmember',component:Addmember,meta:{title:'会员添加', isShow: false, id: 23934}},
        {path:'setup',name:'setup',component:Setup,meta:{title:'会员设置', isShow: false, id: 23934}},
        {path:'shopmember',name:'shopmember',component:Shopmember,meta:{title:'店铺会员', isShow: false, id: 23934}},
        {path:'numberdetails',name:'numberdetails',component:Numberdetails,meta:{title:'会员详情',isShow: false, id: 23934}},
        {path:'upgrade',name:'upgrade',component:Upgrade,meta:{title:'升级赠礼',isShow: false, id: 23934}},
        {path:'attribute',name:'attribute',component:Attribute,meta:{title:'用户属性',isShow: false, id: 23934}},
        {path:'increase',name:'increase',component:Increase,meta:{title:'用户增长',isShow: false, id: 23934}},
        {path:'give',name:'give',component:Give,meta:{title:'赠送详情',isShow: false, id: 23934}},
        {path:'addmembers',name:'addmembers',component:Addmembers,meta:{title:'开通会员',isShow: false, id: 23934}},
      ]
    },


    //  资金管理
    {
      path: '/capital', name: 'Capital', component: Capital, redirect: { name: 'SettlementManagement' }, meta: {title: '资金管理', isShow: true}, children:
        [
          {path: 'settlementManagement', name: 'SettlementManagement', component: SettlementManagement, meta: {title: '结算管理', isShow: true, id: 23936}},
          {path: 'cashIndex', name: 'cashIndex', component: CashIndex, meta: {title: '提现管理', isShow: true, id: 23937}, children:
            [
              {path: '/', name: 'CashManagement', component: CashManagement, meta: {title: '提现管理'}},
              {path: 'tixian', name: 'Tixian', component:Tixian, meta: {title: '申请提现'}},
              {path: 'bankLegal', name: 'bankLegal', component:bankLegal, meta: {title: '查看银行卡'} },
              {path: 'accountDetail', name: 'accountDetail', component:accountDetail, meta: {title: '账户详情(公司)'} },
              {path: 'bankChange', name: 'BankChange', component:bankChange, meta: {title: '更换银行卡'}, children: [
                  {path: '' , name: 'ChangeDesc', component: changeDesc, meta: {title: '说明'}},
                  {path: 'agentInfo' , name: 'AgentInfo', component: agentInfo, meta: {title: '授权代理人信息'}},
                  {path: 'changeCompanyInfo' , name: 'ChangeCompanyInfo', component: changeCompanyInfo, meta: {title: '修改公司信息'}},
                  {path: 'changeBankInfo' , name: 'ChangeBankInfo', component: changeBankInfo, meta: {title: '修改银行卡信息'}},
                  {path: 'applyUpload' , name: 'ApplyUpload', component: applyUpload, meta: {title: '上传申请表'}},
                  {path: 'reviewStatus' , name: 'ReviewStatus', component: reviewStatus, meta: {title: '审核状态'}},
                  {path: 'sendInfo' , name: 'SendInfo', component: sendInfo, meta: {title: '物流信息'}},
                  {path: 'sendDesc' , name: 'SendDesc', component: sendDesc, meta: {title: '寄送说明'}},
                ]
              },
            ]
          },
          {path: 'accountFlow', name: 'AccountFlow', component: AccountFlow, meta: {title: '账户流水', isShow: true, id: 23938}},
          {path: 'paymentmanagement', name: 'Paymentmanagement', component: Paymentmanagement, meta: {title: '支付管理', isShow: true, id: 23939}, children:
              [
                { path: '/', name: 'TransferList', component: TransferList, meta: {title: '店铺转账'}},
                { path: 'zhuanzhang', name: 'Zhuanzhang', component: Zhuanzhang, meta: {title: '转账给用户'}},
                { path: 'transferDetail', name: 'TransferDetail', component: TransferDetail, meta: {title: '转账详情'}},
                { path: 'xufei', name: 'Xufei', component: Xufei, meta: {title: '店铺续费'}},
              ]
          },
        ]
    },

    // 系统消息
    {
      path: '/sysMessage', component: SysMessage ,meta: {title: '系统消息', icon: '', isShow: true}, children: [
        { path: '/', name: 'SysMessageList', component: SysMessageList, meta: {title: '系统消息', icon: '', isShow: true, id: 23941} },
        { path: 'sysMessageDetail', name: 'SysMessageDetail', component: SysMessageDetail, meta: {title: '消息详情', icon: '', isShow: false, id: 23941} },
        { path: 'childAccount', name: 'ChildAccount', component: ChildAccount, meta: {title: '子账号管理', icon: '', isShow: true, id: 23942} },
        { path: 'permissionManage', name: 'PermissionManage', component: PermissionManage, meta: {title: '权限管理', icon: '', isShow: true, id: 23943} },
        { path: 'permissionDetail', name: 'PermissionDetail', component: PermissionDetail, meta: {title: '权限管理', icon: '', isShow: false, id: 23943} },

        { path: 'ConsultingSettings', name: 'ConsultingSettings', component: ConsultingSettings, meta: {title: '咨询设置', icon: '', isShow: true, id: 23944} },
      ]
    },
    //平台
    {
      path: '/contractManage/fee', name: 'FeeStandard', component: FeeStandard, meta: {title: '系统消息', icon: '', isShow: false},
    },

  ]
})
