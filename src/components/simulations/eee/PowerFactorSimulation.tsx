import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Props { isRunning: boolean; }

export function PowerFactorSimulation({ isRunning }: Props) {
  const [voltage, setVoltage] = useState(230); // Vrms
  const [r, setR] = useState(50);
  const [xl, setXl] = useState(30);
  const [xc, setXc] = useState(10);

  const z = Math.sqrt(r * r + (xl - xc) * (xl - xc));
  const phi = Math.atan2(xl - xc, r);
  const pf = Math.cos(phi);
  const irms = voltage / z;
  const pReal = voltage * irms * pf;
  const pReactive = voltage * irms * Math.sin(phi);
  const pApparent = voltage * irms;

  const waveData = useMemo(() => {
    const data = [];
    for (let deg = 0; deg <= 720; deg += 2) {
      const t = deg;
      const rad = (deg * Math.PI) / 180;
      const v = voltage * Math.sqrt(2) * Math.sin(rad);
      const i = irms * Math.sqrt(2) * Math.sin(rad - phi);
      const p = v * i;
      data.push({
        angle: t,
        voltage: parseFloat((v / (voltage * Math.sqrt(2)) * 100).toFixed(1)),
        current: parseFloat((i / (irms * Math.sqrt(2)) * 100).toFixed(1)),
        power: parseFloat((p / (voltage * irms * Math.sqrt(2) * Math.sqrt(2)) * 100).toFixed(1)),
      });
    }
    return data;
  }, [voltage, irms, phi]);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold text-lg mb-4">Power Factor Measurement</h3>
          {/* Power triangle */}
          <svg viewBox="0 0 400 200" className="w-full h-40 border rounded bg-muted/30">
            <line x1="50" y1="150" x2="300" y2="150" stroke="hsl(var(--primary))" strokeWidth="3" />
            <text x="175" y="170" textAnchor="middle" fill="hsl(var(--primary))" fontSize="11">P = {pReal.toFixed(1)} W (Real)</text>
            <line x1="300" y1="150" x2="300" y2={150 - Math.abs(pReactive) / pApparent * 120} stroke="hsl(var(--destructive))" strokeWidth="3" />
            <text x="340" y={150 - Math.abs(pReactive) / pApparent * 60} fill="hsl(var(--destructive))" fontSize="10">Q = {Math.abs(pReactive).toFixed(1)} VAR</text>
            <line x1="50" y1="150" x2="300" y2={150 - Math.abs(pReactive) / pApparent * 120} stroke="hsl(var(--chart-1))" strokeWidth="3" strokeDasharray="5 3" />
            <text x="150" y={150 - Math.abs(pReactive) / pApparent * 60 - 5} fill="hsl(var(--chart-1))" fontSize="10">S = {pApparent.toFixed(1)} VA</text>
            {/* Angle arc */}
            <path d={`M 90,150 A 40,40 0 0 ${pReactive >= 0 ? 0 : 1} 90,${150 - 30}`} fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" />
            <text x="100" y="138" fill="hsl(var(--muted-foreground))" fontSize="10">φ = {(phi * 180 / Math.PI).toFixed(1)}°</text>
          </svg>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-4 space-y-4">
            <div><Label className="text-sm">Voltage: {voltage} Vrms</Label><Slider value={[voltage]} onValueChange={([v]) => setVoltage(v)} min={50} max={440} step={10} /></div>
            <div><Label className="text-sm">Resistance R: {r} Ω</Label><Slider value={[r]} onValueChange={([v]) => setR(v)} min={1} max={200} step={1} /></div>
            <div><Label className="text-sm">Inductive Reactance X_L: {xl} Ω</Label><Slider value={[xl]} onValueChange={([v]) => setXl(v)} min={0} max={200} step={1} /></div>
            <div><Label className="text-sm">Capacitive Reactance X_C: {xc} Ω</Label><Slider value={[xc]} onValueChange={([v]) => setXc(v)} min={0} max={200} step={1} /></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 space-y-2">
            <h4 className="font-semibold">Measurements</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-muted p-2 rounded"><span className="text-muted-foreground">Impedance Z:</span><p className="font-mono font-bold">{z.toFixed(2)} Ω</p></div>
              <div className="bg-muted p-2 rounded"><span className="text-muted-foreground">Current I:</span><p className="font-mono font-bold">{irms.toFixed(3)} A</p></div>
              <div className={`p-2 rounded ${pf > 0.9 ? 'bg-green-100 dark:bg-green-900' : pf > 0.7 ? 'bg-yellow-100 dark:bg-yellow-900' : 'bg-red-100 dark:bg-red-900'}`}>
                <span className="text-muted-foreground">Power Factor:</span><p className="font-mono font-bold">{pf.toFixed(4)}</p>
              </div>
              <div className="bg-muted p-2 rounded"><span className="text-muted-foreground">Phase φ:</span><p className="font-mono font-bold">{(phi * 180 / Math.PI).toFixed(1)}°</p></div>
              <div className="bg-muted p-2 rounded"><span className="text-muted-foreground">Real Power:</span><p className="font-mono font-bold">{pReal.toFixed(1)} W</p></div>
              <div className="bg-muted p-2 rounded"><span className="text-muted-foreground">Reactive:</span><p className="font-mono font-bold">{pReactive.toFixed(1)} VAR</p></div>
            </div>
            <p className="text-xs text-muted-foreground">
              {xl > xc ? '⚡ Inductive (lagging PF)' : xl < xc ? '⚡ Capacitive (leading PF)' : '⚡ Unity PF — Resistive'}
            </p>
          </CardContent>
        </Card>
      </div>

      {isRunning && (
        <Card>
          <CardContent className="pt-6">
            <h4 className="font-semibold mb-4">V, I & P Waveforms</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={waveData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="angle" label={{ value: 'Angle (°)', position: 'bottom' }} />
                <YAxis label={{ value: '% of Peak', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="voltage" stroke="hsl(var(--primary))" name="Voltage (%)" dot={false} />
                <Line type="monotone" dataKey="current" stroke="hsl(var(--destructive))" name="Current (%)" dot={false} />
                <Line type="monotone" dataKey="power" stroke="hsl(var(--chart-1))" name="Power (%)" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
