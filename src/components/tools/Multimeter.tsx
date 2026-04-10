import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Gauge } from 'lucide-react';

type MeasurementMode = 'dc_voltage' | 'ac_voltage' | 'dc_current' | 'ac_current' | 'resistance' | 'capacitance' | 'frequency' | 'diode' | 'continuity';

const modeConfig: Record<MeasurementMode, { label: string; unit: string; symbol: string; color: string }> = {
  dc_voltage: { label: 'DC Voltage', unit: 'V', symbol: 'V⎓', color: 'text-yellow-500' },
  ac_voltage: { label: 'AC Voltage', unit: 'V', symbol: 'V~', color: 'text-yellow-400' },
  dc_current: { label: 'DC Current', unit: 'A', symbol: 'A⎓', color: 'text-red-500' },
  ac_current: { label: 'AC Current', unit: 'A', symbol: 'A~', color: 'text-red-400' },
  resistance: { label: 'Resistance', unit: 'Ω', symbol: 'Ω', color: 'text-green-500' },
  capacitance: { label: 'Capacitance', unit: 'F', symbol: 'C', color: 'text-blue-500' },
  frequency: { label: 'Frequency', unit: 'Hz', symbol: 'Hz', color: 'text-purple-500' },
  diode: { label: 'Diode Test', unit: 'V', symbol: '▷|', color: 'text-orange-500' },
  continuity: { label: 'Continuity', unit: 'Ω', symbol: '🔊', color: 'text-teal-500' },
};

export function Multimeter() {
  const [mode, setMode] = useState<MeasurementMode>('dc_voltage');
  const [inputValue, setInputValue] = useState('');
  const [reading, setReading] = useState<string | null>(null);
  const [range, setRange] = useState('auto');

  const handleMeasure = () => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) {
      setReading('OL');
      return;
    }

    const config = modeConfig[mode];
    let displayVal = val;
    let prefix = '';
    let unit = config.unit;

    // Auto-range formatting
    const absVal = Math.abs(displayVal);
    if (absVal >= 1e6) { displayVal /= 1e6; prefix = 'M'; }
    else if (absVal >= 1e3) { displayVal /= 1e3; prefix = 'k'; }
    else if (absVal >= 1) { prefix = ''; }
    else if (absVal >= 1e-3) { displayVal *= 1e3; prefix = 'm'; }
    else if (absVal >= 1e-6) { displayVal *= 1e6; prefix = 'µ'; }
    else if (absVal >= 1e-9) { displayVal *= 1e9; prefix = 'n'; }
    else if (absVal >= 1e-12) { displayVal *= 1e12; prefix = 'p'; }

    // Add some realistic noise
    const noise = (Math.random() - 0.5) * 0.02 * Math.abs(displayVal);
    displayVal += noise;

    if (mode === 'continuity') {
      if (val < 50) {
        setReading(`${displayVal.toFixed(1)} Ω 🔊 BEEP`);
      } else {
        setReading('OL (Open)');
      }
      return;
    }

    if (mode === 'diode') {
      if (val > 0 && val < 1) {
        setReading(`${displayVal.toFixed(3)} V (Forward)`);
      } else {
        setReading('OL (Reverse/Open)');
      }
      return;
    }

    setReading(`${displayVal.toFixed(3)} ${prefix}${unit}`);
  };

  const config = modeConfig[mode];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Gauge className="h-4 w-4" />
          Multimeter
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Digital Multimeter</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Display */}
          <Card className="bg-zinc-900 border-zinc-700">
            <CardContent className="pt-4 pb-4">
              <div className="text-right">
                <div className="text-xs text-zinc-400 mb-1">{config.label} Mode</div>
                <div className={`text-3xl font-mono font-bold ${config.color}`}>
                  {reading ?? '---'}
                </div>
                <div className="text-xs text-zinc-500 mt-1">Range: {range === 'auto' ? 'AUTO' : range}</div>
              </div>
            </CardContent>
          </Card>

          {/* Mode selector as dial */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Measurement Mode</Label>
            <div className="grid grid-cols-3 gap-1.5">
              {(Object.entries(modeConfig) as [MeasurementMode, typeof modeConfig[MeasurementMode]][]).map(([key, cfg]) => (
                <Button
                  key={key}
                  variant={mode === key ? 'default' : 'outline'}
                  size="sm"
                  className="text-xs h-9"
                  onClick={() => { setMode(key); setReading(null); }}
                >
                  {cfg.symbol} {cfg.label.split(' ').pop()}
                </Button>
              ))}
            </div>
          </div>

          {/* Range */}
          <div>
            <Label className="text-sm">Range</Label>
            <Select value={range} onValueChange={setRange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto</SelectItem>
                <SelectItem value="200m">200m</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="200">200</SelectItem>
                <SelectItem value="1000">1000</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Input */}
          <div>
            <Label className="text-sm">Input Value ({config.unit})</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder={`Enter value in ${config.unit}`}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleMeasure()}
              />
              <Button onClick={handleMeasure} className="shrink-0">
                Measure
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Enter a value to simulate a measurement reading with realistic noise
            </p>
          </div>

          {/* Probe indicators */}
          <div className="flex justify-center gap-8 pt-2">
            <div className="flex flex-col items-center gap-1">
              <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-red-700" />
              <span className="text-xs text-muted-foreground">V/Ω/Hz</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-4 h-4 rounded-full bg-black border-2 border-zinc-600" />
              <span className="text-xs text-muted-foreground">COM</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-red-700" />
              <span className="text-xs text-muted-foreground">mA/A</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
