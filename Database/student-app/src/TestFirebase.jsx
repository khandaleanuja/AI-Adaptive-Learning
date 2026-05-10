import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

function TestFirebase() {

  const addData = async () => {
    try {
      await addDoc(collection(db, "users"), {
        name: "Shweta",
        adaptiveLevel: "Level 1"
      });

      alert("Data Added");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <button onClick={addData}>
        Add Data
      </button>
    </div>
  );
}

export default TestFirebase;