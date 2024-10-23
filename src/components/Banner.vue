<template>
  <div class="w-full h-[300px] flex align-center justify-center" id="background">
    <div class="text-[4vw] xl:text-[3vw] text-white transition-all">Labākie un dabiskākie ziedi Latvijā</div>
  </div>
</template>

<style lang="scss" scoped>

#background {
  position: relative;
  background-image: url('/src/assets/images/bg.webp');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

#background::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4); /* Adjust the opacity (0.5) to make it darker or lighter */
  z-index: 1; /* Ensures the overlay is on top */
}

#background > * {
  position: relative;
  z-index: 2; /* Ensures content stays above the overlay */
}

</style>