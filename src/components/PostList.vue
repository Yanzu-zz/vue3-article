<template>
  <div class="post-list">
    <article v-for="post in posts" :key="post._id" class="card mb-3 shadow-sm">
      <div class="card-body">
        <h4>
          <a href="#">{{ post.title }}</a>
        </h4>
        <div class="row my-3 align-items-center">
          <div v-if="post.image" class="col-4">
            <img
              :src="post.image.url"
              :alt="post.title"
              class="rounded-lg w-100"
            />
          </div>
          <p :class="{ 'col-8': post.image }" class="text-muted">
            {{ post.excerpt }}
          </p>
        </div>
        <span class="text-muted">{{ post.createdAt }}</span>
      </div>
    </article>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import { PostProps } from '../types/index'

export default defineComponent({
  props: {
    list: {
      required: true,
      type: Array as PropType<PostProps[]>
    }
  },
  setup(props) {
    const posts = computed(() => {
      return props.list.map((post) => {
        if (post.image) {
          post.image.url += '?x-oss-process=imageresize,m_pad,h_50,w_100'
        }
        return post
      })
    })
    return {
      posts
    }
  }
})
</script>

<style scoped>
.post-list h4 a {
  text-decoration: none;
  color: #1a1a1a;
}
.post-list h4 a:hover {
  color: #0d6efd;
}
</style>
