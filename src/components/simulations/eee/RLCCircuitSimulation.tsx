import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface RLCCircuitSimulationProps {
  isRunning: boolean;
}

export function RLCCircuitSimulation({ isRunning }: RLCCircuitSimulationProps) {
  const [resistance, setResistance] = useState(100); // Ohms
  const [inductance, setInductance] = useState(50); // mH
  const [capacitance, setCapacitance] = useState(10); // µF
  const [frequency, setFrequency] = useState(500); // Hz
  const [isSeriesCircuit, setIsSeriesCircuit] = useState(true);
  const [sweepMode, setSweepMode] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);

  const calculateImpedance = useCallback((R: number, L_mH: number, C_uF: number, f: number) => {
    const L = L_mH / 1000;
    const C = C_uF / 1e6;
    const omega = 2 * Math.PI * f;
    const XL = omega * L;
    const XC = 1 / (omega * C);

    if (isSeriesCircuit) {
      const Z = Math.sqrt(R * R + (XL - XC) * (XL - XC));
      const phase = Math.atan2(XL - XC, R) * (180 / Math.PI);
      const I = 10 / Z; // 10V source
      return { Z, phase, I, XL, XC, VR: I * R, VL: I * XL, VC: I * XC };
    } else {
      const IR = 10 / R;
      const IL = 10 / XL;
      const IC = 10 / XC;
      const I = Math.sqrt(IR * IR + (IC - IL) * (IC - IL));
      const Z = 10 / I;
      const phase = Math.atan2(IC - IL, IR) * (180 / Math.PI);
      return { Z, phase, I, XL, XC, VR: 10, VL: 10, VC: 10 };
    }
  }, [isSeriesCircuit]);

  useEffect(() => {
    if (!isRunning) return;

    if (sweepMode) {
      const data = [];
      const L = inductance / 1000;
      const C = capacitance / 1e6;
      const f0 = 1 / (2 * Math.PI * Math.sqrt(L * C));
      const fMin = Math.max(10, f0 * 0.1);
      const fMax = f0 * 3;
      const step = (fMax - fMin) / 100;

      for (let f = fMin; f <= fMax; f += step) {
        const result = calculateImpedance(resistance, inductance, capacitance, f);
        data.push({
          frequency: Math.round(f),
          impedance: parseFloat(result.Z.toFixed(2)),
          current: parseFloat((result.I * 1000).toFixed(2)),
          phase: parseFloat(result.phase.toFixed(1)),
        });
      }
      setChartData(data);
    } else {
      const result = calculateImpedance(resistance, inductance, capacitance, frequency);
      const data = [];
      for (let t = 0; t <= 4; t += 0.02) {
        const omega = 2 * Math.PI * frequency;
        const phaseRad = result.phase * Math.PI / 180;
        data.push({
          time: parseFloat((t / frequency * 1000).toFixed(3)),
          voltage: parseFloat((10 * Math.sin(omega * t / frequency)).toFixed(3)),
          current: parseFloat((result.I * Math.sin(omega * t / frequency - phaseRad) * 100).toFixed(3)),
        });
      }
      setChartData(data);
    }
  }, [isRunning, resistance, inductance, capacitance, frequency, sweepMode, calculateImpedance]);

  const result = calculateImpedance(resistance, inductance, capacitance, frequency);
  const L = inductance / 1000;
  const C = capacitance / 1e6;
  const resonantFreq = 1 / (2 * Math.PI * Math.sqrt(L * C));

  return (
    <div className="space-y-6">
      {/* Circuit Diagram */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">RLC {isSeriesCircuit ? 'Series' : 'Parallel'} Circuit</h3>
            <div className="flex items-center gap-2">
              <Label>Series</Label>
              <Switch checked={!isSeriesCircuit} onCheckedChange={(v) => setIsSeriesCircuit(!v)} />
              <Label>Parallel</Label>
            </div>
          </div>

          <svg viewBox="0 0 600 250" className="w-full h-48 border rounded bg-muted/30">
            {/* Power source */}
            <circle cx="50" cy="125" r="25" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" />
            <text x="50" y="120" textAnchor="middle" className="text-xs fill-primary" fontSize="10">AC</text>
            <text x="50" y="135" textAnchor="middle" className="text-xs fill-primary" fontSize="9">10V</text>

            {isSeriesCircuit ? (
              <>
                {/* Series connections */}
                <line x1="75" y1="125" x2="75" y2="50" stroke="hsl(var(--foreground))" strokeWidth="2" />
                <line x1="75" y1="50" x2="160" y2="50" stroke="hsl(var(--foreground))" strokeWidth="2" />
                {/* Resistor */}
                <rect x="160" y="35" width="80" height="30" fill="none" stroke="hsl(var(--destructive))" strokeWidth="2" rx="3" />
                <text x="200" y="55" textAnchor="middle" fill="hsl(var(--destructive))" fontSize="11">R={resistance}Ω</text>
                <line x1="240" y1="50" x2="310" y2="50" stroke="hsl(var(--foreground))" strokeWidth="2" />
                {/* Inductor */}
                <path d="M310,50 Q320,30 330,50 Q340,30 350,50 Q360,30 370,50 Q380,30 390,50" fill="none" stroke="hsl(var(--chart-1))" strokeWidth="2" />
                <text x="350" y="75" textAnchor="middle" fill="hsl(var(--chart-1))" fontSize="11">L={inductance}mH</text>
                <line x1="390" y1="50" x2="525" y2="50" stroke="hsl(var(--foreground))" strokeWidth="2" />
                <line x1="525" y1="50" x2="525" y2="125" stroke="hsl(var(--foreground))" strokeWidth="2" />
                {/* Capacitor */}
                <line x1="525" y1="125" x2="525" y2="140" stroke="hsl(var(--foreground))" strokeWidth="2" />
                <line x1="510" y1="140" x2="540" y2="140" stroke="hsl(var(--chart-2))" strokeWidth="3" />
                <line x1="510" y1="155" x2="540" y2="155" stroke="hsl(var(--chart-2))" strokeWidth="3" />
                <text x="555" y="152" fill="hsl(var(--chart-2))" fontSize="11">C={capacitance}µF</text>
                <line x1="525" y1="155" x2="525" y2="200" stroke="hsl(var(--foreground))" strokeWidth="2" />
                <line x1="525" y1="200" x2="75" y2="200" stroke="hsl(var(--foreground))" strokeWidth="2" />
                <line x1="75" y1="200" x2="75" y2="125" stroke="hsl(var(--foreground))" strokeWidth="2" />
              </>
            ) : (
              <>
                {/* Parallel connections */}
                <line x1="75" y1="125" x2="75" y2="50" stroke="hsl(var(--foreground))" strokeWidth="2" />
                <line x1="75" y1="50" x2="500" y2="50" stroke="hsl(var(--foreground))" strokeWidth="2" />
                <line x1="75" y1="200" x2="500" y2="200" stroke="hsl(var(--foreground))" strokeWidth="2" />
                <line x1="75" y1="200" x2="75" y2="125" stroke="hsl(var(--foreground))" strokeWidth="2" />
                {/* R branch */}
                <line x1="200" y1="50" x2="200" y2="100" stroke="hsl(var(--foreground))" strokeWidth="2" />
                <rect x="185" y="100" width="30" height="50" fill="none" stroke="hsl(var(--destructive))" strokeWidth="2" rx="3" />
                <text x="200" y="130" textAnchor="middle" fill="hsl(var(--destructive))" fontSize="9">R</text>
                <line x1="200" y1="150" x2="200" y2="200" stroke="hsl(var(--foreground))" strokeWidth="2" />
                {/* L branch */}
                <line x1="320" y1="50" x2="320" y2="95" stroke="hsl(var(--foreground))" strokeWidth="2" />
                <path d="M315,95 Q320,80 325,95 Q320,80 315,95" fill="none" stroke="hsl(var(--chart-1))" strokeWidth="2" />
                <ellipse cx="320" cy="115" rx="8" ry="10" fill="none" stroke="hsl(var(--chart-1))" strokeWidth="2" />
                <ellipse cx="320" cy="135" rx="8" ry="10" fill="none" stroke="hsl(var(--chart-1))" strokeWidth="2" />
                <text x="335" y="125" fill="hsl(var(--chart-1))" fontSize="9">L</text>
                <line x1="320" y1="145" x2="320" y2="200" stroke="hsl(var(--foreground))" strokeWidth="2" />
                {/* C branch */}
                <line x1="440" y1="50" x2="440" y2="110" stroke="hsl(var(--foreground))" strokeWidth="2" />
                <line x1="425" y1="110" x2="455" y2="110" stroke="hsl(var(--chart-2))" strokeWidth="3" />
                <line x1="425" y1="125" x2="455" y2="125" stroke="hsl(var(--chart-2))" strokeWidth="3" />
                <text x="460" y="120" fill="hsl(var(--chart-2))" fontSize="9">C</text>
                <line x1="440" y1="125" x2="440" y2="200" stroke="hsl(var(--foreground))" strokeWidth="2" />
              </>
            )}
          </svg>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-4 space-y-4">
            <div>
              <Label className="text-sm">Resistance (R): {resistance} Ω</Label>
              <Slider value={[resistance]} onValueChange={([v]) => setResistance(v)} min={10} max={1000} step={10} />
            </div>
            <div>
              <Label className="text-sm">Inductance (L): {inductance} mH</Label>
              <Slider value={[inductance]} onValueChange={([v]) => setInductance(v)} min={1} max={200} step={1} />
            </div>
            <div>
              <Label className="text-sm">Capacitance (C): {capacitance} µF</Label>
              <Slider value={[capacitance]} onValueChange={([v]) => setCapacitance(v)} min={1} max={100} step={1} />
            </div>
            <div>
              <Label className="text-sm">Frequency: {frequency} Hz</Label>
              <Slider value={[frequency]} onValueChange={([v]) => setFrequency(v)} min={10} max={5000} step={10} />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={sweepMode} onCheckedChange={setSweepMode} />
              <Label className="text-sm">Frequency Sweep Mode</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 space-y-2">
            <h4 className="font-semibold">Measurements</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-muted p-2 rounded">
                <span className="text-muted-foreground">Impedance (Z):</span>
                <p className="font-mono font-bold">{result.Z.toFixed(2)} Ω</p>
              </div>
              <div className="bg-muted p-2 rounded">
                <span className="text-muted-foreground">Current (I):</span>
                <p className="font-mono font-bold">{(result.I * 1000).toFixed(2)} mA</p>
              </div>
              <div className="bg-muted p-2 rounded">
                <span className="text-muted-foreground">Phase Angle:</span>
                <p className="font-mono font-bold">{result.phase.toFixed(1)}°</p>
              </div>
              <div className="bg-muted p-2 rounded">
                <span className="text-muted-foreground">Resonant Freq:</span>
                <p className="font-mono font-bold">{resonantFreq.toFixed(1)} Hz</p>
              </div>
              <div className="bg-muted p-2 rounded">
                <span className="text-muted-foreground">X<sub>L</sub>:</span>
                <p className="font-mono font-bold">{result.XL.toFixed(2)} Ω</p>
              </div>
              <div className="bg-muted p-2 rounded">
                <span className="text-muted-foreground">X<sub>C</sub>:</span>
                <p className="font-mono font-bold">{result.XC.toFixed(2)} Ω</p>
              </div>
            </div>
            <div className={`p-2 rounded text-sm font-medium ${Math.abs(frequency - resonantFreq) < resonantFreq * 0.05 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-muted'}`}>
              {Math.abs(frequency - resonantFreq) < resonantFreq * 0.05
                ? '⚡ At Resonance! Maximum current flow'
                : frequency < resonantFreq
                  ? '📊 Below resonance — Capacitive behavior'
                  : '📊 Above resonance — Inductive behavior'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      {isRunning && chartData.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h4 className="font-semibold mb-4">
              {sweepMode ? 'Frequency Response' : 'Voltage & Current Waveforms'}
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                {sweepMode ? (
                  <>
                    <XAxis dataKey="frequency" label={{ value: 'Frequency (Hz)', position: 'bottom' }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="current" stroke="hsl(var(--primary))" name="Current (mA)" dot={false} />
                    <Line type="monotone" dataKey="impedance" stroke="hsl(var(--destructive))" name="Impedance (Ω)" dot={false} />
                  </>
                ) : (
                  <>
                    <XAxis dataKey="time" label={{ value: 'Time (ms)', position: 'bottom' }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="voltage" stroke="hsl(var(--primary))" name="Voltage (V)" dot={false} />
                    <Line type="monotone" dataKey="current" stroke="hsl(var(--destructive))" name="Current (×100 mA)" dot={false} />
                  </>
                )}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
