import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { CircleUserRound } from "lucide-react";
import { toast } from "react-toastify";

export default function Deconnexion({ nameUser, key }) {
  const logout = async () => {
    const r = await fetch("/api/logout", {
      method: "POST",
    });

    if (r.ok) {
      toast.info("Vous êtes déconnecté");
      setTimeout(() => {
        router.push("/connexion");
      }, 2500); // Redirige vers la page de login
    } else {
      alert("Erreur lors de la deconnexion");
    }
  };
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="inline-flex items-center   justify-center px-1 py-1   gap-x-1.5 rounded-full bg-white  text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 cursor-pointer">
          <CircleUserRound />
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
      >
        <div className="py-1">
          <MenuItem>
            <a
              href="#"
              key={key}
              className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
            >
              {nameUser}
            </a>
          </MenuItem>

          <MenuItem>
            <a
              href="/reglage/profil"
              className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
            >
              Account settings
            </a>
          </MenuItem>
          <form action="#" method="POST">
            <MenuItem>
              <button
                onClick={logout}
                type="submit"
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden cursor-pointer "
              >
                Sign out
              </button>
            </MenuItem>
          </form>
        </div>
      </MenuItems>
    </Menu>
  );
}
