import { useState } from "react";
import { toast } from "react-toastify";

const Connexion = () => {
  // initialisation des hooks
  const [valuInput, setValuInput] = useState({
    displayName: "",
    email: "",
    password: "",
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

  async function SignIn(e) {
    e.preventDefault();
    const r = await fetch("http://localhost:3000/api/creeuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(valuInput),
    });

    const data = await r.json();
    console.log(data.message);

    if (r.ok) {
      toast.success("Inscription reussit");
    } else {
      toast.error(
        "Impossible de vous enregistré veillez utilisez un autre mail"
      );
    }

    setValuInput({
      email: "",
      password: "",
    });
  }

  return (
    <div className="bg-white">
      <div class="flex flex-col justify-center sm:h-screen p-4">
        <div class="max-w-md w-full mx-auto border border-slate-300 rounded-2xl p-8">
          <div class="text-center mb-12">
            <a href="javascript:void(0)">
              <img
                src="https://readymadeui.com/readymadeui.svg"
                alt="logo"
                class="w-40 inline-block"
              />
            </a>
          </div>

          <form onSubmit={SignIn}>
            <div class="space-y-6">
              <div>
                <label class="text-slate-800 text-sm font-medium mb-2 block">
                  Nom
                </label>
                <input
                  value={valuInput.displayName}
                  name="displayName"
                  type="text"
                  class="text-slate-800 bg-white border border-slate-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                  placeholder="Entrer votre nom"
                  onChange={handOnchange}
                />
              </div>
              <div>
                <label class="text-slate-800 text-sm font-medium mb-2 block">
                  Email
                </label>
                <input
                  value={valuInput.email}
                  name="email"
                  type="email"
                  class="text-slate-800 bg-white border border-slate-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                  placeholder="Entrer votre email"
                  onChange={handOnchange}
                />
              </div>
              <div>
                <label class="text-slate-800 text-sm font-medium mb-2 block">
                  Mot de pass
                </label>
                <input
                  value={valuInput.password}
                  name="password"
                  type="password"
                  class="text-slate-800 bg-white border border-slate-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                  placeholder="Entrer votre mot de pass"
                  onChange={handOnchange}
                />
              </div>

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
                  class="text-slate-800 ml-3 block text-sm"
                >
                  J'accepte les{" "}
                  <a
                    href="javascript:void(0);"
                    class="text-blue-600 font-medium hover:underline ml-1"
                  >
                    conditions générales
                  </a>
                </label>
              </div>
            </div>

            <div class="mt-12">
              <button
                type="submit"
                class="w-full py-3 px-4 text-sm tracking-wider font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none cursor-pointer"
              >
                Créer un compte
              </button>
            </div>
            <p class="text-slate-800 text-sm mt-6 text-center">
              Vous avez déjà un compte ?{" "}
              <a
                href="/connexion"
                class="text-blue-600 font-medium hover:underline ml-1"
              >
                Se connecter ici
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Connexion;
