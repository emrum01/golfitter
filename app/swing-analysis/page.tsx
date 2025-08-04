import type { Metadata } from 'next';
import SwingAnalysisPage from './SwingAnalysisPage';

export const metadata: Metadata = {
  title: 'スイング分析 | Golfitter',
  description: 'AIによるゴルフスイング分析',
};

export default function Page() {
  return <SwingAnalysisPage />;
}