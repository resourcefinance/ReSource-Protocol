import Vue from "vue"
import Vuetify from "vuetify/lib/framework"
import "vuetify/dist/vuetify.min.css"

Vue.use(Vuetify)

export default new Vuetify({
  themes: {
    options: {
      customProperties: true,
    },
    light: {
      primary: "#B79CED",
      secondary: "#424242",
      accent: "#82B1FF",
      error: "#FF5252",
      info: "#2196F3",
      success: "#4CAF50",
      warning: "#FFC107",
    },
  },
  iconfont: "md",
})
