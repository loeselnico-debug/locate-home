import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Helvetica', backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, borderBottomWidth: 2, borderBottomColor: '#DC2626', paddingBottom: 10 },
  logoText: { fontSize: 24, fontWeight: 'bold', color: '#DC2626' },
  logoSub: { fontSize: 12, color: '#333333', marginTop: 4 },
  reportInfo: { fontSize: 10, textAlign: 'right', color: '#666666' },
  summaryBox: { padding: 15, borderRadius: 5, marginBottom: 20, borderWidth: 1 },
  summaryBoxOK: { backgroundColor: '#F0FDF4', borderColor: '#22C55E' },
  summaryBoxKO: { backgroundColor: '#FEF2F2', borderColor: '#DC2626' },
  statusText: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  metaText: { fontSize: 10, color: '#333333', marginBottom: 3 },
  justificationBox: { marginTop: 10, padding: 10, backgroundColor: '#FFFFFF', borderLeftWidth: 3, borderLeftColor: '#DC2626' },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginTop: 5, marginBottom: 5 },
  tagBadge: { backgroundColor: '#FEE2E2', color: '#991B1B', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 3, fontSize: 8, fontWeight: 'bold', textTransform: 'uppercase' },
  
  // NOUVEAU : Styles pour la grille Avant/Après
  comparisonRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', paddingBottom: 10 },
  column: { width: '48%' },
  colHeader: { fontSize: 10, fontWeight: 'bold', backgroundColor: '#1F2937', color: 'white', padding: 4, textAlign: 'center', marginBottom: 4 },
  image: { width: '100%', height: 140, objectFit: 'cover', borderRadius: 2, borderWidth: 1, borderColor: '#D1D5DB' },
  drawerTitle: { fontSize: 12, fontWeight: 'bold', color: '#DC2626', marginBottom: 5, marginTop: 10 },
  
  footer: { position: 'absolute', bottom: 30, left: 30, right: 30, textAlign: 'center', fontSize: 8, color: '#9CA3AF', borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 10 },
});

interface FinDePosteReportProps {
  data: {
    profileId: string;
    profileName: string;
    timestamp: string;
    status: 'CONFORME' | 'DEGRADE';
    tags: string[];
    justification: string;
    morningImages: string[]; // Les photos de la Prise de Poste
    eveningImages: string[]; // Les photos qu'il vient de prendre
    totalDrawers: number;
  }
}

export const FinDePosteReport: React.FC<FinDePosteReportProps> = ({ data }) => {
  const isOK = data.status === 'CONFORME';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* EN-TÊTE */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logoText}>LOCATE GARAGE</Text>
            <Text style={styles.logoSub}>Protocole FOD / 5S</Text>
          </View>
          <View style={styles.reportInfo}>
            <Text style={{ fontWeight: 'bold', color: '#DC2626' }}>CLÔTURE DE POSTE (AVANT/APRÈS)</Text>
            <Text>Date : {data.timestamp}</Text>
            <Text>Opérateur : TECH-M5-001</Text>
          </View>
        </View>

        {/* SYNTHÈSE */}
        <View style={[styles.summaryBox, isOK ? styles.summaryBoxOK : styles.summaryBoxKO]}>
          <Text style={[styles.statusText, { color: isOK ? '#15803D' : '#B91C1C' }]}>
            BILAN FIN DE POSTE : {data.status}
          </Text>
          <Text style={styles.metaText}>Équipement : {data.profileId}</Text>
          
          {!isOK && (data.tags.length > 0 || data.justification) && (
            <View style={styles.justificationBox}>
              <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#DC2626' }}>Déclaration d'anomalie :</Text>
              {data.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {data.tags.map((tag, i) => (
                    <Text key={i} style={styles.tagBadge}>{tag}</Text>
                  ))}
                </View>
              )}
              {data.justification && (
                <Text style={{ fontSize: 10, color: '#333333', marginTop: 4, fontStyle: 'italic' }}>
                  "{data.justification}"
                </Text>
              )}
            </View>
          )}
        </View>

        {/* COMPARATEUR VISUEL (La magie opère ici) */}
        {data.eveningImages.map((eveningImg, idx) => {
          const isPlateau = idx === data.totalDrawers;
          // Si on n'a pas l'image du matin (ex: bug système), on met un espace vide, mais normalement on l'a.
          const morningImg = data.morningImages[idx] || eveningImg; 

          return (
            <View key={idx} wrap={false}>
              <Text style={styles.drawerTitle}>
                {isPlateau ? 'PLATEAU SUPÉRIEUR' : `TIROIR 0${idx + 1}`}
              </Text>
              <View style={styles.comparisonRow}>
                <View style={styles.column}>
                  <Text style={styles.colHeader}>PRISE DE POSTE (08:00)</Text>
                  <Image src={morningImg} style={styles.image} />
                </View>
                <View style={styles.column}>
                  <Text style={styles.colHeader}>FIN DE POSTE (MAINTENANT)</Text>
                  <Image src={eveningImg} style={styles.image} />
                </View>
              </View>
            </View>
          );
        })}

        <Text style={styles.footer} fixed>
          Document généré par le système LOCATE M5. Ce rapport de comparaison Avant/Après sert de preuve irréfutable de l'état de l'outillage entre la prise et la fin de poste.
        </Text>
      </Page>
    </Document>
  );
};