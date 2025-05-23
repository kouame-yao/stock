import { ProduisComposant } from "../../components/produis-composent";
import Wrapper from "../../components/wrapper";
import withAuth from "../../lib/withAuth";

const nouveauProduits = () => {
  return (
    <div>
      <Wrapper />
      <div>
        <ProduisComposant titre={"Ajouter un produit"} />
      </div>
    </div>
  );
};

export default withAuth(nouveauProduits);
