import { useState, useMemo, useEffect } from 'react';
import type {  Origin, Ratios, RoastIdx, ServeStyle, MachineId, GrinderId, BlendInput  } from '../../engine/types';
import { computeFlavor, robustaPctOf } from '../../engine/flavor';
import { computeScore, scoreVerdict } from '../../engine/score';
import { computeFit } from '../../engine/fit';
import { blendPricePerKg, costPerCup, monthlyPicture } from '../../engine/money';
import { api } from '../../api';

export function useBlend() {
  const [origins, setOrigins] = useState<Origin[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Builder State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [ratios, setRatios] = useState<Ratios>({});
  const [roastIdx, setRoastIdx] = useState<RoastIdx>(1);
  const [serveStyle, setServeStyle] = useState<ServeStyle>('espresso');
  const [machine, setMachine] = useState<MachineId>('double');
  const [grinder, setGrinder] = useState<GrinderId>('commercial');
  const [blendName, setBlendName] = useState('My Custom Blend');
  
  const [doseOverride, setDoseOverride] = useState<number | null>(null);
  const [cupsPerDay, setCupsPerDay] = useState(100);
  const [currentPricePerKg, setCurrentPricePerKg] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [orgs, sets] = await Promise.all([
          api.getOrigins(),
          api.getSettings()
        ]);
        setOrigins(orgs);
        setSettings(sets);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const doseGrams = useMemo(() => {
    if (doseOverride !== null) return doseOverride;
    if (settings?.doseGrams) return settings.doseGrams[serveStyle] || 18;
    return 18;
  }, [doseOverride, settings, serveStyle]);

  const flavor = useMemo(() => computeFlavor(origins, selectedIds, ratios, roastIdx), [origins, selectedIds, ratios, roastIdx]);
  const cupScore = useMemo(() => computeScore(flavor), [flavor]);
  const verdict = useMemo(() => scoreVerdict(cupScore), [cupScore]);
  const robustaPct = useMemo(() => robustaPctOf(origins, selectedIds, ratios), [origins, selectedIds, ratios]);
  const fit = useMemo(() => computeFit(serveStyle, machine, grinder, roastIdx, robustaPct, flavor), [serveStyle, machine, grinder, roastIdx, robustaPct, flavor]);
  const pricePerKg = useMemo(() => blendPricePerKg(origins, ratios), [origins, ratios]);
  const cupCost = pricePerKg ? costPerCup(pricePerKg, doseGrams) : null;
  const monthly = pricePerKg ? monthlyPicture({ pricePerKg, doseGrams, cupsPerDay, currentPricePerKg }) : null;

  const toggleBean = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        const next = prev.filter(x => x !== id);
        // redistribute ratios equally among remaining for simplicity
        const newR = { ...ratios };
        delete newR[id];
        if (next.length > 0) {
          const share = 100 / next.length;
          next.forEach(n => newR[n] = share);
        }
        setRatios(newR);
        return next;
      }
      if (prev.length >= 4) return prev;
      const next = [...prev, id];
      const newR = { ...ratios };
      const share = 100 / next.length;
      next.forEach(n => newR[n] = share);
      setRatios(newR);
      return next;
    });
  };

  const setRatio = (id: string, val: number) => {
    setRatios(prev => {
      const otherIds = selectedIds.filter(x => x !== id);
      if (otherIds.length === 0) return { [id]: 100 };
      
      const newR = { ...prev, [id]: val };
      const rem = 100 - val;
      const oldRem = otherIds.reduce((sum, o) => sum + (prev[o] || 0), 0);
      
      let drift = rem;
      otherIds.forEach((o, i) => {
        if (i === otherIds.length - 1) {
          newR[o] = Math.round(drift);
        } else {
          const share = oldRem > 0 ? (prev[o] / oldRem) * rem : rem / otherIds.length;
          const rShare = Math.round(share);
          newR[o] = rShare;
          drift -= rShare;
        }
      });
      return newR;
    });
  };

  const applySuggestion = (sug: any) => {
    setSelectedIds(sug.selectedIds);
    setRatios(sug.ratios);
    setRoastIdx(sug.roastIdx);
    setServeStyle(sug.style);
    setMachine(sug.machine);
    setGrinder(sug.grinder);
    setBlendName(sug.blendName);
  };

  return {
    origins, settings, loading, error,
    selectedIds, ratios, roastIdx, serveStyle, machine, grinder, blendName,
    setRoastIdx, setServeStyle, setMachine, setGrinder, setBlendName,
    doseOverride, setDoseOverride, cupsPerDay, setCupsPerDay, currentPricePerKg, setCurrentPricePerKg,
    doseGrams, flavor, cupScore, verdict, robustaPct, fit, pricePerKg, cupCost, monthly,
    toggleBean, setRatio, applySuggestion
  };
}
