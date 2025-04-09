import React, { useState, useEffect, useRef } from "react";
import { IoBagHandleOutline , IoLogOutOutline } from "react-icons/io5";
import { Tooltip } from "./Tooltip";
import { RxDashboard } from "react-icons/rx";
import { GrDatabase, GrUserFemale } from "react-icons/gr";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import { useNavigation } from "../utils/navigationUtils";
import { AiOutlineProduct } from "react-icons/ai";

export function AsideMobile() {
  const [isOpen, setIsOpen] = useState(false); // Controla a visibilidade do menu
  const [activeIcon, setActiveIcon] = useState<string | null>(null);
  const { usuarioData } = useAuth();
  const location = useLocation();
  const navigateTo = useNavigation();
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    console.log("Menu aberto:", !isOpen); // Verifica se o estado muda
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    console.log("Fechando menu");
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      closeMenu();
    }
  };

  useEffect(() => {
    // Fechar o menu ao mudar de rota
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isOpen) {
      console.log("Menu está aberto");
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative">
      {/* Botão para abrir o menu */}
      <button
        onClick={toggleMenu}
        className="flex items-center p-2 text-white hover:text-gray-300 absolute top-2 left-4 z-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMenu}
        ></div>
      )}

      {/* Menu */}
      <div
        ref={menuRef}
        className={`fixed z-50 left-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <ul className="flex flex-col justify-between items-start h-full">
          <div className="w-full">
            <div className="w-full border-b-2 p-4">
              <h1 className="text-lg font-semibold">Menu</h1>
            </div>

            <li
              className={
                activeIcon === "home" ? "bg-[#f5f5f5] w-full" : "bg-transparent"
              }
            >
              <Tooltip tooltipText="Home">
                <button
                  onClick={() => {
                    navigateTo("/");
                    setActiveIcon("home");
                  }}
                  className={`p-4 w-full rounded-lg transition-colors flex items-center space-x-2 text-gray-900 duration-300 ease-in-out ${
                    activeIcon === "home" ? "bg-[#f5f5f5]" : "bg-transparent"
                  }`}
                >
                  <RxDashboard
                    size={28}
                    className={`mr-1 ${
                      activeIcon === "home"
                        ? "text-custom-bg-start"
                        : "text-gray-600"
                    }`}
                  />
                  <span>Dashboard</span>
                </button>
              </Tooltip>
            </li>

            <li
              className={
                activeIcon === "catalog"
                  ? "bg-[#f5f5f5] w-full"
                  : "bg-transparent"
              }
            >
              <Tooltip tooltipText="Catálogo">
                <button
                  onClick={() => {
                    navigateTo("/catalog");
                    setActiveIcon("catalog");
                  }}
                  className={`p-4 rounded-lg transition-colors duration-300 ease-in-out ${
                    activeIcon === "catalog" ? "bg-[#f5f5f5]" : "bg-transparent"
                  } flex items-center space-x-2`}
                >
                  <AiOutlineProduct
                    size={28}
                    className={`${
                      activeIcon === "catalog"
                        ? "text-custom-bg-start"
                        : "text-gray-600"
                    }`}
                  />
                  <span>Catálogo</span>
                </button>
              </Tooltip>
            </li>
            <li
              className={
                activeIcon === "vendas"
                  ? "bg-[#f5f5f5] w-full"
                  : "bg-transparent"
              }
            >
              <Tooltip tooltipText="Catálogo">
                <button
                  onClick={() => {
                    navigateTo("/vendas");
                    setActiveIcon("vendas");
                  }}
                  className={`p-4 rounded-lg transition-colors duration-300 ease-in-out ${
                    activeIcon === "vendas" ? "bg-[#f5f5f5]" : "bg-transparent"
                  } flex items-center space-x-2`}
                >
                  <IoBagHandleOutline 
                    size={28}
                    className={`${
                      activeIcon === "vendas"
                        ? "text-custom-bg-start"
                        : "text-gray-600"
                    }`}
                  />
                  <span>Vendas</span>
                </button>
              </Tooltip>
            </li>

            {usuarioData?.tipo_usuario !== "EMPLOYEE" && (
              <li
                className={
                  activeIcon === "backoffice"
                    ? "bg-[#f5f5f5] w-full"
                    : "bg-transparent"
                }
              >
                <Tooltip tooltipText="Backoffice">
                  <button
                    onClick={() => {
                      navigateTo("/backoffice");
                      setActiveIcon("backoffice");
                    }}
                    className={`p-4 rounded-lg transition-colors duration-300 ease-in-out ${
                      activeIcon === "backoffice"
                        ? "bg-[#f5f5f5]"
                        : "bg-transparent"
                    } flex items-center space-x-2`}
                  >
                    <GrDatabase
                      size={28}
                      className={`${
                        activeIcon === "backoffice"
                          ? "text-custom-bg-start"
                          : "text-gray-600"
                      }`}
                    />
                    <span>Backoffice</span>
                  </button>
                </Tooltip>
              </li>
            )}
          </div>

          <div className="w-full">
            <li className="border-t-2 w-full mt-2" />
            <li className="w-full">
              <Tooltip tooltipText="Sair">
                <button
                  onClick={() => navigateTo("/sair")}
                  className="p-4 rounded-lg transition-colors duration-300 ease-in-out hover:bg-[#f5f5f5] flex items-center space-x-2"
                >
                  <IoLogOutOutline
                    size={28}
                    className="text-gray-600 hover:text-red-600 transition-colors duration-300 ease-in-out"
                  />
                  <span>Sair</span>
                </button>
              </Tooltip>
            </li>
          </div>
        </ul>
      </div>
    </div>
  );
}
