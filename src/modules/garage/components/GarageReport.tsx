import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Helvetica', backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, borderBottomWidth: 2, borderBottomColor: '#DC2626', paddingBottom: 10 },
  logoText: { fontSize: 24, fontWeight: 'bold', color: '#DC2626' },
  logoSub: { fontSize: 12, color: '#333333', marginTop: 4 },
  reportInfo: { fontSize: 10, textAlign: 'right', color: '#666666' },
  
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#DC2626', marginTop: 15, marginBottom: 8, textTransform: 'uppercase' },
  
  summaryBox: { backgroundColor: '#FFF5F5', padding: 15, borderRadius: 5, marginBottom: 15, borderWidth: 1, borderColor: '#DC2626' },
  row: { flexDirection: 'row', marginBottom: 6 },
  label: { width: '40%', fontSize: 10, fontWeight: 'bold', color: '#333333' },
  value: { width: '60%', fontSize: 10, color: '#555555' },

  table: { display: 'flex', width: 'auto', borderStyle: 'solid', borderWidth: 1, borderColor: '#E5E7EB', borderRightWidth: 0, borderBottomWidth: 0, marginTop: 5 },
  tableRow: { margin: 'auto', flexDirection: 'row' },
  tableColHeader: { width: '70%', borderStyle: 'solid', borderWidth: 1, borderColor: '#E5E7EB', borderLeftWidth: 0, borderTopWidth: 0, backgroundColor: '#FFF5F5', padding: 5 },
  tableColHeaderStatus: { width: '30%', borderStyle: 'solid', borderWidth: 1, borderColor: '#E5E7EB', borderLeftWidth: 0, borderTopWidth: 0, backgroundColor: '#FFF5F5', padding: 5 },
  tableCol: { width: '70%', borderStyle: 'solid', borderWidth: 1, borderColor: '#E5E7EB', borderLeftWidth: 0, borderTopWidth: 0, padding: 5 },
  tableColStatus: { width: '30%', borderStyle: 'solid', borderWidth: 1, borderColor: '#E5E7EB', borderLeftWidth: 0, borderTopWidth: 0, padding: 5 },
  tableCellHeader: { margin: 2, fontSize: 10, fontWeight: 'bold', color: '#DC2626' },
  tableCell: { margin: 2, fontSize: 10, color: '#4B5563' },
  tableCellStatus: { margin: 2, fontSize: 10, fontWeight: 'bold', color: '#059669' },

  diagnosticBox: { padding: 15, borderLeftWidth: 4, borderLeftColor: '#DC2626', backgroundColor: '#F9FAFB', marginTop: 5 },
  diagnosticText: { fontSize: 11, fontStyle: 'italic', color: '#333333', lineHeight: 1.5 },
  
  footer: { position: 'absolute', bottom: 30, left: 30, right: 30, textAlign: 'center', fontSize: 8, color: '#9CA3AF', borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 10 },
});

interface GarageReportProps {
  reportData: any;
}

export const GarageReport: React.FC<GarageReportProps> = ({ reportData }) => {
  const isMeca = reportData.metadata.mode === 'mecanique';
  
  // Textes dynamiques selon le métier
  const docTitle = isMeca ? "Ordre de Réparation Mécanique" : "Rapport d'Intervention GMAO";
  const durationLabel = isMeca ? "Temps d'intervention :" : "MTTR (Temps de réparation) :";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* EN-TÊTE DYNAMIQUE */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logoText}>LOCATE GARAGE</Text>
            <Text style={styles.logoSub}>Système Expert M5</Text>
          </View>
          <View style={styles.reportInfo}>
            <Text style={{ fontWeight: 'bold', color: '#DC2626' }}>{docTitle}</Text>
            <Text>ID : {reportData.metadata.reportId}</Text>
            <Text>Date : {new Date(reportData.metadata.timestamp).toLocaleString('fr-FR')}</Text>
          </View>
        </View>

        {/* CONTEXTE D'INTERVENTION */}
        <View style={styles.summaryBox}>
          <View style={styles.row}>
            <Text style={styles.label}>Opérateur / Technicien :</Text>
            <Text style={styles.value}>{reportData.metadata.technician}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{reportData.context.equipmentLabel} :</Text>
            <Text style={styles.value}>{reportData.context.equipmentId} (Zone: {reportData.context.location})</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{durationLabel}</Text>
            <Text style={styles.value}>{reportData.metadata.duration}</Text>
          </View>
          <View style={{ ...styles.row, marginBottom: 0 }}>
            <Text style={styles.label}>{reportData.context.classificationLabel} :</Text>
            <Text style={styles.value}>{reportData.context.classificationValue}</Text>
          </View>
        </View>

        {/* SAFETY GATES */}
        <Text style={styles.sectionTitle}>1. Contrôles & Sécurité Avant Intervention</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Procédure validée</Text></View>
            <View style={styles.tableColHeaderStatus}><Text style={styles.tableCellHeader}>Statut</Text></View>
          </View>
          {reportData.safetyGates.map((gate: any, idx: number) => (
            <View style={styles.tableRow} key={idx}>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{gate.step}</Text></View>
              <View style={styles.tableColStatus}><Text style={styles.tableCellStatus}>{gate.status}</Text></View>
            </View>
          ))}
        </View>

        {/* DIAGNOSTIC IA */}
        <Text style={styles.sectionTitle}>2. Synthèse du Diagnostic (Assisté par IA)</Text>
        <View style={styles.diagnosticBox}>
          <Text style={styles.diagnosticText}>"{reportData.diagnostic.hypothesis}"</Text>
          <Text style={{ fontSize: 10, color: '#666', marginTop: 10 }}>
            Niveau de certitude du modèle : {reportData.diagnostic.aiConfidence}
          </Text>
          <Text style={{ fontSize: 10, color: '#666', marginTop: 4 }}>
            Action recommandée : {reportData.diagnostic.actionPlan}
          </Text>
        </View>

        {/* PIED DE PAGE LÉGAL */}
        <Text style={styles.footer} fixed>
          Ce document est édité localement via l'application LOCATE GARAGE. L'analyse algorithmique est fournie à titre indicatif. Le professionnel intervenant sur site demeure le seul décisionnaire et responsable de l'intervention.
        </Text>

      </Page>
    </Document>
  );
};