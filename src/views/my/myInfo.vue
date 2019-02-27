<template>
    <div class="myInfo">
        <van-cell-group>
            <van-cell title="头像" ><img :src="head_img" width="30" /></van-cell>
            <van-cell title="昵称"  is-link :value="nickname" @click="nicheng=true"></van-cell>
            <van-cell title="性别" value="1" is-link :value="sex" @click="showSex=true"></van-cell>
            <!--<van-cell title="地址"  is-link :value="address" @click="showAddress=true"></van-cell>-->
            <van-cell title="生日" value="1" is-link  :value="birth" @click="showBirth=true"></van-cell>
            <van-cell title="支付密码" is-link @click="phone ? showPassword=true : $router.push({name:'myPhone'})" v-show="usertype"></van-cell>
        </van-cell-group>
        <!--<van-cell-group>
            <van-cell>
                <template>
                    <img src="https://img.yzcdn.cn/public_files/2017/09/05/3bd347e44233a868c99cf0fe560232be.jpg" width="30" />
						
						<template slot="title">
							
							<div class="van-cell-text">
                                <span>二维码</span>
                            </div>
						</template>
                </template>
            </van-cell>
        
        </van-cell-group>-->

        <van-dialog
        title="昵称修改"
        v-model="nicheng"
        show-cancel-button
        :before-close="beforeClose"
        >
        <van-field
            v-model="username"
            :placeholder="username"
        />
        </van-dialog>
        <!--性别-->
        <van-popup v-model="showSex" position="bottom" :close-on-click-overlay="true">
        <van-picker
          show-toolbar
          :columns="columns"
          @confirm="confirmSex"
          @cancel="showSex = false"
        />
      </van-popup>

      <!--生日-->
      <van-popup v-model="showBirth" position="bottom" :close-on-click-overlay="true">
        <van-datetime-picker
            v-model="currentDate"
            type="date"
            :formatter="formatter"
            @confirm="confirmBirth"
            :min-date="minDate"
            :max-Date="maxDate"
            />
     </van-popup>
     <!--地址-->

      <!--<van-popup v-model="showAddress" position="bottom" :close-on-click-overlay="true">
        <van-area :area-list="areaList" value="110101" @confirm="confirmAddress" />
     </van-popup>-->

     <van-popup v-model="showPassword" position="right" class="popup" >
        <van-nav-bar
            title="支付密码"
            left-text=""
            
            left-arrow
            @click-left="showPassword=false"
            
        />
        
        <van-cell-group>
        
            <van-field
                :value="phone"
                label="手机号"
                disabled
                style="padding-top:50px"
            />

            <van-field
                v-model="code"
                center
                clearable
                label="验证码"
                placeholder="请输入短信验证码" 
            >
                
                <van-button slot="button" @click="getCode" size="small"  type="primary" v-show="is_dxyz">验证码</van-button>
                <van-button slot="button"  size="small" v-show="!is_dxyz">{{time}}</van-button>

            </van-field>

            <van-field
                v-model="password"
                placeholder="请输入支付密码"
                clearable
                label="密码"
                type="password"
                
            />
            <van-field
                v-model="repassword"
                placeholder="请确认支付密码"
                clearable
                label="确认密码"
                type="password"
                
            />

            <van-button type="danger" style="width:100%;margin-top:10px " @click="submitPasswordSave()">提交</van-button>
        </van-cell-group>
      </van-popup>

     
    <van-button type="danger" style="width:100%; position:fixed;bottom:0px;" @click="submitSave()">提交</van-button>
    </div>
    
</template>

<script>
import { Cell, CellGroup,Toast,ImagePreview,DatetimePicker,Area } from 'vant'; 
import { getUserInfo,getMessageCode,getPayPassword,saveUserInfo } from "@/api/my/userinfo.js";
import areaList from '@/common/js/area.js'

