<template>
    <div class="dropdown" ref="dropdownRef">
        <a
          href="#"
          class="btn btn-outline-light my-2 dropdown-toggle"
          @click.prevent="toggleOpen"
        >
          {{title}}
        </a>
        <ul class="dropdown-menu" :style="{display: 'block'}" v-if="isOpen">
          <slot></slot>
        </ul>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import useClickOutside from '../hooks/useClickOutside'

export default defineComponent({
  name: 'DropDown',
  props: {
    title: {
      type: String,
      required: true
    }
  },
  setup () {
    const isOpen = ref(false)
    // dropdownRef 节点,命名要与 div上的 ref 一致,可取到其DOM节点
    const dropdownRef = ref<null | HTMLElement>(null)
    const toggleOpen = () => {
      isOpen.value = !isOpen.value
    }
    // 纯逻辑代码,可抽取为函数 =》useClickOutside.ts
    // const handle = (e: MouseEvent) => {
    //   if (dropdownRef.value) {
    //     if (!dropdownRef.value.contains(e.target as HTMLElement) && isOpen.value) {
    //       isOpen.value = false
    //     }
    //   }
    // }
    // onMounted(() => {
    //   document.addEventListener('click', handle)
    // })
    // onUnmounted(() => {
    //   document.addEventListener('click', handle)
    // })
    const isClickOutside = useClickOutside(dropdownRef)
    // setup中只会执行一次,再更新时,则不会再生效,需要改写成响应式的数据 watch
    watch(isClickOutside, () => {
      if (isOpen.value && isClickOutside.value) {
        isOpen.value = false
      }
    })

    return {
      isOpen,
      toggleOpen,
      // 返回和 ref 同名的响应式对象，就可以拿到对应的 dom 节点
      dropdownRef
    }
  }
})
</script>

<style>

</style>
