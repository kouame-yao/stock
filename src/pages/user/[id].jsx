import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Bouton } from "../../../components/bouton";
import Wrapper from "../../../components/wrapper";
import withAuth from "../../../lib/withAuth";

const unite = [
  { id: 1, nom: "Kilogramme", abbr: "kg", type: "poids" },
  { id: 2, nom: "Grammes", abbr: "g", type: "poids" },
  { id: 3, nom: "Milligrammes", abbr: "mg", type: "poids" },
  { id: 4, nom: "Livre", abbr: "lb", type: "poids" },
  { id: 5, nom: "Once", abbr: "oz", type: "poids" },
];
export default function UserPage() {
  const router = useRouter();
  const { id } = router.query;
  const [DataInfo, setDataInfo] = useState([]);
  const [TableProduit, setTableProduit] = useState([]);
  const [InputValue, setInputValue] = useState([]);
  const [lastEditedField, setLastEditedField] = useState("");

  const handChange = (index, field, value) => {
    setLastEditedField(`${field}: ${value}`);
    setInputValue((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, [field]: field === "price" ? Number(value) : value }
          : item
      )
    );
  };
  useEffect(() => {
    const value = Array.isArray(TableProduit)
      ? TableProduit.map((item) => ({
          description: item.description,
          name: item.name,
          unit: item.unit,
          price: item.price,
        }))
      : [];

    setInputValue(value);
  }, [TableProduit]);

  useEffect(() => {
    // Étape 1 : récupérer le profil
    async function GetProfil() {
      const r = await fetch("http://localhost:3000/api/profile", {
        credentials: "include",
      });

      const data = await r.json();

      setDataInfo(data.user.uid); // Déclenchera le useEffect suivant
    }

    GetProfil();
  }, []);

  useEffect(() => {
    async function GetProduits() {
      const r = await fetch(
        `http://localhost:3000/api/getproduitobjet?uid=${DataInfo}&id=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await r.json();
      const docs = data.table;

      setTableProduit(docs);

      // setTableProduit(data);
    }

    GetProduits();
  }, [DataInfo, id]);

  async function EditedProduits(e) {
    console.log(e);

    e.preventDefault();
    const body = { ...InputValue[0], id };

    const r = await fetch(
      `http://localhost:3000/api/editeproduits?uid=${DataInfo}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
    const data = await r.json();
    const message = data.message;
    if (r.ok) {
      toast.success(`${message}: ${lastEditedField}`);

      setTimeout(() => {
        document.location.href = "/produits";
      }, 3000);
    } else {
      toast.error(message);
    }
  }
  // console.log(InputValue);

  return (
    <div>
      <Wrapper />
      <div className="grid gap-4 px-2 md:px-40 w-full">
        <h1>Modifier</h1>
        {InputValue.map((item, index) => (
          <form onSubmit={EditedProduits} className="grid gap-4 w-full">
            <input
              name="name"
              value={item.name}
              onChange={(e) => handChange(index, "name", e.target.value)}
              type="text"
              className="border border-amber-100 rounded-sm p-2 w-full outline-none"
              placeholder="Nom"
            />
            <textarea
              name="description"
              value={item.description}
              onChange={(e) => handChange(index, "description", e.target.value)}
              className="border border-amber-100 rounded-sm py-4 px-2 w-full"
              placeholder="Description"
            ></textarea>
            <input
              name="price"
              value={item.price}
              onChange={(e) => handChange(index, "price", e.target.value)}
              type="number"
              className="border border-amber-100 rounded-sm p-2 w-full outline-none"
              placeholder="Prix"
            />
            <div>
              <select
                className="border border-amber-100 py-2 px-1 rounded-sm w-full text-white cursor-pointer "
                name=""
                id=""
              >
                {Array.isArray(TableProduit) &&
                  TableProduit.map((items) => (
                    <option
                      key={items.id}
                      className="text-black"
                      value={items.categorie}
                    >
                      {items.categorie}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <select
                onChange={handChange}
                className="border border-amber-100 py-2 px-1 rounded-sm w-full text-white cursor-pointer "
                name="unit"
                id=""
              >
                <option className="text-black" value="">
                  Unité
                </option>
                {unite.map((items, index) => (
                  <option key={index} className="text-black" value={items.abbr}>
                    {items.nom}
                  </option>
                ))}
              </select>
            </div>

            <Bouton
              type={"submit"}
              name="Modifier"
              className="bg-pink-400 px-3 py-1 rounded-sm cursor-pointer"
            />
          </form>
        ))}
      </div>
    </div>
  );
}
