<template>
  <div class="flex justify-center m-[100px] flex-col p-4">
    <div class="p-6 border-2 rounded-md">
      there will be filters and search
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 pt-2 box-border">
      <div v-for="(item, index) in items" :key="index" class="border rounded min-w-[200px] box-border">
        <div class="border-b  w-full h-[196px]">Image</div>
        <div class="p-2">
          <p>Some Flower</p>
          <p>$100</p>
          <button class="bg-blue-500 text-white box-border py-2 px-4 rounded w-full">Add to Cart</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        items: Array.from({ length: 10 }),
      }
    },
  }
</script>
