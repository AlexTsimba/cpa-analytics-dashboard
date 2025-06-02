import { ThemeToggle } from '@/components/theme-toggle';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header with Theme Toggle */}
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-foreground">
              CPA Analytics Dashboard
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-4">
              Professional analytics dashboard with Shadcn UI theming system.
              Now featuring dynamic dark/light mode switching.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Theme:</span>
            <ThemeToggle />
          </div>
        </div>

        {/* Theme Demo Section */}
        <Card className="mx-auto max-w-4xl">
          <CardHeader className="text-center">
            <CardTitle>🌙 Dark Mode Implementation</CardTitle>
            <CardDescription>
              Dynamic theme switching with system preference detection. Try the
              theme toggle in the top-right corner!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">✅ Features Implemented:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• next-themes integration</li>
                  <li>• System preference detection</li>
                  <li>• Smooth theme transitions</li>
                  <li>• Hydration safe rendering</li>
                  <li>• Professional color schemes</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">🎨 Theme Features:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Light & dark color palettes</li>
                  <li>• Analytics-optimized colors</li>
                  <li>• Accessible contrast ratios</li>
                  <li>• Chart color coordination</li>
                  <li>• Custom scrollbar styling</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Component Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Button Variants Card */}
          <Card>
            <CardHeader>
              <CardTitle>Button Components</CardTitle>
              <CardDescription>
                Buttons in both light and dark themes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button size="sm">Small</Button>
                <Button>Default</Button>
                <Button size="lg">Large</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
            </CardContent>
          </Card>

          {/* Badge Variants Card */}
          <Card>
            <CardHeader>
              <CardTitle>Status Indicators</CardTitle>
              <CardDescription>Theme-aware badge components</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="destructive">Error</Badge>
                <Badge variant="info">Info</Badge>
              </div>
            </CardContent>
          </Card>

          {/* KPI Metrics Card */}
          <Card>
            <CardHeader>
              <CardTitle>Analytics Metrics</CardTitle>
              <CardDescription>
                Dark theme optimized metrics display
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Revenue</span>
                  <span className="text-kpi text-trend-positive">+12.5%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Conversions
                  </span>
                  <span className="text-kpi text-trend-positive">+8.3%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Cost per Click
                  </span>
                  <span className="text-kpi text-trend-negative">-5.1%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dark Theme Colors Card */}
          <Card>
            <CardHeader>
              <CardTitle>Theme Colors</CardTitle>
              <CardDescription>
                Adaptive color system for both themes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="h-12 bg-primary rounded-md flex items-center justify-center">
                  <span className="text-primary-foreground text-xs font-medium">
                    Primary
                  </span>
                </div>
                <div className="h-12 bg-secondary rounded-md flex items-center justify-center">
                  <span className="text-secondary-foreground text-xs font-medium">
                    Secondary
                  </span>
                </div>
                <div className="h-12 bg-success rounded-md flex items-center justify-center">
                  <span className="text-success-foreground text-xs font-medium">
                    Success
                  </span>
                </div>
                <div className="h-12 bg-warning rounded-md flex items-center justify-center">
                  <span className="text-warning-foreground text-xs font-medium">
                    Warning
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card Backgrounds Demo */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Card Backgrounds</CardTitle>
              <CardDescription>
                Adaptive card styling in current theme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="p-3 bg-muted rounded-md">
                  <span className="text-muted-foreground text-sm">
                    Muted background
                  </span>
                </div>
                <div className="p-3 bg-accent rounded-md">
                  <span className="text-accent-foreground text-sm">
                    Accent background
                  </span>
                </div>
                <div className="p-3 border rounded-md">
                  <span className="text-foreground text-sm">
                    Border styling
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Elements Card */}
          <Card>
            <CardHeader>
              <CardTitle>Interactive States</CardTitle>
              <CardDescription>
                Theme-aware hover and focus states
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Button className="w-full" variant="default">
                  Primary Action
                </Button>
                <Button className="w-full" variant="outline">
                  Secondary Action
                </Button>
                <Button className="w-full" variant="destructive">
                  Destructive Action
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Implementation Status */}
        <Card className="mx-auto max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle>Dark Mode Implementation Complete</CardTitle>
            <CardDescription>
              Full theme system with light/dark mode switching, system
              preference detection, and analytics-optimized color schemes for
              professional dashboards.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex justify-center gap-2 flex-wrap">
              <Badge variant="success">Theme Provider</Badge>
              <Badge variant="success">Dark Mode</Badge>
              <Badge variant="success">System Detection</Badge>
              <Badge variant="info">Components Ready</Badge>
              <Badge variant="secondary">Next: Customization</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
