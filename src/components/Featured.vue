<template>
    <div class="max-w-[1200px] flex mx-auto flex-col px-8 mt-[50px] transition">
        <span class="text-4xl">Iemīļotākie produkti</span>
        <div class="my-8 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 justify-around gap-4">
            <div v-for="(item, index) in items" :key="index" class="flex flex-col max-w-full w-full aspect-[4/4] hover:scale-110 transition">
                <div class="max-w-full h-full" id="background">
                    <div class="text-xs w-fit text-white p-2 bg-[#399918]">-100%</div>
                </div>
                <div class="mt-2">
                    <button class="box-border py-2 px-4 w-full border bg-[#fff] hover:bg-[#4be15c] shadow-lg transition">Add to Cart</button>
                    <div class="p-2">
                        <p class="font-bold">Some Flower</p>
                        <p class="text-slate-500 text-sm">Short description for a flower</p>
                        <div class="flex row mt-1 text-lg">
                            <p>100.99€</p>
                            <p class="line-through text-[#84898e] pl-2">100.99€</p>
                        </div>
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
        items: Array.from({ length: 4 }),
      }
    },
  }
</script>

<style lang="scss" scoped>

#background {
  background-image: url('/src/assets/images/bg.webp');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

</style>