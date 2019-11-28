<template>
  <div class="login-warp">
    <h2 class="login-title">Smart数据分析平台</h2>
    <div class="login">
      <h4>登陆</h4>
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="0px"
        class="demo-ruleForm"
      >
        <el-row>
          <el-col :span="3">
            <i class="iconfont icondenglu1"/>
          </el-col>
          <el-col :span="21">
            <el-form-item prop="username">
              <el-input v-model="ruleForm.username" placeholder="请输入用户名" size="medium" clearable/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3">
            <i class="iconfont iconmima"/>
          </el-col>
          <el-col :span="21">
            <el-form-item prop="password">
              <el-input
                v-model="ruleForm.password"
                type="password"
                placeholder="请输入密码"
                size="medium"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="btn-row">
          <el-col :span="24">
            <el-button
              type="primary"
              size="medium"
              :loading="btnLoading"
              @click="submitForm('ruleForm')"
              @keyup.enter.native="submitForm('ruleForm')"
            >
              登陆
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Login',
  data () {
    return {
      btnLoading: false,
      ruleForm: {
        username: '', // 账号
        password: '', // 密码
      },
      rules: {
        username: [
          { required: true, message: '账号不能为空', trigger: 'blur' },
        ],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
      },
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$message.error('账号密码错误!')
        } else {
          return false
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.login-warp {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url("~@/assets/images/login-bj.jpg") no-repeat;
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.login-title {
  margin: 0 0 50px 0;
  color: $white-color;
  font-size: 45px;
}
.login {
  padding: 60px 40px;
  width: 280px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.6);
  h4 {
    margin: 0;
    padding-bottom: 40px;
    font-size: 25px;
    font-weight: normal;
    color: $title-color;
  }

  /deep/.el-input__inner {
    border-radius: 20px;
    color: $title-color;
    // border: 1px solid #999;
    &::-webkit-input-placeholder {
      color: #777;
    }
    &::-moz-placeholder {
      color: #777;
    }
    &:-ms-input-placeholder {
      color: #777;
    }
  }
  .el-button--medium {
    width: 100%;
    background: $blue-color;
    border: 1px solid $blue-color;
  }
  .iconfont {
    font-size: 20px;
    line-height: 36px;
    color: $font-gray;
  }
  .el-row {
    margin-top: 10px;
  }
  .btn-row {
    margin-top: 40px;
  }
}
</style>
