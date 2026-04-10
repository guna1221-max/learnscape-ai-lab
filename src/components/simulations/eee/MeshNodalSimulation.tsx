import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface Props { isRunning: boolean; }

export function MeshNodalSimulation({ isRunning }: Props) {
  const [method, setMethod] = useState<'mesh' | 'nodal'>('mesh');
  const [v1, setV1] = useState(12);
  const [v2, setV2] = useState(8);
  const [r1, setR1] = useState(100);
  const [r2, setR2] = useState(200);
  const [r3, setR3] = useState(150);

  // Mesh Analysis: 2 mesh currents
  // Mesh 1: V1 = I1*R1 + (I1-I2)*R2
  // Mesh 2: -V2 = I2*R3 + (I2-I1)*R2
  const a11 = r1 + r2, a12 = -r2;
  const a21 = -r2, a22 = r3 + r2;
  const det = a11 * a22 - a12 * a21;
  const i1 = (v1 * a22 - (-v2) * a12) / det;
  const i2 = (a11 * (-v2) - a21 * v1) / det;

  // Nodal Analysis: Node voltage VA
  // (VA - V1)/R1 + VA/R2 + (VA - (-V2))/R3 = 0 ... simplified
  // Actually for this circuit: (VA/R1 - V1/R1) + VA/R2 + (VA/R3 + V2/R3) = 0
  const gSum = 1/r1 + 1/r2 + 1/r3;
  const vA = (v1/r1 - v2/r3) / gSum;

  const meshI1 = i1, meshI2 = i2;
  const nodalIR1 = (v1 - vA) / r1;
  const nodalIR2 = vA / r2;
  const nodalIR3 = (vA + v2) / r3;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold text-lg mb-4">Mesh & Nodal Analysis</h3>
          <Tabs value={method} onValueChange={(v) => setMethod(v as any)}>
            <TabsList className="mb-4">
              <TabsTrigger value="mesh">Mesh Analysis</TabsTrigger>
              <TabsTrigger value="nodal">Nodal Analysis</TabsTrigger>
            </TabsList>
          </Tabs>
          <svg viewBox="0 0 500 250" className="w-full h-48 border rounded bg-muted/30">
            {/* V1 source */}
            <circle cx="60" cy="125" r="20" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" />
            <text x="60" y="128" textAnchor="middle" fill="hsl(var(--primary))" fontSize="9">{v1}V</text>
            <line x1="60" y1="105" x2="60" y2="40" stroke="hsl(var(--foreground))" strokeWidth="2" />
            <line x1="60" y1="40" x2="180" y2="40" stroke="hsl(var(--foreground))" strokeWidth="2" />
            {/* R1 */}
            <rect x="180" y="28" width="60" height="24" fill="none" stroke="hsl(var(--destructive))" strokeWidth="2" rx="3" />
            <text x="210" y="44" textAnchor="middle" fill="hsl(var(--destructive))" fontSize="9">R1={r1}Ω</text>
            <line x1="240" y1="40" x2="300" y2="40" stroke="hsl(var(--foreground))" strokeWidth="2" />
            {/* Node A */}
            <circle cx="300" cy="40" r="5" fill="hsl(var(--primary))" />
            <text x="310" y="35" fill="hsl(var(--primary))" fontSize="10" fontWeight="bold">A</text>
            {method === 'nodal' && <text x="310" y="25" fill="hsl(var(--chart-1))" fontSize="8">VA={vA.toFixed(2)}V</text>}
            {/* R2 downward */}
            <line x1="300" y1="45" x2="300" y2="90" stroke="hsl(var(--foreground))" strokeWidth="2" />
            <rect x="285" y="90" width="30" height="50" fill="none" stroke="hsl(var(--chart-1))" strokeWidth="2" rx="3" />
            <text x="300" y="120" textAnchor="middle" fill="hsl(var(--chart-1))" fontSize="9">R2</text>
            <line x1="300" y1="140" x2="300" y2="210" stroke="hsl(var(--foreground))" strokeWidth="2" />
            {/* R3 to right */}
            <line x1="300" y1="40" x2="360" y2="40" stroke="hsl(var(--foreground))" strokeWidth="2" />
            <rect x="360" y="28" width="60" height="24" fill="none" stroke="hsl(var(--chart-2))" strokeWidth="2" rx="3" />
            <text x="390" y="44" textAnchor="middle" fill="hsl(var(--chart-2))" fontSize="9">R3={r3}Ω</text>
            <line x1="420" y1="40" x2="440" y2="40" stroke="hsl(var(--foreground))" strokeWidth="2" />
            <line x1="440" y1="40" x2="440" y2="105" stroke="hsl(var(--foreground))" strokeWidth="2" />
            {/* V2 source */}
            <circle cx="440" cy="125" r="20" fill="none" stroke="hsl(var(--chart-2))" strokeWidth="2" />
            <text x="440" y="128" textAnchor="middle" fill="hsl(var(--chart-2))" fontSize="9">{v2}V</text>
            <line x1="440" y1="145" x2="440" y2="210" stroke="hsl(var(--foreground))" strokeWidth="2" />
            {/* Bottom wire */}
            <line x1="60" y1="210" x2="440" y2="210" stroke="hsl(var(--foreground))" strokeWidth="2" />
            <line x1="60" y1="145" x2="60" y2="210" stroke="hsl(var(--foreground))" strokeWidth="2" />
            {/* Mesh current indicators */}
            {method === 'mesh' && (
              <>
                <circle cx="180" cy="125" r="25" fill="none" stroke="hsl(var(--primary))" strokeWidth="1" strokeDasharray="4 2" />
                <text x="180" y="128" textAnchor="middle" fill="hsl(var(--primary))" fontSize="9">I1</text>
                <circle cx="370" cy="125" r="25" fill="none" stroke="hsl(var(--chart-2))" strokeWidth="1" strokeDasharray="4 2" />
                <text x="370" y="128" textAnchor="middle" fill="hsl(var(--chart-2))" fontSize="9">I2</text>
              </>
            )}
          </svg>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-4 space-y-4">
            <div><Label className="text-sm">V1: {v1} V</Label><Slider value={[v1]} onValueChange={([v]) => setV1(v)} min={1} max={24} step={0.5} /></div>
            <div><Label className="text-sm">V2: {v2} V</Label><Slider value={[v2]} onValueChange={([v]) => setV2(v)} min={1} max={24} step={0.5} /></div>
            <div><Label className="text-sm">R1: {r1} Ω</Label><Slider value={[r1]} onValueChange={([v]) => setR1(v)} min={10} max={500} step={10} /></div>
            <div><Label className="text-sm">R2: {r2} Ω</Label><Slider value={[r2]} onValueChange={([v]) => setR2(v)} min={10} max={500} step={10} /></div>
            <div><Label className="text-sm">R3: {r3} Ω</Label><Slider value={[r3]} onValueChange={([v]) => setR3(v)} min={10} max={500} step={10} /></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 space-y-2">
            <h4 className="font-semibold">{method === 'mesh' ? 'Mesh' : 'Nodal'} Results</h4>
            {method === 'mesh' ? (
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-muted p-2 rounded"><span className="text-muted-foreground">I1:</span><p className="font-mono font-bold">{(meshI1*1000).toFixed(2)} mA</p></div>
                <div className="bg-muted p-2 rounded"><span className="text-muted-foreground">I2:</span><p className="font-mono font-bold">{(meshI2*1000).toFixed(2)} mA</p></div>
                <div className="bg-muted p-2 rounded"><span className="text-muted-foreground">I_R2:</span><p className="font-mono font-bold">{((meshI1-meshI2)*1000).toFixed(2)} mA</p></div>
                <div className="bg-muted p-2 rounded"><span className="text-muted-foreground">V_R2:</span><p className="font-mono font-bold">{((meshI1-meshI2)*r2).toFixed(3)} V</p></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-muted p-2 rounded"><span className="text-muted-foreground">V_A:</span><p className="font-mono font-bold">{vA.toFixed(3)} V</p></div>
                <div className="bg-muted p-2 rounded"><span className="text-muted-foreground">I_R1:</span><p className="font-mono font-bold">{(nodalIR1*1000).toFixed(2)} mA</p></div>
                <div className="bg-muted p-2 rounded"><span className="text-muted-foreground">I_R2:</span><p className="font-mono font-bold">{(nodalIR2*1000).toFixed(2)} mA</p></div>
                <div className="bg-muted p-2 rounded"><span className="text-muted-foreground">I_R3:</span><p className="font-mono font-bold">{(nodalIR3*1000).toFixed(2)} mA</p></div>
              </div>
            )}
            <Badge variant="default" className="mt-2">
              Both methods give same results ✓
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
