<template>
    <section class="bg-white py-12 h-auto w-auto ">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900">Par mums</h1>
          <p class="mt-4 text-lg text-gray-600">
            Mēs esam Ziedi.lv — jūsu uzticamie ziedu piegādātāji ar vairāk nekā 10 gadu pieredzi
            rūpēs par to, lai jūsu īpašie mirkļi tiktu atzīmēti ar viskrāšņākajiem ziediem.
          </p>
        </div>
  
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Описание компании -->
          <div>
            <h2 class="text-3xl font-semibold text-gray-800">Mūsu misija</h2>
            <p class="mt-4 text-gray-600 leading-relaxed">
              Mūsu mērķis ir ne tikai piegādāt ziedus, bet arī sniegt pozitīvas emocijas, 
              padarot katru pasūtījumu īpašu. Mēs ticam, ka ziedi var radīt brīnišķīgas
              atmiņas un padarīt jebkuru notikumu nozīmīgāku.
            </p>
  
            <p class="mt-4 text-gray-600 leading-relaxed">
              Mūsu komandā strādā profesionāli floristi, kas ar mīlestību un rūpību veido 
              katru kompozīciju. Mēs piegādājam ziedus visā Latvijā un nodrošinām, ka 
              katrs ziedu pušķis ir svaigs un skaists.
            </p>
  
            <p class="mt-4 text-gray-600 leading-relaxed">
              Sazinieties ar mums, un mēs palīdzēsim jums izvēlēties vispiemērotākos ziedus 
              jebkuram gadījumam, vai tas būtu dzimšanas diena, kāzas vai jebkurš cits īpašs notikums.
            </p>
  
            <!-- Преимущества -->
            <div class="mt-8">
              <h3 class="text-2xl font-semibold text-gray-800">Kāpēc izvēlēties mūs?</h3>
              <ul class="mt-4 space-y-4 text-gray-600">
                <li class="flex items-start">
                  <svg class="flex-shrink-0 w-6 h-6 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Augstākā kvalitāte un svaigi ziedi katru dienu</span>
                </li>
                <li class="flex items-start">
                  <svg class="flex-shrink-0 w-6 h-6 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Ātra un uzticama piegāde visā Latvijā</span>
                </li>
                <li class="flex items-start">
                  <svg class="flex-shrink-0 w-6 h-6 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Personīga pieeja katram klientam</span>
                </li>
              </ul>
            </div>
          </div>
  
          <!-- Изображение -->
          <div class="hidden lg:block">
            <img class="rounded-lg shadow-lg" src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80" alt="Ziedu kompozīcija">
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  export default {
    name: 'About'
  }
  </script>
  