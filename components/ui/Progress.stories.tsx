import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';

const meta = {
  title: 'UI/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
    },
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 33,
  },
};

export const Empty: Story = {
  args: {
    value: 0,
  },
};

export const Half: Story = {
  args: {
    value: 50,
  },
};

export const Full: Story = {
  args: {
    value: 100,
  },
};

export const CustomSize: Story = {
  render: () => (
    <div className="space-y-4 w-64">
      <Progress value={25} className="h-1" />
      <Progress value={50} className="h-2" />
      <Progress value={75} className="h-3" />
      <Progress value={100} className="h-4" />
    </div>
  ),
};

export const CustomColors: Story = {
  render: () => (
    <div className="space-y-4 w-64">
      <Progress value={25} className="bg-gray-200" />
      <Progress value={50} className="bg-blue-100" />
      <Progress value={75} className="bg-green-100" />
      <Progress value={100} className="bg-red-100" />
    </div>
  ),
};

export const Animated: Story = {
  render: () => {
    const AnimatedProgress = () => {
      const [progress, setProgress] = useState(0);

      useEffect(() => {
        const timer = setTimeout(() => setProgress(66), 500);
        return () => clearTimeout(timer);
      }, []);

      return <Progress value={progress} className="w-64" />;
    };

    return <AnimatedProgress />;
  },
};

export const Loading: Story = {
  render: () => {
    const LoadingProgress = () => {
      const [progress, setProgress] = useState(0);

      useEffect(() => {
        const interval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval);
              return 100;
            }
            return prev + 10;
          });
        }, 500);

        return () => clearInterval(interval);
      }, []);

      return <Progress value={progress} className="w-64" />;
    };

    return <LoadingProgress />;
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Progress</span>
        <span>66%</span>
      </div>
      <Progress value={66} className="w-64" />
    </div>
  ),
};

export const MultipleProgress: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium mb-2">Downloading...</p>
        <Progress value={75} className="w-64" />
      </div>
      <div>
        <p className="text-sm font-medium mb-2">Installing...</p>
        <Progress value={33} className="w-64" />
      </div>
      <div>
        <p className="text-sm font-medium mb-2">Complete</p>
        <Progress value={100} className="w-64" />
      </div>
    </div>
  ),
};

export const Indeterminate: Story = {
  render: () => (
    <div className="w-64">
      <Progress value={null} className="animate-pulse" />
      <p className="text-xs text-gray-500 mt-2">Processing...</p>
    </div>
  ),
};

export const StepProgress: Story = {
  render: () => {
    const steps = [
      { name: 'Order placed', value: 100 },
      { name: 'Processing', value: 100 },
      { name: 'Shipped', value: 100 },
      { name: 'Delivered', value: 0 },
    ];

    return (
      <div className="w-full max-w-md space-y-4">
        {steps.map((step) => (
          <div key={step.name}>
            <div className="flex justify-between text-sm mb-1">
              <span className={step.value > 0 ? 'font-medium' : 'text-gray-500'}>
                {step.name}
              </span>
              {step.value > 0 && (
                <span className="text-green-600">✓</span>
              )}
            </div>
            <Progress 
              value={step.value} 
              className={`h-2 ${step.value === 0 ? 'opacity-50' : ''}`}
            />
          </div>
        ))}
      </div>
    );
  },
};

export const GradientProgress: Story = {
  render: () => (
    <div className="space-y-4 w-64">
      <div>
        <Progress value={75} className="h-3" />
        <style jsx>{`
          .bg-primary {
            background: linear-gradient(to right, #3b82f6, #8b5cf6);
          }
        `}</style>
      </div>
    </div>
  ),
};