import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardAction
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content can be any React component</p>
      </CardContent>
      <CardFooter>
        <p>Card footer</p>
      </CardFooter>
    </Card>
  ),
};

export const CardOnly: Story = {
  render: () => (
    <Card className="w-[350px] p-6">
      <p>Simple card with just content</p>
    </Card>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card with Action</CardTitle>
        <CardDescription>This card has an action button</CardDescription>
        <CardAction>
          <Button size="sm" variant="outline">Action</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>Card content goes here</p>
      </CardContent>
    </Card>
  ),
};

export const HeaderOnly: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Header Only Card</CardTitle>
        <CardDescription>This card only has a header section</CardDescription>
      </CardHeader>
    </Card>
  ),
};

export const ContentOnly: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardContent>
        <p className="text-sm">This card only has content, no header or footer.</p>
        <p className="text-sm mt-2">It's useful for simple content blocks.</p>
      </CardContent>
    </Card>
  ),
};

export const ComplexContent: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
        <CardDescription>Manage your account settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Name</label>
          <input 
            type="text" 
            className="w-full mt-1 px-3 py-2 border rounded-md" 
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Email</label>
          <input 
            type="email" 
            className="w-full mt-1 px-3 py-2 border rounded-md" 
            placeholder="john@example.com"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Save changes</Button>
      </CardFooter>
    </Card>
  ),
};

export const GridLayout: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Card 1</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">First card content</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Card 2</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Second card content</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Card 3</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Third card content</p>
        </CardContent>
      </Card>
    </div>
  ),
};

export const CustomStyling: Story = {
  render: () => (
    <Card className="w-[350px] bg-blue-50 border-blue-200">
      <CardHeader>
        <CardTitle className="text-blue-900">Custom Styled Card</CardTitle>
        <CardDescription className="text-blue-700">
          This card has custom colors
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-blue-800">Custom styled content</p>
      </CardContent>
    </Card>
  ),
};

export const Interactive: Story = {
  render: () => (
    <Card className="w-[350px] cursor-pointer hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle>Interactive Card</CardTitle>
        <CardDescription>Hover over this card</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This card responds to hover</p>
      </CardContent>
    </Card>
  ),
};

export const WithImage: Story = {
  render: () => (
    <Card className="w-[350px] overflow-hidden">
      <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-600" />
      <CardHeader>
        <CardTitle>Card with Image</CardTitle>
        <CardDescription>Beautiful gradient header</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content below the image</p>
      </CardContent>
    </Card>
  ),
};

export const Loading: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-full bg-gray-200 rounded animate-pulse mt-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  ),
};

export const WithBadge: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Premium Feature</CardTitle>
            <CardDescription>Unlock advanced capabilities</CardDescription>
          </div>
          <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
            NEW
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p>This feature is newly released</p>
      </CardContent>
    </Card>
  ),
};

export const Notification: Story = {
  render: () => (
    <Card className="w-[350px] border-l-4 border-l-blue-500">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm">This is an informational message for the user.</p>
      </CardContent>
    </Card>
  ),
};

export const Stats: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardDescription>Total Revenue</CardDescription>
        <CardTitle className="text-3xl font-bold">$45,231.89</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-green-600">+20.1% from last month</p>
      </CardContent>
    </Card>
  ),
};