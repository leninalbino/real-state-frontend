import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "./layout/AppLayout";
import HomePage from "../features/properties/pages/HomePage";
import PropertyDetailPage from "../features/properties/pages/PropertyDetailPage";
import AccessPage from "../features/auth/pages/AccessPage";
import PublishPropertyPage from "../features/properties/pages/PublishPropertyPage";
import AdminPage from "../features/admin/pages/AdminPage";
import { AdminRoute } from "./auth/AdminRoute";
import EditPropertyPage from "../features/admin/pages/EditPropertyPage";
import EditPropertyPageAgent from "../features/agent/pages/EditPropertyPage";
import DashboardPage from "../features/agent/pages/DashboardPage";
import { AgentRoute } from "./auth/AgentRoute";
import AgentListPage from "../features/admin/pages/AgentListPage";
import AgentDetailPage from "../features/admin/pages/AgentDetailPage";
import MaintenancePage from "../features/admin/pages/MaintenancePage";
import PropertyTypesPage from "../features/admin/pages/PropertyTypesPage";
import CharacteristicsPage from "../features/admin/pages/CharacteristicsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/propiedad/:id",
    element: (
      <AppLayout>
        <PropertyDetailPage />
      </AppLayout>
    ),
  },
  {
    path: "/acceso",
    element: <AccessPage />,
  },
  {
    path: "/anunciar",
    element: <PublishPropertyPage />,
  },
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AppLayout hideNav>
          <AdminPage />
        </AppLayout>
      </AdminRoute>
    ),
  },
  {
    path: "/admin/edit/:id",
    element: (
      <AdminRoute>
        <AppLayout hideNav>
          <EditPropertyPage />
        </AppLayout>
      </AdminRoute>
    ),
  },
  {
    path: "/admin/agents",
    element: (
      <AdminRoute>
        <AppLayout hideNav>
          <AgentListPage />
        </AppLayout>
      </AdminRoute>
    ),
  },
  {
    path: "/admin/agents/:id",
    element: (
      <AdminRoute>
        <AppLayout hideNav>
          <AgentDetailPage />
        </AppLayout>
      </AdminRoute>
    ),
  },
  {
    path: "/admin/maintenance",
    element: (
      <AdminRoute>
        <AppLayout hideNav>
          <MaintenancePage />
        </AppLayout>
      </AdminRoute>
    ),
  },
  {
    path: "/admin/maintenance/property-types",
    element: (
      <AdminRoute>
        <AppLayout hideNav>
          <PropertyTypesPage />
        </AppLayout>
      </AdminRoute>
    ),
  },
  {
    path: "/admin/maintenance/characteristics",
    element: (
      <AdminRoute>
        <AppLayout hideNav>
          <CharacteristicsPage />
        </AppLayout>
      </AdminRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <AgentRoute>
        <AppLayout>
          <DashboardPage />
        </AppLayout>
      </AgentRoute>
    ),
  },
  {
    path: "/dashboard/edit/:id",
    element: (
      <AgentRoute>
        <AppLayout>
          <EditPropertyPageAgent />
        </AppLayout>
      </AgentRoute>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
