<template>
    <div class="Issue">
    <div class="top">
     <h2>关于新增《可食用类违禁添加技术规范》相关规则公开征求意见</h2>
     <p>2019-02-25 20:46:07 发表</p>
     <hr>
    </div>
    <div class="middle">
        <h3>背景说明</h3>
        <p style="marginBottom:40px;">为了进一步加强对天猫商品品质的管理，从而切实保障消费者的人身、财产安全，天猫将新增可食用类产品违禁添加技术规范及抽检实施细则，现就规则内容，广泛征集各位意见</p>
        <h3>审议内容</h3>
        <p>1.除国家批准外，平台上的可食用商品均不得含有违禁添加成分；</p>
        <p style="marginBottom:40px;">2.无标准归类的商品，增加重金属和微生物安全性指标。</p>
        <h4>具体内容如下</h4>
        <p>新增 <span>《可食用类产品违禁添加技术规范》</span> </p>
        <p>新增 <span>《可食用类产品违禁类药物添加抽检实施细则》</span> </p>
        <p style="marginTop:40px;marginBottom:40px;">针对本次规则的调整，您可以通过点击页面右侧选项进行投票。</p>
        <hr>
    </div>
    <div class="bottom">
        <p>针对上述规则调整，您认为：</p>
        <p style="marginTop:25px;">
        <el-radio v-model="radio" label="1">赞同</el-radio>
        <el-radio v-model="radio" label="2">反对</el-radio>
        </p>
        <p style="marginTop:25px;">
        <el-button type="primary">提交</el-button>
        </p>
        
    </div>
    </div>
</template>

<script>
export default {
data(){
    return {
        radio:''
    }
}
}
</script>

<style lang="less">
.Issue{
    height: 1070px;
    background: #fff;
    padding: 30px 0 0 40px;
    .top{
        h2{
            color:#00a2ff;
            margin-bottom: 10px;
        }
        p{
            color:#999999;
            margin-bottom: 20px;
        }
    }
    .middle{
        margin-top: 15px;
        span{
            color:#00a2ff;
        }
    }
    .bottom{
        margin-top: 40px;
    }
   
}
</style>
