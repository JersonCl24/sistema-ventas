/*
* =================================================================
* ARCHIVO: src/controllers/ai.controller.js (NUEVO)
* =================================================================
* Descripción: Este controlador maneja la comunicación con el
* servicio de Ollama para generar contenido con IA.
*/
import axios from 'axios';

export const generateProductDescription = async (req, res) => {
    const { nombre, categoria } = req.body;

    if (!nombre || !categoria) {
        return res.status(400).json({ message: 'El nombre y la categoría del producto son requeridos.' });
    }

    // El prompt que le enviaremos al modelo de lenguaje
    const prompt = `Actúa como un experto en marketing. Crea una descripción atractiva y vendedora para el siguiente producto, de no más de 40 palabras. La descripción debe estar en español. Producto: "${nombre}", Categoría: "${categoria}".`;

    try {
        // Hacemos la petición a la API de Ollama que corre localmente
        const ollamaResponse = await axios.post('http://localhost:11434/api/generate', {
            // --- CAMBIO AQUÍ ---
            model: "deepseek-r1:7b", // Usamos el nuevo modelo que instalaste
            prompt: prompt,
            stream: false // Queremos la respuesta completa, no en streaming
        });

        // Devolvemos la descripción generada al frontend
        res.json({ description: ollamaResponse.data.response });

    } catch (error) {
        console.error("Error al conectar con Ollama:", error);
        res.status(500).json({ message: 'No se pudo generar la descripción. Asegúrate de que Ollama esté corriendo.' });
    }
};

