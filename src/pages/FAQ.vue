<template>
  <div class="bg-transparent mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Mūsu piegādes pakalpojumi</h1>
    
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <div v-for="(card, index) in cards" :key="index" class="bg-white p-6 rounded-lg shadow-md">
        <div class="flex items-center mb-4">
          <component :is="card.icon" class="w-6 h-6 mr-2" />
          <h2 class="text-xl font-semibold">{{ card.title }}</h2>
        </div>
        <p>{{ card.description }}</p>
      </div>
    </div>
    
    <h2 class="text-2xl font-semibold mb-4">Piegādes tarifi</h2>
    <div class="overflow-x-auto">
      <table class="w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead class="bg-gray-50">
          <tr>
            <th v-for="header in tableHeaders" :key="header" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="row in tableData" :key="row.type">
            <td v-for="(value, key) in row" :key="key" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ value }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <h2 class="text-2xl font-semibold my-6">Biežāk uzdotie jautājumi</h2>
    <div class="space-y-4">
      <div v-for="(faq, index) in faqs" :key="index" class="border-b border-gray-200 pb-4">
        <button 
          @click="faq.isOpen = !faq.isOpen" 
          class="flex justify-between items-center w-full text-left font-medium text-lg"
        >
          {{ faq.question }}
          <ChevronDown :class="{ 'transform rotate-180': faq.isOpen }" class="w-5 h-5 transition-transform duration-200" />
        </button>
        <div v-show="faq.isOpen" class="mt-2 text-gray-600">
          <div v-for="(step, idx) in formatSteps(faq.answer)" :key="idx" class="mb-2">
            <p>{{ step }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Truck, Clock, MapPin, HelpCircle, ChevronDown } from 'lucide-vue-next'

// Dati par kartēm (piegādes pakalpojumiem)
const cards = [
  {
    icon: Truck,
    title: 'Ātra piegāde',
    description: 'Mēs piedāvājam ātras un uzticamas piegādes iespējas, lai jūsu ziedi sasniegtu jūs pēc iespējas ātrāk.'
  },
  {
    icon: Clock,
    title: 'Piegādes laiki',
    description: 'Lielākā daļa pasūtījumu tiek piegādāti 1-3 darba dienu laikā, atkarībā no jūsu atrašanās vietas.'
  },
  {
    icon: MapPin,
    title: 'Plašs pārklājums',
    description: 'Mēs piedāvājam piegādi visā Latvijā.'
  },
  {
    icon: HelpCircle,
    title: 'Atbalsts',
    description: 'Mūsu klientu apkalpošanas komanda ir gatava palīdzēt jums ar jebkuriem ar piegādi saistītiem jautājumiem.'
  }
]

// Tabulas galvenes un dati
const tableHeaders = ['Piegādes veids', 'Paredzamais piegādes laiks', 'Cena']
const tableData = [
  { type: 'Standarta piegāde', time: 'Nākāmā dienā vai vēlāk', price: '0.99 €' },
  { type: 'Eksprespiegāde', time: 'Tajā pašā dienā', price: '3.99 €' },
]

// FAQ dati
const faqs = ref([
  {
    question: 'Vai jūs piedāvājat bezmaksas piegādi?',
    answer: 'Jā, mēs piedāvājam bezmaksas standarta piegādi pasūtījumiem virs 50 €.',
    isOpen: false
  },
    {
    question: 'Kā es varu sazināties ar klientu atbalsta komandu?',
    answer: 'Ja tev ir jautājumi vai problēmas, vari sazināties ar mūsu klientu atbalsta komandu, zvanot uz tālruni +371 12345678. Mēs esam pieejami darba dienās no 9:00 līdz 18:00.',
    isOpen: false
  },
  {
    question: 'Kā es varu veikt pasūtījumu?',
    answer: `Lai veiktu pasūtījumu, izvēlies vēlamo produktu, norādi nepieciešamo daudzumu un pievieno produktu grozam, nospiežot pogu "Pievienot grozam". Kad esat gatavs iegādāties, noklikšķiniet uz pogas "Pirkt", lai pārietu uz pasūtījuma noformēšanu, kur ievadīsi piegādes datus un veiksi maksājumu`,
    isOpen: false
  },
  {
    question: 'Kā pievienot promokodu?',
    answer: 'Ja tev ir promokods, dodies uz grozu un ieraksti kodu attiecīgajā laukā. Pēc tam nospied pogu "Pielietot", lai iegūtu atlaidi uz savu pasūtījumu.',
    isOpen: false
  },
  {
    question: 'Kā es varu pievienot un mainīt piegādes datus?',
    answer: 'Piegādes datus var pievienot un rediģēt pasūtījuma noformēšanas laikā. Pirms maksājuma veikšanas būs nepieciešams aizpildīt laukus ar piegādes informāciju (vārds, uzvārds, adrese, utt.).',
    isOpen: false
  },
  {
    question: 'Kā es varu mainīt savu paroli?',
    answer: 'Lai mainītu savu paroli, dodies uz sava profila lapu un izvēlies "Mainīt paroli". Ievadi jauno paroli un apstiprini to, lai veiktu izmaiņas.',
    isOpen: false
  },
   {
    question: ' Kas ir "Iepriekšējie pasūtījumi" sadaļa manā profilā?',
    answer: 'Sadaļa "Iepriekšējie pasūtījumi" ļauj apskatīt visu tavu iepriekšējo pasūtījumu vēsturi, lai tu varētu viegli sekot līdzi saviem pasūtījumiem un atkārtoti pasūtīt produktus, kas tev patika.',
    isOpen: false
  },
    {
    question: 'Kādas maksājumu metodes ir pieejamas, lai veiktu pirkumus?',
    answer: 'Mēs piedāvājam vairākas maksājumu metodes, tostarp kredītkartes (Visa, MasterCard), PayPal, bankas pārskaitījumu un citas lokālās maksājumu metodes. Maksājuma iespējas tiks parādītas pasūtījuma noformēšanas laikā.',
    isOpen: false
  },
  

])

// Palīgfunkcija, lai sadalītu soļus
const formatSteps = (steps) => {
  return steps.split('\n').filter(step => step.trim() !== '');
}
</script>

