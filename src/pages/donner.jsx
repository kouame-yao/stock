import {
  HandHeart,
  PackageCheck,
  PackageOpen,
  PackageSearch,
  Plus,
  Trash,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Bouton } from "../../components/bouton";
import { Tableau } from "../../components/table";
import Wrapper from "../../components/wrapper";
import withAuth from "../../lib/withAuth";

const donner = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [DataInfo, setDataInfo] = useState([]);
  const [inputSearch, setInputSearch] = useState("");
  const [recupeId, setRecupeId] = useState(null);
  const [OrigineTableau, setOrigineTableau] = useState([]);
  const [InputUnitValue, setInputInitValue] = useState({ newQuantity: 0 });
  const [listeSelect, setListSelect] = useState([]);
  const [erreurMessage, setErreurMessage] = useState("");

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
    async function GetProduits() {
      if (!DataInfo) return;
      const r = await fetch(
        `${apiBaseUrl}/api/getproduits?uid=${DataInfo}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await r.json();
      setOrigineTableau(data.table);
    }
    GetProduits();
  }, [DataInfo]);

  const TableauOri = (id) => {
    setRecupeId(id);
    const copie = OrigineTableau.filter((items) => items.id !== id);
    setOrigineTableau(copie);
  };

  const handclick = (items) => {
    const newProduit = items;
    setListSelect((prev) => [...prev, newProduit]);
  };

  const review = (id, doc) => {
    setOrigineTableau((items) => [doc, ...items]);
    const copie = listeSelect.filter((doc) => doc.id !== id);
    setListSelect(copie);
  };

  async function DonnerQuantity() {
    const body = { newQuantity: InputUnitValue.newQuantity };

    const r = await fetch(
      `${apiBaseUrl}/api/donner?uid=${DataInfo}&id=${recupeId}`,
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
      toast.success("Quantité retiré avec succèes");
    } else {
      toast.error("Quantité insuffisante");
    }
  }

  return (
    <div>
      <Wrapper />
      <main className="px-3 space-y-4 md:flex md:gap-4 md:px-40 md:w-full">
        <section className="md:w-full max-w-md">
          <div className="grid space-y-4">
            <div>
              <input
                value={inputSearch}
                type="search"
                className="border border-amber-100 outline-none rounded-sm w-full p-3"
                placeholder="Réchercher un produit..."
                onChange={(e) => setInputSearch(e.target.value)}
              />
            </div>
            {OrigineTableau.length !== 0 ? (
              <div className="overflow-auto h-80 py-2 rounded-2xl border p-4 border-amber-100 md:h-140">
                <div className="space-y-4">
                  {OrigineTableau.filter((items) =>
                    items.name.toLowerCase().includes(inputSearch.toLowerCase())
                  ).map((items) => (
                    <div
                      key={items.id}
                      className="flex items-center space-x-3 py-2 border border-amber-100 rounded-2xl px-8"
                    >
                      <div>
                        <PackageCheck
                          size={"80"}
                          className="bg-amber-100 text-orange-400 p-2 rounded-2xl"
                        />
                      </div>
                      <div className="grid gap-2">
                        <strong>{items.name}</strong>
                        <span className="bg-amber-50 text-orange-400 px-3 rounded-sm">
                          {items.categorie}
                        </span>
                        <span className="bg-amber-50 text-orange-400 px-3 rounded-sm">
                          {items.quantity} gk
                        </span>
                        <Plus
                          onClick={() => {
                            handclick(items);
                            TableauOri(items.id);
                          }}
                          className="w-8 h-8 rounded-full bg-red-400 cursor-pointer"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <PackageSearch color="pink" size={"100"} />
            )}
          </div>
        </section>

        {listeSelect.length > 0 ? (
          <section>
            <div className="px-6 border border-amber-100 rounded-2xl">
              <Tableau
                classNametable={
                  "table-auto w-full border-separate md:border-spacing-x-20 border-spacing-y-10 text-left"
                }
                entete={
                  <>
                    <th>Image</th>
                    <th>Nom</th>
                    <th>Quantité</th>
                    <th>Stock</th>
                    <th>Action</th>
                  </>
                }
                body={
                  <>
                    {listeSelect.map((items) => (
                      <tr key={items.id}>
                        <th>
                          <PackageOpen
                            size={"80"}
                            className="bg-amber-100 text-orange-400 p-2 rounded-2xl"
                          />
                        </th>
                        <th>{items.name}</th>
                        <th>
                          <input
                            name="newQuantity"
                            value={InputUnitValue.newQuantity}
                            onChange={(e) =>
                              setInputInitValue({
                                ...InputUnitValue,
                                newQuantity: Number(e.target.value),
                              })
                            }
                            type="number"
                            className="border-amber-100 border rounded-sm w-15"
                          />
                        </th>
                        <th>{items.quantity} gk</th>
                        <th>
                          <Bouton
                            onClick={() => review(items.id, items)}
                            className={"bg-red-500 p-1 rounded-sm"}
                            name={<Trash color="gray" />}
                          />
                        </th>
                      </tr>
                    ))}
                  </>
                }
              />

              {/* Message d'erreur */}
              {erreurMessage && (
                <p className="text-red-500 font-medium mb-2">{erreurMessage}</p>
              )}

              <div>
                <Bouton
                  onClick={async () => {
                    const produit = listeSelect.find(
                      (item) => item.id === recupeId
                    );
                    const quantiteDemandee = Number(InputUnitValue.newQuantity);

                    if (quantiteDemandee > produit.quantity) {
                      setErreurMessage("Quantité insuffisante");
                      toast.error("Quantité insuffisante");
                      return;
                    }

                    setErreurMessage(""); // Reset erreur

                    await DonnerQuantity();

                    setListSelect((prev) =>
                      prev.map((item) =>
                        item.id === recupeId
                          ? {
                              ...item,
                              quantity: item.quantity - quantiteDemandee,
                            }
                          : item
                      )
                    );
                  }}
                  className={"bg-pink-400 p-1 px-3 mb-4 rounded-sm "}
                  name={"Donner"}
                />
              </div>
            </div>
          </section>
        ) : (
          <section className="md:w-full md:max-w-lvh">
            <div className="border rounded-2xl border-amber-100 p-10 grid justify-center items-center place-items-center">
              <div>
                <HandHeart size={"100"} color="pink" />
              </div>
              Aucun produit selectionné
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default withAuth(donner);
