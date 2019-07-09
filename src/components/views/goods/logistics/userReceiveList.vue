<template>
  <!--用户自提列表-->
  <div class="container">
    <div class="remind">用户自提能更快促成交易，减少用户等待时间，若方便建议设置用户自提地点</div>
    <div class="btn"><el-button type="primary" icon="el-icon-circle-plus-outline" @click="userReceiveAdd">新增自提地点</el-button></div>

    <div class="charge" v-for="(item,index) in ChargeTableData" :key="index">
      <div class="main-title">
        <span>{{item.title}}</span>
        <ul class="main-title-right"><li>最后编辑时间：{{item.updateTime}}</li>
          <li @click="copy(item.id)">复制模板</li>
          <li @click="amend(item.id)">修改</li>
          <li @click="removeOne(item.id)">删除</li>
        </ul>
      </div>
      <div class="charge-table">
        <el-table :data="[item]" style="width: 100%" :border="true">
          <el-table-column label="自提地点">
            <template slot-scope="scope">
              <span>{{ scope.row.address }}</span>
            </template>
          </el-table-column>
          <el-table-column label="地图选点">
            <template slot-scope="scope">
              <span>
                <div>
                  <el-amap :vid="scope.$index" :zoom="zoom" :plugin="plugin" style="height: 100px;width: auto;" :center="[0,0]">
                    <el-amap-marker vid="component-marker" :position="[0,0]" :label="label"></el-amap-marker>
                  </el-amap>
                </div>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="营业时间">
            <template slot-scope="scope">
              <span>{{ scope.row.startTime }}-{{scope.row.endTime}}</span>
            </template>
          </el-table-column>
          <el-table-column label="贵宾专线">
            <template slot-scope="scope">
              <span>{{ scope.row.hotline }}</span>
            </template>
          </el-table-column>
          <el-table-column label="自提说明">
            <template slot-scope="scope">
              <span>{{ scope.row.remark }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

  </div>

</template>

<script>
  import oneSelfPack from '@/api/goods/logistics/GetOneselfPackList';
  import LogicDelOneselfPack from '@/api/goods/logistics/LogicDelOneselfPack';
  import CopyOneselfPack from '@/api/goods/logistics/CopyOneselfPack';
  export default {
    name: "userReceiveList",
    data(){
      // let self = this;
      return{
        // ChargeTableData:[{area:'重庆市江北区北城艺术大厦22楼',area:'重庆；安徽省：芜湖、合肥；天津(所有地区)',date:'9:00-21:00',phone:'12345678911',explain:'自提点收取的定金分别为20%或100%，自提时支付余额'}],
        ChargeTableData: [],
        plugin: [{
          pName: 'Geolocation',
          events: {
            init(o) {
              // o 是高德地图定位插件实例
              o.getCurrentPosition((status, result) => {
                // if (result && result.position) {
                //   self.lng = result.position.lng;
                //   self.lat = result.position.lat;
                //   self.center = [self.lng, self.lat];
                //   self.loaded = true;
                //   self.$nextTick();
                // }
              });
            }
          }
        }],
        zoom:12,
        label: {
          content: '',
          offset: [10, 12]
        },
      }
    },
    methods:{
      //用户自提新增
      userReceiveAdd(){
        this.$router.push({name:'UserReceiveAdd'});
      },
      //修改
      amend(id){
        this.$router.push({name: 'UserReceiveAdd', query: { id: id }});
      },
      //复制
      copy(id){
        let param = {
          oneselfPackId: id,
          clientVersion: "v1.0",
          clientTimespan: this.$Tool.formatDate(new Date())
        }
        CopyOneselfPack.call(this, param).then(res=>{
          if(res.data.code === 1){
            this.$message.success(res.data.desc);
            this.getTableData();
          }else{
            this.$message.error(res.data.desc);
          }
        })
      },
      //获取自提点列表
      getTableData(){
        oneSelfPack.call(this,`?clientVersion=v1&clientTimespan=${this.$Tool.formatDate(new Date())}`).then(res=>{
          if(res.data.code===1){
            this.ChargeTableData = res.data.data;
          }else{
            this.$message.error(res.data.desc);
          }
        })
      },
      //删除自提点
      removeOne(id){
        this.$confirm('确定删除该自提点?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = {
            oneselfPackId: id,
            clientVersion: "v1.0",
            clientTimespan: this.$Tool.formatDate(new Date())
          }
          LogicDelOneselfPack.call(this,param).then(res=>{
            if(res.data.code === 1){
              this.getTableData();
              this.$message.success(res.data.desc);
            }else{
              this.$message.error(res.data.desc);
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    },
    created(){
      this.$parent.change('用户自提');
      this.getTableData();
    },
  }
</script>
<style lang="less" scoped>
  @import "less/userReceiveList.less";
</style>
