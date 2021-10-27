import VueRouter from "vue-router";
import routes from "./routes";
import Vue from "vue";
Vue.use(VueRouter);

// configure router
const router = new VueRouter({
  routes,
  linkExactActiveClass: "active",
  scrollBehavior: (to) => {
    if (to.hash) {
      return { selector: to.hash };
    } else {
      return { x: 0, y: 0 };
    }
  },
});

export default router;
