import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface Props { isRunning: boolean; }

export function LissajousSimulation({ isRunning }: Props) {
  const [freqRatio, setFreqRatio] = useState(1);
  const [phaseDiff, setPhaseDiff] = useState(90);
  const [amplitudeX, setAmplitudeX] = useState(100);
  const [amplitudeY, setAmplitudeY] = useState(100);

  const points = useMemo(() => {
    const pts: string[] = [];
    const phaseRad = (phaseDiff * Math.PI) / 180;
    for (let t = 0; t <= 2 * Math.PI; t += 0.01) {
      const x = 200 + (amplitudeX / 100) * 150 * Math.sin(t);
      const y = 200 + (amplitudeY / 100) * 150 * Math.sin(freqRatio * t + phaseRad);
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return pts.join(' ');
  }, [freqRatio, phaseDiff, amplitudeX, amplitudeY]);

  const getPatternName = () => {
    if (freqRatio === 1 && phaseDiff === 0) return 'Straight Line (0°)';
    if (freqRatio === 1 && phaseDiff === 90) return 'Circle';
    if (freqRatio === 1 && phaseDiff === 45) return 'Ellipse (45°)';
    if (freqRatio === 1 && phaseDiff === 180) return 'Straight Line (180°)';
    if (freqRatio === 2) return 'Figure-8 pattern (2:1)';
    if (freqRatio === 3) return 'Trefoil pattern (3:1)';
    return `${freqRatio}:1 Lissajous`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold text-lg mb-4">Lissajous Figures (CRO)</h3>
          <div className="flex justify-center">
            <svg viewBox="0 0 400 400" className="w-full max-w-md h-80 border rounded" style={{ background: '#0a0a0a' }}>
              {/* Grid */}
              {[...Array(9)].map((_, i) => (
                <g key={i}>
                  <line x1={50 + i * 37.5} y1="50" x2={50 + i * 37.5} y2="350" stroke="#1a3a1a" strokeWidth="0.5" />
                  <line x1="50" y1={50 + i * 37.5} x2="350" y2={50 + i * 37.5} stroke="#1a3a1a" strokeWidth="0.5" />
                </g>
              ))}
              {/* Center cross */}
              <line x1="200" y1="50" x2="200" y2="350" stroke="#2a5a2a" strokeWidth="1" />
              <line x1="50" y1="200" x2="350" y2="200" stroke="#2a5a2a" strokeWidth="1" />
              {/* Lissajous curve */}
              <polyline points={points} fill="none" stroke="#00ff41" strokeWidth="2" opacity="0.9" />
              {/* Labels */}
              <text x="200" y="385" textAnchor="middle" fill="#00ff41" fontSize="10">Channel X</text>
              <text x="15" y="200" textAnchor="middle" fill="#00ff41" fontSize="10" transform="rotate(-90, 15, 200)">Channel Y</text>
            </svg>
          </div>
          <p className="text-center text-sm font-medium mt-2">{getPatternName()}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-4 space-y-4">
            <div><Label className="text-sm">Frequency Ratio (fy/fx): {freqRatio}</Label><Slider value={[freqRatio]} onValueChange={([v]) => setFreqRatio(v)} min={1} max={5} step={1} /></div>
            <div><Label className="text-sm">Phase Difference: {phaseDiff}°</Label><Slider value={[phaseDiff]} onValueChange={([v]) => setPhaseDiff(v)} min={0} max={360} step={5} /></div>
            <div><Label className="text-sm">Amplitude X: {amplitudeX}%</Label><Slider value={[amplitudeX]} onValueChange={([v]) => setAmplitudeX(v)} min={10} max={100} step={5} /></div>
            <div><Label className="text-sm">Amplitude Y: {amplitudeY}%</Label><Slider value={[amplitudeY]} onValueChange={([v]) => setAmplitudeY(v)} min={10} max={100} step={5} /></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 space-y-2">
            <h4 className="font-semibold">Analysis</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-muted p-2 rounded"><span className="text-muted-foreground">Freq Ratio:</span><p className="font-mono font-bold">{freqRatio}:1</p></div>
              <div className="bg-muted p-2 rounded"><span className="text-muted-foreground">Phase:</span><p className="font-mono font-bold">{phaseDiff}°</p></div>
              <div className="bg-muted p-2 rounded col-span-2"><span className="text-muted-foreground">Pattern:</span><p className="font-mono font-bold">{getPatternName()}</p></div>
            </div>
            <div className="text-xs text-muted-foreground space-y-1 mt-2">
              <p>• Set ratio to 1:1 and vary phase to see circle → ellipse → line</p>
              <p>• Higher ratios create complex multi-loop patterns</p>
              <p>• Used in CRO to compare unknown frequencies</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
