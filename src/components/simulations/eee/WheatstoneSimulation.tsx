import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface Props { isRunning: boolean; }

export function WheatstoneSimulation({ isRunning }: Props) {
  const [r1, setR1] = useState(100);
  const [r2, setR2] = useState(200);
  const [r3, setR3] = useState(150);
  const [r4, setR4] = useState(300);
  const [vs, setVs] = useState(10);

  const vA = vs * r3 / (r1 + r3);
  const vB = vs * r4 / (r2 + r4);
  const vG = vA - vB;
  const isBalanced = Math.abs(r1 * r4 - r2 * r3) < 0.01;
  const rUnknown = (r2 * r3) / r1;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold text-lg mb-4">Wheatstone Bridge</h3>
          <svg viewBox="0 0 400 350" className="w-full h-60 border rounded bg-muted/30">
            {/* Diamond shape */}
            <line x1="200" y1="30" x2="80" y2="160" stroke="hsl(var(--foreground))" strokeWidth="2" />
            <line x1="200" y1="30" x2="320" y2="160" stroke="hsl(var(--foreground))" strokeWidth="2" />
            <line x1="80" y1="160" x2="200" y2="290" stroke="hsl(var(--foreground))" strokeWidth="2" />
            <line x1="320" y1="160" x2="200" y2="290" stroke="hsl(var(--foreground))" strokeWidth="2" />
            {/* Galvanometer */}
            <line x1="80" y1="160" x2="320" y2="160" stroke="hsl(var(--chart-1))" strokeWidth="2" strokeDasharray="5 3" />
            <circle cx="200" cy="160" r="15" fill="hsl(var(--background))" stroke="hsl(var(--chart-1))" strokeWidth="2" />
            <text x="200" y="164" textAnchor="middle" fill="hsl(var(--chart-1))" fontSize="10">G</text>
            {/* Labels */}
            <rect x="110" y="80" width="50" height="22" fill="hsl(var(--background))" stroke="hsl(var(--destructive))" strokeWidth="1.5" rx="3" />
            <text x="135" y="95" textAnchor="middle" fill="hsl(var(--destructive))" fontSize="9">R1={r1}</text>
            <rect x="240" y="80" width="50" height="22" fill="hsl(var(--background))" stroke="hsl(var(--chart-2))" strokeWidth="1.5" rx="3" />
            <text x="265" y="95" textAnchor="middle" fill="hsl(var(--chart-2))" fontSize="9">R2={r2}</text>
            <rect x="110" y="210" width="50" height="22" fill="hsl(var(--background))" stroke="hsl(var(--primary))" strokeWidth="1.5" rx="3" />
            <text x="135" y="225" textAnchor="middle" fill="hsl(var(--primary))" fontSize="9">R3={r3}</text>
            <rect x="240" y="210" width="50" height="22" fill="hsl(var(--background))" stroke="hsl(var(--chart-4, var(--foreground)))" strokeWidth="1.5" rx="3" />
            <text x="265" y="225" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="9">R4={r4}</text>
            {/* Nodes */}
            <circle cx="200" cy="30" r="4" fill="hsl(var(--primary))" />
            <text x="200" y="22" textAnchor="middle" fill="hsl(var(--primary))" fontSize="9">+{vs}V</text>
            <circle cx="200" cy="290" r="4" fill="hsl(var(--foreground))" />
            <text x="200" y="310" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="9">GND</text>
            <circle cx="80" cy="160" r="4" fill="hsl(var(--chart-1))" />
            <text x="60" y="160" textAnchor="middle" fill="hsl(var(--chart-1))" fontSize="9">A</text>
            <circle cx="320" cy="160" r="4" fill="hsl(var(--chart-1))" />
            <text x="340" y="160" textAnchor="middle" fill="hsl(var(--chart-1))" fontSize="9">B</text>
            {/* Voltage labels */}
            <text x="55" y="185" fill="hsl(var(--muted-foreground))" fontSize="8">VA={vA.toFixed(2)}V</text>
            <text x="315" y="185" fill="hsl(var(--muted-foreground))" fontSize="8">VB={vB.toFixed(2)}V</text>
          </svg>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-4 space-y-4">
            <div><Label className="text-sm">Vs: {vs} V</Label><Slider value={[vs]} onValueChange={([v]) => setVs(v)} min={1} max={24} step={0.5} /></div>
            <div><Label className="text-sm">R1: {r1} Ω</Label><Slider value={[r1]} onValueChange={([v]) => setR1(v)} min={10} max={1000} step={10} /></div>
            <div><Label className="text-sm">R2: {r2} Ω</Label><Slider value={[r2]} onValueChange={([v]) => setR2(v)} min={10} max={1000} step={10} /></div>
            <div><Label className="text-sm">R3: {r3} Ω</Label><Slider value={[r3]} onValueChange={([v]) => setR3(v)} min={10} max={1000} step={10} /></div>
            <div><Label className="text-sm">R4: {r4} Ω</Label><Slider value={[r4]} onValueChange={([v]) => setR4(v)} min={10} max={1000} step={10} /></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 space-y-2">
            <h4 className="font-semibold">Bridge Measurements</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-muted p-2 rounded"><span className="text-muted-foreground">V_A:</span><p className="font-mono font-bold">{vA.toFixed(3)} V</p></div>
              <div className="bg-muted p-2 rounded"><span className="text-muted-foreground">V_B:</span><p className="font-mono font-bold">{vB.toFixed(3)} V</p></div>
              <div className="bg-muted p-2 rounded"><span className="text-muted-foreground">V_G (A-B):</span><p className="font-mono font-bold">{(vG * 1000).toFixed(2)} mV</p></div>
              <div className="bg-muted p-2 rounded"><span className="text-muted-foreground">R4 for balance:</span><p className="font-mono font-bold">{rUnknown.toFixed(1)} Ω</p></div>
            </div>
            <Badge variant={isBalanced ? 'default' : 'destructive'} className="mt-2">
              {isBalanced ? '✓ Bridge Balanced — R1×R4 = R2×R3' : `✗ Unbalanced — ΔV = ${(vG*1000).toFixed(2)} mV`}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">
              Balance condition: R1/R2 = R3/R4 → {(r1/r2).toFixed(3)} vs {(r3/r4).toFixed(3)}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
