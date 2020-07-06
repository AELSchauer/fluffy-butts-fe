import BrandIndexPage from "./pages/Brand/IndexPage";
import BrandShowPage from "./pages/Brand/ShowPage";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import ProductPage from "./pages/ProductPage";

export default [
  {
    path: "/brands/:brandName/products/:productLineSlug",
    title: "Product",
    includeInNavBar: false,
    component: ProductPage,
  },
  {
    path: "/brands/:brandSlug",
    title: "Brand",
    includeInNavBar: false,
    component: BrandShowPage,
  },
  {
    path: "/products/:productLineSlug",
    title: "Product",
    includeInNavBar: false,
    component: ProductPage,
  },
  {
    path: "/brands",
    title: "Brands",
    includeInNavBar: true,
    component: BrandIndexPage,
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
