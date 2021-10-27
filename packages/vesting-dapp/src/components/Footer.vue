<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <h5 class="display-5">@{{ year }} - Made with ❤️</h5>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Footer",
  data: () => ({
    year: new Date().getFullYear(),
  }),
};
</script>
