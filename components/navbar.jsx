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
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import Deconnexion from "./deconnexion";
import { ModuleComposant } from "./modale-composant";

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
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
  const [displayName, setDisplayName] = useState(null);
  const [userUid, setUserUid] = useState(null);
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Récupération de l'UID utilisateur
  useEffect(() => {
    fetch("/api/profile", {
      credentials: "include", // Obligatoire pour envoyer les cookies
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUserUid(data.user.uid);
        } else {
          console.warn("Non connecté :", data.error);
        }
      });
  }, []);

  // Récupération des infos utilisateur (displayName)
  useEffect(() => {
    if (!userUid) return;
    fetch(`${apiBaseUrl}/api/userData/getUserData?uid=${userUid}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((doc) => {
        if (Array.isArray(doc.table)) {
          setDisplayName(doc.table);
        } else if (doc.table) {
          setDisplayName([doc.table]);
        }
      })
      .catch(() => setDisplayName(null));
  }, [userUid, apiBaseUrl]);

  // Gestion du clic en dehors du menu pour le fermer
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

    const timeout = setTimeout(() => {
      document.addEventListener("click", handler);
    }, 100);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener("click", handler);
    };
  }, []);

  // Fonction déconnexion
  const logout = async () => {
    const res = await fetch(`${apiBaseUrl}/api/logout`, {
      method: "POST",
    });

    if (res.ok) {
      toast.info("Vous êtes déconnecté");
      setTimeout(() => {
        router.push("/connexion");
      }, 3000);
    } else {
      alert("Erreur lors de la déconnexion");
    }
  };

  return (
    <div className="md:mt-8 md:px-30 w-full mb-8">
      <div className="md:flex justify-between items-center">
        <Link href="/acceuil">
          <button className="hidden md:flex items-center bg-gray-500 py-1 gap-2 justify-center px-1 rounded-sm cursor-pointer">
            <PackagePlus />
            AssoStock
          </button>
        </Link>

        <div className="hidden md:flex space-x-3">
          {menu.map((item, index) => (
            <Link key={index} href={item.href}>
              <button
                className={`flex items-center py-1 gap-2 justify-center px-1 rounded-sm cursor-pointer ${
                  pathname === item.href ? "bg-blue-400" : "bg-gray-500"
                }`}
              >
                {item.icon} {item.name}
              </button>
            </Link>
          ))}

          <button
            onClick={OpenModale2}
            className="inline-flex bg-gray-500 items-center py-1 gap-2 justify-center px-1 rounded-sm cursor-pointer"
          >
            <Warehouse />
            Alimenter le stock
          </button>

          {Array.isArray(displayName) &&
            displayName.map((item, index) => (
              <Deconnexion nameUser={item.displayName} key={index} />
            ))}
        </div>
      </div>

      {/* Menu téléphone */}
      <div
        className={`md:hidden flex justify-between items-center px-4 py-4 ${
          open ? "hidden" : "block"
        }`}
      >
        <button className="flex gap-2 items-center">
          <PackagePlus />
          AssoStock
        </button>
        <div
          ref={buttonRef}
          onClick={() => setOpen(!open)}
          className="bg-gray-600 p-2 rounded-sm cursor-pointer"
          aria-label="Ouvrir le menu"
        >
          <AlignJustify />
        </div>
      </div>

      {/* Menu mobile avec bouton Profil en bas */}
      <nav
        ref={menuRef}
        className={`md:hidden bg-gray-900 w-8/12 fixed top-0 left-0 h-screen transition-transform duration-300 ease-in-out z-50 py-6 px-4 flex flex-col justify-between ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Haut du menu */}
        <div className="grid grid-cols-1 gap-4">
          {menu.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`inline-flex p-2 rounded-2xl gap-3 items-center ${
                pathname === item.href ? "bg-blue-400" : "bg-gray-500"
              }`}
            >
              {item.icon} {item.name}
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
        <div className="mb-20 flex flex-col">
          <div className="inline-flex space-x-3 items-center cursor-pointer p-2">
            <CircleUserRound />
            {Array.isArray(displayName) &&
              displayName.map((item, index) => (
                <span key={index}>{item.displayName}</span>
              ))}
          </div>
          <div
            onClick={() => router.push("/reglage/profil")}
            className="inline-flex space-x-3 items-center cursor-pointer p-2"
          >
            <Settings />
            <span>Paramètre</span>
          </div>
          <div
            onClick={logout}
            className="inline-flex space-x-3 items-center cursor-pointer p-2"
          >
            <LogOut />
            <span>Déconnexion</span>
          </div>
        </div>
      </nav>
    </div>
  );
};
