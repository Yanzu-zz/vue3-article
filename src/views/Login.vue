<template>
  <!-- Form -->
  <validate-form @form-submit="onFormSubmit">
    <div class="mb-3">
      <label class="form-label">邮箱地址</label>
      <validate-input
        type="text"
        placeholder="请输入登录帐号"
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
        ref="inputRef"
      ></validate-input>
    </div>

    <!-- <template #submit>
      <span class="btn btn-primary">Submit</span>
    </template> -->
  </validate-form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import ValidateForm from '../components/ValidateForm.vue'
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue'

export default defineComponent({
  name: 'Login',
  components: {
    ValidateForm,
    ValidateInput
  },
  setup() {
    const router = useRouter()
    const store = useStore()

    const emailVal = ref('')
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

    const passwordVal = ref('')
    const passwordRules: RulesProp = [
      {
        type: 'required',
        message: '密码不能为空'
      }
    ]

    const onFormSubmit = (result: boolean) => {
      if (result) {
        const payload = {
          email: emailVal.value,
          password: passwordVal.value
        }

        store.dispatch('loginAndFetch', payload).then((data) => {
          console.log(data)
          router.push('/')
        })
      }
    }

    return {
      emailVal,
      emailRules,
      passwordVal,
      passwordRules,
      onFormSubmit
    }
  }
})
</script>

<style>
</style>
