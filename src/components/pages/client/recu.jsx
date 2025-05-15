const styles = {
  container: {
    width: "600px",
    fontFamily: "monospace",
    border: "1px dashed #000",
    padding: "20px",
    margin: "auto",
    background: "#fff",
    color: "#000",
  },
  center: { textAlign: "center" },
  row: {
    display: "flex",
    justifyContent: "space-between",
    margin: "4px 0",
  },
  dotted: {
    borderTop: "2px dotted #000",
    margin: "10px 0",
  },
  signature: {
    marginTop: "20px",
    border: "1px solid #000",
    padding: "10px",
    textAlign: "center",
    position: "relative",
  },
  noSig: {
    position: "absolute",
    top: "-10px",
    left: "10px",
    transform: "rotate(-10deg)",
    fontWeight: "bold",
    fontSize: "14px",
  },
};

const Recu = ({
  titulaire,
  type,
  date,
  destinataire,
  montant,
  numCompte,
  motif,
}) => {
  const formatDate = (datestr) => {
    const date = new Date(datestr);
    return (
      date.toLocaleDateString("fr-FR") + " " + date.toLocaleTimeString("fr-FR")
    );
  };

  return (
    <div className="recu-content" style={{ paddingTop: "20px" }}>
      <div style={styles.container}>
        <div style={styles.center}>
          <h3>REÇU DE {type.toUpperCase()}</h3>

          <p>Titulaire: {titulaire}</p>
          <p>Transaction N°: TRS01</p>
          <p>Date: {formatDate(new Date())}</p>
        </div>

        <div style={styles.dotted}></div>

        <div style={styles.row}>
          <strong>Montant</strong>{" "}
          <span>
            {montant.toLocaleString("fr-FR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            Ar
          </span>
        </div>

        {motif && (
          <div style={styles.row}>
            <strong>Motif</strong> <span>{motif}</span>
          </div>
        )}

        <div style={styles.row}>
          <strong>Numéro de compte</strong>
          <span>************{numCompte.slice(-4)}</span>
        </div>
        <div style={styles.row}>
          <strong>Compte destinataire</strong>
          <span>************{destinataire.slice(-4)}</span>
        </div>

        <div style={styles.dotted}></div>

        <div style={styles.signature}>
          <div style={styles.noSig}>SIGNATURE NON REQUISE</div>
          <div>X _____________________</div>
        </div>

        <p style={styles.center}>
          MERCI POUR VOTRE CONFIANCE <br />
          NOUS APPRÉCIONS VOTRE VISITE
        </p>
      </div>
    </div>
  );
};

export default Recu;
