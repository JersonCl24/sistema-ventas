import db from '../database.js';

// Función auxiliar para añadir el filtro de fecha a las consultas
const addDateFilter = (query, params, startDate, endDate, dateColumn = 'fecha') => {
    let filteredQuery = query;
    if (startDate && endDate) {
        // Añadimos 'WHERE' o 'AND' dependiendo de si la consulta ya tiene un 'WHERE'
        if (filteredQuery.toLowerCase().includes('where')) {
            filteredQuery += ` AND ${dateColumn} BETWEEN ? AND ?`;
        } else {
            filteredQuery += ` WHERE ${dateColumn} BETWEEN ? AND ?`;
        }
        // Aseguramos que el endDate incluya todo el día
        params.push(startDate, `${endDate} 23:59:59`);
    }
    return { filteredQuery, params };
};

export const getDashboardSummary = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const usuario_id = req.user.id; // Obtenemos el ID del usuario

        // 1. Total de Ventas (solo del usuario actual)
        let ventasQuery = "SELECT SUM(total) as totalVentas FROM ventas WHERE estado != 'Cancelado' AND usuario_id = ?";
        let ventasParams = [usuario_id];
        let { filteredQuery: fVentasQuery, params: fVentasParams } = addDateFilter(ventasQuery, ventasParams, startDate, endDate);
        const [ventasResult] = await db.query(fVentasQuery, fVentasParams);

        // 2. Total de Gastos (solo del usuario actual)
        let gastosQuery = 'SELECT SUM(monto) as totalGastos FROM gastos WHERE usuario_id = ?';
        let gastosParams = [usuario_id];
        let { filteredQuery: fGastosQuery, params: fGastosParams } = addDateFilter(gastosQuery, gastosParams, startDate, endDate);
        const [gastosResult] = await db.query(fGastosQuery, fGastosParams);

        // 3. Total de Clientes (solo del usuario actual)
        const [clientsResult] = await db.query("SELECT COUNT(*) as totalClientes FROM clientes WHERE usuario_id = ?", [usuario_id]);

        // 4. Productos con bajo stock (solo del usuario actual)
        const [lowStockResult] = await db.query("SELECT COUNT(*) as productosBajoStock FROM productos WHERE stock < 5 AND usuario_id = ?", [usuario_id]);

        const totalVentas = ventasResult[0].totalVentas || 0;
        const totalGastos = gastosResult[0].totalGastos || 0;

        res.json({
            totalVentas,
            totalGastos,
            gananciaNeta: totalVentas - totalGastos,
            totalClientes: clientsResult[0].totalClientes || 0,
            productosBajoStock: lowStockResult[0].productosBajoStock || 0,
        });

    } catch (error) {
        console.error("Error en getDashboardSummary:", error);
        res.status(500).json({ message: 'Error al obtener el resumen del dashboard' });
    }
};

export const getSalesOverTime = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const usuario_id = req.user.id; // Obtenemos el ID del usuario

        // Consulta base que excluye ventas canceladas y filtra por usuario
        let query = `
            SELECT 
                DATE(fecha) as fecha, 
                SUM(total) as total 
            FROM ventas
            WHERE estado != 'Cancelado' AND usuario_id = ?
        `;
        let params = [usuario_id];

        // Añadimos el filtro de fecha adicional
        let { filteredQuery, params: dateParams } = addDateFilter(query, params, startDate, endDate);
        
        filteredQuery += ' GROUP BY DATE(fecha) ORDER BY fecha ASC';
        
        const [rows] = await db.query(filteredQuery, dateParams);
        res.json(rows);

    } catch (error) {
        console.error("Error en getSalesOverTime:", error);
        res.status(500).json({ message: 'Error al obtener los datos de ventas' });
    }
};