import { PackageOpen, Table } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
export const ModuleComposant = ({ CloseModale }) => {
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
  const [dataInfo, setDataInfo] = useState(null);
  const [tableProduit, setTableProduit] = useState([]);
  const [currentInput, setcurrentInput] = useState(0);
  const [idItem, setIdItem] = useState(null);
  const [valueInput, setValueInput] = useState({
    newQuantity: "",
  });
  const [valueOption, setValueOption] = useState();

  // Récupération des produits après avoir récupéré le uid
  useEffect(() => {
    if (!dataInfo) return;

    async function getProduits() {
      try {
        const r = await fetch(`${apiBaseUrl}/api/getproduits?uid=${dataInfo}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!r.ok)
          throw new Error("Erreur lors de la récupération des produits");
        const data = await r.json();
        setTableProduit(data.table);
      } catch (err) {
        toast.error(err.message);
      }
    }

    getProduits();
  }, [dataInfo, apiBaseUrl]);

  // Récupération du profil utilisateur
  useEffect(() => {
    async function getProfil() {
      try {
        const r = await fetch(`${apiBaseUrl}/api/profile`, {
          credentials: "include",
        });
        if (!r.ok) throw new Error("Erreur lors de la récupération du profil");
        const data = await r.json();
        setDataInfo(data.user.uid);
      } catch (err) {
        toast.error(err.message);
      }
    }
    getProfil();
  }, [apiBaseUrl]);

  // Option onchange
  const HandChang = (e) => {
    setIdItem(e.target.value);
    const valeur = tableProduit.find((prev) => prev.id === e.target.value);
    setValueOption(valeur);
  };

  // Input onchange
  const HandChangInput = (e) => {
    const { name, value } = e.target;

    setValueInput((prev) => ({ ...prev, [name]: value }));
    const nombre = Number(e.target.value);
    const difference = nombre - currentInput;
    setcurrentInput(nombre);
    const copieTable = {
      ...valueOption,
      quantity: valueOption.quantity + difference,
    };

    setValueOption(copieTable);
  };

  // // recupt object
  // useEffect(() => {
  //   if (valueOption) {
  //     setnewTable([{ ...valueOption }]);
  //   }
  // }, [valueOption]);

  async function AddQuantite() {
    const body = { newQuantity: valueInput.newQuantity };

    const r = await fetch(
      `${apiBaseUrl}/api/ajouterquantite?uid=${dataInfo}&id=${idItem}`,
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
    <div className="flex flex-col justify-center items-center bg-black/50 fixed w-screen h-screen top-0 left-0 ">
      <div className="grid bg-gray-600 md:w-lg w-sm px-4 gap-4 py-4 rounded-md">
        <div className="grid gap-2">
          <div className="flex justify-between">
            <strong>Gestion du stock</strong>
            <button onClick={CloseModale} className="font-bold cursor-pointer">
              X
            </button>
          </div>
          <span>
            Ajouter des quantités aux produit disponible dans votre stock
          </span>
        </div>
        <div className="grid gap-2">
          <span>Sélectionner un produit</span>
          <select
            onChange={HandChang}
            className="border outline-amber-100 px-3 md:w-full  -outline-offset-4 border-amber-100 rounded-md p-1"
            name=""
            id=""
          >
            <option>Produit en stock</option>

            {tableProduit.map((item, index) => (
              <option
                key={index}
                className="text-black w-full max-w-sm "
                value={item.id}
              >
                {item.name}
              </option>
            ))}
          </select>
        </div>

        {Array.isArray(valueOption)
          ? []
          : [valueOption]
              .filter((item) => item)
              .map((item, index) => (
                <div className="flex items-center gap-4 border border-amber-100 p-3 rounded-md">
                  <PackageOpen
                    className="bg-pink-200 rounded-md"
                    color="black"
                    size={"100"}
                  />
                  <div className="grid gap-2">
                    <strong className=" text-gray-900">{item.name}</strong>
                    <span className="bg-amber-100 grid items-center justify-center text-orange-400 px-2 rounded-md">
                      {item.categorie}
                    </span>
                    <span className="bg-amber-100 grid items-center justify-center text-orange-400 px-2 rounded-md">
                      {item.quantity} {item.unit}
                    </span>
                  </div>
                </div>
              ))}

        <div className="grid gap-2">
          <span>Quantité a ajouter</span>
          <input
            onChange={HandChangInput}
            name="newQuantity"
            value={valueInput.newQuantity}
            type="number"
            className="border outline-amber-100 px-3 -outline-offset-4 border-amber-100 p-1 rounded-md"
          />
        </div>
        <button
          onClick={() => AddQuantite()}
          className="p-2 px-3 bg-pink-300 rounded-md cursor-pointer hover:bg-pink-500"
        >
          Ajouter au stock
        </button>
      </div>
    </div>
  );
};
