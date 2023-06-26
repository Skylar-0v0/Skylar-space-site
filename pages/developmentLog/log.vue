<script setup>
  let props = defineProps({
    data: Object
  })
</script>

<template>
  <div class="log-contanier">
    <uni-dateformat class="log-date op-8" :date="data.createdAt" format="yyyy/MM/dd">
    </uni-dateformat>
    <p class="log-text">{{data.log}}</p>
  </div>
</template>

<style scoped>
  @import '../main.css';

  @media screen and (min-width:768px) {
    .log-contanier {
      display: flex;
      align-items: center;
    }

    .log-date {
      margin-right: 2.5%;
    }

    .log-text {
      padding-left: 2.5%;
      border-left: 1px solid var(--color-line);
    }
  }

  @media screen and (max-width:767px) {
    .log-text {
      margin-top: 5px;
    }
  }

  .log-contanier {
    margin-bottom: 40px;
    width: 90%;
  }
</style>
