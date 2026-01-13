import { LogOut, UserCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../app/auth/useAuth";
import { Menu } from "@headlessui/react";
import type { ReactNode } from "react";

export const Header = ({
  centerContent,
  showNav = true,
}: {
  centerContent?: ReactNode;
  showNav?: boolean;
}) => {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/50 to-transparent">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center  gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="text-white font-semibold">ESPACIOS RD</span>
          </div>

          {/* Center Content or Desktop Nav */}
          <div className="flex-1 flex justify-center">
            {centerContent
              ? centerContent
              : showNav && (
                  <div className="hidden md:flex items-center gap-8 text-white text-sm font-medium">
                    <a href="#comprar" className="hover:text-yellow-400 transition">
                      COMPRAR
                    </a>
                    <a href="#alquilar" className="hover:text-yellow-400 transition">
                      ALQUILAR
                    </a>
                    <a href="#proyectos" className="hover:text-yellow-400 transition">
                      PROYECTOS
                    </a>
                  </div>
                )}
          </div>

          {/* Botón Acceder */}
          <div>
            {user ? (
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="flex items-center gap-3 bg-gray-100/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 text-sm">
                    <UserCircle className="w-5 h-5" />
                    <span className="font-semibold">{user.fullName}</span>
                  </Menu.Button>
                </div>
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-1 py-1 ">
                    <div className="px-4 py-2">
                      <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                    </div>
                  </div>
                  <div className="px-1 py-1">
                    {user.role === 'admin' && (
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/admin"
                            className={`${
                              active ? 'bg-violet-500 text-white' : 'text-gray-900'
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            Admin Panel
                          </Link>
                        )}
                      </Menu.Item>
                    )}
                    {user.role === 'agent' && (
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/dashboard"
                            className={`${
                              active ? 'bg-violet-500 text-white' : 'text-gray-900'
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            Agent Dashboard
                          </Link>
                        )}
                      </Menu.Item>
                    )}
                  </div>
                  <div className="px-1 py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={logout}
                          className={`${
                            active ? 'bg-violet-500 text-white' : 'text-gray-900'
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        >
                          <LogOut className="mr-2 h-5 w-5" aria-hidden="true" />
                          Logout
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Menu>
            ) : (
              <Link
                to="/acceso"
                className="flex items-center space-x-2 bg-gray-100/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200"
              >
                <UserCircle className="w-5 h-5" />
                <span>Acceder</span>
              </Link>
            )}
          </div>
        </div>
    </nav>
  );
};
