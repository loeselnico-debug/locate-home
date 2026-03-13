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
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  imageContainer: { width: '48%', marginBottom: 15 },
  image: { width: '100%', height: 160, objectFit: 'cover', borderRadius: 4, borderWidth: 1, borderColor: '#E5E7EB' },
  imageLabel: { fontSize: 10, fontWeight: 'bold', marginTop: 5, textAlign: 'center', backgroundColor: '#F9FAFB', padding: 4 },
  footer: { position: 'absolute', bottom: 30, left: 30, right: 30, textAlign: 'center', fontSize: 8, color: '#9CA3AF', borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 10 },
});

interface PriseDePosteReportProps {
  data: {
    profileId: string;
    profileName: string;
    timestamp: string;
    status: 'CONFORME' | 'DEGRADE';
    tags: string[];
    justification: string;
    images: string[];
    totalDrawers: number;
  }
}

export const PriseDePosteReport: React.FC<PriseDePosteReportProps> = ({ data }) => {
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
            <Text style={{ fontWeight: 'bold', color: '#DC2626' }}>CERTIFICAT D'ÉTAT (SERVANTE)</Text>
            <Text>Date : {data.timestamp}</Text>
            <Text>Opérateur : TECH-M5-001</Text>
          </View>
        </View>

        {/* SYNTHÈSE ET JUSTIFICATION */}
        <View style={[styles.summaryBox, isOK ? styles.summaryBoxOK : styles.summaryBoxKO]}>
          <Text style={[styles.statusText, { color: isOK ? '#15803D' : '#B91C1C' }]}>
            STATUT : {data.status}
          </Text>
          <Text style={styles.metaText}>Équipement ciblé : {data.profileId} ({data.profileName})</Text>
          <Text style={styles.metaText}>Contrôle visuel : {data.images.length} zones inspectées et photographiées.</Text>
          
          {!isOK && (data.tags.length > 0 || data.justification) && (
            <View style={styles.justificationBox}>
              <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#DC2626' }}>Déclaration d'anomalie :</Text>
              
              {/* Affichage des Tags (Chantier, Chaos, etc.) */}
              {data.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {data.tags.map((tag, i) => (
                    <Text key={i} style={styles.tagBadge}>{tag}</Text>
                  ))}
                </View>
              )}

              {/* Texte libre éventuel */}
              {data.justification && (
                <Text style={{ fontSize: 10, color: '#333333', marginTop: 4, fontStyle: 'italic' }}>
                  "{data.justification}"
                </Text>
              )}
            </View>
          )}
        </View>

        {/* GRILLE DES PREUVES VISUELLES */}
        <View style={styles.grid}>
          {data.images.map((img, idx) => {
            const isPlateau = idx === data.totalDrawers;
            return (
              <View key={idx} style={styles.imageContainer} wrap={false}>
                <Image src={img} style={styles.image} />
                <Text style={styles.imageLabel}>
                  {isPlateau ? 'PLATEAU SUPÉRIEUR' : `TIROIR 0${idx + 1}`}
                </Text>
              </View>
            );
          })}
        </View>

        {/* FOOTER LÉGAL */}
        <Text style={styles.footer} fixed>
          Document généré cryptographiquement par le système LOCATE M5. La responsabilité de la vérification de l'intégrité de la servante incombe à l'opérateur. Ce rapport sert de preuve visuelle de l'état de l'outillage.
        </Text>
      </Page>
    </Document>
  );
};