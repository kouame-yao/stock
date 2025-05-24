import {
  AlignJustify,
  CircleUserRound,
  HandHeart,
  LayoutDashboard,
  ListTree,
  LogOut,
  PackagePlus,
  Receipt,
  Settings,
  ShoppingBasket,
  Warehouse,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Deconnexion from "./deconnexion";
const menu = [
  { name: "Tableau de Bord", icon: <LayoutDashboard />, href: "/acceuil" },
  { name: "Produits", icon: <ShoppingBasket />, href: "/produits" },
  {
    name: "Nouveau Produits",
    icon: <PackagePlus />,
    href: "/nouveau-produits",
  },
  { name: "Catégorie", icon: <ListTree />, href: "/categorie" },
  { name: "Donner", icon: <HandHeart />, href: "/donner" },
  { name: "Transaction", icon: <Receipt />, href: "/transaction" },
];

export const NavBar = ({ OpenModale2, OpenModale1 }) => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [DisplayName, setDisplayName] = useState(null);
  const [DataInfo, setDataInfo] = useState([]);
  const pathname = usePathname();
  useEffect(() => {
    fetch("/api/profile", {
      credentials: "include", // Obligatoire pour envoyer les cookies
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setDataInfo(data.user.uid);
        } else {
          console.warn("Non connecté :", data.error);
        }
      });
  }, []);

  const [open, setOpen] = useState(false);

  const router = useRouter();

  const menuRef = useRef();
  const buttonRef = useRef();
  // deconnexion
  const logout = async () => {
    const r = await fetch(`${apiBaseUrl}/api/logout`, {
      method: "POST",
    });

    if (r.ok) {
      toast.info("Vous êtes déconnecté");
      setTimeout(() => {
        router.push("/connexion");
      }, 3000); // Redirige vers la page de login
    } else {
      alert("Erreur lors de la deconnexion");
    }
  };
  useEffect(() => {
    const handler = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    let timeout = setTimeout(() => {
      document.addEventListener("click", handler);
    }, 100); // ← petit délai pour éviter de capturer le clic qui ouvre
    return () => {
      clearTimeout(timeout);
      document.removeEventListener("click", handler);
    };
  }, []);

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/userData/getUserData?uid=${DataInfo}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((doc) => {
        if (Array.isArray(doc.table)) {
          setDisplayName(doc.table);
        } else if (doc.table) {
          setDisplayName([doc.table]);
        }
      });
  }, [DataInfo]);

  return (
    <div className="md:mt-8 md:px-30 w-full mb-8">
      <div className="md:flex  justify-between items-center justify-items-center">
        <Link href={"/acceuil"}>
          <button className="hidden md:flex items-center bg-gray-500 py-1 gap-2 justify-center px-1 rounded-sm cursor-pointer">
            <PackagePlus />
            AssoStock
          </button>
        </Link>

        <div className="hidden md:flex space-x-3 ">
          {menu.map((items, index) => (
            <Link key={index} href={items.href}>
              <button
                className={` ${
                  pathname === items.href ? "bg-blue-400" : "bg-gray-500 "
                }  flex items-center py-1 gap-2 justify-center px-1 rounded-sm cursor-pointer`}
              >
                {items.icon} {items.name}
              </button>
            </Link>
          ))}
          <Link href={"#"}>
            <button
              onClick={OpenModale2}
              className="inline-flex bg-gray-500 items-center py-1 gap-2 justify-center px-1 rounded-sm cursor-pointer"
            >
              <Warehouse />
              Alimenter le stock
            </button>
          </Link>
          {Array.isArray(DisplayName) &&
            DisplayName.map((items, index) => (
              <Deconnexion nameUser={items.displayName} key={index} />
            ))}
        </div>
      </div>

      {/* Menu phone */}
      <div
        className={`md:hidden flex justify-between items-center px-4 py-4 ${
          open ? "hidden" : "block"
        }`}
      >
        <button className="flex gap-2">
          <PackagePlus />
          AssoStock
        </button>
        <div
          ref={buttonRef}
          onClick={() => {
            setOpen(!open);
          }}
          className="bg-gray-600 p-2 rounded-sm cursor-pointer"
        >
          <AlignJustify />
        </div>
      </div>

      {/* Menu mobile avec bouton Profil en bas */}
      <div
        ref={menuRef}
        className={`md:hidden bg-gray-900 w-8/12 fixed top-0 left-0 h-[100vh] transition-transform duration-300 ease-in-out z-50 py-6 px-4 flex flex-col justify-between   ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Haut du menu */}
        <div className="grid grid-cols-1 gap-4">
          {menu.map((items, index) => (
            <Link
              onClick={() => setOpen(false)}
              key={index}
              href={items.href}
              className={`${
                pathname === items.href ? "bg-blue-400" : "bg-gray-500 "
              }  inline-flex p-2 rounded-2xl gap-3 items-center  `}
            >
              {items.icon} {items.name}
            </Link>
          ))}
          <button
            onClick={OpenModale1}
            className="bg-gray-500 inline-flex p-2 rounded-2xl gap-3 items-center cursor-pointer"
          >
            <Warehouse />
            Alimenter le stock
          </button>
        </div>

        {/* Bas du menu : bouton Profil */}
        <div className="mb-8 flex flex-col">
          <div className="inline-flex space-x-3 items-center cursor-pointer p-2">
            <CircleUserRound />
            {Array.isArray(DisplayName) &&
              DisplayName.map((item, index) => (
                <span key={index}>{item.displayName}</span>
              ))}
          </div>
          <div
            onClick={() => (location.href = "/reglage/profil")}
            className="inline-flex space-x-3 items-center cursor-pointer p-2"
          >
            <Settings />
            <span>Paramètre</span>
          </div>
          <div
            className="inline-flex space-x-3 items-center cursor-pointer p-2"
            onClick={logout}
          >
            <LogOut />
            <span>Déconnexion</span>
          </div>
        </div>
      </div>
    </div>
  );
};
