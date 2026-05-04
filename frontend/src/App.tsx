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
        element: <div className="p-6">Home Page</div>,
      },
      {
        path: "dashboard",
        element: (
          <SidebarLayout>
            <SideNavBar />
          </SidebarLayout>
        ),
        children: [
          { path: "home", element: <Home /> },
          { path: "calculator", element: <Calculator /> },
          { path: "books", element: <BooksPage /> },
          { path: "stationary", element: <StationaryPage /> },
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
          { path: "stationary", element: <StationaryPage /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />, // You can replace this with a NotFound component
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
