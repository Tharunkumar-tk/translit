import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function Accessibility() {
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const [fontSize, setFontSize] = useState([16]);

  const handleReset = () => {
    setHighContrast(false);
    setLargeText(false);
    setReducedMotion(false);
    setScreenReader(false);
    setFontSize([16]);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Accessibility Settings</h1>
        <p className="text-muted-foreground">
          Customize your experience with accessibility features designed to make the application more usable for everyone.
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Visual Accessibility</CardTitle>
            <CardDescription>
              Adjust visual settings to improve readability and reduce eye strain.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="high-contrast">High Contrast Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Increase contrast between text and background colors
                </p>
              </div>
              <Switch
                id="high-contrast"
                checked={highContrast}
                onCheckedChange={setHighContrast}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="large-text">Large Text</Label>
                <p className="text-sm text-muted-foreground">
                  Increase text size throughout the application
                </p>
              </div>
              <Switch
                id="large-text"
                checked={largeText}
                onCheckedChange={setLargeText}
              />
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>Font Size: {fontSize[0]}px</Label>
              <Slider
                value={fontSize}
                onValueChange={setFontSize}
                max={24}
                min={12}
                step={1}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                Adjust the base font size for better readability
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Motion & Animation</CardTitle>
            <CardDescription>
              Control animations and motion effects for better comfort.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="reduced-motion">Reduce Motion</Label>
                <p className="text-sm text-muted-foreground">
                  Minimize animations and transitions that may cause discomfort
                </p>
              </div>
              <Switch
                id="reduced-motion"
                checked={reducedMotion}
                onCheckedChange={setReducedMotion}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Screen Reader Support</CardTitle>
            <CardDescription>
              Enhanced support for assistive technologies.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="screen-reader">Screen Reader Optimizations</Label>
                <p className="text-sm text-muted-foreground">
                  Enable additional ARIA labels and descriptions
                </p>
              </div>
              <Switch
                id="screen-reader"
                checked={screenReader}
                onCheckedChange={setScreenReader}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={handleReset}>
            Reset to Defaults
          </Button>
        </div>
      </div>
    </div>
  );
}