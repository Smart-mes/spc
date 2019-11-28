<template>
  <div class="login-warp">
    <h2 class="login-title">Smart数据分析平台</h2>
    <div class="login">
      <h4>登陆</h4>
      <el-row>
        <el-col :span="3">
          <i class="iconfont icondenglu1"/>
        </el-col>
        <el-col :span="21">
          <el-input v-model="user" placeholder="请输入用户名" size="medium" clearable/>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">
          <i class="iconfont iconmima"/>
        </el-col>
        <el-col :span="21">
          <el-input v-model="password" placeholder="请输入密码" size="medium" clearable/>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24"><el-button type="primary" size="medium">主要按钮</el-button></el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Login',
  data () {
    return {
      user: '',
      password: '',
    }
  },
}
</script>
<style lang="scss" scoped>
.login-warp {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url("~@/assets/images/bg.jpg") no-repeat;
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.login-title {
  margin: 0 0 30px 0;
  color: $white-colour;
  font-size: 45px;
}
.login {
  padding: 40px 40px;
  width: 300px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.6);
  box-shadow: 0 0 1px 2px #132e54;
  /deep/.el-input__inner {
    border: 1px solid #90a2d8;
    border-radius: 15px;
  }
  .iconfont{
      font-size: 20px;
      line-height: 36px;
  }
  .el-row {
      margin-bottom: 20px;
  }
}
</style>
