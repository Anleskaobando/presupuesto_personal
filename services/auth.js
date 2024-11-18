import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./Firebase";

export const iniciarSesionconFirebase = async (email, password) => {
  try {
    // Consulta a la colección "Usuario" con filtros
    const q = query(
      collection(db, "Usuario"),
      where("correoElectronico", "==", email),
      where("contraseña", "==", password)
    );

    const querySnapshot = await getDocs(q);

    // Si no se encontraron documentos, devolvemos un error
    if (querySnapshot.empty) {
      return { success: false, message: "Correo o contraseña incorrectos" };
    }

    // Verificar si se encontraron documentos
    if (!querySnapshot.empty) {
      // Retornar el usuario encontrado
      const userData = querySnapshot.docs[0].data();
      return { success: true, user: userData };
    } else {
      return { success: false, message: "Usuario o contraseña incorrectos" };
    }
  } catch (error) {
    console.error("Error al autenticar:", error);
    return { success: false, message: "Ocurrió un error en la autenticación" };
  }
};
