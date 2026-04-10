import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Props { isRunning: boolean; }

export function TransientSimulation({ isRunning }: Props) {
  const [circuitType, setCircuitType] = useState<'rc' | 'rl' | 'rlc'>('rc');
  const [vs, setVs] = useState(10);
  const [r, setR] = useState(1000);
  const [c, setC] = useState(10); // µF
  const [l, setL] = useState(100); // mH

  const tau = circuitType === 'rl' ? (l / 1000) / r : r * (c / 1e6);
  
  const chartData = useMemo(() => {
    const data = [];
    const tMax = 5 * tau;
    const steps = 200;
    const dt = tMax / steps;
    const C_val = c / 1e6;
    const L_val = l / 1000;

    for (let i = 0; i <= steps; i++) {
      const t = i * dt;
      let vOut = 0, iOut = 0;

      if (circuitType === 'rc') {
        vOut = vs * (1 - Math.exp(-t / tau));
        iOut = (vs / r) * Math.exp(-t / tau);
      } else if (circuitType === 'rl') {
        iOut = (vs / r) * (1 - Math.exp(-t / tau));
        vOut = vs * Math.exp(-t / tau); // voltage across L
      } else {
        const alpha = r / (2 * L_val);
        const omega0 = 1 / Math.sqrt(L_val * C_val);
        if (alpha < omega0) { // underdamped
          const wd = Math.sqrt(omega0 * omega0 - alpha * alpha);
          vOut = vs * (1 - Math.exp(-alpha * t) * (Math.cos(wd * t) + (alpha / wd) * Math.sin(wd * t)));
          iOut = (vs * C_val * Math.exp(-alpha * t) * ((omega0 * omega0) / wd) * Math.sin(wd * t));
        } else if (alpha > omega0) { // overdamped
          const s1 = -alpha + Math.sqrt(alpha * alpha - omega0 * omega0);
          const s2 = -alpha - Math.sqrt(alpha * alpha - omega0 * omega0);
          vOut = vs * (1 - (s1 * Math.exp(s2 * t) - s2 * Math.exp(s1 * t)) / (s1 - s2));
          iOut = vs * C_val * (s1 * s2 * (Math.exp(s1 * t) - Math.exp(s2 * t))) / (s1 - s2);
        } else { // critically damped
          vOut = vs * (1 - (1 + alpha * t) * Math.exp(-alpha * t));
          iOut = vs * C_val * alpha * alpha * t * Math.exp(-alpha * t);
        }
      }
      data.push({
        time: parseFloat((t * 1000).toFixed(3)),
        voltage: parseFloat(vOut.toFixed(4)),
        current: parseFloat((iOut * 1000).toFixed(4)),
      });
    }
    return data;
  }, [circuitType, vs, r, c, l, tau]);

  const dampingType = circuitType === 'rlc' ? (() => {
    const alpha = r / (2 * (l / 1000));
    const omega0 = 1 / Math.sqrt((l / 1000) * (c / 1e6));
    if (Math.abs(alpha - omega0) < 0.01) return 'Critically Damped';
    return alpha < omega0 ? 'Underdamped' : 'Overdamped';
  })() : null;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold text-lg mb-4">Transient Response</h3>
          <Tabs value={circuitType} onValueChange={(v) => setCircuitType(v as any)}>
            <TabsList className="mb-4">
              <TabsTrigger value="rc">RC Circuit</TabsTrigger>
              <TabsTrigger value="rl">RL Circuit</TabsTrigger>
              <TabsTrigger value="rlc">RLC Circuit</TabsTrigger>
            </TabsList>
          </Tabs>
          <svg viewBox="0 0 400 120" className="w-full h-24 border rounded bg-muted/30">
            {/* Source */}
            <rect x="20" y="35" width="30" height="50" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" rx="3" />
            <text x="35" y="63" textAnchor="middle" fill="hsl(var(--primary))" fontSize="9">{vs}V</text>
            {/* Switch */}
            <line x1="50" y1="35" x2="50" y2="20" stroke="hsl(var(--foreground))" strokeWidth="2" />
            <line x1="50" y1="20" x2="90" y2="20" stroke="hsl(var(--foreground))" strokeWidth="2" />
            <circle cx="90" cy="20" r="3" fill="none" stroke="hsl(var(--foreground))" strokeWidth="2" />
            <line x1="93" y1="20" x2="120" y2="20" stroke="hsl(var(--foreground))" strokeWidth="2" />
            <text x="85" y="14" fill="hsl(var(--muted-foreground))" fontSize="8">t=0</text>
            {/* R */}
            <line x1="120" y1="20" x2="150" y2="20" stroke="hsl(var(--foreground))" strokeWidth="2" />
            <rect x="150" y="10" width="50" height="20" fill="none" stroke="hsl(var(--destructive))" strokeWidth="2" rx="2" />
            <text x="175" y="24" textAnchor="middle" fill="hsl(var(--destructive))" fontSize="9">R</text>
            <line x1="200" y1="20" x2="240" y2="20" stroke="hsl(var(--foreground))" strokeWidth="2" />
            {circuitType !== 'rc' && (
              <>
                {/* L */}
                <path d="M240,20 Q250,5 260,20 Q270,5 280,20 Q290,5 300,20" fill="none" stroke="hsl(var(--chart-1))" strokeWidth="2" />
                <text x="270" y="38" textAnchor="middle" fill="hsl(var(--chart-1))" fontSize="9">L</text>
                <line x1="300" y1="20" x2="330" y2="20" stroke="hsl(var(--foreground))" strokeWidth="2" />
              </>
            )}
            {circuitType !== 'rl' && (
              <>
                {/* C */}
                <line x1={circuitType === 'rc' ? 240 : 330} y1="20" x2={circuitType === 'rc' ? 240 : 330} y2="45" stroke="hsl(var(--foreground))" strokeWidth="2" />
                <line x1={circuitType === 'rc' ? 228 : 318} y1="45" x2={circuitType === 'rc' ? 252 : 342} y2="45" stroke="hsl(var(--chart-2))" strokeWidth="3" />
                <line x1={circuitType === 'rc' ? 228 : 318} y1="55" x2={circuitType === 'rc' ? 252 : 342} y2="55" stroke="hsl(var(--chart-2))" strokeWidth="3" />
                <text x={circuitType === 'rc' ? 260 : 350} y="53" fill="hsl(var(--chart-2))" fontSize="9">C</text>
                <line x1={circuitType === 'rc' ? 240 : 330} y1="55" x2={circuitType === 'rc' ? 240 : 330} y2="100" stroke="hsl(var(--foreground))" strokeWidth="2" />
              </>
            )}
            {/* Ground return */}
            <line x1="20" y1="100" x2={circuitType === 'rl' ? 300 : circuitType === 'rc' ? 240 : 330} y2="100" stroke="hsl(var(--foreground))" strokeWidth="2" />
            <line x1="20" y1="85" x2="20" y2="100" stroke="hsl(var(--foreground))" strokeWidth="2" />
          </svg>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-4 space-y-4">
            <div><Label className="text-sm">Source Voltage: {vs} V</Label><Slider value={[vs]} onValueChange={([v]) => setVs(v)} min={1} max={24} step={0.5} /></div>
            <div><Label className="text-sm">Resistance: {r} Ω</Label><Slider value={[r]} onValueChange={([v]) => setR(v)} min={10} max={10000} step={10} /></div>
            {circuitType !== 'rl' && <div><Label className="text-sm">Capacitance: {c} µF</Label><Slider value={[c]} onValueChange={([v]) => setC(v)} min={1} max={100} step={1} /></div>}
            {circuitType !== 'rc' && <div><Label className="text-sm">Inductance: {l} mH</Label><Slider value={[l]} onValueChange={([v]) => setL(v)} min={1} max={500} step={1} /></div>}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 space-y-2">
            <h4 className="font-semibold">Parameters</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-muted p-2 rounded"><span className="text-muted-foreground">Time Constant τ:</span><p className="font-mono font-bold">{(tau * 1000).toFixed(3)} ms</p></div>
              <div className="bg-muted p-2 rounded"><span className="text-muted-foreground">5τ (Steady):</span><p className="font-mono font-bold">{(5 * tau * 1000).toFixed(1)} ms</p></div>
              {circuitType === 'rlc' && dampingType && (
                <div className="bg-muted p-2 rounded col-span-2"><span className="text-muted-foreground">Damping:</span><p className="font-mono font-bold">{dampingType}</p></div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {isRunning && (
        <Card>
          <CardContent className="pt-6">
            <h4 className="font-semibold mb-4">Step Response</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" label={{ value: 'Time (ms)', position: 'bottom' }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="voltage" stroke="hsl(var(--primary))" name="Voltage (V)" dot={false} />
                <Line type="monotone" dataKey="current" stroke="hsl(var(--destructive))" name="Current (mA)" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
