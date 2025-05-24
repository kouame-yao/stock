import { AlertCircleIcon, Trash } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Bouton } from "../../components/bouton";
import Wrapper from "../../components/wrapper";
import withAuth from "../../lib/withAuth";

const Produits = () => {
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
  const [dataInfo, setDataInfo] = useState(null);
  const [tableProduit, setTableProduit] = useState([]);
  const [open, setOpen] = useState(false);
  const [valide, setValide] = useState(null);

  const router = useRouter();

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

  // Suppression d’un produit
  async function deletedProduits() {
    try {
      const r = await fetch(
        `${apiBaseUrl}/api/deleteproduits?uid=${dataInfo}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: valide }),
        }
      );
      const data = await r.json();
      if (r.ok) {
        setTableProduit((prev) => prev.filter((item) => item.id !== valide));
        toast.success(data.message);
      } else {
        toast.error(data.message || "Impossible de supprimer ce produit");
      }
    } catch {
      toast.error("Erreur réseau lors de la suppression");
    }
  }

  return (
    <div>
      <Wrapper />
      <div className="overflow-x-auto w-full md:px-8">
        {Array.isArray(tableProduit) && tableProduit.length > 0 ? (
          <table className="table-auto w-full border-separate border-spacing-x-4 text-left">
            <thead>
              <tr>
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
              {tableProduit.map((items, index) => (
                <tr
                  key={items.id}
                  className="border-t border-b border-gray-300"
                >
                  <td>{index + 1}</td>
                  <td>{items.name}</td>
                  <td>{items.description}</td>
                  <td>{items.price} FRCFA</td>
                  <td>
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
                      onClick={() => {
                        setValide(items.id);
                        setOpen(true);
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

      {/* Modale de confirmation */}
      {open && (
        <div className="bg-black/50 h-screen w-screen fixed z-50 top-0 left-0 flex justify-center items-center">
          <div className="bg-gray-500 p-4 rounded-sm inline-grid gap-3">
            <div className="flex flex-col items-center justify-center space-y-2">
              <AlertCircleIcon size={40} color="red" />
              <p>Voulez-vous supprimer ce produit ?</p>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setOpen(false)}
                className="bg-black p-2 px-4 rounded-sm font-bold cursor-pointer"
              >
                Non
              </button>
              <button
                onClick={() => {
                  deletedProduits();
                  setOpen(false);
                }}
                className="bg-red-500 p-2 px-4 rounded-sm font-bold cursor-pointer"
              >
                Oui
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(Produits);
