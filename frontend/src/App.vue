<script setup>
  import { ref } from 'vue';

  const kittens = ref([]);
  const nameInput = ref('');

  async function getKittens() {
    const response = await fetch('http://localhost:3000/kittens');
    const json = await response.json();
    kittens.value = json.kittens;
    return json;
  }

  async function addKitten() {
    const response = await fetch('http://localhost:3000/kittens', {
      body: JSON.stringify({
        name: nameInput.value,
      }), 
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', 
    });
    const json = await response.json();
    kittens.value.push(json.kitten);
  }

  getKittens();



</script>

<template>
  <h1>我的貓咪們！</h1>
  <form @submit.prevent="addKitten">
    <input v-model="nameInput" type="text" />
    <button type="submit">新增</button>
  </form>
  <ul class="kittens">
    <li v-for="kitten in kittens" :key="kitten.id">{{ kitten.name }}</li>
  </ul>
</template>
