import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface Props { isRunning: boolean; }

export function StarDeltaSimulation({ isRunning }: Props) {
  const [ra, setRa] = useState(100);
  const [rb, setRb] = useState(200);
  const [rc, setRc] = useState(150);
  const [isDeltaToStar, setIsDeltaToStar] = useState(true);

  // Delta to Star
  const sum = ra + rb + rc;
  const rStar1 = (ra * rb) / sum;
  const rStar2 = (rb * rc) / sum;
  const rStar3 = (ra * rc) / sum;

  // Star to Delta
  const prod = ra * rb + rb * rc + ra * rc;
  const rDelta1 = prod / rc;
  const rDelta2 = prod / ra;
  const rDelta3 = prod / rb;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Star-Delta Transformation</h3>
            <div className="flex items-center gap-2">
              <Label>Δ→Y</Label>
              <Switch checked={!isDeltaToStar} onCheckedChange={(v) => setIsDeltaToStar(!v)} />
              <Label>Y→Δ</Label>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2 text-center">{isDeltaToStar ? 'Delta (Input)' : 'Star (Input)'}</p>
              {isDeltaToStar ? (
                <svg viewBox="0 0 250 220" className="w-full h-44 border rounded bg-muted/30">
                  {/* Delta triangle */}
                  <line x1="125" y1="30" x2="40" y2="180" stroke="hsl(var(--destructive))" strokeWidth="3" />
                  <line x1="125" y1="30" x2="210" y2="180" stroke="hsl(var(--chart-1))" strokeWidth="3" />
                  <line x1="40" y1="180" x2="210" y2="180" stroke="hsl(var(--chart-2))" strokeWidth="3" />
                  <circle cx="125" cy="30" r="6" fill="hsl(var(--primary))" />
                  <circle cx="40" cy="180" r="6" fill="hsl(var(--primary))" />
                  <circle cx="210" cy="180" r="6" fill="hsl(var(--primary))" />
                  <text x="65" y="100" fill="hsl(var(--destructive))" fontSize="11">Ra={ra}Ω</text>
                  <text x="165" y="100" fill="hsl(var(--chart-1))" fontSize="11">Rb={rb}Ω</text>
                  <text x="100" y="205" fill="hsl(var(--chart-2))" fontSize="11">Rc={rc}Ω</text>
                  <text x="125" y="20" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="10">A</text>
                  <text x="25" y="195" fill="hsl(var(--foreground))" fontSize="10">B</text>
                  <text x="215" y="195" fill="hsl(var(--foreground))" fontSize="10">C</text>
                </svg>
              ) : (
                <svg viewBox="0 0 250 220" className="w-full h-44 border rounded bg-muted/30">
                  {/* Star (Y) shape */}
                  <circle cx="125" cy="110" r="6" fill="hsl(var(--primary))" />
                  <text x="135" y="115" fill="hsl(var(--primary))" fontSize="10">N</text>
                  <line x1="125" y1="110" x2="125" y2="30" stroke="hsl(var(--destructive))" strokeWidth="3" />
                  <line x1="125" y1="110" x2="40" y2="190" stroke="hsl(var(--chart-1))" strokeWidth="3" />
                  <line x1="125" y1="110" x2="210" y2="190" stroke="hsl(var(--chart-2))" strokeWidth="3" />
                  <circle cx="125" cy="30" r="6" fill="hsl(var(--foreground))" />
                  <circle cx="40" cy="190" r="6" fill="hsl(var(--foreground))" />
                  <circle cx="210" cy="190" r="6" fill="hsl(var(--foreground))" />
                  <text x="130" y="70" fill="hsl(var(--destructive))" fontSize="11">Ra={ra}Ω</text>
                  <text x="50" y="165" fill="hsl(var(--chart-1))" fontSize="11">Rb={rb}Ω</text>
                  <text x="155" y="165" fill="hsl(var(--chart-2))" fontSize="11">Rc={rc}Ω</text>
                </svg>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2 text-center">{isDeltaToStar ? 'Star (Output)' : 'Delta (Output)'}</p>
              {isDeltaToStar ? (
                <svg viewBox="0 0 250 220" className="w-full h-44 border rounded bg-muted/30">
                  <circle cx="125" cy="110" r="6" fill="hsl(var(--primary))" />
                  <text x="135" y="115" fill="hsl(var(--primary))" fontSize="10">N</text>
                  <line x1="125" y1="110" x2="125" y2="30" stroke="hsl(var(--destructive))" strokeWidth="3" />
                  <line x1="125" y1="110" x2="40" y2="190" stroke="hsl(var(--chart-1))" strokeWidth="3" />
                  <line x1="125" y1="110" x2="210" y2="190" stroke="hsl(var(--chart-2))" strokeWidth="3" />
                  <circle cx="125" cy="30" r="6" fill="hsl(var(--foreground))" />
                  <circle cx="40" cy="190" r="6" fill="hsl(var(--foreground))" />
                  <circle cx="210" cy="190" r="6" fill="hsl(var(--foreground))" />
                  <text x="130" y="70" fill="hsl(var(--destructive))" fontSize="10">R1={rStar1.toFixed(1)}Ω</text>
                  <text x="45" y="165" fill="hsl(var(--chart-1))" fontSize="10">R2={rStar2.toFixed(1)}Ω</text>
                  <text x="150" y="165" fill="hsl(var(--chart-2))" fontSize="10">R3={rStar3.toFixed(1)}Ω</text>
                </svg>
              ) : (
                <svg viewBox="0 0 250 220" className="w-full h-44 border rounded bg-muted/30">
                  <line x1="125" y1="30" x2="40" y2="180" stroke="hsl(var(--destructive))" strokeWidth="3" />
                  <line x1="125" y1="30" x2="210" y2="180" stroke="hsl(var(--chart-1))" strokeWidth="3" />
                  <line x1="40" y1="180" x2="210" y2="180" stroke="hsl(var(--chart-2))" strokeWidth="3" />
                  <circle cx="125" cy="30" r="6" fill="hsl(var(--primary))" />
                  <circle cx="40" cy="180" r="6" fill="hsl(var(--primary))" />
                  <circle cx="210" cy="180" r="6" fill="hsl(var(--primary))" />
                  <text x="60" y="100" fill="hsl(var(--destructive))" fontSize="10">R1={rDelta1.toFixed(1)}Ω</text>
                  <text x="160" y="100" fill="hsl(var(--chart-1))" fontSize="10">R2={rDelta2.toFixed(1)}Ω</text>
                  <text x="95" y="205" fill="hsl(var(--chart-2))" fontSize="10">R3={rDelta3.toFixed(1)}Ω</text>
                </svg>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-4 space-y-4">
            <div><Label className="text-sm">Ra: {ra} Ω</Label><Slider value={[ra]} onValueChange={([v]) => setRa(v)} min={10} max={500} step={10} /></div>
            <div><Label className="text-sm">Rb: {rb} Ω</Label><Slider value={[rb]} onValueChange={([v]) => setRb(v)} min={10} max={500} step={10} /></div>
            <div><Label className="text-sm">Rc: {rc} Ω</Label><Slider value={[rc]} onValueChange={([v]) => setRc(v)} min={10} max={500} step={10} /></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 space-y-2">
            <h4 className="font-semibold">{isDeltaToStar ? 'Δ → Y Conversion' : 'Y → Δ Conversion'}</h4>
            {isDeltaToStar ? (
              <div className="space-y-1 text-sm">
                <p className="font-mono">R1 = (Ra×Rb)/(Ra+Rb+Rc) = <strong>{rStar1.toFixed(2)} Ω</strong></p>
                <p className="font-mono">R2 = (Rb×Rc)/(Ra+Rb+Rc) = <strong>{rStar2.toFixed(2)} Ω</strong></p>
                <p className="font-mono">R3 = (Ra×Rc)/(Ra+Rb+Rc) = <strong>{rStar3.toFixed(2)} Ω</strong></p>
              </div>
            ) : (
              <div className="space-y-1 text-sm">
                <p className="font-mono">R1 = (RaRb+RbRc+RaRc)/Rc = <strong>{rDelta1.toFixed(2)} Ω</strong></p>
                <p className="font-mono">R2 = (RaRb+RbRc+RaRc)/Ra = <strong>{rDelta2.toFixed(2)} Ω</strong></p>
                <p className="font-mono">R3 = (RaRb+RbRc+RaRc)/Rb = <strong>{rDelta3.toFixed(2)} Ω</strong></p>
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              {isDeltaToStar ? 'Star resistances are always smaller than the smallest delta resistance' : 'Delta resistances are always larger than the largest star resistance'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
