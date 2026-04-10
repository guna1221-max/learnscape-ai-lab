import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

interface Props { isRunning: boolean; }

export function MaxPowerTransferSimulation({ isRunning }: Props) {
  const [vs, setVs] = useState(12);
  const [rs, setRs] = useState(100);
  const [rl, setRl] = useState(100);

  const iL = vs / (rs + rl);
  const vL = iL * rl;
  const pL = iL * iL * rl;
  const pMax = (vs * vs) / (4 * rs);
  const efficiency = (rl / (rs + rl)) * 100;

  const chartData = useMemo(() => {
    const data = [];
    for (let r = 1; r <= rs * 4; r += Math.max(1, Math.floor(rs / 50))) {
      const i = vs / (rs + r);
      data.push({
        rl: r,
        power: parseFloat((i * i * r * 1000).toFixed(3)),
        efficiency: parseFloat(((r / (rs + r)) * 100).toFixed(1)),
      });
    }
    return data;
  }, [vs, rs]);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold text-lg mb-4">Maximum Power Transfer Theorem</h3>
          <svg viewBox="0 0 400 180" className="w-full h-36 border rounded bg-muted/30">
            <circle cx="60" cy="90" r="20" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" />
            <text x="60" y="88" textAnchor="middle" fill="hsl(var(--primary))" fontSize="9">{vs}V</text>
            <text x="60" y="100" textAnchor="middle" fill="hsl(var(--primary))" fontSize="8">Vs</text>
            <line x1="60" y1="70" x2="60" y2="30" stroke="hsl(var(--foreground))" strokeWidth="2" />
            <line x1="60" y1="30" x2="140" y2="30" stroke="hsl(var(--foreground))" strokeWidth="2" />
            <rect x="140" y="18" width="60" height="24" fill="none" stroke="hsl(var(--destructive))" strokeWidth="2" rx="3" />
            <text x="170" y="34" textAnchor="middle" fill="hsl(var(--destructive))" fontSize="9">Rs={rs}Ω</text>
            <line x1="200" y1="30" x2="280" y2="30" stroke="hsl(var(--foreground))" strokeWidth="2" />
            <line x1="280" y1="30" x2="280" y2="55" stroke="hsl(var(--foreground))" strokeWidth="2" />
            <rect x="265" y="55" width="30" height="50" fill="none" stroke="hsl(var(--chart-1))" strokeWidth="2" rx="3" />
            <text x="280" y="78" textAnchor="middle" fill="hsl(var(--chart-1))" fontSize="8">RL</text>
            <text x="280" y="90" textAnchor="middle" fill="hsl(var(--chart-1))" fontSize="8">{rl}Ω</text>
            <line x1="280" y1="105" x2="280" y2="150" stroke="hsl(var(--foreground))" strokeWidth="2" />
            <line x1="60" y1="150" x2="280" y2="150" stroke="hsl(var(--foreground))" strokeWidth="2" />
            <line x1="60" y1="110" x2="60" y2="150" stroke="hsl(var(--foreground))" strokeWidth="2" />
            {/* Dashed box around Thevenin */}
            <rect x="30" y="10" width="190" height="160" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="1" strokeDasharray="5 5" rx="5" />
            <text x="125" y="175" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="8">Source Network</text>
          </svg>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-4 space-y-4">
            <div><Label className="text-sm">Source Voltage Vs: {vs} V</Label><Slider value={[vs]} onValueChange={([v]) => setVs(v)} min={1} max={24} step={0.5} /></div>
            <div><Label className="text-sm">Source Resistance Rs: {rs} Ω</Label><Slider value={[rs]} onValueChange={([v]) => setRs(v)} min={10} max={500} step={10} /></div>
            <div><Label className="text-sm">Load Resistance RL: {rl} Ω</Label><Slider value={[rl]} onValueChange={([v]) => setRl(v)} min={1} max={rs * 4} step={1} /></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 space-y-2">
            <h4 className="font-semibold">Measurements</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-muted p-2 rounded"><span className="text-muted-foreground">I_L:</span><p className="font-mono font-bold">{(iL*1000).toFixed(2)} mA</p></div>
              <div className="bg-muted p-2 rounded"><span className="text-muted-foreground">V_L:</span><p className="font-mono font-bold">{vL.toFixed(3)} V</p></div>
              <div className="bg-muted p-2 rounded"><span className="text-muted-foreground">P_L:</span><p className="font-mono font-bold">{(pL*1000).toFixed(2)} mW</p></div>
              <div className="bg-muted p-2 rounded"><span className="text-muted-foreground">P_max:</span><p className="font-mono font-bold">{(pMax*1000).toFixed(2)} mW</p></div>
              <div className="bg-muted p-2 rounded"><span className="text-muted-foreground">Efficiency:</span><p className="font-mono font-bold">{efficiency.toFixed(1)}%</p></div>
              <div className={`p-2 rounded text-sm ${Math.abs(rl - rs) < rs * 0.05 ? 'bg-green-100 dark:bg-green-900' : 'bg-muted'}`}>
                <span className="text-muted-foreground">Status:</span>
                <p className="font-bold">{Math.abs(rl - rs) < rs * 0.05 ? '⚡ Max Power!' : rl < rs ? 'RL < Rs' : 'RL > Rs'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {isRunning && (
        <Card>
          <CardContent className="pt-6">
            <h4 className="font-semibold mb-4">Power vs Load Resistance</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rl" label={{ value: 'RL (Ω)', position: 'bottom' }} />
                <YAxis label={{ value: 'Power (mW)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <ReferenceLine x={rs} stroke="hsl(var(--destructive))" strokeDasharray="5 5" label={`RL=Rs=${rs}Ω`} />
                <Line type="monotone" dataKey="power" stroke="hsl(var(--primary))" name="Power (mW)" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
