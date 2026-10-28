// frontend/src/services/exportUtils.js

/**
 * Convierte un arreglo de objetos a archivo CSV compatible con Excel y lo descarga.
 * @param {Array} data - Lista de objetos a exportar
 * @param {Array} headers - Encabezados visibles [{ key: 'campo', label: 'Nombre Columna' }]
 * @param {string} fileName - Nombre del archivo final sin extensión
 */
export const exportToCSV = (data, headers, fileName = 'reporte') => {
  if (!data || data.length === 0) {
    alert('No hay datos disponibles para exportar.');
    return;
  }

  // Encabezados
  const headerRow = headers.map((h) => `"${h.label}"`).join(';');

  // Filas de datos
  const rows = data.map((item) =>
    headers
      .map((h) => {
        let value = item[h.key];
        if (value === null || value === undefined) value = '';
        // Si es número con decimales o fecha, formatearlo limpiamente
        if (typeof value === 'string') {
          value = value.replace(/"/g, '""'); // Escapar comillas dobles
        }
        return `"${value}"`;
      })
      .join(';')
  );

  // Unir todo con salto de línea
  const csvContent = [headerRow, ...rows].join('\r\n');

  // Agregar BOM (\uFEFF) para que Excel reconozca tildes y caracteres en español
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  // Crear enlace temporal de descarga
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};