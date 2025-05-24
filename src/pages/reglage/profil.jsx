import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { CircleUserRound, Fingerprint } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Wrapper from "../../../components/wrapper";
import withAuth from "../../../lib/withAuth";

const butonList = [
  { name: "Général", icon: <CircleUserRound /> },
  { name: "Sécurité", icon: <Fingerprint /> },
];

const Réglage = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();
  const [Button, setButton] = useState("Général");
  const [ElementAffiche, setElementAffiche] = useState(null);
  const [email, setEmail] = useState(null);

  const [Message, setMessage] = useState(null);
  const [DisplayName, setDisplayName] = useState([]);
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [valueInput, setValueInput] = useState({
    displayName: "",
    email: "",
    password: "",
    password2: "",
  });
  const [DataInfo, setDataInfo] = useState([]);

  const handChange = (e) => {
    const { name, value } = e.target;
    setValueInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  async function EditeName() {
    const body = { displayName: valueInput.displayName, uid: DataInfo };
    const newTable = Array.isArray(DisplayName)
      ? DisplayName.map((item) => ({
          ...item,
          displayName: valueInput.displayName,
        }))
      : [];
    setDisplayName(newTable);
    const r = await fetch(`${apiBaseUrl}/api/reglage/miseajourprofil`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await r.json();
    console.log(data.message);

    if (r.ok) {
      toast.success("Mise ajour du Nom effectué avec succès");
      setValueInput({
        displayName: "",
        email: "",
        password: "",
        password2: "",
      });
    } else {
      toast.error("Impossible de mettre ajour Le Nom");
    }
  }

  async function EditeEmail() {
    const body = { email: valueInput.email, uid: DataInfo };
    const r = await fetch(`${apiBaseUrl}/api/reglage/updateEmail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await r.json();
    console.log(data.message);

    if (r.ok) {
      toast.success("Mise ajour du Email effectué avec succès");
      setValueInput({
        displayName: "",
        email: "",
        password: "",
        password2: "",
      });
    } else {
      toast.error("Impossible de mettre ajour Le Email");
    }
  }

  async function EditePassword(e) {
    e.preventDefault();
    if (valueInput.password === valueInput.password2) {
      const body = { password: valueInput.password, uid: DataInfo };
      const r = await fetch(`${apiBaseUrl}/api/reglage/updatepassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await r.json();
      console.log(data.message);
      if (r.ok) {
        toast.success("Mise ajour du Mot de pass effectué avec succès");
        setValueInput({
          displayName: "",
          email: "",
          password: "",
          password2: "",
        });
      } else {
        toast.error("Impossible de mettre ajour Le Mot de pass");
      }
    } else {
      setMessage("Mot de pass incorrect veillez vérifiez");
    }
  }

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/profile`, {
      credentials: "include", // Obligatoire pour envoyer les cookies
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setDataInfo(data.user.uid);
          setUser(data.user.user);
        } else {
          console.warn("Non connecté :", data.error);
        }
      });
  }, []);

  const changeItem = (doc) => {
    setButton(doc);
  };

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

  async function DeletedProil() {
    const r = await fetch(
      `${apiBaseUrl}/api/DeletedCompte/deleted?uid=${DataInfo}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await r.json();

    if (r.ok) {
      toast.success("Votre compte a été supprimer avec succès");
      setTimeout(() => {
        document.location.href = "/connexion";
      }, 3000);
    } else {
      toast.error("Impossible de supprimer l'utilisateur");
    }
  }
  //   deconnexion

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
  return (
    <div>
      <Wrapper />
      <div className="md:flex w-full justify-center  gap-10 ">
        <div className="md:flex md:flex-col md:justify-start md:space-y-2 w-full md:max-w-50 flex justify-center gap-2">
          {butonList.map((item, index) => (
            <button
              onClick={() => changeItem(item.name)}
              key={index}
              className={`${
                Button === item.name
                  ? "bg-blue-200 text-blue-600"
                  : "bg-white text-blue-300"
              } " p-2  px-3 rounded-sm flex gap-3 items-start justify-start cursor-pointer "`}
            >
              {item.icon}
              {item.name}
            </button>
          ))}
        </div>

        {Button === "Général" && (
          <div className="grid px-3 mt-4">
            <div className="mb-4">
              <p>Profil</p>
              <span>
                Ces informations seront affichées publiquement, alors faites
                attention à ce que vous partagez.
              </span>
            </div>

            {/* Nom */}

            {Array.isArray(DisplayName) &&
              DisplayName.map((item, index) => (
                <div
                  key={index}
                  className=" justify-between p-4 border-b border-blue-50 border-t"
                >
                  <div className="flex justify-between">
                    <span>Nom</span>
                    <span>{item.displayName}</span>
                    <button
                      onClick={() => setElementAffiche(!false)}
                      className="font-bold text-blue-600 cursor-pointer"
                    >
                      Mettre ajour
                    </button>
                  </div>
                  {ElementAffiche && (
                    <div className="mt-4 flex justify-between items-center  ">
                      <span className=" ">Entrez votre Nom</span>
                      <input
                        name="displayName"
                        value={valueInput.displayName}
                        onChange={handChange}
                        type="text"
                        className="border border-blue-600 outline-none rounded-md px-3 w-full max-w-30 lg:max-w-1/2"
                      />
                      <button
                        className="font-bold cursor-pointer bg-blue-600 lg:px-3 rounded-sm px-1"
                        onClick={() => EditeName()}
                      >
                        Modifier
                      </button>
                    </div>
                  )}
                </div>
              ))}

            {/* Email */}
            {Array.isArray(DisplayName) &&
              DisplayName.map((item, index) => (
                <div
                  key={index}
                  className="justify-between p-4 border-b border-blue-50"
                >
                  <div className="flex justify-between ">
                    <span> email</span>
                    <span>
                      <br /> {item.email}
                    </span>
                    <button
                      onClick={() => {
                        setEmail(!false);
                      }}
                      className="font-bold text-blue-600 cursor-pointer"
                    >
                      Mettre ajour
                    </button>
                  </div>
                  {email && (
                    <div className="mt-4 flex justify-between items-center  ">
                      <span className=" ">Entrez votre Email</span>
                      <input
                        name="email"
                        value={valueInput.email}
                        onChange={handChange}
                        type="text"
                        className="border border-blue-600 outline-none rounded-md px-3 w-full max-w-30 lg:max-w-1/2"
                      />
                      <button
                        className="lg:font-bold cursor-pointer bg-blue-600 lg:px-3 rounded-sm px-1 "
                        onClick={() => EditeEmail()}
                      >
                        Modifier
                      </button>
                    </div>
                  )}
                </div>
              ))}

            <div>
              <div className="mt-4">
                <button
                  onClick={() => setOpen(true)}
                  className="bg-blue-600 px-3 rounded-sm p-1"
                >
                  Supprimer le compte
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Mot de pass */}

        {Button === "Sécurité" && (
          <div className="w-full md:max-w-168 px-3 mt-4">
            <div className="grid mb-4">
              <strong>Changer le mot de pass</strong>
              <span>
                Mettez à jour votre mot de passe associé à votre compte.
              </span>
            </div>
            <div>
              <form onSubmit={EditePassword}>
                <span className="grid gap-2 mb-4">
                  Nouveau mot de passe
                  <input
                    value={valueInput.password}
                    onChange={handChange}
                    name="password"
                    type="text"
                    className="border border-blue-600 rounded-sm outline-none px-3 py-1"
                  />
                </span>

                <span className="grid gap-2 mb-4">
                  Confirmez le mot de passe
                  <span className="text-red-400">{Message}</span>
                  <input
                    value={valueInput.password2}
                    name="password2"
                    onChange={handChange}
                    type="text"
                    className="border border-blue-600 rounded-sm outline-none px-3 py-1"
                  />
                </span>

                <button
                  type="submit"
                  className="bg-blue-400 p-1 px-8 rounded-md cursor-pointer hover:bg-blue-600 font-bold"
                >
                  Sauvegarder
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in "
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                    <ExclamationTriangleIcon
                      aria-hidden="true"
                      className="size-6 text-red-600"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <DialogTitle
                      as="h3"
                      className="text-base font-semibold text-gray-900"
                    >
                      Supression du compte
                    </DialogTitle>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Voulez vous supprimer votre compte ?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={() => {
                    DeletedProil(), logout();
                  }}
                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto"
                >
                  Supprimer
                </button>
                <button
                  type="button"
                  data-autofocus
                  onClick={() => setOpen(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default withAuth(Réglage);
