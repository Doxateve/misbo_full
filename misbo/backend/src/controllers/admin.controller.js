import adminServices from "../services/admin.services.js";

const dashboardController = async (req, res) => {
  try {
    const dashboard = await adminServices.dashboardService();
    return res.status(200).json({ dashboard });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const agregarItemController = async (req, res) => {
  const imagenUrl = req.body.imagenUrl;
  const mcItem = req.body.mcItem;
  const nombre = req.body.nombre;
  const descripcion = req.body.descripcion;
  const precio = req.body.precio;
  const stock = req.body.stock;
  try {
    await adminServices.agregarItemService(
      imagenUrl,
      mcItem,
      nombre,
      descripcion,
      precio,
      stock,
    );
    return res.status(200).json({ message: "Item agregado." });
  } catch (e) {
    return res.status(500).json({ message: e.message })
  }
}

const inventarioBotController = (req, res) => {
  try {
    const inventario = adminServices.inventarioBotService();
    return res.status(200).json({ inventario });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

export default { dashboardController, agregarItemController, inventarioBotController };
