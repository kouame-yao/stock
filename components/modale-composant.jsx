import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Bouton } from "./bouton";

export const ModuleComposant = ({ CloseModale }) => {
  const [DataInfo, setDataInfo] = useState([]);
  const [TableProduit, setTableProduit] = useState([]);
  const [OptionValue, setOptionValue] = useState(null);
  const [Inputvalue, setInputValue] = useState({
    newQuantity: 0,
  });

  useEffect(() => {
    async function GetProfil() {
      const r = await fetch("http://localhost:3000/api/profile", {
        credentials: "include",
      });
      const data = await r.json();
      setDataInfo(data.user.uid);
    }
    GetProfil();
  }, []);

  useEffect(() => {
    async function GetProduits() {
      if (!DataInfo) return;
      const r = await fetch(
        `http://localhost:3000/api/getproduits?uid=${DataInfo}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await r.json();
      setTableProduit(data.table);
    }
    GetProduits();
  }, [DataInfo]);

  const HandChange = (e) => {
    const produitId = e.target.value;
    const produit = TableProduit.find((prev) => prev.id === produitId);
    if (produit) {
      setOptionValue(produit);
      setInputValue({ newQuantity: 0 }); // Reset input à chaque nouveau produit sélectionné
    }
  };

  const handleInputChange = (e) => {
    const updatedQuantity = Number(e.target.value);
    setInputValue((prev) => ({
      ...prev,
      newQuantity: updatedQuantity,
    }));
  };

  async function EdidteQuantite(id) {
    const quantiteAAjouter = Inputvalue.newQuantity;

    if (quantiteAAjouter <= 0) {
      alert("Veuillez entrer une quantité positive à ajouter.");
      return;
    }

    const copie = TableProduit.map((prev) => {
      return prev.id === id
        ? {
            ...prev,
            quantity: prev.quantity + quantiteAAjouter,
          }
        : prev;
    });
    setTableProduit(copie);

    const body = { newQuantity: quantiteAAjouter, id: id };

    const r = await fetch(
      `http://localhost:3000/api/ajouterquantite?uid=${DataInfo}&id=${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
    const data = await r.json();
    if (r.ok) {
      toast.success("Quantité ajouter au produit avec succès");
    } else {
      toast.error("Impossible d'ajouter des quantité avec produit");
    }
  }

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center transition-opacity duration-300">
      <div className="bg-gray-900 rounded-sm shadow-lg p-6 w-full max-w-lg mx-4 relative animate-fadeIn border border-amber-100 ">
        <button
          onClick={CloseModale}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl font-bold"
        >
          &times;
        </button>
        <div>
          <h1>
            <strong>Gestion du stock</strong>
          </h1>
          <div className="grid space-y-3">
            <span>
              Ajouter des quantité aux produits disponibles dans votre stock
            </span>
            <span>Sélectionner un produit</span>
            <select
              className="border border-amber-100 p-1 rounded-sm w-full outline-none"
              name={"name"}
              onChange={HandChange}
            >
              <option value="">Sélectionner le produit</option>
              {TableProduit.map((items) => (
                <option className="text-black" key={items.id} value={items.id}>
                  {items.name}
                </option>
              ))}
            </select>

            {OptionValue && (
              <div className="grid space-y-2">
                <strong>NOM: {OptionValue.name}</strong>
                <span>
                  <strong>CATEGORIE:</strong>{" "}
                  <span className="bg-amber-100 text-orange-500 rounded-sm p-1">
                    {OptionValue.categorie}
                  </span>
                </span>
                <span>
                  <strong>QUANTITE:</strong>{" "}
                  <span className="bg-amber-100 text-orange-500 rounded-sm p-1">
                    {Number(OptionValue.quantity) +
                      Number(Inputvalue.newQuantity)}{" "}
                    {OptionValue.unit}
                  </span>
                </span>
              </div>
            )}

            <span>Quantité à ajouter</span>
            <input
              name="quantity"
              type="number"
              value={Inputvalue.newQuantity}
              onChange={handleInputChange}
              className="border border-amber-100 p-1 w-full rounded-sm outline-none"
            />

            <Bouton
              onClick={() => {
                if (OptionValue?.id) {
                  EdidteQuantite(OptionValue.id);
                } else {
                  console.warn("Aucun produit sélectionné");
                }
              }}
              className={"p-1 px-3 cursor-pointer rounded-sm bg-pink-400"}
              name={"Ajouter au stock"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
