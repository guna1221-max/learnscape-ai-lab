import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TransformerSimulationProps {
  isRunning: boolean;
}

export function TransformerSimulation({ isRunning }: TransformerSimulationProps) {
  const [testType, setTestType] = useState<'oc' | 'sc'>('oc');
  const [ratedVoltage] = useState(230); // Primary rated voltage
  const [ratedCurrent] = useState(10); // Rated current
  const [turnsRatio, setTurnsRatio] = useState(2); // N1/N2
  const [appliedVoltage, setAppliedVoltage] = useState(230);
  const [appliedCurrent, setAppliedCurrent] = useState(2); // For SC test

  // Transformer parameters
  const R1 = 2.5; // Primary winding resistance
  const X1 = 4; // Primary leakage reactance
  const R2 = 0.6; // Secondary resistance (referred)
  const X2 = 1; // Secondary leakage reactance
  const Rc = 800; // Core loss resistance
  const Xm = 400; // Magnetizing reactance

  // Open Circuit Test (applied on LV side, HV side open)
  const oc_V = appliedVoltage;
  const oc_I0 = oc_V / Math.sqrt(Rc * Rc + Xm * Xm) * Math.sqrt(Rc * Rc + Xm * Xm) / Xm;
  const oc_W = oc_V * oc_V / Rc; // Core loss (watts)
  const oc_pf = oc_W / (oc_V * oc_I0);
  const oc_Ic = oc_I0 * oc_pf; // Core loss component
  const oc_Im = oc_I0 * Math.sqrt(1 - oc_pf * oc_pf); // Magnetizing component

  // Short Circuit Test (applied on HV side, LV side shorted)
  const sc_Zeq = appliedVoltage / appliedCurrent;
  const sc_Req = R1 + R2 * turnsRatio * turnsRatio;
  const sc_Xeq = Math.sqrt(Math.max(0, sc_Zeq * sc_Zeq - sc_Req * sc_Req));
  const sc_W = appliedCurrent * appliedCurrent * sc_Req; // Copper loss

  // Efficiency calculation at various loads
  const efficiencyData = [];
  for (let load = 0.1; load <= 1.5; load += 0.05) {
    const cuLoss = load * load * sc_W;
    const coreLoss = oc_W;
    const output = load * ratedVoltage * ratedCurrent * 0.8; // 0.8 pf
    const efficiency = (output / (output + cuLoss + coreLoss)) * 100;
    efficiencyData.push({
      load: parseFloat((load * 100).toFixed(0)),
      efficiency: parseFloat(efficiency.toFixed(2)),
      copperLoss: parseFloat(cuLoss.toFixed(1)),
      coreLoss: parseFloat(coreLoss.toFixed(1)),
    });
  }

  return (
    <div className="space-y-6">
      {/* Test type selector */}
      <div className="flex items-center gap-4">
        <Button size="sm" variant={testType === 'oc' ? 'default' : 'outline'} onClick={() => setTestType('oc')}>
          Open Circuit Test
        </Button>
        <Button size="sm" variant={testType === 'sc' ? 'default' : 'outline'} onClick={() => setTestType('sc')}>
          Short Circuit Test
        </Button>
      </div>

      {/* Circuit Diagram */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-2">{testType === 'oc' ? 'Open Circuit (No-Load) Test' : 'Short Circuit Test'}</h3>
          <svg viewBox="0 0 600 220" className="w-full h-44 border rounded bg-muted/30">
            {/* AC Source */}
            <circle cx="60" cy="110" r="22" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" />
            <text x="60" y="108" textAnchor="middle" fill="hsl(var(--primary))" fontSize="9">AC</text>
            <text x="60" y="120" textAnchor="middle" fill="hsl(var(--primary))" fontSize="8">
              {testType === 'oc' ? `${appliedVoltage}V` : `${appliedVoltage}V`}
            </text>

            {/* Wattmeter */}
            <line x1="60" y1="88" x2="60" y2="30" stroke="hsl(var(--foreground))" strokeWidth="2" />
            <line x1="60" y1="30" x2="130" y2="30" stroke="hsl(var(--foreground))" strokeWidth="2" />
            <rect x="130" y="15" width="50" height="30" fill="none" stroke="hsl(var(--chart-1))" strokeWidth="2" rx="3" />
            <text x="155" y="35" textAnchor="middle" fill="hsl(var(--chart-1))" fontSize="9">W</text>
            <line x1="180" y1="30" x2="220" y2="30" stroke="hsl(var(--foreground))" strokeWidth="2" />

            {/* Ammeter */}
            <circle cx="240" cy="30" r="12" fill="none" stroke="hsl(var(--chart-2))" strokeWidth="2" />
            <text x="240" y="34" textAnchor="middle" fill="hsl(var(--chart-2))" fontSize="9">A</text>
            <line x1="252" y1="30" x2="280" y2="30" stroke="hsl(var(--foreground))" strokeWidth="2" />

            {/* Transformer Primary */}
            <line x1="280" y1="30" x2="310" y2="30" stroke="hsl(var(--foreground))" strokeWidth="2" />
            <rect x="310" y="20" width="20" height="140" fill="none" stroke="hsl(var(--foreground))" strokeWidth="2" />
            {/* Coil lines */}
            {[0,1,2,3,4,5].map(i => (
              <line key={`p${i}`} x1="315" y1={30 + i * 22} x2="325" y2={30 + i * 22} stroke="hsl(var(--primary))" strokeWidth="1.5" />
            ))}
            {/* Core */}
            <rect x="330" y="20" width="10" height="140" fill="hsl(var(--muted-foreground))" opacity="0.3" />
            {/* Secondary */}
            <rect x="340" y="20" width="20" height="140" fill="none" stroke="hsl(var(--foreground))" strokeWidth="2" />
            {[0,1,2,3,4,5].map(i => (
              <line key={`s${i}`} x1="345" y1={30 + i * 22} x2="355" y2={30 + i * 22} stroke="hsl(var(--destructive))" strokeWidth="1.5" />
            ))}

            <line x1="360" y1="30" x2="460" y2="30" stroke="hsl(var(--foreground))" strokeWidth="2" />

            {/* Secondary side */}
            {testType === 'oc' ? (
              <>
                {/* Voltmeter on secondary */}
                <circle cx="500" cy="110" r="15" fill="none" stroke="hsl(var(--chart-1))" strokeWidth="2" />
                <text x="500" y="114" textAnchor="middle" fill="hsl(var(--chart-1))" fontSize="10">V</text>
                <line x1="460" y1="30" x2="500" y2="30" stroke="hsl(var(--foreground))" strokeWidth="2" />
                <line x1="500" y1="30" x2="500" y2="95" stroke="hsl(var(--foreground))" strokeWidth="2" />
                <line x1="500" y1="125" x2="500" y2="190" stroke="hsl(var(--foreground))" strokeWidth="2" />
                <text x="530" y="110" fill="hsl(var(--muted-foreground))" fontSize="9">OPEN</text>
              </>
            ) : (
              <>
                {/* Short circuit */}
                <line x1="460" y1="30" x2="460" y2="190" stroke="hsl(var(--destructive))" strokeWidth="3" />
                <text x="480" y="110" fill="hsl(var(--destructive))" fontSize="9">SHORT</text>
              </>
            )}

            {/* Bottom connections */}
            <line x1="60" y1="132" x2="60" y2="190" stroke="hsl(var(--foreground))" strokeWidth="2" />
            <line x1="60" y1="190" x2="310" y2="190" stroke="hsl(var(--foreground))" strokeWidth="2" />
            <line x1="360" y1="160" x2="360" y2="190" stroke="hsl(var(--foreground))" strokeWidth="2" />
            <line x1="360" y1="190" x2="500" y2="190" stroke="hsl(var(--foreground))" strokeWidth="2" />

            {/* Labels */}
            <text x="315" y="175" fill="hsl(var(--primary))" fontSize="9">N₁</text>
            <text x="345" y="175" fill="hsl(var(--destructive))" fontSize="9">N₂</text>
          </svg>
        </CardContent>
      </Card>

      {/* Controls */}
      <Card>
        <CardContent className="pt-4 space-y-3">
          <div>
            <Label className="text-sm">Applied Voltage: {appliedVoltage} V</Label>
            <Slider value={[appliedVoltage]} onValueChange={([v]) => setAppliedVoltage(v)} min={10} max={testType === 'oc' ? 230 : 50} step={1} />
          </div>
          {testType === 'sc' && (
            <div>
              <Label className="text-sm">Applied Current: {appliedCurrent} A</Label>
              <Slider value={[appliedCurrent]} onValueChange={([v]) => setAppliedCurrent(v)} min={0.5} max={15} step={0.5} />
            </div>
          )}
          <div>
            <Label className="text-sm">Turns Ratio (N₁/N₂): {turnsRatio}</Label>
            <Slider value={[turnsRatio]} onValueChange={([v]) => setTurnsRatio(v)} min={1} max={5} step={0.5} />
          </div>
        </CardContent>
      </Card>

      {/* Readings */}
      <Card>
        <CardContent className="pt-4">
          <h4 className="font-semibold mb-3">{testType === 'oc' ? 'Open Circuit Test Readings' : 'Short Circuit Test Readings'}</h4>
          {testType === 'oc' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              <div className="bg-muted p-2 rounded">
                <span className="text-muted-foreground">No-Load Current (I₀):</span>
                <p className="font-mono font-bold">{oc_I0.toFixed(3)} A</p>
              </div>
              <div className="bg-muted p-2 rounded">
                <span className="text-muted-foreground">Core Loss (W₀):</span>
                <p className="font-mono font-bold">{oc_W.toFixed(2)} W</p>
              </div>
              <div className="bg-muted p-2 rounded">
                <span className="text-muted-foreground">Power Factor:</span>
                <p className="font-mono font-bold">{oc_pf.toFixed(4)}</p>
              </div>
              <div className="bg-muted p-2 rounded">
                <span className="text-muted-foreground">Core Loss (Ic):</span>
                <p className="font-mono font-bold">{oc_Ic.toFixed(4)} A</p>
              </div>
              <div className="bg-muted p-2 rounded">
                <span className="text-muted-foreground">Magnetizing (Im):</span>
                <p className="font-mono font-bold">{oc_Im.toFixed(4)} A</p>
              </div>
              <div className="bg-muted p-2 rounded">
                <span className="text-muted-foreground">R₀ / X₀:</span>
                <p className="font-mono font-bold">{Rc}Ω / {Xm}Ω</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              <div className="bg-muted p-2 rounded">
                <span className="text-muted-foreground">Z_eq:</span>
                <p className="font-mono font-bold">{sc_Zeq.toFixed(2)} Ω</p>
              </div>
              <div className="bg-muted p-2 rounded">
                <span className="text-muted-foreground">R_eq:</span>
                <p className="font-mono font-bold">{sc_Req.toFixed(2)} Ω</p>
              </div>
              <div className="bg-muted p-2 rounded">
                <span className="text-muted-foreground">X_eq:</span>
                <p className="font-mono font-bold">{sc_Xeq.toFixed(2)} Ω</p>
              </div>
              <div className="bg-muted p-2 rounded">
                <span className="text-muted-foreground">Copper Loss:</span>
                <p className="font-mono font-bold">{sc_W.toFixed(2)} W</p>
              </div>
              <div className="bg-muted p-2 rounded">
                <span className="text-muted-foreground">SC Voltage:</span>
                <p className="font-mono font-bold">{appliedVoltage} V</p>
              </div>
              <div className="bg-muted p-2 rounded">
                <span className="text-muted-foreground">SC Current:</span>
                <p className="font-mono font-bold">{appliedCurrent} A</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Efficiency curve */}
      {isRunning && (
        <Card>
          <CardContent className="pt-6">
            <h4 className="font-semibold mb-4">Efficiency vs Load Curve</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={efficiencyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="load" label={{ value: 'Load (%)', position: 'bottom' }} />
                <YAxis domain={[0, 100]} label={{ value: 'Efficiency (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="efficiency" stroke="hsl(var(--primary))" name="Efficiency (%)" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="copperLoss" stroke="hsl(var(--destructive))" name="Cu Loss (W)" dot={false} />
                <Line type="monotone" dataKey="coreLoss" stroke="hsl(var(--chart-2))" name="Core Loss (W)" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
