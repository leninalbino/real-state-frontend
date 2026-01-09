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

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AppLayout>
        <HomePage />
      </AppLayout>
    ),
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
    element: (
      <AppLayout>
        <PublishPropertyPage />
      </AppLayout>
    ),
  },
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AppLayout>
          <AdminPage />
        </AppLayout>
      </AdminRoute>
    ),
  },
  {
    path: "/admin/edit/:id",
    element: (
      <AdminRoute>
        <AppLayout>
          <EditPropertyPage />
        </AppLayout>
      </AdminRoute>
    ),
  },
  {
    path: "/admin/agents",
    element: (
      <AdminRoute>
        <AppLayout>
          <AgentListPage />
        </AppLayout>
      </AdminRoute>
    ),
  },
  {
    path: "/admin/agents/:id",
    element: (
      <AdminRoute>
        <AppLayout>
          <AgentDetailPage />
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
