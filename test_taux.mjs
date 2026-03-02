// Test standalone du calcul de taux d'accroissement
// Simule exactement le code de create.tsx

function applyGrowthRates(updated, prevYearData) {
  if (!prevYearData) { console.log("FAIL: prevYearData is null"); return updated; }

  // Préscolaire
  ['espaceCommunautaireEveil', 'maternel', 'prePrimaire', 'special'].forEach((niveau) => {
    const prevData = prevYearData.niveauPrescolaire?.[niveau];
    const currentData = updated.parametresCles?.effectifScolaire?.niveauPrescolaire?.[niveau];
    if (prevData && currentData) {
      const prevGF = prevData.effectifGarconsFilles || 0;
      const currentGF = currentData.effectifGarconsFilles || 0;
      if (prevGF > 0 && currentGF > 0) {
        currentData.tauxAccroissementGarconsFilles = Math.round(((currentGF - prevGF) / prevGF) * 100 * 1000) / 1000;
      }
    }
  });

  // Primaire
  ['enseignementSpecial', 'enseignementPrimaire'].forEach((niveau) => {
    const prevData = prevYearData.niveauPrimaire?.[niveau];
    const currentData = updated.parametresCles?.effectifScolaire?.niveauPrimaire?.[niveau];
    if (prevData && currentData) {
      const prevGF = prevData.effectifGarconsFilles || 0;
      const currentGF = currentData.effectifGarconsFilles || 0;
      if (prevGF > 0 && currentGF > 0) {
        currentData.tauxAccroissementGarconsFilles = Math.round(((currentGF - prevGF) / prevGF) * 100 * 1000) / 1000;
      }
    }
  });

  return updated;
}

// Simulate handleInputChange
function handleInputChange(formData, field, value, prevYearData) {
  const isTauxField = field.includes('tauxAccroissement') || 
                       (field.includes('tauxGarcons') && field.includes('effectifScolaire')) || 
                       (field.includes('tauxFilles') && field.includes('effectifScolaire'));

  const updated = JSON.parse(JSON.stringify(formData));
  const finalValue = typeof value === 'number' ? Math.round(value * 100) / 100 : value;
  
  const keys = field.split('.');
  let current = updated;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) {
      console.log(`FAIL: path broken at key[${i}] = '${keys[i]}'`);
      return updated;
    }
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = finalValue;
  
  if (!isTauxField && prevYearData) {
    return applyGrowthRates(updated, prevYearData);
  }
  return updated;
}

// === TEST ===
const prevYear = {
  niveauPrescolaire: {
    espaceCommunautaireEveil: { effectifGarconsFilles: 100, effectifFilles: 50 },
    maternel: { effectifGarconsFilles: 200, effectifFilles: 80 },
    prePrimaire: { effectifGarconsFilles: 0, effectifFilles: 0 },
    special: { effectifGarconsFilles: 0, effectifFilles: 0 }
  },
  niveauPrimaire: {
    enseignementSpecial: { effectifGarconsFilles: 0, effectifFilles: 0 },
    enseignementPrimaire: { effectifGarconsFilles: 500, effectifFilles: 250 }
  },
  niveauSecondaire: {}
};

const formData = {
  parametresCles: {
    effectifScolaire: {
      niveauPrescolaire: {
        espaceCommunautaireEveil: { effectifGarconsFilles: 0, effectifFilles: 0, tauxAccroissementGarconsFilles: 0, tauxAccroissementFilles: 0 },
        maternel: { effectifGarconsFilles: 0, effectifFilles: 0, tauxAccroissementGarconsFilles: 0, tauxAccroissementFilles: 0 },
        prePrimaire: { effectifGarconsFilles: 0, effectifFilles: 0, tauxAccroissementGarconsFilles: 0, tauxAccroissementFilles: 0 },
        special: { effectifGarconsFilles: 0, effectifFilles: 0, tauxAccroissementGarconsFilles: 0, tauxAccroissementFilles: 0 }
      },
      niveauPrimaire: {
        enseignementSpecial: { effectifGarconsFilles: 0, effectifFilles: 0, tauxAccroissementGarconsFilles: 0, tauxAccroissementFilles: 0 },
        enseignementPrimaire: { effectifGarconsFilles: 0, effectifFilles: 0, tauxAccroissementGarconsFilles: 0, tauxAccroissementFilles: 0 }
      },
      niveauSecondaire: {}
    }
  }
};

// Simulate: user types 120 in ECE effectifGarconsFilles
const field = 'parametresCles.effectifScolaire.niveauPrescolaire.espaceCommunautaireEveil.effectifGarconsFilles';
const result = handleInputChange(formData, field, 120, prevYear);

const taux = result.parametresCles.effectifScolaire.niveauPrescolaire.espaceCommunautaireEveil.tauxAccroissementGarconsFilles;
console.log(`ECE taux G/F = ${taux}  (expected: 20)`);
console.log(taux === 20 ? '✅ TEST PASSED' : '❌ TEST FAILED');

// Test 2: type 300 in maternel
const result2 = handleInputChange(formData, 'parametresCles.effectifScolaire.niveauPrescolaire.maternel.effectifGarconsFilles', 300, prevYear);
const taux2 = result2.parametresCles.effectifScolaire.niveauPrescolaire.maternel.tauxAccroissementGarconsFilles;
console.log(`Maternel taux G/F = ${taux2}  (expected: 50)`);
console.log(taux2 === 50 ? '✅ TEST PASSED' : '❌ TEST FAILED');

// Test 3: type 600 in enseignementPrimaire
const result3 = handleInputChange(formData, 'parametresCles.effectifScolaire.niveauPrimaire.enseignementPrimaire.effectifGarconsFilles', 600, prevYear);
const taux3 = result3.parametresCles.effectifScolaire.niveauPrimaire.enseignementPrimaire.tauxAccroissementGarconsFilles;
console.log(`Primaire taux G/F = ${taux3}  (expected: 20)`);
console.log(taux3 === 20 ? '✅ TEST PASSED' : '❌ TEST FAILED');

// Test 4: with null prevYearData
const result4 = handleInputChange(formData, field, 120, null);
const taux4 = result4.parametresCles.effectifScolaire.niveauPrescolaire.espaceCommunautaireEveil.tauxAccroissementGarconsFilles;
console.log(`\nWith null prevYear: taux = ${taux4}  (expected: 0 - unchanged)`);
console.log(taux4 === 0 ? '✅ TEST PASSED (no data = no calc)' : '❌ TEST FAILED');

// Test 5: taux field should NOT trigger recalc
const result5 = handleInputChange(formData, 'parametresCles.effectifScolaire.niveauPrescolaire.espaceCommunautaireEveil.tauxAccroissementGarconsFilles', 99, prevYear);
const taux5 = result5.parametresCles.effectifScolaire.niveauPrescolaire.espaceCommunautaireEveil.tauxAccroissementGarconsFilles;
console.log(`\nManual taux edit: ${taux5}  (expected: 99 - manual override)`);
console.log(taux5 === 99 ? '✅ TEST PASSED' : '❌ TEST FAILED');

console.log('\n=== All tests complete ===');
