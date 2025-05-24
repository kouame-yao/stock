import { AlertCircleIcon, Trash } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Bouton } from "../../components/bouton";
import { Tableau } from "../../components/table";
import Wrapper from "../../components/wrapper";
import withAuth from "../../lib/withAuth";

const produits = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [DataInfo, setDataInfo] = useState([]);
  const [TableProduit, setTableProduit] = useState([]);
  const [Open, setOpent] = useState(false);
  const [valide, setValide] = useState(null);

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

      setTableProduit(data.table);
    }

    GetProduits();
  }, [DataInfo]);
  const router = useRouter();

  async function DeletedProduits() {
    const r = await fetch(
      `${apiBaseUrl}/api/deleteproduits?uid=${DataInfo}/`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: valide }),
      }
    );
    const data = await r.json();
    const message = data.message;
    if (r.ok) {
      const copie = TableProduit.filter((item) => item.id !== valide);
      setTableProduit(copie);
      toast.success(message);
    } else {
      toast.error("Impossible de supprimer ce produit");
    }
  }

  return (
    <div>
      <Wrapper />
      <div className="overflow-x-auto w-full md:px-8">
        {Array.isArray(TableProduit) && TableProduit.length > 0 ? (
          <table className="table-auto w-full border-separate border-spacing-x-4 text-left ">
            <thead>
              <tr className="">
                <th>#</th>
                <th>Nom</th>
                <th>Description</th>
                <th>Prix</th>
                <th>Quantité</th>
                <th>Catégorie</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {TableProduit.map((items, index) => (
                <tr
                  key={items.id}
                  className="border-t border-b border-gray-300"
                >
                  <td>{index + 1} </td>
                  <td>{items.name} </td>
                  <td>{items.description}</td>
                  <td>{items.price} FRCFA</td>
                  <td>
                    {" "}
                    {items.quantity} {items.unit}
                  </td>
                  <td>{items.categorie}</td>
                  <td className="grid space-y-1">
                    <Bouton
                      onClick={() => router.push("/user/" + items.id)}
                      className="bg-pink-400 text-blue-900 px-2 rounded-sm cursor-pointer text-sm"
                      name="Modifier"
                    />
                    <Bouton
                      //
                      onClick={() => {
                        setValide(items.id), setOpent(true);
                      }}
                      className="bg-gray-200 text-black px-2 rounded-sm cursor-pointer text-sm"
                      name={<Trash />}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>Aucun produit</div>
        )}
      </div>
      {/* Modale */}
      {Open && (
        <div className=" bg-black/50  h-screen w-screen  fixed z-0 indent-0 top-0 left-0 inline-grid justify-center items-center ">
          <div>
            <div className="bg-gray-500 p-4 rounded-sm inline-grid gap-3">
              <div className="grid justify-center items-center place-items-center ">
                <AlertCircleIcon size={"40"} color="red" />
                <p>Voulez vous supprimer le produit</p>
              </div>

              <div className="inline-flex gap-4">
                <button
                  onClick={() => setOpent(false)}
                  className="bg-black p-1  px-4 rounded-sm font-bold cursor-pointer"
                >
                  Non
                </button>
                <button
                  onClick={() => {
                    DeletedProduits(), setOpent(false);
                  }}
                  className="bg-red-500 p-1  px-4 rounded-sm font-bold cursor-pointer"
                >
                  Oui
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(produits);
