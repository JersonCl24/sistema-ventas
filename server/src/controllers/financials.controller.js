
import db from '../database.js';

const addDateFilter = (query, params, startDate, endDate, dateColumn = 'fecha') => {
    let filteredQuery = query;
    if (startDate && endDate) {
        if (filteredQuery.toLowerCase().includes('where')) {
            filteredQuery += ` AND ${dateColumn} BETWEEN ? AND ?`;
        } else {
            filteredQuery += ` WHERE ${dateColumn} BETWEEN ? AND ?`;
        }
        params.push(startDate, `${endDate} 23:59:59`);
    }
    return { filteredQuery, params };
};

export const getFinancialSummary = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const usuario_id = req.user.id; // Obtenemos el ID del usuario logueado

        // 1. Cálculo de Ingresos y Costos (solo del usuario actual)
        let salesProfitQuery = `
            SELECT
                SUM(dv.cantidad * dv.precio_unitario) AS ingresosBrutos,
                SUM(dv.cantidad * p.costo_promedio) AS costoDeProductos
            FROM ventas v
            JOIN detalle_ventas dv ON v.id = dv.venta_id
            JOIN productos p ON dv.producto_id = p.id
            WHERE v.estado != 'Cancelado' AND v.usuario_id = ? 
        `;
        let salesProfitParams = [usuario_id];
        let { filteredQuery: fSalesProfitQuery, params: fSalesProfitParams } = addDateFilter(salesProfitQuery, salesProfitParams, startDate, endDate, 'v.fecha');
        const [salesProfitResult] = await db.query(fSalesProfitQuery, fSalesProfitParams);

        // 2. Total de Costos de Envío (solo del usuario actual)
        let shippingQuery = "SELECT SUM(costo_envio) as totalEnvio FROM ventas WHERE estado != 'Cancelado' AND usuario_id = ?";
        let shippingParams = [usuario_id];
        let { filteredQuery: fShippingQuery, params: fShippingParams } = addDateFilter(shippingQuery, shippingParams, startDate, endDate);
        const [shippingResult] = await db.query(fShippingQuery, fShippingParams);

        // 3. Total de Gastos Operativos (solo del usuario actual)
        let expensesQuery = 'SELECT SUM(monto) as totalGastos FROM gastos WHERE usuario_id = ?';
        let expensesParams = [usuario_id];
        let { filteredQuery: fExpensesQuery, params: fExpensesParams } = addDateFilter(expensesQuery, expensesParams, startDate, endDate);
        const [expensesResult] = await db.query(fExpensesQuery, fExpensesParams);

        const ingresosBrutos = salesProfitResult[0].ingresosBrutos || 0;
        const costoDeProductos = salesProfitResult[0].costoDeProductos || 0;
        const gananciaBruta = ingresosBrutos - costoDeProductos;
        const totalEnvio = shippingResult[0].totalEnvio || 0;
        const totalGastos = expensesResult[0].totalGastos || 0;
        
        res.json({
            ingresosBrutos,
            costoDeProductos,
            gananciaBruta,
            totalEnvio,
            totalGastos,
            gananciaNeta: gananciaBruta - totalEnvio - totalGastos,
        });

    } catch (error) {
        console.error("Error en getFinancialSummary:", error);
        res.status(500).json({ message: 'Error al obtener el resumen financiero' });
    }
};

export const getFinancialBreakdown = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const usuario_id = req.user.id; // Obtenemos el ID del usuario logueado

        // 1. Obtener Ingresos y Costos (solo del usuario actual)
        let salesQuery = `
            SELECT
                DATE_FORMAT(v.fecha, '%Y-%m') AS month,
                SUM(dv.cantidad * dv.precio_unitario) AS ingresos,
                SUM(dv.cantidad * p.costo_promedio) AS costos
            FROM ventas v
            JOIN detalle_ventas dv ON v.id = dv.venta_id
            JOIN productos p ON dv.producto_id = p.id
            WHERE v.estado != 'Cancelado' AND v.usuario_id = ?
        `;
        let salesParams = [usuario_id];
        ({ filteredQuery: salesQuery, params: salesParams } = addDateFilter(salesQuery, salesParams, startDate, endDate, 'v.fecha'));
        salesQuery += ' GROUP BY month';
        const [salesRows] = await db.query(salesQuery, salesParams);

        // 2. Obtener Gastos Operativos (solo del usuario actual)
        let expensesQuery = `
            SELECT
                DATE_FORMAT(fecha, '%Y-%m') AS month,
                SUM(monto) AS gastos
            FROM gastos
            WHERE usuario_id = ?
        `;
        let expensesParams = [usuario_id];
        ({ filteredQuery: expensesQuery, params: expensesParams } = addDateFilter(expensesQuery, expensesParams, startDate, endDate, 'fecha'));
        expensesQuery += ' GROUP BY month';
        const [expensesRows] = await db.query(expensesQuery, expensesParams);

        // 3. Combinar los datos (sin cambios en esta parte)
        const combinedData = {};
        salesRows.forEach(row => {
            if (!combinedData[row.month]) {
                combinedData[row.month] = { month: row.month, ingresos: 0, costos: 0, gastos: 0 };
            }
            combinedData[row.month].ingresos = parseFloat(row.ingresos);
            combinedData[row.month].costos = parseFloat(row.costos);
        });
        expensesRows.forEach(row => {
            if (!combinedData[row.month]) {
                combinedData[row.month] = { month: row.month, ingresos: 0, costos: 0, gastos: 0 };
            }
            combinedData[row.month].gastos = parseFloat(row.gastos);
        });

        const result = Object.values(combinedData).sort((a, b) => a.month.localeCompare(b.month));
        res.json(result);

    } catch (error) {
        console.error("Error en getFinancialBreakdown:", error);
        res.status(500).json({ message: 'Error al obtener el desglose financiero' });
    }
};