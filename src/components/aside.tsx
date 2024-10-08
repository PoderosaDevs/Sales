import React, { useState, useRef, useCallback, useEffect } from "react";
import { IoLogOutOutline } from "react-icons/io5";
import { AsideSecondary } from "./aside-secondary";
import { Tooltip } from "./Tooltip";
import { RxDashboard } from "react-icons/rx";
import { GrDatabase, GrUserFemale } from "react-icons/gr";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import { useNavigation } from "../utils/navigationUtils";
import { AiOutlineProduct } from "react-icons/ai";


interface AsideProps {
  setIsSecondaryOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

type IconType = "home" | "user" | "cog" | "catalog" | "backoffice";

export function Aside({ setIsSecondaryOpen }: AsideProps) {
  const [activeIcon, setActiveIcon] = useState<IconType | null>(null);
  const [hoveredIcon, setHoveredIcon] = useState<IconType | null>(null);
  const [secondaryMenuVisible, setSecondaryMenuVisible] = useState(false);
  const [isMouseOverSecondary, setIsMouseOverSecondary] = useState(false);
  const { usuarioData } = useAuth()
  console.log(usuarioData)
  const asideRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const currentPath = location.pathname;
  const navigateTo = useNavigation();

  const userButtonRef = useRef<HTMLButtonElement>(null);
  const backofficeButtonRef = useRef<HTMLButtonElement>(null);

  const handleIconMouseEnter = useCallback(
    (icon: IconType, ref: React.RefObject<HTMLButtonElement> | null) => {
      if (icon === "user" || icon === "backoffice") {
        setHoveredIcon(icon);
        setSecondaryMenuVisible(true);
      }
    },
    []
  );

  const handleIconMouseLeave = useCallback(() => {
    if (!isMouseOverSecondary) {
      setHoveredIcon(null);
      setSecondaryMenuVisible(false);
    }
  }, [isMouseOverSecondary]);

  const handleSecondaryMouseEnter = useCallback(() => {
    setIsMouseOverSecondary(true);
  }, []);

  const handleSecondaryMouseLeave = useCallback(() => {
    setIsMouseOverSecondary(false);
    if (!hoveredIcon) {
      setSecondaryMenuVisible(false);
    }
  }, [hoveredIcon]);

  const handleClickOutside = (event: MouseEvent) => {
    if (asideRef.current && !asideRef.current.contains(event.target as Node)) {
      setActiveIcon(null);
      setHoveredIcon(null);
      setSecondaryMenuVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (
      currentPath.startsWith("/perfil") ||
      currentPath.startsWith("/vendas")
    ) {
      setActiveIcon("user");
    } else if (currentPath === "/") {
      setActiveIcon("home");
    } else if (currentPath === "/catalog") {
      setActiveIcon("catalog");
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
    <div
      className="fixed  bg-white h-full flex justify-center flex-row"
      ref={asideRef}
    >
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
          <li
            className="flex items-center space-x-2 text-center"
            onMouseEnter={() => handleIconMouseEnter("home", null)}
            onMouseLeave={handleIconMouseLeave}
          >
            <Tooltip tooltipText="Home">
              <button
                onClick={() => navigateTo("/")}
                className={`p-4 rounded-lg transition-colors duration-300 ease-in-out ${activeIcon === "home" ? "bg-[#f5f5f5]" : "bg-transparent"
                  }`}
              >
                <RxDashboard
                  size={28}
                  className={`transition-colors duration-300 ease-in-out ${activeIcon === "home"
                      ? "text-custom-bg-start"
                      : "text-gray-600"
                    }`}
                />
              </button>
            </Tooltip>
          </li>
          <li
            className="flex items-center space-x-2 text-center"
            onMouseEnter={() => handleIconMouseEnter("catalog", null)}
            onMouseLeave={handleIconMouseLeave}
          >
            <Tooltip tooltipText="Catálogo">
              <button
                onClick={() => navigateTo("/catalog")}
                className={`p-4 rounded-lg transition-colors duration-300 ease-in-out ${activeIcon === "catalog" ? "bg-[#f5f5f5]" : "bg-transparent"
                  }`}
              >
                <AiOutlineProduct
                  size={28}
                  className={`transition-colors duration-300 ease-in-out ${activeIcon === "catalog"
                      ? "text-custom-bg-start"
                      : "text-gray-600"
                    }`}
                />
              </button>
            </Tooltip>
          </li>
          <li
            className="flex items-center space-x-2 text-center"
            onMouseEnter={() => handleIconMouseEnter("user", userButtonRef)}
            onMouseLeave={handleIconMouseLeave}
          >
            <button
              onClick={() => navigateTo("/perfil")}
              className={`p-4 rounded-lg transition-colors duration-300 ease-in-out ${activeIcon === "user" ? "bg-[#f5f5f5]" : "bg-transparent"
                }`}
              ref={userButtonRef}
            >
              <GrUserFemale
                size={28}
                className={`transition-colors duration-300 ease-in-out ${activeIcon === "user"
                    ? "text-custom-bg-start"
                    : "text-gray-600"
                  }`}
              />
            </button>
          </li>

          {usuarioData?.tipo_usuario === 'EMPLOYEE' ? (
            <></>
          ) : (
            <li
              className="flex items-center space-x-2 text-center"
              onMouseEnter={() =>
                handleIconMouseEnter("backoffice", backofficeButtonRef)
              }
              onMouseLeave={handleIconMouseLeave}
            >
              <button
                onClick={() => navigateTo("/backoffice")}
                className={`p-4 rounded-lg transition-colors duration-300 ease-in-out ${activeIcon === "backoffice" ? "bg-[#f5f5f5]" : "bg-transparent"
                  }`}
                ref={backofficeButtonRef}
              >
                <GrDatabase
                  size={28}
                  className={`transition-colors duration-300 ease-in-out ${activeIcon === "backoffice"
                      ? "text-custom-bg-start"
                      : "text-gray-600"
                    }`}
                />
              </button>
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

      {/* Conditionally render AsideSecondary based on hovered icon */}
      {hoveredIcon && (
        <AsideSecondary
          isOpen={secondaryMenuVisible}
          activeIcon={hoveredIcon}
          buttonRef={
            hoveredIcon === "user"
              ? userButtonRef
              : hoveredIcon === "backoffice"
                ? backofficeButtonRef
                : null
          }
          onMouseEnter={handleSecondaryMouseEnter}
          onMouseLeave={handleSecondaryMouseLeave}
        />
      )}
    </div>
  );
}
