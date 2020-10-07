import BrandIndexPage from "./pages/Brand/IndexPage";
import BrandShowPage from "./pages/Brand/ShowPage";
import CreatePage from "./pages/Admin/CreatePage";
import HomePage from "./pages/HomePage";
import BrowsePage from "./pages/BrowsePage";
import ProductPage from "./pages/ProductPage";

export default [
  {
    path: "/admin/create",
    title: "Create Page",
    includeInNavBar: false,
    component: CreatePage,
  },
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
    path: "/browse",
    title: "Browse",
    includeInNavBar: true,
    component: BrowsePage,
  },
  {
    path: "/",
    title: "Home",
    includeInNavBar: false,
    component: HomePage,
  },
];
