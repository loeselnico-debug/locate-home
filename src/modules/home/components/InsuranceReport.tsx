import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { InventoryItem } from '../../../types';

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Helvetica', backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, borderBottomWidth: 2, borderBottomColor: '#FF6600', paddingBottom: 10 },
  logoText: { fontSize: 24, fontWeight: 'bold', color: '#FF6600' },
  logoSub: { fontSize: 12, color: '#333333', marginTop: 4 },
  reportInfo: { fontSize: 10, textAlign: 'right', color: '#666666' },
  summaryBox: { backgroundColor: '#FFF5EB', padding: 15, borderRadius: 5, marginBottom: 20, borderWidth: 1, borderColor: '#FF6600' },
  summaryTitle: { fontSize: 14, fontWeight: 'bold', color: '#FF6600', marginBottom: 8 },
  summaryText: { fontSize: 12, color: '#333333', marginBottom: 4 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#FF6600', marginTop: 15, marginBottom: 10 },
  table: { display: 'flex', width: 'auto', borderStyle: 'solid', borderWidth: 1, borderColor: '#E5E7EB', borderRightWidth: 0, borderBottomWidth: 0 },
  tableRow: { margin: 'auto', flexDirection: 'row' },
  tableColHeader: { width: '25%', borderStyle: 'solid', borderWidth: 1, borderColor: '#E5E7EB', borderLeftWidth: 0, borderTopWidth: 0, backgroundColor: '#F9FAFB', padding: 5 },
  tableCol: { width: '25%', borderStyle: 'solid', borderWidth: 1, borderColor: '#E5E7EB', borderLeftWidth: 0, borderTopWidth: 0, padding: 5 },
  tableCellHeader: { margin: 2, fontSize: 10, fontWeight: 'bold', color: '#374151' },
  tableCell: { margin: 2, fontSize: 9, color: '#4B5563' },
  footer: { position: 'absolute', bottom: 30, left: 30, right: 30, textAlign: 'center', fontSize: 8, color: '#9CA3AF', borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 10 },
});

interface InsuranceReportProps {
  items: InventoryItem[];
  userInfo: { name: string; address: string };
}

export const InsuranceReport: React.FC<InsuranceReportProps> = ({ items, userInfo }) => {
  const totalValue = items.reduce((sum, item) => sum + (item.price || 0), 0);
  const reportId = `REP-${Date.now().toString().slice(-6)}`;
  const date = new Date().toLocaleString('fr-FR');

  const groupedItems = items.reduce((acc, item) => {
    const loc = item.location || 'Non assigné';
    if (!acc[loc]) acc[loc] = [];
    acc[loc].push(item);
    return acc;
  }, {} as Record<string, InventoryItem[]>);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.logoText}>LOCATE HOME</Text>
            <Text style={styles.logoSub}>by Locate Systems</Text>
          </View>
          <View style={styles.reportInfo}>
            <Text>Rapport d'inventaire certifié</Text>
            <Text>ID Rapport : {reportId}</Text>
            <Text>Édité le : {date}</Text>
          </View>
        </View>

        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Synthèse du Parc Outillage</Text>
          <Text style={styles.summaryText}>Titulaire : {userInfo.name}</Text>
          <Text style={styles.summaryText}>Lieu de stockage principal : {userInfo.address}</Text>
          <Text style={styles.summaryText}>Nombre total d'articles : {items.length}</Text>
          <Text style={{ ...styles.summaryText, fontWeight: 'bold', marginTop: 5 }}>
            Valeur Totale Estimée : {totalValue.toLocaleString('fr-FR')} €
          </Text>
        </View>

        {Object.entries(groupedItems).map(([location, locItems]) => (
          <View key={location} wrap={false}>
            <Text style={styles.sectionTitle}>Zone : {location.toUpperCase()}</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Désignation</Text></View>
                <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>S/N (Numéro de Série)</Text></View>
                <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>État</Text></View>
                <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Valeur estimée</Text></View>
              </View>
              {locItems.map((item, idx) => (
                <View style={styles.tableRow} key={idx}>
                  <View style={styles.tableCol}><Text style={styles.tableCell}>{item.toolName || 'Outil non nommé'}</Text></View>
                  <View style={styles.tableCol}><Text style={styles.tableCell}>{item.serialNumber || 'N/A'}</Text></View>
                  <View style={styles.tableCol}><Text style={styles.tableCell}>{item.condition || 'Usagé'}</Text></View>
                  <View style={styles.tableCol}><Text style={styles.tableCell}>{item.price ? `${item.price} €` : 'N/A'}</Text></View>
                </View>
              ))}
            </View>
          </View>
        ))}

        <Text style={styles.footer} fixed>
          Ce rapport a été généré localement via l'application LOCATE HOME. Les données sont certifiées conformes par l'utilisateur au moment de la validation manuelle dans le système (Sas Zéro-Trust). Locate Systems ne saurait être tenu responsable de l'exactitude des informations saisies.
        </Text>
      </Page>
    </Document>
  );
};