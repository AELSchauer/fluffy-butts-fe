import BrandPage from "./pages/BrandPage";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";

export default [
  {
    path: "/",
    title: "Fluffy Butts",
    includeInNavBar: false,
    component: HomePage,
  },
  {
    path: "/brands",
    title: "Brands",
    includeInNavBar: true,
    component: BrandPage,
  },
  {
    path: "/search",
    title: "Search",
    includeInNavBar: true,
    component: SearchPage,
  },
];
