import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Bouton } from "./bouton";

const unite = [
  { id: 1, nom: "Kilogramme", abbr: "kg", type: "poids" },
  { id: 2, nom: "Grammes", abbr: "g", type: "poids" },
  { id: 3, nom: "Milligrammes", abbr: "mg", type: "poids" },
  { id: 4, nom: "Livre", abbr: "lb", type: "poids" },
  { id: 5, nom: "Once", abbr: "oz", type: "poids" },
];

export const ProduisComposant = ({ titre }) => {
  const router = useRouter();
  const [RecupeId, setRecupeId] = useState(null);
  const [TableCategorie, setTableCategorie] = useState([]);
  const [DataInfo, setDataInfo] = useState(null);
  const [LengthCategorie, setLengthCategorie] = useState(null);
  const [InputValue, setInputValue] = useState({
    name: "",
    price: "",
    quantity: "",
    unit: "",
    categorie: "",
    description: "",
  });

  const handChang = (e) => {
    const { name, value } = e.target;
    setInputValue((prev) => ({
      ...prev,
      [name]: name === "price" || name === "quantity" ? Number(value) : value,
    }));
  };

  // Récupère l'UID du profil
  useEffect(() => {
    async function GetProfile() {
      try {
        const r = await fetch("http://localhost:3000/api/profile", {
          credentials: "include",
        });
        const data = await r.json();
        setDataInfo(data.user.uid);
      } catch (error) {
        toast.error("Erreur lors du chargement du profil");
      }
    }
    GetProfile();
  }, []);

  // Récupère les catégories liées à l'UID
  useEffect(() => {
    if (!DataInfo) return;

    async function fetchCategories() {
      try {
        const r = await fetch(
          `http://localhost:3000/api/getcategorie?uid=${DataInfo}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await r.json();

        const result = !data.table?.length ? true : false;

        console.log("datalength", result);

        setLengthCategorie(result);
        if (data.table.length > 0) {
          setRecupeId(data.table[0].id);
        }

        if (r.ok) {
          setTableCategorie(data.table);
        }
      } catch (error) {
        toast.error("Erreur lors du chargement des catégories");
      }
    }

    fetchCategories();
  }, [DataInfo]);

  // Ajout d’un produit
  async function AddProduit(e) {
    e.preventDefault();

    const body = { ...InputValue, categoryId: RecupeId };

    try {
      if (LengthCategorie === true) {
        toast.error("Créer une cétégorie avant ajout d'un produit ");
      } else if (InputValue.categorie === "") {
        toast.error("Veillez ajouter une catégorie au produit !");
      } else {
        const r = await fetch(
          `http://localhost:3000/api/produitsadd?uid=${DataInfo}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          }
        );

        const data = await r.json();

        const messae = data.message;

        if (r.ok) {
          toast.success(messae);
          setInputValue({
            name: "",
            price: "",
            quantity: "",
            unit: "",
            categorie: "",
            description: "",
          });
        } else {
          toast.error(messae);
        }
      }
    } catch (error) {
      toast.error("Une erreur est survenue !");
    }
  }

  return (
    <div>
      <div className="grid gap-4 px-2 md:px-40 w-full">
        <h1>{titre}</h1>
        <form className="grid gap-4 w-full" onSubmit={AddProduit}>
          <input
            name="name"
            type="text"
            className="border border-amber-100 rounded-sm p-2 w-full outline-none"
            placeholder="Nom"
            onChange={handChang}
            value={InputValue.name}
          />
          <textarea
            name="description"
            className="border border-amber-100 rounded-sm py-4 px-2 w-full"
            placeholder="Description"
            onChange={handChang}
            value={InputValue.description}
          ></textarea>
          <input
            name="price"
            type="number"
            className="border border-amber-100 rounded-sm p-2 w-full outline-none"
            placeholder="Prix"
            onChange={handChang}
            value={InputValue.price}
          />
          <div>
            <select
              name="categorie"
              className="border border-amber-100 py-2 px-1 rounded-sm w-full text-white cursor-pointer"
              onChange={handChang}
              value={InputValue.categorie}
            >
              <option className="text-black" value="">
                Catégorie
              </option>
              {TableCategorie.map((items) => (
                <option
                  key={items.id}
                  className="text-black"
                  value={items.name}
                >
                  {items.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              name="unit"
              className="border border-amber-100 py-2 px-1 rounded-sm w-full text-white cursor-pointer"
              onChange={handChang}
              value={InputValue.unit}
            >
              <option className="text-black" value="">
                Unité
              </option>
              {unite.map((items) => (
                <option
                  key={items.id}
                  className="text-black"
                  value={items.abbr}
                >
                  {items.nom}
                </option>
              ))}
            </select>
          </div>

          <Bouton
            name="Créer le produit"
            className="bg-pink-400 px-3 py-1 rounded-sm cursor-pointer"
          />
        </form>
      </div>
    </div>
  );
};
