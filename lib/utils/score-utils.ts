export const getScoreColor = (score: number): string => {
  if (score >= 90) return 'text-green-600';
  if (score >= 80) return 'text-blue-600';
  if (score >= 70) return 'text-yellow-600';
  return 'text-red-600';
};

export const getScoreBadgeVariant = (
  score: number
): 'default' | 'secondary' | 'destructive' => {
  if (score >= 90) return 'default';
  if (score >= 80) return 'secondary';
  return 'destructive';
};

export const getScoreLevel = (score: number): string => {
  if (score >= 90) return '優秀';
  if (score >= 80) return '良好';
  if (score >= 70) return '普通';
  return '要改善';
};

export const getScoreLevelColor = (score: number): string => {
  if (score >= 90) return 'text-green-600';
  if (score >= 80) return 'text-blue-600';
  if (score >= 70) return 'text-yellow-600';
  return 'text-red-600';
}; 