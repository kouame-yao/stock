import { BookmarkCheck, Box, DollarSign, ShoppingCart } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Tableau } from "../../components/table";
import Wrapper from "../../components/wrapper";
import withAuth from "../../lib/withAuth";
const Acceuil = () => {
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
  const [TableProduit, setTableProduit] = useState([]);
  const [DataInfo, setDataInfo] = useState([]);
  const [Categorie, setCategorie] = useState([]);
  const [Historique, setHistorique] = useState([]);
  const router = useRouter();
  // Récupération du profil utilisateur
  useEffect(() => {
    async function GetProfil() {
      const r = await fetch(`${apiBaseUrl}/api/profile`, {
        credentials: "include",
      });
      const data = await r.json();
      setDataInfo(data.user.uid);

      console.log("uid", data.user.uid);
    }
    GetProfil();
  }, []);

  useEffect(() => {
    async function GetProduits() {
      const r = await fetch(`${apiBaseUrl}/api/getproduits?uid=${DataInfo}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await r.json();

      setTableProduit(data.table);

      console.log("produit", data.table);
    }

    GetProduits();
  }, [DataInfo]);

  useEffect(() => {
    // Étape 2 : attendre que DataInfo.uid soit prêt

    async function fetchCategories() {
      const r = await fetch(`${apiBaseUrl}/api/getcategorie?uid=${DataInfo}`);
      const data = await r.json();

      setCategorie(data.table);
      console.log("categorie", data.table);
    }

    fetchCategories();
  }, [DataInfo]);

  // Récupération de l'historique des transactions
  useEffect(() => {
    async function GetHistorique() {
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

  // const logout = async () => {
  //   await fetch("/api/logout", {
  //     method: "POST",
  //   });

  //   router.push("/connexion"); // Redirige vers la page de login
  // };

  const TotalePrice = Array.isArray(TableProduit)
    ? TableProduit.reduce((somme, item) => (somme = somme + item.price || 0), 0)
    : 0;

  const TotaleQuantite = Array.isArray(TableProduit)
    ? TableProduit.reduce(
        (somme, item) => (somme = somme + item.quantity || 0),
        0
      )
    : 0;

  const sommeTotale = TotalePrice * TotaleQuantite;
  const prixFormate = sommeTotale.toLocaleString("fr-FR", {
    style: "currency",
    currency: "XOF",
  });
  const signe = "≤";
  const TotalHistorique = Array.isArray(Historique) ? Historique.length : 0;
  const TotaleCategorie = Categorie.length;
  const TotaleProduit = Array.isArray(TableProduit) ? TableProduit.length : 0;

  const StockNormal = Array.isArray(TableProduit)
    ? TableProduit.filter((item) => item.quantity > 0).length
    : 0;

  const StockFaible = Array.isArray(TableProduit)
    ? TableProduit.filter((item) => item.quantity <= 0).length
    : 0;

  const Rupture = Array.isArray(TableProduit)
    ? TableProduit.filter((item) => item.quantity == 0).length
    : 0;

  // graphisme

  // const CategorieProuit = Categorie.map((item) => item.name);
  // const ProduitCategorie = TableProduit.map((item) => item.categorie);

  const similaire = Categorie.map((cat) => {
    const count = TableProduit.filter(
      (prod) => prod.categorie === cat.name
    ).length;

    return {
      categorie: cat.name,
      nombreDeProduit: count,
    };
  })
    .filter((item) => item.nombreDeProduit === 1 || item.nombreDeProduit === 2)
    .slice(1, 6);

  // Étape 1 : trier + prendre les 5 premières
  const similetrie = [...similaire]
    .filter((item) => item.nombreDeProduit >= 1) // éviter les vides
    .sort((a, b) => b.nombreDeProduit - a.nombreDeProduit);

  // Étape 2 : trouver la plus grande valeur
  const maximum = similetrie[0]?.nombreDeProduit;

  const NomProduitCritique = Array.isArray(TableProduit)
    ? TableProduit.filter((item) => item.quantity <= 0).filter((items) => items)
    : 0;

  // const TotaleHistorique = Historique.length;
  return (
    <div>
      <Wrapper />

      <main className="grid md:flex  md:w-full gap-4 px-6 ">
        <section className="grid gap-4 items-center  md:w-full">
          {/* Les differents stocks */}
          <div className="grid   md:flex gap-4 md:w-full md:items-center   ">
            <div className="grid space-y-4 w-full">
              <div className="grid border border-amber-100 px-4 rounded-2xl p-4">
                <span>Valeur totale du stock</span>
                <div className="flex justify-between">
                  <strong>{prixFormate}</strong>
                  <Box className="bg-pink-200 h-8 md:w-10 md:p-2 md:h-10 w-8 p-1 justify-center text-pink-300 rounded-full grid items-center" />
                </div>
              </div>

              <div className="grid border border-amber-100 px-4 rounded-2xl p-4">
                <span>Nombre de catégorie</span>
                <div className="flex justify-between">
                  <strong>{TotaleCategorie}</strong>
                  <DollarSign className="bg-pink-200 h-8 md:w-10 md:p-2 md:h-10 w-8 p-1 justify-center text-pink-300 rounded-full grid items-center" />
                </div>
              </div>
            </div>

            <div className="grid space-y-4 md:w-full">
              <div className="grid border border-amber-100 px-4 rounded-2xl p-4">
                <span>Totale de transaction</span>
                <div className="flex justify-between">
                  <strong>{TotalHistorique}</strong>
                  <ShoppingCart className="bg-pink-200 h-8 md:w-10 md:p-2 md:h-10 w-8 p-1 justify-center text-pink-300 rounded-full grid items-center" />
                </div>
              </div>

              <div className="grid border border-amber-100 px-4 rounded-2xl p-4">
                <span>Produit en stock</span>
                <div className="flex justify-between">
                  <strong>{TotaleProduit}</strong>
                  <BookmarkCheck className="bg-pink-200 h-8 md:w-10 md:p-2 md:h-10 w-8 p-1 justify-center text-pink-300 rounded-full grid items-center" />
                </div>
              </div>
            </div>
          </div>

          {/* diagrame des categorie avec le plus de stock */}
          <div className="border border-amber-100 md:h-full md:w-full rounded-2xl px-4 py-4 space-y-4">
            <div>
              <strong>5 catégories avec le plus de produits</strong>
            </div>

            <div className="flex gap-4 items-end">
              {similetrie.map((item, index) => (
                <div key={index}>
                  <div
                    className={`py-2 max-w-lg p-4 rounded-md shadow ${
                      item.nombreDeProduit < 2 ? "h-20" : "h-40"
                    } ${
                      item.nombreDeProduit === maximum
                        ? "bg-green-400 text-white"
                        : "bg-red-100 text-black"
                    } grid justify-end items-center font-bold text-2xl`}
                  >
                    {item.nombreDeProduit}
                  </div>
                  <span className="block text-center mt-1 text-sm font-medium text-gray-700">
                    {item.categorie}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className=" space-y-4 w-full md:w-180">
          {/* div des stock et des rupture de stock */}
          <div className="flex items-center gap-4 px-10 border border-amber-100 rounded-2xl py-9 ">
            <div className="flex flex-col items-start space-y-3 relative">
              {/* Trait vertical */}
              <div className="absolute top-0 left-3.5 bottom-0 w-1 bg-pink-200 z-0" />
              {/* Élément 1 */}
              <div className="relative z-10 w-8 h-8 bg-pink-200 text-blue-900 rounded-full flex items-center justify-center">
                1
              </div>

              {/* Élément 2 */}
              <div className="relative z-10 w-8 h-8 bg-pink-200 text-blue-900 rounded-full flex items-center justify-center">
                2
              </div>

              {/* Élément 3 */}
              <div className="relative z-10 w-8 h-8 bg-pink-200 text-blue-900 rounded-full flex items-center justify-center">
                3
              </div>
            </div>

            <div className="grid gap-5.5">
              <div>
                <strong>Stock normal</strong>
              </div>
              <div>Stock faible ({signe})</div>
              <div>Rupture</div>
            </div>

            <div className="grid gap-5.5">
              <div className="bg-green-300 text-green-500 px-2 rounded-sm">
                {StockNormal}
              </div>
              <div className="bg-red-300 text-red-500 px-2 rounded-sm">
                {StockFaible}
              </div>
              <div className="bg-red-300 text-red-500 px-2 rounded-sm">
                {Rupture}
              </div>
            </div>
          </div>

          {/* Tableau des produits critiques */}

          <div>
            <Tableau
              className="grid gap-3 border border-amber-100 rounded-2xl px-2  py-4"
              sujet={"Produits critiques"}
              entete={
                <>
                  <th className=" text-left"></th>
                  <th className=" text-left">Nom</th>
                  <th className=" text-left">Quntité</th>
                </>
              }
              body={
                <>
                  {NomProduitCritique.map((item, index) => (
                    <tr key={index}>
                      <td className=" text-left">{index + 1}</td>
                      <td className=" text-left">{item.name}</td>
                      <td className=" text-left">{item.quantity}</td>
                    </tr>
                  ))}
                </>
              }
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default withAuth(Acceuil);
