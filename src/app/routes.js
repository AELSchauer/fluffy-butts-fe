import BrandIndexPage from "./pages/Brand/IndexPage";
import BrandShowPage from "./pages/Brand/ShowPage";
import BrowsePage from "./pages/BrowsePage";
import EditPage from "./pages/Admin/EditPage";
import DiaperTypesPage from "./pages/DiaperTypesPage";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";

export default [
  {
    path: "/admin/edit",
    title: "Edit Page",
    includeInNavBar: false,
    component: EditPage,
  },
  {
    path: "/diaper-types",
    title: "Diaper Types",
    includeInNavBar: true,
    component: DiaperTypesPage,
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
