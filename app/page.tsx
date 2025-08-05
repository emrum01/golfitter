'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/protected-route';
import { useAuth } from '@/lib/auth-context';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload, User, Target, Activity, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import SwingAnalysis from '@/components/swing-analysis';
import { MobileVideoPlayer } from '@/components/mobile-video-player';
import Link from 'next/link';

interface UserData {
  name: string;
  height: number;
  weight: number;
  armLength: number;
  strengthLevel: number;
  currentScore: number;
  targetScore: number;
  experienceYears: number;
  budget: number;
  profileImage?: string;
}

interface ProGolfer {
  id: string;
  name: string;
  height: number;
  weight: number;
  armLength: number;
  strengthLevel: number;
  imageUrl: string;
  swingVideoUrl: string;
  clubSet: {
    driver: string;
    irons: string;
    wedges: string;
    putter: string;
  };
  achievements: string[];
}

const proGolfers: ProGolfer[] = [
  {
    id: '1',
    name: '田中 太郎',
    height: 175,
    weight: 70,
    armLength: 85,
    strengthLevel: 4,
    imageUrl: '/placeholder.svg?height=200&width=200',
    swingVideoUrl: '/videos/test.mp4',
    clubSet: {
      driver: 'TaylorMade SIM2 Driver',
      irons: 'Titleist T100 Irons',
      wedges: 'Vokey SM9 Wedges',
      putter: 'Scotty Cameron Newport',
    },
    achievements: ['PGAツアー優勝3回', '日本オープン優勝', '平均スコア68.5'],
  },
  {
    id: '2',
    name: '佐藤 花子',
    height: 165,
    weight: 58,
    armLength: 78,
    strengthLevel: 3,
    imageUrl: '/placeholder.svg?height=200&width=200',
    swingVideoUrl: '/videos/test2.mp4',
    clubSet: {
      driver: 'Callaway Epic Speed Driver',
      irons: 'Mizuno JPX921 Irons',
      wedges: 'Cleveland RTX ZipCore',
      putter: 'Odyssey White Hot',
    },
    achievements: ['LPGA優勝5回', 'メジャー準優勝', '平均スコア70.2'],
  },
  {
    id: '3',
    name: '山田 次郎',
    height: 180,
    weight: 85,
    armLength: 90,
    strengthLevel: 5,
    imageUrl: '/placeholder.svg?height=200&width=200',
    swingVideoUrl: '/videos/test.mp4',
    clubSet: {
      driver: 'Ping G425 LST Driver',
      irons: 'PXG 0311 T Irons',
      wedges: 'Titleist Vokey SM8',
      putter: 'TaylorMade Spider X',
    },
    achievements: ['飛距離平均320ヤード', 'PGAツアー優勝1回', '平均スコア69.8'],
  },
];

function findBestMatch(userData: UserData): ProGolfer {
  let bestMatch = proGolfers[0];
  let bestScore = Number.POSITIVE_INFINITY;

  proGolfers.forEach((pro) => {
    const heightDiff = Math.abs(pro.height - userData.height);
    const weightDiff = Math.abs(pro.weight - userData.weight);
    const armDiff = Math.abs(pro.armLength - userData.armLength);
    const strengthDiff = Math.abs(pro.strengthLevel - userData.strengthLevel);

    const totalScore =
      heightDiff * 0.3 + weightDiff * 0.2 + armDiff * 0.3 + strengthDiff * 0.2;

    if (totalScore < bestScore) {
      bestScore = totalScore;
      bestMatch = pro;
    }
  });

  return bestMatch;
}

