<template>
  <div class="flex mx-auto max-w-[1200px] flex-col p-4">
    <div class="p-6 border-2 rounded-md">
      there will be filters and search
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-4 pt-2 box-border mx-auto">
      <div v-for="(item, index) in items" :key="index" class="rounded min-w-[250px] box-border">
        <div class="border-b  w-full h-[196px]">Image</div>
        <div class="mt-2">
          <button class="box-border py-2 px-4 w-full border hover:bg-black hover:text-white transition">Add to Cart</button>
          <div class="p-2">
            <p class="font-bold">Some Flower</p>
            <p class="text-slate-500 text-sm">Short description for a flower</p>
            <p class="mt-1 text-lg">100.99€</p>
          </div>
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