export default{
    name:"myInfo",
    components: {},
    data(){
        return{
            member_type_id:'0',
            usertype:false,
            nicheng:false,
            showSex:false,
            showBirth:false,
            showAddress:false,
            showPassword:false,
            password:'',
            repassword:'',
            is_dxyz:true,
            time:60,
            phone:'',
            code:'',
            currentDate: new Date(),
            areaList,
            year: ' Year',
            month: ' Month',
            day:'Day',
            head_img:'',
            nickname:'',
            username:'',
            address:'',
            sex:'0',
            birth:'',
            columns: ['男', '女'],
            telephone:'', 
            minDate: new Date(1970, 1, 1),
            maxDate: new Date(),
        }
    },
    methods:{
        
        beforeClose(action, done) {
            if (action === 'confirm') {
                setTimeout(done, 1000);
                this.nickname = this.username;
            } else {
                done();
            }
        },
        confirmSex(c){
            this.showSex = false;
            this.sex = c
        },
        confirmBirth(c){
            
             var d = new Date(c);  
            var resDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); 
            this.birth = resDate
            this.showBirth = false;
            
        },
        confirmAddress(c){
            console.log(c)
        },
        submitSave(){
            var $_this=this;
            var sexNum=$_this.sex=="男"?1:($_this.sex=="女"?2:0);
            saveUserInfo($_this.nickname,sexNum,$_this.address,$_this.head_img,$_this.birth).then((res)=>{
                
                
                if(res.status==1){
                    Toast("修改成功");
                    this.$router.go(-1)
                }else if(res.status==2){
                    Toast("您的账号被冻结！");
                }else{
                    Toast(res.info);
                }
            }).catch((err) =>{
                // Toast(err.info ? err.info : '获取数据失败');
            })
        },
        submitPasswordSave(){
            var $_this=this;
            if(this.code == ""){
                Toast("请输入验证码")
                return
            }
            if(this.password == ""){
                Toast("请输入密码")
                return
            }
            if(this.password != this.repassword){
                Toast("密码不统一")
                return
            }
            getPayPassword(this.code,this.password,this.repassword).then((res)=>{
                console.log(res);
                
                if(res.status==1){
                    Toast("修改成功");
                    $_this.showPassword=false;

                }else if(res.status==2){
                    Toast("您的账号被冻结！");
                }else{
                    Toast(res.info);
                }
            }).catch((err) =>{
                // Toast(err.info ? err.info : '获取数据失败');
            })

        },
        getCode() {
            var reg=11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
            if(this.phone == ""){
                
                Toast('请输入手机号')
                return false;
            }else if(!reg.test(this.phone)){
                
                Toast("手机格式不正确");
                return false;
            }
                this.dx_yzb();
            let codetype = '3'
            
            //获取验证码
            //getMessageCode(this.phone,codetype).then((res) =>{
            getMessageCode(this.phone,codetype).then((res) =>{
                Toast(res.info)
            }).catch((err) =>{
                // Toast(err.info ? err.info : '获取数据失败');
            })
        },
        dx_yzb(){
        
            this.is_dxyz = false;
            let dx_djs = setInterval(()=>{
                this.time --;
                
                if((this.time) <=0){
                this.time = 60;
                this.is_dxyz=true
                clearInterval(dx_djs)
                }
            },1000)
        },
        formatter(type, value) {
            if (type === 'year') {
                return `${value}年`;
            } else if (type === 'month') {
                return `${value}月`
            } else if (type === 'day') {
                return `${value}日`
            }
            return value;
        }
    },
    mounted() {
        getUserInfo().then((res) => {
          if (res.status == "1") {
            this.head_img = res.head_img;
            this.nickname = res.username;
            this.username = res.username;

            this.phone = res.telephone;

            this.sex = res.sex==1?'男':'女';
            this.birth = res.birth;

            this.address = res.address;
            this.member_type_id = res.member_type_id;

            this.currentDate = new Date(res.birth)
            
            
            if(res.member_type_id == '2' || res.member_type_id == '3' || res.member_type_id == '4')
            {
                this.usertype = true;
            }else{
                this.usertype = fasle;
            }
            // sessionStorage.setItem("head_img", res.head_img);
            // sessionStorage.setItem("username", res.username);

          } else if (res.status == "2") {
            Toast("账号被冻结");
            this.$router.go(-1);
          } else {
            Toast(res.info);
          }
        })
        .catch((err) => {
          //Toast(err);
        //   Toast(err.info ? err.info : '获取数据失败');
            
        });
    },
    created() {
        if(this.$route.query.phone){
            this.phone = this.$route.query.phone;
            this.showPassword = true;
        }
    },
}

</script>
<style lang="less">
@import "../../styles/color.less";

.myInfo{
    padding-top:46px;

    .van-cell-text{
            display: inline-block;
            p{
                margin: 0;
                font-size: 12px;
                color: @descColor;
                height: 16px;
                line-height: 16px;
            }
	    }
    .popup {
        width: 100%;
        height: 100%;

        box-sizing: border-box;
    }
    .van-button--danger{
        background: @activeColor;
        border-color: @activeColor;
    }
}

</style>