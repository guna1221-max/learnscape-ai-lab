import { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface Props { isRunning: boolean; }

export function NortonSimulation({ isRunning }: Props) {
  const [vs, setVs] = useState(12);
  const [r1, setR1] = useState(100);
  const [r2, setR2] = useState(200);
  const [r3, setR3] = useState(150);
  const [rl, setRl] = useState(100);

  const calculate = useCallback(() => {
    // Norton equivalent across RL (R3 in series with parallel R1||R2)
    const rParallel = (r1 * r2) / (r1 + r2);
    const iSc = vs / r1; // Short circuit current (R3 shorted, current through R1)
    // More accurate: Norton current with RL shorted
    const iN = vs / (r1 + (r2 * 0) / (r2 + 0)); // simplified
    const rN = (r1 * r2) / (r1 + r2); // Norton resistance
    const iL = (iN * rN) / (rN + rl);
    const vL = iL * rl;
    const pL = vL * iL;
    // Direct calculation for verification
    const rTotal = r1 + (r2 * rl) / (r2 + rl);
    const iSource = vs / rTotal;
    const vAB = vs - iSource * r1;
    const iLDirect = vAB / rl;
    return { iN: vs / r1, rN, iL, vL, pL, iLDirect, vAB };
  }, [vs, r1, r2, r3, rl]);

  const result = calculate();

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold text-lg mb-4">Norton's Theorem</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Original Circuit</p>
              <svg viewBox="0 0 300 200" className="w-full h-40 border rounded bg-muted/30">
                <circle cx="40" cy="100" r="18" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" />
                <text x="40" y="103" textAnchor="middle" fill="hsl(var(--primary))" fontSize="8">{vs}V</text>
                <line x1="40" y1="82" x2="40" y2="30" stroke="hsl(var(--foreground))" strokeWidth="2" />
                <line x1="40" y1="30" x2="100" y2="30" stroke="hsl(var(--foreground))" strokeWidth="2" />
                <rect x="100" y="18" width="50" height="24" fill="none" stroke="hsl(var(--destructive))" strokeWidth="2" rx="2" />
                <text x="125" y="34" textAnchor="middle" fill="hsl(var(--destructive))" fontSize="8">R1</text>
                <line x1="150" y1="30" x2="200" y2="30" stroke="hsl(var(--foreground))" strokeWidth="2" />
                <line x1="200" y1="30" x2="200" y2="55" stroke="hsl(var(--foreground))" strokeWidth="2" />
                <rect x="188" y="55" width="24" height="40" fill="none" stroke="hsl(var(--chart-1))" strokeWidth="2" rx="2" />
                <text x="200" y="78" textAnchor="middle" fill="hsl(var(--chart-1))" fontSize="8">R2</text>
                <line x1="200" y1="95" x2="200" y2="170" stroke="hsl(var(--foreground))" strokeWidth="2" />
                <line x1="200" y1="30" x2="260" y2="30" stroke="hsl(var(--foreground))" strokeWidth="2" />
                <line x1="260" y1="30" x2="260" y2="70" stroke="hsl(var(--foreground))" strokeWidth="2" />
                <rect x="248" y="70" width="24" height="40" fill="none" stroke="hsl(var(--chart-2))" strokeWidth="2" rx="2" />
                <text x="260" y="93" textAnchor="middle" fill="hsl(var(--chart-2))" fontSize="8">RL</text>
                <line x1="260" y1="110" x2="260" y2="170" stroke="hsl(var(--foreground))" strokeWidth="2" />
                <line x1="40" y1="170" x2="260" y2="170" stroke="hsl(var(--foreground))" strokeWidth="2" />
                <line x1="40" y1="118" x2="40" y2="170" stroke="hsl(var(--foreground))" strokeWidth="2" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Norton Equivalent</p>
              <svg viewBox="0 0 300 200" className="w-full h-40 border rounded bg-muted/30">
                <circle cx="80" cy="100" r="18" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" />
                <text x="80" y="97" textAnchor="middle" fill="hsl(var(--primary))" fontSize="7">IN</text>
                <text x="80" y="107" textAnchor="middle" fill="hsl(var(--primary))" fontSize="7">{(result.iN*1000).toFixed(1)}mA</text>
                <line x1="80" y1="82" x2="80" y2="30" stroke="hsl(var(--foreground))" strokeWidth="2" />
                <line x1="80" y1="30" x2="160" y2="30" stroke="hsl(var(--foreground))" strokeWidth="2" />
                <line x1="160" y1="30" x2="160" y2="55" stroke="hsl(var(--foreground))" strokeWidth="2" />
                <rect x="148" y="55" width="24" height="40" fill="none" stroke="hsl(var(--chart-1))" strokeWidth="2" rx="2" />
                <text x="160" y="72" textAnchor="middle" fill="hsl(var(--chart-1))" fontSize="7">RN</text>
                <text x="160" y="84" textAnchor="middle" fill="hsl(var(--chart-1))" fontSize="7">{result.rN.toFixed(0)}Ω</text>
                <line x1="160" y1="95" x2="160" y2="170" stroke="hsl(var(--foreground))" strokeWidth="2" />
                <line x1="160" y1="30" x2="230" y2="30" stroke="hsl(var(--foreground))" strokeWidth="2" />
                <line x1="230" y1="30" x2="230" y2="70" stroke="hsl(var(--foreground))" strokeWidth="2" />
                <rect x="218" y="70" width="24" height="40" fill="none" stroke="hsl(var(--chart-2))" strokeWidth="2" rx="2" />
                <text x="230" y="93" textAnchor="middle" fill="hsl(var(--chart-2))" fontSize="7">RL</text>
                <line x1="230" y1="110" x2="230" y2="170" stroke="hsl(var(--foreground))" strokeWidth="2" />
                <line x1="80" y1="170" x2="230" y2="170" stroke="hsl(var(--foreground))" strokeWidth="2" />
                <line x1="80" y1="118" x2="80" y2="170" stroke="hsl(var(--foreground))" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-4 space-y-4">
            <div><Label className="text-sm">Source Voltage: {vs} V</Label><Slider value={[vs]} onValueChange={([v]) => setVs(v)} min={1} max={24} step={0.5} /></div>
            <div><Label className="text-sm">R1: {r1} Ω</Label><Slider value={[r1]} onValueChange={([v]) => setR1(v)} min={10} max={1000} step={10} /></div>
            <div><Label className="text-sm">R2: {r2} Ω</Label><Slider value={[r2]} onValueChange={([v]) => setR2(v)} min={10} max={1000} step={10} /></div>
            <div><Label className="text-sm">Load RL: {rl} Ω</Label><Slider value={[rl]} onValueChange={([v]) => setRl(v)} min={10} max={1000} step={10} /></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 space-y-2">
            <h4 className="font-semibold">Norton Equivalent</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-muted p-2 rounded"><span className="text-muted-foreground">I_N:</span><p className="font-mono font-bold">{(result.iN*1000).toFixed(2)} mA</p></div>
              <div className="bg-muted p-2 rounded"><span className="text-muted-foreground">R_N:</span><p className="font-mono font-bold">{result.rN.toFixed(2)} Ω</p></div>
              <div className="bg-muted p-2 rounded"><span className="text-muted-foreground">I_L:</span><p className="font-mono font-bold">{(result.iL*1000).toFixed(2)} mA</p></div>
              <div className="bg-muted p-2 rounded"><span className="text-muted-foreground">V_L:</span><p className="font-mono font-bold">{result.vL.toFixed(3)} V</p></div>
              <div className="bg-muted p-2 rounded"><span className="text-muted-foreground">P_L:</span><p className="font-mono font-bold">{(result.pL*1000).toFixed(2)} mW</p></div>
              <div className="bg-muted p-2 rounded"><span className="text-muted-foreground">Direct I_L:</span><p className="font-mono font-bold">{(result.iLDirect*1000).toFixed(2)} mA</p></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