function GolfFitter() {
  const { user, signOut } = useAuth();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState<
    'input' | 'results' | 'swing-analysis'
  >('input');
  const [userData, setUserData] = useState<UserData>({
    name: user?.user_metadata?.full_name || user?.email || '',
    height: 0,
    weight: 0,
    armLength: 0,
    strengthLevel: 1,
    currentScore: 0,
    targetScore: 0,
    experienceYears: 0,
    budget: 0,
  });
  const [matchedPro, setMatchedPro] = useState<ProGolfer | null>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // URLパラメータからcurrentStepを読み取る
  useEffect(() => {
    const step = searchParams.get('currentStep');
    if (step === 'results') {
      // セッションストレージから診断結果を復元
      const savedMatchedPro = sessionStorage.getItem('matchedPro');
      const savedUserData = sessionStorage.getItem('userData');
      
      if (savedMatchedPro && savedUserData) {
        setMatchedPro(JSON.parse(savedMatchedPro));
        setUserData(JSON.parse(savedUserData));
        setCurrentStep('results');
      }
    }
  }, [searchParams]);

  // アプリケーション初期化時にセッションストレージから診断結果を復元
  useEffect(() => {
    const savedMatchedPro = sessionStorage.getItem('matchedPro');
    const savedUserData = sessionStorage.getItem('userData');
    
    if (savedMatchedPro && savedUserData && currentStep === 'input') {
      setMatchedPro(JSON.parse(savedMatchedPro));
      setUserData(JSON.parse(savedUserData));
      setCurrentStep('results');
    }
  }, [currentStep]);

  const handleSubmit = () => {
    const match = findBestMatch(userData);
    setMatchedPro(match);
    
    // 診断結果をセッションストレージに保存
    sessionStorage.setItem('matchedPro', JSON.stringify(match));
    sessionStorage.setItem('userData', JSON.stringify(userData));
    
    setCurrentStep('results');
  };

  const handleInputChange = (field: keyof UserData, value: string | number) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('サインアウトエラー:', error);
    }
  };

  if (currentStep === 'swing-analysis') {
    return (
      <SwingAnalysis
        onBack={() => setCurrentStep('results')}
        matchedProName={matchedPro?.name}
      />
    );
  }

  if (currentStep === 'results' && matchedPro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        {/* ヘッダー */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Golfitter</h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback>
                      {user?.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-700">{user?.email}</span>
                </div>
                <Button onClick={handleSignOut} variant="outline" size="sm">
                  ログアウト
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="p-4">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-green-800">診断結果</h1>
              <p className="text-gray-600">
                あなたに最適なプロゴルファーとクラブセットをご提案します
              </p>
            </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* プロゴルファーマッチング */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  マッチしたプロゴルファー
                </CardTitle>
                <CardDescription>
                  あなたの身体データに最も近いプロゴルファーです
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage
                      src={matchedPro.imageUrl || '/placeholder.svg'}
                      alt={matchedPro.name}
                    />
                    <AvatarFallback>{matchedPro.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">{matchedPro.name}</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>身長: {matchedPro.height}cm</p>
                      <p>体重: {matchedPro.weight}kg</p>
                      <p>腕の長さ: {matchedPro.armLength}cm</p>
                      <p>筋力レベル: {matchedPro.strengthLevel}/5</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">主な実績</h4>
                  <ul className="text-sm space-y-1">
                    {matchedPro.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* 推奨クラブセット */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  推奨クラブセット
                </CardTitle>
                <CardDescription>
                  {matchedPro.name}が使用しているクラブセット
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">ドライバー</span>
                    <span className="text-sm text-gray-600">
                      {matchedPro.clubSet.driver}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">アイアン</span>
                    <span className="text-sm text-gray-600">
                      {matchedPro.clubSet.irons}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">ウェッジ</span>
                    <span className="text-sm text-gray-600">
                      {matchedPro.clubSet.wedges}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">パター</span>
                    <span className="text-sm text-gray-600">
                      {matchedPro.clubSet.putter}
                    </span>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-2">
                    予算範囲: ¥{userData.budget.toLocaleString()}
                  </p>
                  <p className="text-xs text-green-600">
                    ✓ 予算内で購入可能なクラブセットです
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* スイングフォーム提案 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                スイングフォーム提案
              </CardTitle>
              <CardDescription>
                {matchedPro.name}のスイングを参考にしたフォーム改善ポイント
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative">
                  {/* 動画プレーヤー */}
                  <MobileVideoPlayer
                    key={currentVideoIndex}
                    src={currentVideoIndex === 0 ? '/videos/test.mp4' : '/videos/test2.mp4'}
                    title={`${matchedPro.name}のスイング ${currentVideoIndex + 1}`}
                    className="w-full h-64 rounded-lg"
                  />
                  
                  {/* 動画切り替えボタン（オーバーレイ） */}
                  <div className="absolute inset-0 flex items-center justify-between pointer-events-none">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentVideoIndex(currentVideoIndex === 0 ? 1 : 0)}
                      className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm border-gray-300 hover:bg-white hover:border-gray-400 transition-all duration-200 shadow-lg ml-4 pointer-events-auto"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentVideoIndex(currentVideoIndex === 0 ? 1 : 0)}
                      className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm border-gray-300 hover:bg-white hover:border-gray-400 transition-all duration-200 shadow-lg mr-4 pointer-events-auto"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  {/* 動画番号インジケーター */}
                  <div className="absolute top-4 right-4 bg-black/60 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {currentVideoIndex + 1} / 2
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">改善ポイント</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h5 className="font-medium text-blue-800">アドレス</h5>
                      <p className="text-sm text-blue-600">
                        {matchedPro.name}
                        と同様の体型なので、同じスタンス幅を意識してください
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h5 className="font-medium text-green-800">
                        バックスイング
                      </h5>
                      <p className="text-sm text-green-600">
                        腕の長さが近いため、同じテンポでのバックスイングが効果的です
                      </p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <h5 className="font-medium text-orange-800">
                        フォロースルー
                      </h5>
                      <p className="text-sm text-orange-600">
                        筋力レベルが近いので、同じフィニッシュポジションを目指しましょう
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {/* メインアクションボタン */}
            <div className="text-center mb-2">
              <p className="text-sm text-gray-600 mb-2">次のステップを選択してください</p>
            </div>
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => setCurrentStep('swing-analysis')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                スイング分析
              </Button>
              <Link href={`/swing-comparison?video2=${currentVideoIndex === 0 ? 'test.mp4' : 'test2.mp4'}&proName=${matchedPro.name}`}>
                <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-red-500">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  スイング比較
                </Button>
              </Link>
            </div>
            
            {/* サブアクションボタン */}
            <div className="flex justify-center gap-4 flex-wrap">
              <Button 
                onClick={() => {
                  // セッションストレージをクリア
                  sessionStorage.removeItem('matchedPro');
                  sessionStorage.removeItem('userData');
                  setCurrentStep('input');
                }} 
                variant="outline"
              >
                再診断する
              </Button>
              <Button className="bg-green-600 hover:bg-green-700">
                結果を保存
              </Button>
              <Link href="/videos">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  動画を見る
                </Button>
              </Link>
            </div>
          </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Golfitter</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback>
                    {user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-700">{user?.email}</span>
              </div>
              <Button onClick={handleSignOut} variant="outline" size="sm">
                ログアウト
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-green-800">
              ゴルフフィッター
            </h1>
            <p className="text-gray-600">
              あなたに最適なゴルフクラブとスイングを提案します
            </p>
          </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 身体データ入力 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                身体データ
              </CardTitle>
              <CardDescription>
                あなたの身体的特徴を入力してください
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">お名前</Label>
                <Input
                  id="name"
                  value={userData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="山田太郎"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height">身長 (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={userData.height || ''}
                    onChange={(e) =>
                      handleInputChange(
                        'height',
                        Number.parseInt(e.target.value) || 0
                      )
                    }
                    placeholder="175"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">体重 (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={userData.weight || ''}
                    onChange={(e) =>
                      handleInputChange(
                        'weight',
                        Number.parseInt(e.target.value) || 0
                      )
                    }
                    placeholder="70"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="armLength">腕の長さ (cm)</Label>
                <Input
                  id="armLength"
                  type="number"
                  value={userData.armLength || ''}
                  onChange={(e) =>
                    handleInputChange(
                      'armLength',
                      Number.parseInt(e.target.value) || 0
                    )
                  }
                  placeholder="85"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="strengthLevel">筋力レベル</Label>
                <Select
                  onValueChange={(value) =>
                    handleInputChange('strengthLevel', Number.parseInt(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="筋力レベルを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - 低い</SelectItem>
                    <SelectItem value="2">2 - やや低い</SelectItem>
                    <SelectItem value="3">3 - 普通</SelectItem>
                    <SelectItem value="4">4 - やや高い</SelectItem>
                    <SelectItem value="5">5 - 高い</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* プレイ情報入力 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                プレイ情報
              </CardTitle>
              <CardDescription>
                あなたのゴルフ経験と目標を入力してください
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentScore">現在のスコア</Label>
                  <Input
                    id="currentScore"
                    type="number"
                    value={userData.currentScore || ''}
                    onChange={(e) =>
                      handleInputChange(
                        'currentScore',
                        Number.parseInt(e.target.value) || 0
                      )
                    }
                    placeholder="90"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetScore">目標スコア</Label>
                  <Input
                    id="targetScore"
                    type="number"
                    value={userData.targetScore || ''}
                    onChange={(e) =>
                      handleInputChange(
                        'targetScore',
                        Number.parseInt(e.target.value) || 0
                      )
                    }
                    placeholder="80"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="experienceYears">経験年数</Label>
                <Input
                  id="experienceYears"
                  type="number"
                  value={userData.experienceYears || ''}
                  onChange={(e) =>
                    handleInputChange(
                      'experienceYears',
                      Number.parseInt(e.target.value) || 0
                    )
                  }
                  placeholder="5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">予算 (円)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={userData.budget || ''}
                  onChange={(e) =>
                    handleInputChange(
                      'budget',
                      Number.parseInt(e.target.value) || 0
                    )
                  }
                  placeholder="300000"
                />
              </div>
              <div className="space-y-2">
                <Label>プロフィール画像</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">
                    画像をアップロード（オプション）
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 px-8 py-3 text-lg"
            disabled={!userData.name || !userData.height || !userData.weight}
          >
            AI診断を開始
          </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <ProtectedRoute>
      <GolfFitter />
    </ProtectedRoute>
  );
}
