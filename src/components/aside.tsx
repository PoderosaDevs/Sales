import React, { useState, useEffect } from "react";
import { IoLogOutOutline } from "react-icons/io5";
import { Tooltip } from "./Tooltip";
import { RxDashboard } from "react-icons/rx";
import { GrDatabase } from "react-icons/gr";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import { useNavigation } from "../utils/navigationUtils";
import { AiOutlineProduct } from "react-icons/ai";
import { IoBagHandleOutline } from "react-icons/io5";

interface AsideProps {}

type IconType = "home" | "user" | "cog" | "vendas" | "catalog" | "backoffice";

export function Aside({}: AsideProps) {
  const [activeIcon, setActiveIcon] = useState<IconType | null>(null);
  const { usuarioData } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;
  const navigateTo = useNavigation();

  useEffect(() => {
    if (currentPath === "/") {
      setActiveIcon("home");
    } else if (currentPath === "/catalog") {
      setActiveIcon("catalog");
    } else if (currentPath === "/vendas") {
      setActiveIcon("vendas");
    } else if (currentPath === "/configuracoes") {
      setActiveIcon("cog");
    } else if (
      currentPath === "/backoffice" ||
      currentPath === "/produtos" ||
      currentPath === "/linhas" ||
      currentPath === "/metas" ||
      currentPath === "/lojas" ||
      currentPath === "/marcas" ||
      currentPath === "/funcionarios"
    ) {
      setActiveIcon("backoffice");
    } else {
      setActiveIcon(null);
    }
  }, [currentPath]);

  return (
    <div className="fixed bg-white h-full flex justify-center flex-row">
      <div className="flex flex-col w-[120px] items-center py-6 shadow-md">
        <div>
          <img
            src="https://media.graphassets.com/1ueVAwCoS6yTxCUa2mCX"
            width={80}
            alt="Logo"
          />
        </div>

        {/* Menu Items */}
        <ul className="flex-1 space-y-6 flex flex-col items-center justify-center">
          <li className="flex items-center space-x-2 text-center">
            <Tooltip tooltipText="Home">
              <button
                onClick={() => navigateTo("/")}
                className={`p-4 rounded-lg transition-colors duration-300 ease-in-out ${
                  activeIcon === "home" ? "bg-[#f5f5f5]" : "bg-transparent"
                }`}
              >
                <RxDashboard
                  size={28}
                  className={`transition-colors duration-300 ease-in-out ${
                    activeIcon === "home" ? "text-custom-bg-start" : "text-gray-600"
                  }`}
                />
              </button>
            </Tooltip>
          </li>
          <li className="flex items-center space-x-2 text-center">
            <Tooltip tooltipText="Catálogo">
              <button
                onClick={() => navigateTo("/catalog")}
                className={`p-4 rounded-lg transition-colors duration-300 ease-in-out ${
                  activeIcon === "catalog" ? "bg-[#f5f5f5]" : "bg-transparent"
                }`}
              >
                <AiOutlineProduct
                  size={28}
                  className={`transition-colors duration-300 ease-in-out ${
                    activeIcon === "catalog" ? "text-custom-bg-start" : "text-gray-600"
                  }`}
                />
              </button>
            </Tooltip>
          </li>
          <li className="flex items-center space-x-2 text-center">
            <Tooltip tooltipText="Vendas">
              <button
                onClick={() => navigateTo("/vendas")}
                className={`p-4 rounded-lg transition-colors duration-300 ease-in-out ${
                  activeIcon === "vendas" ? "bg-[#f5f5f5]" : "bg-transparent"
                }`}
              >
                <IoBagHandleOutline
                  size={28}
                  className={`transition-colors duration-300 ease-in-out ${
                    activeIcon === "vendas" ? "text-custom-bg-start" : "text-gray-600"
                  }`}
                />
              </button>
            </Tooltip>
          </li>

          {usuarioData?.tipo_usuario !== 'EMPLOYEE' && (
            <li className="flex items-center space-x-2 text-center">
              <Tooltip tooltipText="Backoffice">
                <button
                  onClick={() => navigateTo("/backoffice")}
                  className={`p-4 rounded-lg transition-colors duration-300 ease-in-out ${
                    activeIcon === "backoffice" ? "bg-[#f5f5f5]" : "bg-transparent"
                  }`}
                >
                  <GrDatabase
                    size={28}
                    className={`transition-colors duration-300 ease-in-out ${
                      activeIcon === "backoffice" ? "text-custom-bg-start" : "text-gray-600"
                    }`}
                  />
                </button>
              </Tooltip>
            </li>
          )}
        </ul>

        {/* Logout Icon */}
        <div>
          <Tooltip tooltipText="Sair">
            <button
              onClick={() => navigateTo("/sair")}
              className="p-2 rounded transition-colors duration-300 ease-in-out hover:bg-[#f5f5f5]"
            >
              <IoLogOutOutline
                size={28}
                className="text-gray-600 hover:text-red-600 transition-colors duration-300 ease-in-out"
              />
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
