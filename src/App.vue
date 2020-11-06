<template>
  <div class="container-lg">
    <global-header :user="currentUser"></global-header>
    <!-- <column-list :list="list"></column-list> -->

    <!-- Form -->
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">邮箱地址</label>
        <validate-input
          type="text"
          placeholder="Hello There!"
          :rules="emailRules"
          v-model="emailVal"
          ref="inputRef"
        ></validate-input>
      </div>

      <div class="mb-3">
        <label for="exampleInputPassword1" class="form-label">密码</label>
        <validate-input
          type="password"
          placeholder="请输入密码..."
          :rules="passwordRules"
          v-model="passwordVal"
        ></validate-input>
      </div>

      <template #submit>
        <span class="btn btn-danger">Submit</span>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css' // bootstrap yyds
import { ColumnProps } from './components/ColumnList.vue'
import GlobalHeader, { UserProps } from './components/GlobalHeader.vue'
import ValidateForm from './components/ValidateForm.vue'
import ValidateInput, { RulesProp } from './components/ValidateInput.vue'

const testData: ColumnProps[] = [
  {
    id: 1,
    title: 'test1的专栏',
    description: '这是专栏，这是很有意思的一段简介',
    avatar: 'https://img.lguohe.com/uploads/2018/11/vtools-480x300.png'
  },
  {
    id: 2,
    title: 'test2的专栏',
    description: '这是专栏，这是很有意思的一段简介',
    avatar: 'https://img.lguohe.com/uploads/2019/05/anydo-480x300.png'
  },
  {
    id: 1,
    title: 'test1的专栏',
    description: '这是专栏，这是很有意思的一段简介'
    // avatar: 'https://img.lguohe.com/uploads/2018/11/vtools-480x300.png'
  },
  {
    id: 2,
    title: 'test2的专栏',
    description: '这是专栏，这是很有意思的一段简介',
    avatar: 'https://img.lguohe.com/uploads/2019/05/anydo-480x300.png'
  },
  {
    id: 1,
    title: 'test1的专栏',
    description: '这是专栏，这是很有意思的一段简介',
    avatar: 'https://img.lguohe.com/uploads/2018/11/vtools-480x300.png'
  },
  {
    id: 2,
    title: 'test2的专栏',
    description: '这是专栏，这是很有意思的一段简介',
    avatar: 'https://img.lguohe.com/uploads/2019/05/anydo-480x300.png'
  }
]

const currentUser: UserProps = {
  isLogin: true,
  name: 'viking'
}

export default defineComponent({
  name: 'App',
  components: {
    // ColumnList,
    GlobalHeader,
    ValidateForm,
    ValidateInput
  },
  setup() {
    const inputRef = ref<any>()
    const emailVal = ref('123@test.com')
    const emailRules: RulesProp = [
      {
        type: 'required',
        message: '电子邮箱地址不能为空'
      },
      {
        type: 'email',
        message: '请输入正确的电子邮箱格式'
      }
    ]

    const passwordVal = ref('qwe')
    const passwordRules: RulesProp = [
      {
        type: 'required',
        message: '密码不能为空'
      }
    ]

    const onFormSubmit = (result: boolean) => {
      console.log(result)
    }

    return {
      list: testData,
      currentUser,
      emailRules,
      passwordRules,
      emailVal,
      passwordVal,
      onFormSubmit,
      inputRef
    }
  }
})
</script>

<style>
</style>
