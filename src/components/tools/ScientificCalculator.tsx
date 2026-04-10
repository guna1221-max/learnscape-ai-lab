import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calculator } from 'lucide-react';

export function ScientificCalculator() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [isNewNumber, setIsNewNumber] = useState(true);

  const handleNumber = (num: string) => {
    if (isNewNumber) {
      setDisplay(num);
      setIsNewNumber(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperator = (op: string) => {
    setExpression(display + ' ' + op + ' ');
    setIsNewNumber(true);
  };

  const handleFunction = (fn: string) => {
    const val = parseFloat(display);
    let result: number;
    switch (fn) {
      case 'sin': result = Math.sin(val * Math.PI / 180); break;
      case 'cos': result = Math.cos(val * Math.PI / 180); break;
      case 'tan': result = Math.tan(val * Math.PI / 180); break;
      case 'log': result = Math.log10(val); break;
      case 'ln': result = Math.log(val); break;
      case '√': result = Math.sqrt(val); break;
      case 'x²': result = val * val; break;
      case 'x³': result = val * val * val; break;
      case '1/x': result = 1 / val; break;
      case 'π': result = Math.PI; break;
      case 'e': result = Math.E; break;
      case '|x|': result = Math.abs(val); break;
      case '±': result = -val; break;
      case '%': result = val / 100; break;
      default: result = val;
    }
    setDisplay(result.toPrecision(10).replace(/\.?0+$/, ''));
    setIsNewNumber(true);
  };

  const handleEquals = () => {
    try {
      const fullExpr = expression + display;
      const sanitized = fullExpr.replace(/×/g, '*').replace(/÷/g, '/');
      const result = Function('"use strict"; return (' + sanitized + ')')();
      setDisplay(Number(result).toPrecision(10).replace(/\.?0+$/, ''));
      setExpression('');
      setIsNewNumber(true);
    } catch {
      setDisplay('Error');
      setIsNewNumber(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setExpression('');
    setIsNewNumber(true);
  };

  const btnClass = "h-10 text-sm font-medium";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Calculator className="h-4 w-4" />
          Calculator
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Scientific Calculator</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <div className="text-right text-xs text-muted-foreground h-4 truncate">{expression}</div>
          <div className="bg-muted rounded-md p-3 text-right text-2xl font-mono font-bold truncate">{display}</div>

          <div className="grid grid-cols-5 gap-1">
            {/* Row 1 - Scientific */}
            <Button variant="secondary" className={btnClass} onClick={() => handleFunction('sin')}>sin</Button>
            <Button variant="secondary" className={btnClass} onClick={() => handleFunction('cos')}>cos</Button>
            <Button variant="secondary" className={btnClass} onClick={() => handleFunction('tan')}>tan</Button>
            <Button variant="secondary" className={btnClass} onClick={() => handleFunction('log')}>log</Button>
            <Button variant="secondary" className={btnClass} onClick={() => handleFunction('ln')}>ln</Button>

            {/* Row 2 - Scientific */}
            <Button variant="secondary" className={btnClass} onClick={() => handleFunction('√')}>√</Button>
            <Button variant="secondary" className={btnClass} onClick={() => handleFunction('x²')}>x²</Button>
            <Button variant="secondary" className={btnClass} onClick={() => handleFunction('x³')}>x³</Button>
            <Button variant="secondary" className={btnClass} onClick={() => handleFunction('π')}>π</Button>
            <Button variant="secondary" className={btnClass} onClick={() => handleFunction('e')}>e</Button>

            {/* Row 3 */}
            <Button variant="outline" className={btnClass} onClick={handleClear}>AC</Button>
            <Button variant="outline" className={btnClass} onClick={() => handleFunction('±')}>±</Button>
            <Button variant="outline" className={btnClass} onClick={() => handleFunction('%')}>%</Button>
            <Button variant="outline" className={btnClass} onClick={() => handleFunction('1/x')}>1/x</Button>
            <Button variant="default" className={btnClass} onClick={() => handleOperator('÷')}>÷</Button>

            {/* Row 4 */}
            <Button variant="ghost" className={btnClass} onClick={() => handleNumber('7')}>7</Button>
            <Button variant="ghost" className={btnClass} onClick={() => handleNumber('8')}>8</Button>
            <Button variant="ghost" className={btnClass} onClick={() => handleNumber('9')}>9</Button>
            <Button variant="ghost" className={btnClass} onClick={() => handleNumber('(')}>(</Button>
            <Button variant="default" className={btnClass} onClick={() => handleOperator('×')}>×</Button>

            {/* Row 5 */}
            <Button variant="ghost" className={btnClass} onClick={() => handleNumber('4')}>4</Button>
            <Button variant="ghost" className={btnClass} onClick={() => handleNumber('5')}>5</Button>
            <Button variant="ghost" className={btnClass} onClick={() => handleNumber('6')}>6</Button>
            <Button variant="ghost" className={btnClass} onClick={() => handleNumber(')')}>)</Button>
            <Button variant="default" className={btnClass} onClick={() => handleOperator('-')}>−</Button>

            {/* Row 6 */}
            <Button variant="ghost" className={btnClass} onClick={() => handleNumber('1')}>1</Button>
            <Button variant="ghost" className={btnClass} onClick={() => handleNumber('2')}>2</Button>
            <Button variant="ghost" className={btnClass} onClick={() => handleNumber('3')}>3</Button>
            <Button variant="ghost" className={btnClass} onClick={() => handleFunction('|x|')}>|x|</Button>
            <Button variant="default" className={btnClass} onClick={() => handleOperator('+')}>+</Button>

            {/* Row 7 */}
            <Button variant="ghost" className={`${btnClass} col-span-2`} onClick={() => handleNumber('0')}>0</Button>
            <Button variant="ghost" className={btnClass} onClick={() => handleNumber('.')}>.</Button>
            <Button variant="default" className={`${btnClass} col-span-2`} onClick={handleEquals}>=</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
