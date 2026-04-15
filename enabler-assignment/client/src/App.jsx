import { useState } from "react";
import axios from "axios";

/* ---------------- TABLE COMPONENT ---------------- */
function Table({ data }) {
  if (!data || data.length === 0) return <p>No data</p>;

  const columns = Object.keys(data[0]).slice(0, 10); // limit columns

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col} style={styles.th}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.slice(0, 10).map((row, i) => (
            <tr key={i}>
              {columns.map((col) => (
                <td key={col} style={styles.td}>
                  {String(row[col])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------- MAIN APP ---------------- */
function App() {
  const [files, setFiles] = useState({});
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!files.existing || !files.new || !files.sales) {
      alert("Please upload all 3 files");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("existing", files.existing);
      formData.append("new", files.new);
      formData.append("sales", files.sales);

     const res = await axios.post(
       `${process.env.REACT_APP_BASE_URL}/api/upload`,
       formData,
     );
      setData(res.data);
    } catch (err) {
      alert("Error uploading files");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1> Data Linking Dashboard</h1>

      <p style={{ marginBottom: 20 }}>
        Upload 3 files → Validate → Link data → View results
      </p>

      {/* ---------------- UPLOAD SECTION ---------------- */}
      <div style={styles.card}>
        <h2> Upload Files</h2>

        <div style={styles.uploadBox}>
          <p>
            <strong> Existing Packaging Master</strong>
          </p>
          <small>Contains Component_ID + Product_SKU</small>
          <br />
          <input
            type="file"
            onChange={(e) =>
              setFiles({ ...files, existing: e.target.files[0] })
            }
          />
          <p>{files.existing?.name}</p>
        </div>

        <div style={styles.uploadBox}>
          <p>
            <strong> New Packaging Data</strong>
          </p>
          <small>Contains Component_ID + Flags</small>
          <br />
          <input
            type="file"
            onChange={(e) => setFiles({ ...files, new: e.target.files[0] })}
          />
          <p>{files.new?.name}</p>
        </div>

        <div style={styles.uploadBox}>
          <p>
            <strong> Sales Data</strong>
          </p>
          <small>Contains Product_SKU + Sold_Qty_UOM</small>
          <br />
          <input
            type="file"
            onChange={(e) => setFiles({ ...files, sales: e.target.files[0] })}
          />
          <p>{files.sales?.name}</p>
        </div>

        <button style={styles.button} onClick={handleUpload}>
          {loading ? "Processing..." : "Upload & Process"}
        </button>
      </div>

      {/* ---------------- DATA SECTION ---------------- */}
      {data && (
        <>
          {/* VALIDATION */}
          <div style={styles.card}>
            <h2> Validation Errors</h2>
            {data.validationErrors?.length ? (
              <ul>
                {data.validationErrors.map((e, i) => (
                  <li key={i} style={styles.error}>
                    {e}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={styles.success}>No errors 🎉</p>
            )}
          </div>

          {/* PREVIEW */}
          <div style={styles.card}>
            <h2> Data Preview</h2>

            <h4>Existing Packaging</h4>
            <Table data={data.preview?.existing} />

            <h4>New Packaging</h4>
            <Table data={data.preview?.newData} />

            <h4>Sales Data</h4>
            <Table data={data.preview?.sales} />
          </div>

          {/* FINAL LINKED */}
          <div style={styles.card}>
            <h2> Final Linked Data</h2>

            <p>
              Total Records: {data.finalLinked?.length} | Matched:{" "}
              {data.finalLinked?.filter((x) => x.total_sales > 0).length} |
              Unmatched: {data.unmatched?.skuMismatch?.length}
            </p>

            <Table data={data.finalLinked} />
          </div>

          {/* UNMATCHED */}
          <div style={styles.card}>
            <h2> Unmatched Records</h2>

            <h4>Component Mismatch</h4>
            <Table data={data.unmatched?.componentMismatch} />

            <h4>SKU Mismatch</h4>
            <Table data={data.unmatched?.skuMismatch} />
          </div>
        </>
      )}
    </div>
  );
}

/* ---------------- STYLES ---------------- */
const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial",
  },
  card: {
    background: "grey",
    padding: "20px",
    marginBottom: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  uploadBox: {
    border: "1px dashed #ccc",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "8px",
    background: "#fafafa",
  },
  button: {
    marginTop: "10px",
    padding: "10px 15px",
    background: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px",
  },
  th: {
    background: "#333",
    color: "#fff",
    padding: "8px",
    textAlign: "left",
  },
  td: {
    border: "1px solid #ddd",
    padding: "8px",
  },
  error: {
    color: "red",
    fontWeight: "bold",
  },
  success: {
    color: "green",
    fontWeight: "bold",
  },
};

export default App;
