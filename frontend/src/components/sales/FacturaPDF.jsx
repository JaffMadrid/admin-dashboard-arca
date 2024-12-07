import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { format } from 'date-fns';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12
  },
  header: {
    marginBottom: 20,
    borderBottom: 1,
    paddingBottom: 10
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
    color: '#4B5563'
  },
  info: {
    marginBottom: 20,
    gap: 5
  },
  table: {
    display: 'table',
    width: '100%',
    marginBottom: 20,
    borderBottom: 1
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: 1,
    borderColor: '#E5E7EB',
    minHeight: 24,
    alignItems: 'center'
  },
  tableHeader: {
    backgroundColor: '#F3F4F6'
  },
  tableCell: {
    flex: 1,
    padding: 8,
    textAlign: 'left'
  },
  total: {
    marginTop: 30,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: 'bold'
  }
});

const FacturaPDF = ({ ventaData }) => {
  const formatPDFDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return !isNaN(date.getTime()) 
        ? format(date, 'dd/MM/yyyy HH:mm')
        : 'Fecha no disponible';
    } catch {
      console.error('Error formatting date:');
      return 'Fecha no disponible';
    }
  };

  const calculateSubtotal = (peso, precio) => {
      return (parseFloat(peso) * parseFloat(precio)).toFixed(2);
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Arca De Esperanzas</Text>
          <Text>Factura CD2024{ventaData.id_venta || ''}</Text>
        </View>
        
        <View style={styles.info}>
          <Text>Fecha: {formatPDFDate(ventaData.fecha_venta)}</Text>
          <Text>Cliente: {ventaData.nombre_cliente || 'N/A'}</Text>
          <Text>Dirección: {ventaData.direccion_cliente || 'N/A'}</Text>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Material</Text>
            <Text style={styles.tableCell}>Peso (lb)</Text>
            <Text style={styles.tableCell}>Precio/lb</Text>
            <Text style={styles.tableCell}>Subtotal</Text>
          </View>

          {ventaData?.materiales?.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.descripcion_tipo || 'N/A'}</Text>
              <Text style={styles.tableCell}>{item.peso || '0'}</Text>
              <Text style={styles.tableCell}>L. {item.preciolibra || '0.00'}</Text>
              <Text style={styles.tableCell}>
                L. {calculateSubtotal(item.peso, item.preciolibra)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.total}>
          <Text>Total: L. {ventaData.total || '0.00'}</Text>
        </View>
      </Page>
    </Document>
  );
};

FacturaPDF.propTypes = {
  ventaData: PropTypes.shape({
    id_venta: PropTypes.number,
    fecha_venta: PropTypes.string,
    nombre_cliente: PropTypes.string,
    direccion_cliente: PropTypes.string,
    total: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    materiales: PropTypes.arrayOf(
      PropTypes.shape({
        descripcion_tipo: PropTypes.string,
        peso: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        preciolibra: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      })
    )
  }).isRequired
};

export default FacturaPDF;