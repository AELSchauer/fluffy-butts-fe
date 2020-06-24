import BrandPage from "./pages/BrandPage";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import ProductPage from "./pages/ProductPage";

export default [
  {
    path: "/brands",
    title: "Brands",
    includeInNavBar: true,
    component: BrandPage,
  },
  {
    path: "/products/:id",
    title: "Product",
    includeInNavBar: false,
    component: ProductPage,
  },
  {
    path: "/search",
    title: "Search",
    includeInNavBar: true,
    component: SearchPage,
  },
  {
    path: "/",
    title: "Home",
    includeInNavBar: false,
    component: HomePage,
  },
];
