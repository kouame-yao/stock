import { Pen, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Bouton } from "../../components/bouton";
import Wrapper from "../../components/wrapper";
import withAuth from "../../lib/withAuth";
const Categorie = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [Open, setOpen] = useState(false);
  const [OpenEdited, setOpenEdited] = useState(false);
  const [DataInfo, setDataInfo] = useState(null);
  const [Categorie, setCategorie] = useState([]);
  const [searchId, setSearchId] = useState(null);

  const [InputModale, setInputModale] = useState({
    name: "",
    description: "",
  });

  // Valeur input

  const handChange = (e) => {
    const { name, value } = e.target;

    setInputModale((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Récupération du profil utilisateur
  useEffect(() => {
    async function GetProfil() {
      const r = await fetch(`${apiBaseUrl}/api/profile`, {
        credentials: "include",
      });
      const data = await r.json();
      setDataInfo(data.user.uid);
    }
    GetProfil();
  }, []);

  useEffect(() => {
    // Étape 2 : attendre que DataInfo.uid soit prêt
    if (!DataInfo) return;

    async function fetchCategories() {
      const r = await fetch(`${apiBaseUrl}/api/getcategorie?uid=${DataInfo}`);
      const data = await r.json();

      setCategorie(data.table);
    }

    fetchCategories();
  }, [DataInfo]);

  // ajouter une categorie

  async function AddCategorie(e) {
    const body = { ...InputModale, uid: DataInfo };
    e.preventDefault();
    const r = await fetch(`${apiBaseUrl}/api/categorieadd`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await r.json();

    const message = data.message;
    const id = data.id;

    if (r.ok) {
      const newCategori = {
        id: id,
        name: InputModale.name,
        description: InputModale.description,
      };
      setCategorie([newCategori, ...Categorie]);
      toast.success(message);
    } else {
      toast.error("Erreur lors de l'ajout de la catégorie");
    }
  }

  async function DeletedCategorie(id) {
    if (!DataInfo) return;

    const r = await fetch(`${apiBaseUrl}/api/deletecategorie?uid=${DataInfo}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    const data = await r.json();
    const message = data.message;
    if (r.ok) {
      const copie = Categorie.filter((doc) => doc.id !== id);
      setCategorie(copie);

      toast.success(message);
    } else {
      toast.error("Impossible de supprimer la cégorie");
    }
  }

  async function EditedCategorie(e, id) {
    e.preventDefault();
    const body = { ...InputModale, id: id };
    const r = await fetch(`${apiBaseUrl}/api/editedcategorie?uid=${DataInfo}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await r.json();
    const message = data.message;
    if (r.ok) {
      const newCopie = Categorie.map((item) =>
        item.id == id
          ? {
              ...item,
              name: InputModale.name,
              description: InputModale.description,
            }
          : item
      );

      setCategorie(newCopie);
      toast.success(message);
    } else {
      toast.error("Impossible de modifier la catégorie");
    }
  }

  return (
    <div>
      <Wrapper />
      <div className="grid space-y-4 px-3 md:px-40 cursor-pointer">
        <div>
          <Bouton
            onClick={() => setOpen(true)}
            name={"Ajouter une catégorie"}
            className="bg-pink-400 px-3 rounded-sm py-1 cursor-pointer"
          />
        </div>
        <div className="grid gap-4">
          {Categorie.map((items, index) => (
            <div
              key={index}
              className="border border-amber-100 flex justify-between items-center rounded-2xl p-2 px-8 "
            >
              <div className="grid space-y-1">
                <strong>{items.name}</strong>
                <span>{items.description}</span>
              </div>
              <div className="flex space-x-3">
                <Bouton
                  onClick={() => {
                    setOpenEdited(true);
                    setSearchId(items.id);
                  }}
                  className={"bg-gray-400 p-2 rounded-sm cursor-pointer"}
                  name={<Pen />}
                />
                <Bouton
                  onClick={() => DeletedCategorie(items.id)}
                  className={"bg-red-400 p-2 rounded-sm cursor-pointer"}
                  name={<Trash />}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Modale */}
      {Open && (
        <div className="bg-black/50 h-screen fixed z-0 inset-0 grid justify-center  items-center">
          <div className="bg-gray-900 py-4 px-4 rounded-sm grid space-y-4">
            <div className="flex justify-between">
              <h1>Ajouter une catégorie</h1>
              <span onClick={() => setOpen(false)} className="cursor-pointer">
                X
              </span>
            </div>
            <form onSubmit={AddCategorie}>
              <div className=" space-y-4">
                <input
                  value={InputModale.name}
                  name="name"
                  type="text"
                  className="border border-amber-100 w-full outline-none p-1 rounded-sm"
                  placeholder="Nom"
                  onChange={handChange}
                />
                <input
                  name="description"
                  value={InputModale.description}
                  type="text"
                  className="border border-amber-100 w-full outline-none p-1 rounded-sm"
                  placeholder="Description"
                  onChange={handChange}
                />
                <Bouton
                  type={"submit"}
                  className={"bg-pink-400 p-1 px-3 rounded-sm cursor-pointer"}
                  name={"Créer"}
                />
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modale 2 */}
      {OpenEdited && (
        <div className="bg-black/50 h-screen fixed z-0 inset-0 grid justify-center  items-center">
          <div className="bg-gray-900 py-4 px-4 rounded-sm grid space-y-4">
            <div className="flex justify-between">
              <h1>Modifier la catégorie</h1>
              <span
                onClick={() => setOpenEdited(false)}
                className="cursor-pointer"
              >
                X
              </span>
            </div>
            <form onSubmit={(e) => EditedCategorie(e, searchId)}>
              <div className=" space-y-4">
                <input
                  value={InputModale.name}
                  name="name"
                  type="text"
                  className="border border-amber-100 w-full outline-none p-1 rounded-sm"
                  placeholder="Nom"
                  onChange={handChange}
                />
                <input
                  name="description"
                  value={InputModale.description}
                  type="text"
                  className="border border-amber-100 w-full outline-none p-1 rounded-sm"
                  placeholder="Description"
                  onChange={handChange}
                />
                <Bouton
                  type={"submit"}
                  className={"bg-pink-400 p-1 px-3 rounded-sm cursor-pointer"}
                  name={"Modifier"}
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(Categorie);
