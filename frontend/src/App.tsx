// App.jsx - Main Router Setup
import { createBrowserRouter, RouterProvider, Outlet } from "react-router";
import MainNavbar from "./components/MainNavbar";
import SideNavBar from "./components/SideNavBar";
import SellPageSideNavbar from "./components/SellPageSideNavbar";
import SellItemForm from "./pages/SellItemForm";
import Home from "./pages/Home";
import Calculator from "./pages/Calculator";
import NotFound from "./pages/NotFound";
import BooksPage from "./pages/BooksPage";
import StationaryPage from "./pages/StationaryPage";
import Subscription from "./pages/Subscription";
import ProductDetail from "./pages/ProductDetail"; // 1. Imported your ProductDetail page
import Login from "./pages/Login";
import AllBooksPage from "./pages/AllBooksPage";
import AllStationaryPage from "./pages/AllStationaryPage";
import AllItems from "./pages/AllItems";
import UpdateItemForm from "./pages/UpdateItemForm";

// Main Layout Component
function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <MainNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

// Reusable Sidebar Layout
function SidebarLayout({ children }) {
  return children;
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
          <div className="p-6">
            <Login />
          </div>
        ),
      },
      // 2. Added product details route globally under the main Navbar layout

      {
        path: "dashboard",
        element: (
          <SidebarLayout>
            <SideNavBar />
          </SidebarLayout>
        ),
        children: [
          { path: "stationary", element: <AllStationaryPage /> },
          { path: "home", element: <Home /> },
          { path: "all-items", element: <AllItems /> },
          { path: "calculator", element: <Calculator /> },
          { path: "books", element: <AllBooksPage /> },
          { path: "subscriptions", element: <Subscription /> },
        ],
      },
      {
        path: "sellpage",
        element: (
          <SidebarLayout>
            <SellPageSideNavbar />
          </SidebarLayout>
        ),
        children: [
          { path: "sell-item-form", element: <SellItemForm /> },
          { path: "books", element: <BooksPage /> },
          {
            path: "books/:id",
            element: <ProductDetail />,
          },
          { path: "stationary", element: <StationaryPage /> },
          { path: "subscriptions", element: <Subscription /> },
          { path: "/sellpage/update/:id", element: <UpdateItemForm /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
