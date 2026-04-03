import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface SuperpositionSimulationProps {
  isRunning: boolean;
}

export function SuperpositionSimulation({ isRunning }: SuperpositionSimulationProps) {
  const [V1, setV1] = useState(10);
  const [V2, setV2] = useState(5);
  const [R1, setR1] = useState(100);
  const [R2, setR2] = useState(200);
  const [R3, setR3] = useState(150);
  const [activeSource, setActiveSource] = useState<'both' | 'v1' | 'v2'>('both');

  // With only V1 (V2 shorted): mesh analysis
  const calcV1Only = () => {
    // R2 and R3 in parallel = Rp
    const Rp = (R2 * R3) / (R2 + R3);
    const I_total = V1 / (R1 + Rp);
    const V_node = I_total * Rp;
    const I_R2 = V_node / R2;
    const I_R3 = V_node / R3;
    return { I_R1: I_total, I_R2, I_R3, V_node };
  };

  // With only V2 (V1 shorted): 
  const calcV2Only = () => {
    const Rp = (R1 * R3) / (R1 + R3);
    const I_total = V2 / (R2 + Rp);
    const V_node = I_total * Rp;
    const I_R1 = V_node / R1;
    const I_R3 = V_node / R3;
    return { I_R1, I_R2: I_total, I_R3, V_node };
  };

  const v1Only = calcV1Only();
  const v2Only = calcV2Only();

  // Superposition: add contributions
  const superposed = {
    I_R1: v1Only.I_R1 + v2Only.I_R1,
    I_R2: v1Only.I_R2 + v2Only.I_R2,
    I_R3: v1Only.I_R3 + v2Only.I_R3,
  };

  const current = activeSource === 'v1' ? v1Only : activeSource === 'v2' ? v2Only : null;

  return (
    <div className="space-y-6">
      {/* Step selector */}
      <div className="flex gap-2 flex-wrap">
        <Button size="sm" variant={activeSource === 'v1' ? 'default' : 'outline'} onClick={() => setActiveSource('v1')}>
          Step 1: V₁ Only
        </Button>
        <Button size="sm" variant={activeSource === 'v2' ? 'default' : 'outline'} onClick={() => setActiveSource('v2')}>
          Step 2: V₂ Only
        </Button>
        <Button size="sm" variant={activeSource === 'both' ? 'default' : 'outline'} onClick={() => setActiveSource('both')}>
          Step 3: Superpose
        </Button>
      </div>

      {/* Circuit */}
      <Card>
        <CardContent className="pt-6">
          <svg viewBox="0 0 600 250" className="w-full h-48 border rounded bg-muted/30">
            {/* V1 */}
            <circle cx="60" cy="125" r="22" fill="none" stroke={activeSource === 'v2' ? 'gray' : 'hsl(var(--primary))'} strokeWidth="2" strokeDasharray={activeSource === 'v2' ? '4' : '0'} />
            <text x="60" y="120" textAnchor="middle" fill={activeSource === 'v2' ? 'gray' : 'hsl(var(--primary))'} fontSize="9">V₁</text>
            <text x="60" y="133" textAnchor="middle" fill={activeSource === 'v2' ? 'gray' : 'hsl(var(--primary))'} fontSize="8">{activeSource === 'v2' ? 'SHORT' : `${V1}V`}</text>

            {/* Wires top */}
            <line x1="60" y1="103" x2="60" y2="40" stroke="hsl(var(--foreground))" strokeWidth="2" />
            <line x1="60" y1="40" x2="170" y2="40" stroke="hsl(var(--foreground))" strokeWidth="2" />
            {/* R1 */}
            <rect x="170" y="25" width="80" height="30" fill="none" stroke="hsl(var(--destructive))" strokeWidth="2" rx="3" />
            <text x="210" y="45" textAnchor="middle" fill="hsl(var(--destructive))" fontSize="10">R₁={R1}Ω</text>
            <line x1="250" y1="40" x2="300" y2="40" stroke="hsl(var(--foreground))" strokeWidth="2" />

            {/* Node A */}
            <circle cx="300" cy="40" r="4" fill="hsl(var(--primary))" />
            <text x="305" y="30" fill="hsl(var(--primary))" fontSize="9">A</text>

            {/* R3 down from node */}
            <line x1="300" y1="44" x2="300" y2="80" stroke="hsl(var(--foreground))" strokeWidth="2" />
            <rect x="285" y="80" width="30" height="70" fill="none" stroke="hsl(var(--chart-2))" strokeWidth="2" rx="3" />
            <text x="330" y="120" fill="hsl(var(--chart-2))" fontSize="10">R₃={R3}Ω</text>
            <line x1="300" y1="150" x2="300" y2="210" stroke="hsl(var(--foreground))" strokeWidth="2" />

            {/* R2 from node to V2 */}
            <line x1="300" y1="40" x2="400" y2="40" stroke="hsl(var(--foreground))" strokeWidth="2" />
            <rect x="400" y="25" width="80" height="30" fill="none" stroke="hsl(var(--chart-1))" strokeWidth="2" rx="3" />
            <text x="440" y="45" textAnchor="middle" fill="hsl(var(--chart-1))" fontSize="10">R₂={R2}Ω</text>
            <line x1="480" y1="40" x2="540" y2="40" stroke="hsl(var(--foreground))" strokeWidth="2" />

            {/* V2 */}
            <line x1="540" y1="40" x2="540" y2="103" stroke="hsl(var(--foreground))" strokeWidth="2" />
            <circle cx="540" cy="125" r="22" fill="none" stroke={activeSource === 'v1' ? 'gray' : 'hsl(var(--chart-1))'} strokeWidth="2" strokeDasharray={activeSource === 'v1' ? '4' : '0'} />
            <text x="540" y="120" textAnchor="middle" fill={activeSource === 'v1' ? 'gray' : 'hsl(var(--chart-1))'} fontSize="9">V₂</text>
            <text x="540" y="133" textAnchor="middle" fill={activeSource === 'v1' ? 'gray' : 'hsl(var(--chart-1))'} fontSize="8">{activeSource === 'v1' ? 'SHORT' : `${V2}V`}</text>
            <line x1="540" y1="147" x2="540" y2="210" stroke="hsl(var(--foreground))" strokeWidth="2" />

            {/* Bottom wire */}
            <line x1="60" y1="147" x2="60" y2="210" stroke="hsl(var(--foreground))" strokeWidth="2" />
            <line x1="60" y1="210" x2="540" y2="210" stroke="hsl(var(--foreground))" strokeWidth="2" />
          </svg>
        </CardContent>
      </Card>

      {/* Controls */}
      <Card>
        <CardContent className="pt-4 space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm">V₁: {V1} V</Label>
              <Slider value={[V1]} onValueChange={([v]) => setV1(v)} min={1} max={24} step={0.5} />
            </div>
            <div>
              <Label className="text-sm">V₂: {V2} V</Label>
              <Slider value={[V2]} onValueChange={([v]) => setV2(v)} min={1} max={24} step={0.5} />
            </div>
            <div>
              <Label className="text-sm">R₁: {R1} Ω</Label>
              <Slider value={[R1]} onValueChange={([v]) => setR1(v)} min={10} max={500} step={10} />
            </div>
            <div>
              <Label className="text-sm">R₂: {R2} Ω</Label>
              <Slider value={[R2]} onValueChange={([v]) => setR2(v)} min={10} max={500} step={10} />
            </div>
          </div>
          <div>
            <Label className="text-sm">R₃: {R3} Ω</Label>
            <Slider value={[R3]} onValueChange={([v]) => setR3(v)} min={10} max={500} step={10} />
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      {isRunning && (
        <Card>
          <CardContent className="pt-6">
            <h4 className="font-semibold mb-4">Superposition Results</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Current</TableHead>
                  <TableHead>V₁ Only (mA)</TableHead>
                  <TableHead>V₂ Only (mA)</TableHead>
                  <TableHead>Superposed (mA)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">I(R₁)</TableCell>
                  <TableCell>{(v1Only.I_R1 * 1000).toFixed(2)}</TableCell>
                  <TableCell>{(v2Only.I_R1 * 1000).toFixed(2)}</TableCell>
                  <TableCell className="font-bold">{(superposed.I_R1 * 1000).toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">I(R₂)</TableCell>
                  <TableCell>{(v1Only.I_R2 * 1000).toFixed(2)}</TableCell>
                  <TableCell>{(v2Only.I_R2 * 1000).toFixed(2)}</TableCell>
                  <TableCell className="font-bold">{(superposed.I_R2 * 1000).toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">I(R₃)</TableCell>
                  <TableCell>{(v1Only.I_R3 * 1000).toFixed(2)}</TableCell>
                  <TableCell>{(v2Only.I_R3 * 1000).toFixed(2)}</TableCell>
                  <TableCell className="font-bold">{(superposed.I_R3 * 1000).toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div className="mt-4">
              <Badge variant="outline">
                Superposition: I_total = I(V₁ only) + I(V₂ only)
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
