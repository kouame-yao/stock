import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
const Connexion = () => {
  // initialisation des hooks
  const [valuInput, setValuInput] = useState({
    email: "",
    password: "",
    emailValide: "",
  });
  // initialisation de la fonction de l'input
  const handOnchange = (e) => {
    const { name, value } = e.target;

    setValuInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // initialisation de l'api de connexion
  const router = useRouter();

  async function SignIn(e) {
    e.preventDefault();
    const r = await fetch("http://localhost:3000/api/userconnected", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(valuInput),
    });

    const data = await r.json();

    router.push("/acceuil");

    setValuInput({
      email: "",
      password: "",
    });
  }

  // Exemple React (useEffect)
  useEffect(() => {
    fetch("/api/profile", {
      credentials: "include", // Obligatoire pour envoyer les cookies
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          console.log("Utilisateur :", data);
        } else {
          console.warn("Non connecté :", data.error);
        }
      });
  }, []);

  async function EditePassword() {
    const body = { email: valuInput.emailValide };

    const r = await fetch(
      "http://localhost:3000/api/passwordOublier/passwordReset",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await r.json();
    const message = data.message;
    if (r.ok) {
      toast.success(message);
    } else {
      toast.error(message);
    }
  }

  return (
    <div className="bg-white">
      <div class="min-h-screen flex fle-col items-center justify-center">
        <div class="py-6 px-4">
          <div class="grid md:grid-cols-2 items-center gap-6 max-w-6xl w-full">
            <div class="border border-slate-300 rounded-lg p-6 max-w-md shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-md:mx-auto">
              <form class="space-y-6" onSubmit={SignIn}>
                <div class="mb-12">
                  <h3 class="text-slate-900 text-3xl font-semibold">
                    Se connecter
                  </h3>
                  <p class="text-slate-500 text-sm mt-6 leading-relaxed">
                    Veuillez vous connecter pour gérer efficacement votre stock
                    de produits, suivre l'état des inventaires en temps réel et
                    assurer un contrôle optimal de vos opérations.
                  </p>
                </div>

                <div>
                  <label class="text-slate-800 text-sm font-medium mb-2 block">
                    Email
                  </label>
                  <div class="relative flex items-center">
                    <input
                      name="email"
                      type="text"
                      required
                      class="w-full text-sm text-slate-800 border border-slate-300 pl-4 pr-10 py-3 rounded-lg outline-blue-600"
                      placeholder="Entrer votre email"
                      value={valuInput.email}
                      onChange={handOnchange}
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#bbb"
                      stroke="#bbb"
                      class="w-[18px] h-[18px] absolute right-4"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        cx="10"
                        cy="7"
                        r="6"
                        data-original="#000000"
                      ></circle>
                      <path
                        d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                        data-original="#000000"
                      ></path>
                    </svg>
                  </div>
                </div>
                <div>
                  <label class="text-slate-800 text-sm font-medium mb-2 block">
                    Mot de pass
                  </label>
                  <div class="relative flex items-center">
                    <input
                      name="password"
                      type="password"
                      required
                      value={valuInput.password}
                      class="w-full text-sm text-slate-800 border border-slate-300 pl-4 pr-10 py-3 rounded-lg outline-blue-600"
                      placeholder="Enter password"
                      onChange={handOnchange}
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#bbb"
                      stroke="#bbb"
                      class="w-[18px] h-[18px] absolute right-4 cursor-pointer"
                      viewBox="0 0 128 128"
                    >
                      <path
                        d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                        data-original="#000000"
                      ></path>
                    </svg>
                  </div>
                </div>

                <div class="flex flex-wrap items-center justify-between gap-4">
                  <div class="flex items-center">
                    <input
                      required
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      class="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                    />
                    <label
                      for="remember-me"
                      class="ml-3 block text-sm text-slate-500"
                    >
                      Se souvenir de toi
                    </label>
                  </div>

                  <div class="text-sm">
                    <label htmlFor="my_modal_7" className=" text-blue-500">
                      Mot de passe oublier ?
                    </label>
                  </div>
                </div>

                <div class="!mt-12">
                  <button
                    type="submit"
                    class="w-full shadow-xl py-2.5 px-4 text-[15px] font-medium tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none cursor-pointer"
                  >
                    Connexion
                  </button>
                  <p class="text-sm !mt-6 text-center text-slate-500">
                    Tu n'as pas de compte{" "}
                    <a
                      href="/"
                      class="text-blue-600 font-medium hover:underline ml-1 whitespace-nowrap"
                    >
                      S'inscrire ici
                    </a>
                  </p>
                </div>
              </form>
            </div>

            <div class="max-md:mt-8">
              <img
                src="https://readymadeui.com/login-image.webp"
                class="w-full aspect-[71/50] max-md:w-4/5 mx-auto block object-cover"
                alt="login img"
              />
            </div>
          </div>
        </div>
      </div>
      {/* modale mot de pass valide */}
      <input type="checkbox" id="my_modal_7" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box grid justify-center gap-2">
          <h3 className="text-lg font-bold">
            Veillez Entrer votre adress mail
          </h3>
          <input
            onChange={handOnchange}
            value={valuInput.emailValide}
            name="emailValide"
            type="text"
            className="border border-blue-600 outline-none rounded-sm px-2  "
            placeholder="Entrez l'email..."
          />
          <button
            onClick={() => EditePassword()}
            className="bg-blue-500 p-1 px-2 rounded-sm w-full max-w-1/2"
          >
            Valider
          </button>
        </div>
        <label className="modal-backdrop" htmlFor="my_modal_7">
          Close
        </label>
      </div>
    </div>
  );
};

export default Connexion;
