import { useEffect, useState } from "react";
import Wrapper from "../../components/wrapper";
import withAuth from "../../lib/withAuth";

const Transaction = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [DataInfo, setDataInfo] = useState(null);
  const [Historique, setHistorique] = useState([]);
  const [InputSearch, setSearch] = useState("");

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

  // Récupération de l'historique des transactions
  useEffect(() => {
    async function GetHistorique() {
      if (!DataInfo) return;
      const r = await fetch(`${apiBaseUrl}/api/historique?uid=${DataInfo}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await r.json();
      setHistorique(data.table);
    }
    GetHistorique();
  }, [DataInfo]);

  // Convertir le timestamp Firebase en date lisible
  const formatDate = (timestamp) => {
    if (!timestamp?._seconds) return "";
    const date = new Date(timestamp._seconds * 1000);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div>
      <Wrapper />

      <div className="grid space-y-4 px-3 md:px-40 cursor-pointer">
        <div>
          <input
            value={InputSearch}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            className="border border-amber-100 p-2 rounded-sm max-w-lg w-full"
            placeholder="Rechercher une transaction ..."
          />
        </div>
        <div className="grid gap-4">
          {Array.isArray(Historique) && Historique.length > 0 ? (
            Historique.filter((item) =>
              item.categorie.toLowerCase().includes(InputSearch.toLowerCase())
            ).map((item, index) => {
              const isAjout = item.ajouter !== undefined;
              const valeur = isAjout ? item.ajouter : item.retraire;
              const couleur = isAjout ? "text-green-500" : "text-red-500";
              const signe = isAjout ? "+" : "-";

              return (
                <div
                  key={item.id || index}
                  className="border border-amber-100 flex justify-between items-center rounded-2xl p-2 px-8"
                >
                  <div className="grid space-y-1">
                    <strong>{item.name}</strong>
                    <span className="bg-amber-100 text-orange-400 px-1 rounded-sm grid justify-center items-center">
                      {item.categorie}
                    </span>
                  </div>
                  <div className="grid space-y-2 text-right">
                    <strong className={couleur}>
                      {signe}
                      {Math.abs(valeur)} {item.unit}
                    </strong>
                    <span className="text-gray-400 text-sm">
                      {formatDate(item.date)}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-gray-400">
              Aucune transaction trouvée.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default withAuth(Transaction);
