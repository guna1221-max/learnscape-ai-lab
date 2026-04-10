import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

interface Props { isRunning: boolean; }

export function KirchhoffSimulation({ isRunning }: Props) {
  const [v1, setV1] = useState(10);
  const [v2, setV2] = useState(5);
  const [r1, setR1] = useState(100);
  const [r2, setR2] = useState(200);
  const [r3, setR3] = useState(150);
  const [showKCL, setShowKCL] = useState(false);

  const calculate = useCallback(() => {
    // Mesh analysis for 2 loops
    // Loop 1: V1 = I1*R1 + (I1-I2)*R3
    // Loop 2: V2 = I2*R2 + (I2-I1)*R3
    const a11 = r1 + r3, a12 = -r3;
    const a21 = -r3, a22 = r2 + r3;
    const det = a11 * a22 - a12 * a21;
    const i1 = (v1 * a22 - v2 * a12) / det;
    const i2 = (a11 * v2 - a21 * v1) / det;
    const i3 = i1 - i2;
    const vr1 = i1 * r1, vr2 = i2 * r2, vr3 = i3 * r3;
    const kvlLoop1 = v1 - vr1 - vr3;
    const kvlLoop2 = v2 - vr2 + vr3;
    const kclNodeA = i1 - i2 - i3;
    return { i1, i2, i3, vr1, vr2, vr3, kvlLoop1, kvlLoop2, kclNodeA };
  }, [v1, v2, r1, r2, r3]);

  const result = calculate();

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold text-lg mb-4">Kirchhoff's {showKCL ? 'Current' : 'Voltage'} Law</h3>
          <div className="flex items-center gap-2 mb-4">
            <Label>KVL</Label>
            <Switch checked={showKCL} onCheckedChange={setShowKCL} />
            <Label>KCL</Label>
          </div>
          <svg viewBox="0 0 500 300" className="w-full h-56 border rounded bg-muted/30">
            {/* V1 source */}
            <circle cx="60" cy="150" r="20" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" />
            <text x="60" y="145" textAnchor="middle" fill="hsl(var(--primary))" fontSize="8">V1</text>
            <text x="60" y="158" textAnchor="middle" fill="hsl(var(--primary))" fontSize="8">{v1}V</text>
            {/* R1 */}
            <line x1="60" y1="130" x2="60" y2="60" stroke="hsl(var(--foreground))" strokeWidth="2" />
            <line x1="60" y1="60" x2="150" y2="60" stroke="hsl(var(--foreground))" strokeWidth="2" />
            <rect x="150" y="45" width="70" height="30" fill="none" stroke="hsl(var(--destructive))" strokeWidth="2" rx="3" />
            <text x="185" y="65" textAnchor="middle" fill="hsl(var(--destructive))" fontSize="9">R1={r1}Ω</text>
            <line x1="220" y1="60" x2="300" y2="60" stroke="hsl(var(--foreground))" strokeWidth="2" />
            {/* Node A */}
            <circle cx="300" cy="60" r="5" fill="hsl(var(--primary))" />
            <text x="310" y="55" fill="hsl(var(--primary))" fontSize="9">Node A</text>
            {/* R3 down */}
            <line x1="300" y1="65" x2="300" y2="120" stroke="hsl(var(--foreground))" strokeWidth="2" />
            <rect x="285" y="120" width="30" height="60" fill="none" stroke="hsl(var(--chart-1))" strokeWidth="2" rx="3" />
            <text x="300" y="155" textAnchor="middle" fill="hsl(var(--chart-1))" fontSize="8">R3</text>
            <line x1="300" y1="180" x2="300" y2="240" stroke="hsl(var(--foreground))" strokeWidth="2" />
            {/* R2 right from Node A */}
            <line x1="305" y1="60" x2="370" y2="60" stroke="hsl(var(--foreground))" strokeWidth="2" />
            <rect x="370" y="45" width="70" height="30" fill="none" stroke="hsl(var(--chart-2))" strokeWidth="2" rx="3" />
            <text x="405" y="65" textAnchor="middle" fill="hsl(var(--chart-2))" fontSize="9">R2={r2}Ω</text>
            <line x1="440" y1="60" x2="440" y2="150" stroke="hsl(var(--foreground))" strokeWidth="2" />
            {/* V2 source */}
            <circle cx="440" cy="170" r="20" fill="none" stroke="hsl(var(--chart-2))" strokeWidth="2" />
            <text x="440" y="168" textAnchor="middle" fill="hsl(var(--chart-2))" fontSize="8">V2</text>
            <text x="440" y="178" textAnchor="middle" fill="hsl(var(--chart-2))" fontSize="8">{v2}V</text>
            {/* Bottom wire */}
            <line x1="440" y1="190" x2="440" y2="240" stroke="hsl(var(--foreground))" strokeWidth="2" />
            <line x1="60" y1="240" x2="440" y2="240" stroke="hsl(var(--foreground))" strokeWidth="2" />
            <line x1="60" y1="170" x2="60" y2="240" stroke="hsl(var(--foreground))" strokeWidth="2" />
            {/* Current arrows */}
            <text x="110" y="52" fill="hsl(var(--primary))" fontSize="9">I1→ {(result.i1*1000).toFixed(1)}mA</text>
            <text x="350" y="52" fill="hsl(var(--chart-2))" fontSize="9">I2→ {(result.i2*1000).toFixed(1)}mA</text>
            <text x="305" y="115" fill="hsl(var(--chart-1))" fontSize="9">I3↓ {(result.i3*1000).toFixed(1)}mA</text>
          </svg>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-4 space-y-4">
            <div><Label className="text-sm">V1: {v1} V</Label><Slider value={[v1]} onValueChange={([v]) => setV1(v)} min={1} max={24} step={0.5} /></div>
            <div><Label className="text-sm">V2: {v2} V</Label><Slider value={[v2]} onValueChange={([v]) => setV2(v)} min={1} max={24} step={0.5} /></div>
            <div><Label className="text-sm">R1: {r1} Ω</Label><Slider value={[r1]} onValueChange={([v]) => setR1(v)} min={10} max={1000} step={10} /></div>
            <div><Label className="text-sm">R2: {r2} Ω</Label><Slider value={[r2]} onValueChange={([v]) => setR2(v)} min={10} max={1000} step={10} /></div>
            <div><Label className="text-sm">R3: {r3} Ω</Label><Slider value={[r3]} onValueChange={([v]) => setR3(v)} min={10} max={1000} step={10} /></div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 space-y-2">
            <h4 className="font-semibold">Verification</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-muted p-2 rounded">
                <span className="text-muted-foreground">V_R1:</span>
                <p className="font-mono font-bold">{result.vr1.toFixed(3)} V</p>
              </div>
              <div className="bg-muted p-2 rounded">
                <span className="text-muted-foreground">V_R2:</span>
                <p className="font-mono font-bold">{result.vr2.toFixed(3)} V</p>
              </div>
              <div className="bg-muted p-2 rounded">
                <span className="text-muted-foreground">V_R3:</span>
                <p className="font-mono font-bold">{result.vr3.toFixed(3)} V</p>
              </div>
              <div className="bg-muted p-2 rounded">
                <span className="text-muted-foreground">KCL (Node A):</span>
                <p className="font-mono font-bold">{result.kclNodeA.toFixed(6)} A</p>
              </div>
            </div>
            <div className="space-y-1">
              <Badge variant={Math.abs(result.kvlLoop1) < 0.001 ? 'default' : 'destructive'}>
                KVL Loop 1: ΣV = {result.kvlLoop1.toFixed(4)} V {Math.abs(result.kvlLoop1) < 0.001 ? '✓' : '✗'}
              </Badge>
              <Badge variant={Math.abs(result.kclNodeA) < 1e-10 ? 'default' : 'destructive'} className="ml-2">
                KCL Node A: ΣI = {(result.kclNodeA * 1000).toFixed(4)} mA {Math.abs(result.kclNodeA) < 1e-10 ? '✓' : '✗'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
