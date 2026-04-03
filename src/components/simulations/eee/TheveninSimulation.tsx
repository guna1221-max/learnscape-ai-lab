import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TheveninSimulationProps {
  isRunning: boolean;
}

export function TheveninSimulation({ isRunning }: TheveninSimulationProps) {
  const [V1, setV1] = useState(12); // Source voltage
  const [R1, setR1] = useState(100); // Resistance 1
  const [R2, setR2] = useState(200); // Resistance 2
  const [R3, setR3] = useState(150); // Resistance 3
  const [RL, setRL] = useState(100); // Load resistance
  const [step, setStep] = useState<'original' | 'voc' | 'rth' | 'equivalent'>('original');
  const [chartData, setChartData] = useState<any[]>([]);

  // Thevenin calculations (voltage divider network)
  const Vth = V1 * R2 / (R1 + R2); // Open circuit voltage across R2
  const Rth = (R1 * R2) / (R1 + R2) + R3; // Thevenin resistance
  const IL = Vth / (Rth + RL);
  const VL = IL * RL;
  const PL = IL * IL * RL;

  // Max power transfer
  const maxPowerRL = Rth;
  const maxPower = (Vth * Vth) / (4 * Rth);

  useEffect(() => {
    if (!isRunning) return;
    const data = [];
    for (let rl = 1; rl <= 500; rl += 5) {
      const il = Vth / (Rth + rl);
      const vl = il * rl;
      const pl = il * il * rl;
      data.push({
        RL: rl,
        voltage: parseFloat(vl.toFixed(3)),
        current: parseFloat((il * 1000).toFixed(2)),
        power: parseFloat((pl * 1000).toFixed(3)),
      });
    }
    setChartData(data);
  }, [isRunning, Vth, Rth]);

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="flex gap-2 flex-wrap">
        {(['original', 'voc', 'rth', 'equivalent'] as const).map((s) => (
          <Button key={s} size="sm" variant={step === s ? 'default' : 'outline'} onClick={() => setStep(s)}>
            {s === 'original' ? '1. Original Circuit' : s === 'voc' ? '2. Find V_OC' : s === 'rth' ? '3. Find R_th' : '4. Equivalent'}
          </Button>
        ))}
      </div>

      {/* Circuit visualization */}
      <Card>
        <CardContent className="pt-6">
          <svg viewBox="0 0 600 280" className="w-full h-56 border rounded bg-muted/30">
            {step === 'original' && (
              <>
                {/* Voltage source */}
                <circle cx="60" cy="140" r="25" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" />
                <text x="60" y="135" textAnchor="middle" fill="hsl(var(--primary))" fontSize="10">V₁</text>
                <text x="60" y="150" textAnchor="middle" fill="hsl(var(--primary))" fontSize="9">{V1}V</text>
                {/* R1 */}
                <line x1="60" y1="115" x2="60" y2="50" stroke="hsl(var(--foreground))" strokeWidth="2" />
                <line x1="60" y1="50" x2="180" y2="50" stroke="hsl(var(--foreground))" strokeWidth="2" />
                <rect x="130" y="35" width="100" height="30" fill="none" stroke="hsl(var(--destructive))" strokeWidth="2" rx="3" />
                <text x="180" y="55" textAnchor="middle" fill="hsl(var(--destructive))" fontSize="10">R₁={R1}Ω</text>
                {/* R2 */}
                <line x1="280" y1="50" x2="280" y2="90" stroke="hsl(var(--foreground))" strokeWidth="2" />
                <rect x="265" y="90" width="30" height="70" fill="none" stroke="hsl(var(--chart-1))" strokeWidth="2" rx="3" />
                <text x="310" y="130" fill="hsl(var(--chart-1))" fontSize="10">R₂={R2}Ω</text>
                <line x1="280" y1="160" x2="280" y2="230" stroke="hsl(var(--foreground))" strokeWidth="2" />
                {/* R3 */}
                <line x1="280" y1="50" x2="380" y2="50" stroke="hsl(var(--foreground))" strokeWidth="2" />
                <rect x="380" y="35" width="80" height="30" fill="none" stroke="hsl(var(--chart-2))" strokeWidth="2" rx="3" />
                <text x="420" y="55" textAnchor="middle" fill="hsl(var(--chart-2))" fontSize="10">R₃={R3}Ω</text>
                {/* RL */}
                <line x1="500" y1="50" x2="500" y2="90" stroke="hsl(var(--foreground))" strokeWidth="2" />
                <rect x="485" y="90" width="30" height="70" fill="none" stroke="hsl(var(--accent-foreground))" strokeWidth="2" rx="3" />
                <text x="530" y="130" fill="hsl(var(--accent-foreground))" fontSize="10">R_L={RL}Ω</text>
                <line x1="500" y1="160" x2="500" y2="230" stroke="hsl(var(--foreground))" strokeWidth="2" />
                {/* Ground wires */}
                <line x1="60" y1="165" x2="60" y2="230" stroke="hsl(var(--foreground))" strokeWidth="2" />
                <line x1="60" y1="230" x2="500" y2="230" stroke="hsl(var(--foreground))" strokeWidth="2" />
                <line x1="230" y1="50" x2="280" y2="50" stroke="hsl(var(--foreground))" strokeWidth="2" />
                <line x1="460" y1="50" x2="500" y2="50" stroke="hsl(var(--foreground))" strokeWidth="2" />
              </>
            )}
            {step === 'equivalent' && (
              <>
                {/* Thevenin equivalent */}
                <circle cx="150" cy="140" r="30" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" />
                <text x="150" y="135" textAnchor="middle" fill="hsl(var(--primary))" fontSize="11">V_th</text>
                <text x="150" y="152" textAnchor="middle" fill="hsl(var(--primary))" fontSize="10">{Vth.toFixed(1)}V</text>
                <line x1="150" y1="110" x2="150" y2="50" stroke="hsl(var(--foreground))" strokeWidth="2" />
                <line x1="150" y1="50" x2="280" y2="50" stroke="hsl(var(--foreground))" strokeWidth="2" />
                <rect x="280" y="35" width="100" height="30" fill="none" stroke="hsl(var(--destructive))" strokeWidth="2" rx="3" />
                <text x="330" y="55" textAnchor="middle" fill="hsl(var(--destructive))" fontSize="10">R_th={Rth.toFixed(1)}Ω</text>
                <line x1="380" y1="50" x2="450" y2="50" stroke="hsl(var(--foreground))" strokeWidth="2" />
                <line x1="450" y1="50" x2="450" y2="100" stroke="hsl(var(--foreground))" strokeWidth="2" />
                <rect x="435" y="100" width="30" height="70" fill="none" stroke="hsl(var(--chart-1))" strokeWidth="2" rx="3" />
                <text x="480" y="140" fill="hsl(var(--chart-1))" fontSize="10">R_L={RL}Ω</text>
                <line x1="450" y1="170" x2="450" y2="230" stroke="hsl(var(--foreground))" strokeWidth="2" />
                <line x1="150" y1="170" x2="150" y2="230" stroke="hsl(var(--foreground))" strokeWidth="2" />
                <line x1="150" y1="230" x2="450" y2="230" stroke="hsl(var(--foreground))" strokeWidth="2" />
              </>
            )}
            {(step === 'voc' || step === 'rth') && (
              <text x="300" y="140" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="14">
                {step === 'voc' ? `V_OC = V₁ × R₂/(R₁+R₂) = ${Vth.toFixed(2)} V` : `R_th = R₁∥R₂ + R₃ = ${Rth.toFixed(2)} Ω`}
              </text>
            )}
          </svg>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-4 space-y-3">
            <h4 className="font-semibold">Circuit Parameters</h4>
            <div>
              <Label className="text-sm">Source Voltage (V₁): {V1} V</Label>
              <Slider value={[V1]} onValueChange={([v]) => setV1(v)} min={1} max={30} step={0.5} />
            </div>
            <div>
              <Label className="text-sm">R₁: {R1} Ω</Label>
              <Slider value={[R1]} onValueChange={([v]) => setR1(v)} min={10} max={500} step={10} />
            </div>
            <div>
              <Label className="text-sm">R₂: {R2} Ω</Label>
              <Slider value={[R2]} onValueChange={([v]) => setR2(v)} min={10} max={500} step={10} />
            </div>
            <div>
              <Label className="text-sm">R₃: {R3} Ω</Label>
              <Slider value={[R3]} onValueChange={([v]) => setR3(v)} min={10} max={500} step={10} />
            </div>
            <div>
              <Label className="text-sm">Load R_L: {RL} Ω</Label>
              <Slider value={[RL]} onValueChange={([v]) => setRL(v)} min={1} max={500} step={5} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 space-y-2">
            <h4 className="font-semibold">Thevenin Equivalent</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-muted p-2 rounded">
                <span className="text-muted-foreground">V_th:</span>
                <p className="font-mono font-bold">{Vth.toFixed(3)} V</p>
              </div>
              <div className="bg-muted p-2 rounded">
                <span className="text-muted-foreground">R_th:</span>
                <p className="font-mono font-bold">{Rth.toFixed(2)} Ω</p>
              </div>
              <div className="bg-muted p-2 rounded">
                <span className="text-muted-foreground">Load Current:</span>
                <p className="font-mono font-bold">{(IL * 1000).toFixed(2)} mA</p>
              </div>
              <div className="bg-muted p-2 rounded">
                <span className="text-muted-foreground">Load Voltage:</span>
                <p className="font-mono font-bold">{VL.toFixed(3)} V</p>
              </div>
              <div className="bg-muted p-2 rounded">
                <span className="text-muted-foreground">Load Power:</span>
                <p className="font-mono font-bold">{(PL * 1000).toFixed(3)} mW</p>
              </div>
              <div className="bg-muted p-2 rounded">
                <span className="text-muted-foreground">Max Power R_L:</span>
                <p className="font-mono font-bold">{maxPowerRL.toFixed(1)} Ω</p>
              </div>
            </div>
            <Badge variant={Math.abs(RL - Rth) < 5 ? 'default' : 'secondary'}>
              {Math.abs(RL - Rth) < 5 ? '⚡ Maximum Power Transfer!' : `Set R_L = ${Rth.toFixed(0)}Ω for max power`}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      {isRunning && chartData.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h4 className="font-semibold mb-4">Load Analysis (V_L, I_L, P_L vs R_L)</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="RL" label={{ value: 'Load Resistance (Ω)', position: 'bottom' }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="voltage" stroke="hsl(var(--primary))" name="Voltage (V)" dot={false} />
                <Line type="monotone" dataKey="power" stroke="hsl(var(--destructive))" name="Power (mW)" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
