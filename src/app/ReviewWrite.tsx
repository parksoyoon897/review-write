import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, animate } from 'motion/react';
import { useNavigate } from 'react-router';
import { Search, X, Star, Plus, ChevronDown, ThumbsUp, ThumbsDown, Meh, RotateCcw, CheckCircle2 } from 'lucide-react';

// Placeholder product image (SVG data URL)
const productPlaceholder = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='52' height='52'%3E%3Crect width='52' height='52' fill='%23f5f5f5'/%3E%3Ccircle cx='26' cy='20' r='8' fill='%23ddd'/%3E%3Cellipse cx='26' cy='38' rx='12' ry='7' fill='%23ddd'/%3E%3C/svg%3E`;

// Mock product data
const mockProducts = [
  { id: 1, brand: '에스쁘아', name: '치크블러셔 [3호 비올레타]', image: productPlaceholder },
  { id: 2, brand: '에스쁘아', name: '립스틱 매트 [01호 코랄]', image: productPlaceholder },
  { id: 3, brand: '에스쁘아', name: '쿠션 파운데이션 [21호]', image: productPlaceholder },
  { id: 4, brand: '헤라', name: '블랙 쿠션 [23호]', image: productPlaceholder },
  { id: 5, brand: '설화수', name: '자음 에센스 [기본형]', image: productPlaceholder },
];

interface Product {
  id: number;
  brand: string;
  name: string;
  image: string;
}

export default function ReviewWrite() {
  const navigate = useNavigate();

  // Refs for auto-scroll
  const ratingRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const usagePeriodRef = useRef<HTMLDivElement>(null);
  const prosRef = useRef<HTMLDivElement>(null);
  const prosTextareaRef = useRef<HTMLTextAreaElement>(null);
  const consRef = useRef<HTMLDivElement>(null);
  const consTextareaRef = useRef<HTMLTextAreaElement>(null);
  const reasonRef = useRef<HTMLDivElement>(null);
  const reasonTextareaRef = useRef<HTMLTextAreaElement>(null);
  const skinInfoRef = useRef<HTMLDivElement>(null);

  // Step 1: Product Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Step 2: Rating
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  // Step 3: Photos
  const [photos, setPhotos] = useState<string[]>([]);

  // Step 4: Usage Period
  const [usagePeriod, setUsagePeriod] = useState('');
  const [usagePeriodExpanded, setUsagePeriodExpanded] = useState(true);

  // Step 5: Pros
  const [selectedPros, setSelectedPros] = useState<string[]>([]);
  const [prosText, setProsText] = useState('');
  const [prosTextCompleted, setProsTextCompleted] = useState(false);
  const [prosExpanded, setProsExpanded] = useState(true);

  // Step 6: Cons
  const [selectedCons, setSelectedCons] = useState<string[]>([]);
  const [consText, setConsText] = useState('');
  const [consTextCompleted, setConsTextCompleted] = useState(false);
  const [consExpanded, setConsExpanded] = useState(true);

  // Step 7-9: Purchase Reason, Free Review, Repurchase (shown together)
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [reasonText, setReasonText] = useState('');
  const [reasonExpanded, setReasonExpanded] = useState(true);
  const [reasonCompleted, setReasonCompleted] = useState(false);
  const [freeReview, setFreeReview] = useState('');
  const [repurchaseIntent, setRepurchaseIntent] = useState('');
  const [repurchaseExpanded, setRepurchaseExpanded] = useState(true);

  // Step 10: Skin Info
  const [skinType, setSkinType] = useState('');
  const [skinTone, setSkinTone] = useState('');
  const [personalColor, setPersonalColor] = useState('');
  const [skinConcerns, setSkinConcerns] = useState<string[]>([]);

  // Dropdown states
  const [skinTypeOpen, setSkinTypeOpen] = useState(false);
  const [skinToneOpen, setSkinToneOpen] = useState(false);
  const [personalColorOpen, setPersonalColorOpen] = useState(false);
  const [skinConcernsOpen, setSkinConcernsOpen] = useState(false);

  // Progress tracking
  const [completedSteps, setCompletedSteps] = useState(0);

  const usagePeriodOptions = ['1주미만', '1주~1개월', '1~3개월', '3~6개월', '6개월 이상'];
  const prosOptions = ['보습력 좋음', '흡수력 좋음', '흡수 빠름', '자극 없음', '향 좋음', '지속력 좋음', '가성비 좋음', '기타', '없음'];
  const consOptions = ['보습력 아쉬움', '흡수력 아쉬움', '자극 있음', '향 아쉬움', '지속력 아쉬움', '가성비 아쉬움', '기타', '없음'];
  const reasonOptions = ['피부고민', '신제품', '추천받아서', '지인추천', '광고', '기타'];
  const repurchaseOptions = [
    { label: '다시 구매할래요', icon: <ThumbsUp className="size-[16px]" /> },
    { label: '잘모르겠어요', icon: <Meh className="size-[16px]" /> },
    { label: '안 살 것 같아요', icon: <ThumbsDown className="size-[16px]" /> },
  ];
  const skinTypeOptions = ['중성', '건성', '지성', '민감성', '복합성', '수부지'];
  const skinToneOptions = ['13호', '17호', '19호', '21호', '23호', '25호'];
  const personalColorOptions = ['봄 웜톤', '여름 쿨톤', '가을 웜톤', '겨울 쿨톤'];
  const skinConcernOptions = [
    '미백', '여드름(트러블)', '피부결', '홍조', '탄력저하/주름', '약건성',
    '다크서클', '잡티(기미,주근깨)', '모공/홈터', '유분', '블랙헤드/피지',
  ];

  // Auto-scroll when new sections appear
  useEffect(() => {
    if (selectedProduct && rating > 0) {
      setTimeout(() => {
        photoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    }
  }, [rating]);

  useEffect(() => {
    if (photos.length >= 2) {
      setTimeout(() => {
        usagePeriodRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    }
  }, [photos.length]);

  useEffect(() => {
    if (usagePeriod) {
      setTimeout(() => {
        prosRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    }
  }, [usagePeriod]);


  // Filter products based on search query
  const filteredProducts = mockProducts.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setShowSearchResults(false);
    setSearchQuery('');
    setCompletedSteps(1);
    setTimeout(() => {
      ratingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  };

  const handleRemoveProduct = () => {
    setSelectedProduct(null);
    setRating(0);
    setPhotos([]);
    setUsagePeriod('');
    setUsagePeriodExpanded(true);
    setSelectedPros([]);
    setProsText('');
    setProsTextCompleted(false);
    setProsExpanded(true);
    setSelectedCons([]);
    setConsText('');
    setConsTextCompleted(false);
    setConsExpanded(true);
    setSelectedReasons([]);
    setReasonText('');
    setReasonExpanded(true);
    setReasonCompleted(false);
    setFreeReview('');
    setRepurchaseIntent('');
    setRepurchaseExpanded(true);
    setCompletedSteps(0);
  };

  const handleRatingClick = (value: number) => {
    setRating(value);
    if (completedSteps < 2) setCompletedSteps(2);
  };

  const getRatingText = (stars: number) => {
    switch (stars) {
      case 1: return '별로예요';
      case 2: return '그냥 그래요';
      case 3: return '보통이에요';
      case 4: return '좋아요';
      case 5: return '최고예요';
      default: return '별점을 선택해주세요';
    }
  };

  const handlePhotoAdd = () => {
    const newPhotos = [...photos, `photo-${photos.length + 1}`];
    setPhotos(newPhotos);
    if (newPhotos.length >= 2 && completedSteps < 3) {
      setCompletedSteps(3);
    }
  };

  const handlePhotoRemove = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
    if (newPhotos.length < 2) {
      setUsagePeriod('');
      setUsagePeriodExpanded(true);
      setSelectedPros([]);
      setProsText('');
      setProsTextCompleted(false);
      setProsExpanded(true);
      setSelectedCons([]);
      setConsText('');
      setConsTextCompleted(false);
      setConsExpanded(true);
      setSelectedReasons([]);
      setReasonText('');
      setReasonExpanded(true);
      setReasonCompleted(false);
      setFreeReview('');
      setRepurchaseIntent('');
      setRepurchaseExpanded(true);
      setCompletedSteps(2);
    }
  };

  const handleUsagePeriodSelect = (period: string) => {
    setUsagePeriod(period);
    setUsagePeriodExpanded(false);
    if (completedSteps < 4) setCompletedSteps(4);
    // 좋았던 점으로 스크롤
    setTimeout(() => {
      prosRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  };

  const handleProsToggle = (option: string) => {
    if (selectedPros.includes(option)) {
      setSelectedPros(selectedPros.filter(p => p !== option));
    } else {
      const next = [...selectedPros, option];
      setSelectedPros(next);
      if (next.length === 1) {
        setTimeout(() => {
          prosTextareaRef.current?.focus();
          prosTextareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    }
  };

  const handleProsTextBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    if (selectedPros.length > 0 && e.target.value.trim().length >= 70) {
      setProsTextCompleted(true);
      if (completedSteps < 5) setCompletedSteps(5);
      setTimeout(() => {
        consRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 300);
    }
  };

  const handleConsToggle = (option: string) => {
    if (selectedCons.includes(option)) {
      setSelectedCons(selectedCons.filter(c => c !== option));
    } else {
      const next = [...selectedCons, option];
      setSelectedCons(next);
      if (next.length === 1) {
        setTimeout(() => {
          consTextareaRef.current?.focus();
          consTextareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    }
  };

  const handleConsTextBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    if (selectedCons.length > 0 && e.target.value.trim().length >= 20) {
      setConsTextCompleted(true);
      if (completedSteps < 6) setCompletedSteps(6);
      setTimeout(() => {
        reasonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 300);
    }
  };

  const handleReasonToggle = (option: string) => {
    if (selectedReasons.includes(option)) {
      setSelectedReasons(selectedReasons.filter(r => r !== option));
    } else {
      const next = [...selectedReasons, option];
      setSelectedReasons(next);
      if (completedSteps < 6) setCompletedSteps(6);
      if (next.length === 1) {
        setTimeout(() => {
          reasonTextareaRef.current?.focus();
          reasonTextareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    }
  };

  const handleRepurchaseSelect = (option: string) => {
    setRepurchaseIntent(option);
    setRepurchaseExpanded(false);
    if (completedSteps < 7) setCompletedSteps(7);
    setTimeout(() => {
      if (skinInfoRef.current) {
        const rect = skinInfoRef.current.getBoundingClientRect();
        const isCompletelyHidden = rect.top >= window.innerHeight || rect.bottom <= 0;
        if (isCompletelyHidden) {
          skinInfoRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    }, 300);
  };

  const handleSkinConcernToggle = (concern: string) => {
    if (skinConcerns.includes(concern)) {
      setSkinConcerns(skinConcerns.filter(c => c !== concern));
    } else {
      setSkinConcerns([...skinConcerns, concern]);
    }
  };

  const formatTags = (items: string[]) => {
    if (items.length === 0) return '';
    if (items.length === 1) return items[0];
    return `${items[0]} 외 ${items.length - 1}개`;
  };

  const coinCount =
    (selectedProduct ? 50 : 0) +
    (rating > 0 ? 50 : 0) +
    (photos.length >= 2 ? 50 : 0) +
    (usagePeriod ? 30 : 0) +
    (selectedPros.length > 0 ? 20 : 0) +
    (prosText.trim().length >= 70 ? 80 : 0) +
    (selectedCons.length > 0 ? 20 : 0) +
    (consText.trim().length >= 20 ? 50 : 0) +
    (selectedReasons.length > 0 ? 20 : 0) +
    (reasonText.trim().length >= 70 ? 80 : 0) +
    (repurchaseIntent ? 50 : 0);
  const progress = (coinCount / 500) * 100;
  const canSubmit = !!(selectedProduct && rating > 0 && photos.length >= 2 && selectedPros.length > 0 && prosText.trim());

  return (
    <div className="bg-white relative w-full min-h-screen max-w-[360px] mx-auto overflow-y-auto">
      {/* Status bar */}
      <div className="fixed bg-white h-[24px] left-1/2 -translate-x-1/2 top-0 w-full max-w-[360px] z-50">
        <StatusBar />
      </div>

      {/* Header */}
      <div className="fixed bg-white h-[50px] left-1/2 -translate-x-1/2 top-[24px] w-full max-w-[360px] z-50">
        <div className="absolute left-[16px] size-[24px] top-[13px] cursor-pointer" onClick={() => navigate('/')}>
          <BackIcon />
        </div>
        <p className="absolute left-1/2 -translate-x-1/2 font-['Pretendard'] font-medium text-[16px] leading-[24px] text-black top-[13px]">
          리뷰 작성
        </p>
      </div>

      {/* Progress Bar - Below Header */}
      <div className="fixed bg-white left-1/2 -translate-x-1/2 top-[74px] w-full max-w-[360px] z-40 border-b border-[#f0f0f0] pt-[8px] pb-[10px] px-[16px]">
        <div className="flex gap-[8px] items-center mb-[4px]">
          <div className="flex-1 h-[4px] bg-[#e5e5e5] rounded-[24px] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="h-full bg-[#ffb80a] rounded-[24px]"
            />
          </div>
          <div className="flex items-center gap-[2px] shrink-0">
            <CashIcon />
            <p className="font-['Pretendard'] font-bold text-[13px] leading-[18px]">
              <RollingNumber value={coinCount} className="text-[#ff9008]" />
              <span className="font-medium text-[12px] text-[#999]">/500</span>
            </p>
          </div>
        </div>
        <p className="font-['Pretendard'] text-[12px] leading-[14px] text-[#555]">
          리뷰 작성 완료 후 검수 완료 시 캐시가 지급됩니다
        </p>
      </div>

      {/* Main Content - Scrollable */}
      <div className="pt-[122px] pb-[240px] px-[16px]">

        {/* Step 1: Product Search */}
        {!selectedProduct && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-[0px] mt-[0px] mb-[17px]"
          >
            <h1 className="font-['Pretendard'] font-bold text-[20px] leading-[28px] text-black px-[0px] pt-[40px] pb-[12px] m-[0px]">
              어떤 제품에 대한<br />후기를 작성하시나요?
            </h1>

            <div className="relative">
              <div className="bg-white rounded-[8px] border border-[#e5e5e5] flex items-center gap-[10px] p-[12px] focus-within:border-[#333] transition-colors">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchResults(e.target.value.length > 0);
                  }}
                  onFocus={() => setShowSearchResults(searchQuery.length > 0)}
                  placeholder="제품명을 검색해 주세요"
                  className="flex-1 font-['Pretendard'] text-[14px] leading-[20px] text-[#333] outline-none placeholder:text-[#999]"
                />
                <Search className="size-[24px] text-[#333]" />
              </div>

              {/* Search Results */}
              <AnimatePresence>
                {showSearchResults && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-[52px] left-0 right-0 bg-white rounded-[8px] border border-[#ddd] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.04)] max-h-[282px] overflow-y-auto z-10"
                  >
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleProductSelect(product)}
                          className="w-full flex items-center gap-[12px] px-[16px] py-[12px] hover:bg-[#fafafa] transition-colors border-b border-[#ececec] last:border-b-0"
                        >
                          <div className="size-[52px] bg-[#f5f5f5] rounded-[8px] flex items-center justify-center overflow-hidden">
                            <img src={product.image} alt={product.name} className="size-full object-cover" />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="font-['Pretendard'] text-[13px] leading-[18px] text-[#777]">{product.brand}</p>
                            <p className="font-['Pretendard'] font-medium text-[15px] leading-[22px] text-[#333]">{product.name}</p>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="py-[40px] px-[16px] text-center">
                        <p className="font-['Pretendard'] font-medium text-[15px] leading-[22px] text-[#333] mb-[24px]">
                          찾으시는 상품이 없나요?
                        </p>
                        <p className="font-['Pretendard'] text-[13px] leading-[18px] text-[#666] mb-[16px]">
                          제품이 등록되어 있지 않으면 리뷰 작성이 어려워요<br />
                          제품을 등록해주시면 빠른검토 후<br />
                          등록이 되면 알림을 보내드릴게요!
                        </p>
                        <button className="bg-white border border-[#e5e5e5] rounded-[8px] px-[12px] py-[10px] font-['Pretendard'] font-medium text-[14px] leading-[20px] text-[#555]">
                          상품 등록 요청하기
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Selected Product Card */}
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-[24px]"
          >
            <div className="bg-[#fafafa] border border-[#ececec] rounded-[8px] flex items-center gap-[12px] px-[12px] py-[10px] mx-[0px] mt-[16px] mb-[0px]">
              <div className="size-[52px] bg-white rounded-[8px] overflow-hidden">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="size-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="font-['Pretendard'] text-[13px] leading-[18px] text-[#999]">{selectedProduct.brand}</p>
                <p className="font-['Pretendard'] font-medium text-[15px] leading-[22px] text-[#333]">{selectedProduct.name}</p>
              </div>
              <button onClick={handleRemoveProduct} className="size-[20px]">
                <X className="size-full text-[#777]" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Rating */}
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-[32px]"
            ref={ratingRef}
          >
            <p className={`font-['Pretendard'] font-bold leading-[24px] mb-[18px] text-center text-[18px] ${rating > 0 ? 'text-[#FF5542]' : 'text-[#666666]'}`}>
              {getRatingText(rating)}
            </p>
            <div className="flex items-center justify-center gap-[8px]">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => handleRatingClick(value)}
                  onMouseEnter={() => setHoverRating(value)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="size-[40px] transition-transform hover:scale-110"
                >
                  <Star
                    className="size-full"
                    fill={(hoverRating || rating) >= value ? '#FF5542' : '#e5e5e5'}
                    stroke="none"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 3: Photos */}
        {rating > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-[32px]"
            ref={photoRef}
          >
            <p className="font-['Pretendard'] font-bold leading-[24px] text-black mb-[4px] text-[18px]">
              사진 첨부
            </p>
            <p className="font-['Pretendard'] leading-[20px] text-[#777] mb-[16px] text-[14px]">
              최소 2장 이상의 사진을 올려주세요
            </p>
            <div className="flex gap-[12px] overflow-x-auto overflow-y-visible pb-[4px] pt-[6px]" style={{ scrollbarWidth: 'none' }}>
              {/* 추가 버튼 - 항상 맨 앞 고정 */}
              {photos.length < 10 && (
                <button
                  onClick={handlePhotoAdd}
                  className="shrink-0 size-[84px] bg-white border border-dashed border-[#ccc] rounded-[13px] flex flex-col items-center justify-center gap-[4px] hover:bg-[#fafafa] transition-colors"
                >
                  <Plus className="size-[24px] text-[#777]" />
                  <p className="font-['Pretendard'] text-[14px] text-[#777]">
                    {photos.length}/10
                  </p>
                </button>
              )}
              {/* 추가된 사진들 */}
              {photos.map((_, index) => (
                <div key={index} className="relative shrink-0 size-[84px] bg-[#f5f5f5] rounded-[13px]">
                  <button
                    onClick={() => handlePhotoRemove(index)}
                    className="absolute -top-[6px] -right-[6px] size-[20px] bg-[#333] rounded-full flex items-center justify-center z-10"
                  >
                    <X className="size-[12px] text-white" />
                  </button>
                  <div className="size-full bg-gradient-to-br from-[#f0f0f0] to-[#e0e0e0] rounded-[13px] flex items-center justify-center">
                    <span className="font-['Pretendard'] text-[11px] text-[#aaa]">사진 {index + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 4: 상세 리뷰 타이틀 + Usage Period */}
        {photos.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-[16px]"
            ref={usagePeriodRef}
          >
            <p className="font-['Pretendard'] font-bold text-[18px] leading-[24px] text-black mb-[2px]">
              상세 리뷰
            </p>
            <p className="font-['Pretendard'] text-[14px] leading-[20px] text-[#777] mb-[12px]">
              실제 사용 경험 이야기를 들려주세요
            </p>

            {/* 사용 기간 카드 - 단일 카드로 접힘/펼침 */}
            <motion.div
              layout
              onClick={() => usagePeriod && setUsagePeriodExpanded(v => !v)}
              className="relative rounded-[12px] overflow-hidden cursor-pointer"
              style={{
                backgroundColor: usagePeriodExpanded ? '#fafafa' : '#ffffff',
                boxShadow: !usagePeriodExpanded && usagePeriod ? 'inset 0 0 0 1px #e5e5e5' : 'none',
              }}
              transition={{ layout: { type: 'spring', stiffness: 350, damping: 30 } }}
            >
              <motion.div layout className="px-[16px] pt-[20px] pb-[16px] flex flex-col items-center gap-[8px]">
                <p className="font-['Pretendard'] font-bold text-[15px] leading-[22px] text-[#555] text-center">
                  제품 사용 기간은 어느정도인가요?
                </p>

                {/* 접힌 상태: 선택값 표시 */}
                <AnimatePresence>
                  {usagePeriod && !usagePeriodExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden flex items-center gap-[6px]"
                    >
                      <p className="font-['Pretendard'] font-bold text-[18px] leading-[20px] text-[#ea4619]">
                        {usagePeriod}
                      </p>
                      <div className="bg-[#ececec] rounded-[4px] size-[20px] flex items-center justify-center">
                        <ChevronDown className="size-[14px] text-[#555]" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 펼친 상태: 전체 태그 */}
                <AnimatePresence>
                  {usagePeriodExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden w-full"
                      onClick={e => e.stopPropagation()}
                    >
                      <div className="flex flex-wrap gap-[8px] justify-center pt-[4px]">
                        {usagePeriodOptions.map((option) => (
                          <button
                            key={option}
                            onClick={() => handleUsagePeriodSelect(option)}
                            className={`px-[12px] py-[7px] rounded-[22px] border transition-colors font-['Pretendard'] text-[14px] leading-[20px] ${
                              usagePeriod === option
                                ? 'bg-[#fff2ee] border-[#FF5542] text-[#FF5542] font-bold'
                                : 'bg-white border-[#ddd] text-[#555] font-medium'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

            </motion.div>
          </motion.div>
        )}

        {/* Step 5: 좋았던 점 */}
        {usagePeriod && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-[16px]"
            ref={prosRef}
          >
            <CollapsibleCard
              question="사용하면서 좋았던 점은 무엇인가요?"
              expanded={prosExpanded}
              selectedSummary={formatTags(selectedPros)}
              onToggle={() => prosTextCompleted || selectedPros.length > 0 ? setProsExpanded(v => !v) : undefined}
              canCollapse={selectedPros.length > 0}
            >
              <div className="flex flex-wrap gap-[8px] justify-center">
                {prosOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleProsToggle(option)}
                    className={`px-[12px] py-[7px] rounded-[22px] border transition-colors font-['Pretendard'] text-[13px] leading-[18px] ${
                      selectedPros.includes(option)
                        ? 'bg-[#fff2ee] border-[#FF5542] text-[#FF5542] font-bold'
                        : 'bg-white border-[#ddd] text-[#555] font-medium'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <AnimatePresence>
                {selectedPros.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="mt-[16px] mb-[16px] h-px bg-[#ececec]" />
                    <p className="font-['Pretendard'] font-bold text-[15px] leading-[22px] text-[#555] mb-[12px] text-center">
                      어떤 상황에서 사용했고, 어떤 점이 좋았나요?
                    </p>
                    <textarea
                      ref={prosTextareaRef}
                      placeholder="아침 / 화장 전 / 외출 후 등 상황과 느낌을 함께 적어주세요"
                      value={prosText}
                      onChange={(e) => {
                        setProsText(e.target.value);
                        if (selectedPros.length > 0 && e.target.value.trim().length >= 70 && !prosTextCompleted) {
                          setProsTextCompleted(true);
                          if (completedSteps < 5) setCompletedSteps(5);
                          setTimeout(() => { consRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 300);
                        }
                      }}
                      onBlur={(e) => handleProsTextBlur(e)}
                      className="w-full bg-white rounded-[8px] border border-[#ececec] px-[12px] py-[12px] font-['Pretendard'] text-[15px] leading-[22px] text-[#333] outline-none placeholder:text-[#999] focus:border-[#333] transition-colors min-h-[68px] resize-none"
                    />
                    {prosText.length >= 70 ? (
                      <p className="flex items-center gap-[4px] font-['Pretendard'] text-[13px] mt-[4px] text-[#35B275]">
                        <CheckCircle2 className="size-[14px] shrink-0" />
                        최소 글자 수를 충족했어요
                      </p>
                    ) : (
                      <p className="font-['Pretendard'] text-[13px] mt-[4px] text-[#999]">
                        자세히 적어주시면 도움이 돼요 <span className="text-[#ff5527]">({prosText.length}/70)</span>
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </CollapsibleCard>
          </motion.div>
        )}

        {/* Step 6: 아쉬웠던 점 */}
        {prosTextCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-[16px]"
            ref={consRef}
          >
            <CollapsibleCard
              question="사용하면서 아쉬웠던 점은 무엇인가요?"
              expanded={consExpanded}
              selectedSummary={formatTags(selectedCons)}
              onToggle={() => selectedCons.length > 0 ? setConsExpanded(v => !v) : undefined}
              canCollapse={selectedCons.length > 0}
            >
              <div className="flex flex-wrap gap-[8px] justify-center">
                {consOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleConsToggle(option)}
                    className={`px-[12px] py-[7px] rounded-[22px] border transition-colors font-['Pretendard'] text-[13px] leading-[18px] ${
                      selectedCons.includes(option)
                        ? 'bg-[#fff2ee] border-[#FF5542] text-[#FF5542] font-bold'
                        : 'bg-white border-[#ddd] text-[#555] font-medium'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <AnimatePresence>
                {selectedCons.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="mt-[16px] mb-[16px] h-px bg-[#ececec]" />
                    <p className="font-['Pretendard'] font-bold text-[15px] leading-[22px] text-[#555] mb-[12px] text-center">
                      어떤 상황에서 불편했고, 어떤 점이 아쉬웠나요?
                    </p>
                    <textarea
                      ref={consTextareaRef}
                      placeholder="사용 중 불편했던 순간이나 개선됐으면 하는 점을 적어주세요"
                      value={consText}
                      onChange={(e) => {
                        setConsText(e.target.value);
                        if (selectedCons.length > 0 && e.target.value.trim().length >= 20 && !consTextCompleted) {
                          setConsTextCompleted(true);
                          if (completedSteps < 6) setCompletedSteps(6);
                          setTimeout(() => { reasonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 300);
                        }
                      }}
                      onBlur={(e) => handleConsTextBlur(e)}
                      className="w-full bg-white rounded-[8px] border border-[#ececec] px-[12px] py-[12px] font-['Pretendard'] text-[15px] leading-[22px] text-[#333] outline-none placeholder:text-[#999] focus:border-[#333] transition-colors min-h-[68px] resize-none"
                    />
                    {consText.length >= 20 ? (
                      <p className="flex items-center gap-[4px] font-['Pretendard'] text-[13px] mt-[4px] text-[#35B275]">
                        <CheckCircle2 className="size-[14px] shrink-0" />
                        최소 글자 수를 충족했어요
                      </p>
                    ) : (
                      <p className="font-['Pretendard'] text-[13px] mt-[4px] text-[#999]">
                        자세히 적어주시면 도움이 돼요 <span className="text-[#ff5527]">({consText.length}/20)</span>
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </CollapsibleCard>
          </motion.div>
        )}

        {/* Step 7: 사용 계기 */}
        {consTextCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-[16px]"
            ref={reasonRef}
          >
            <CollapsibleCard
              question="이 제품의 사용 경로는 무엇인가요?"
              expanded={reasonExpanded}
              selectedSummary={formatTags(selectedReasons)}
              onToggle={() => selectedReasons.length > 0 ? setReasonExpanded(v => !v) : undefined}
              canCollapse={selectedReasons.length > 0}
            >
              <div className="flex flex-wrap gap-[8px] justify-center">
                {reasonOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleReasonToggle(option)}
                    className={`px-[12px] py-[7px] rounded-[22px] border transition-colors font-['Pretendard'] text-[13px] leading-[18px] ${
                      selectedReasons.includes(option)
                        ? 'bg-[#fff2ee] border-[#FF5542] text-[#FF5542] font-bold'
                        : 'bg-white border-[#ddd] text-[#555] font-medium'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <AnimatePresence>
                {selectedReasons.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="mt-[16px] mb-[16px] h-px bg-[#ececec]" />
                    <p className="font-['Pretendard'] font-bold text-[15px] leading-[22px] text-[#555] mb-[12px] text-center">
                      어떤 계기로 이 제품을 알게 됐나요?
                    </p>
                    <textarea
                      ref={reasonTextareaRef}
                      placeholder="추천받은 채널, 광고, 지인 등 구체적인 계기를 적어주세요"
                      value={reasonText}
                      onChange={(e) => {
                        setReasonText(e.target.value);
                        if (selectedReasons.length > 0 && e.target.value.trim().length >= 70 && !reasonCompleted) {
                          setReasonCompleted(true);
                        }
                      }}
                      onBlur={(e) => {
                        if (selectedReasons.length > 0 && e.target.value.trim().length >= 70) {
                          setReasonCompleted(true);
                        }
                      }}
                      className="w-full bg-white rounded-[8px] border border-[#ececec] px-[12px] py-[12px] font-['Pretendard'] text-[15px] leading-[22px] text-[#333] outline-none placeholder:text-[#999] focus:border-[#333] transition-colors min-h-[68px] resize-none"
                    />
                    {reasonText.length >= 70 ? (
                      <p className="flex items-center gap-[4px] font-['Pretendard'] text-[13px] mt-[4px] text-[#35B275]">
                        <CheckCircle2 className="size-[14px] shrink-0" />
                        최소 글자 수를 충족했어요
                      </p>
                    ) : (
                      <p className="font-['Pretendard'] text-[13px] mt-[4px] text-[#999]">
                        자세히 적어주시면 도움이 돼요 <span className="text-[#ff5527]">({reasonText.length}/70)</span>
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </CollapsibleCard>
          </motion.div>
        )}

        {/* Step 8: 자유 리뷰 - 접힘 없음 */}
        {reasonCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-[16px]"
          >
            <div className="bg-[#fafafa] rounded-[12px] px-[16px] pt-[20px] pb-[16px] flex flex-col gap-[12px]">
              <p className="font-['Pretendard'] font-bold text-[15px] leading-[22px] text-[#555] text-center">
                더 하실 말씀이 있으신가요? <span className="font-normal text-[#999]">(선택)</span>
              </p>
              <textarea
                placeholder="자유롭게 리뷰를 작성해주세요"
                value={freeReview}
                onChange={(e) => setFreeReview(e.target.value)}
                onFocus={(e) => setTimeout(() => e.target.scrollIntoView({ behavior: 'smooth', block: 'center' }), 200)}
                className="w-full bg-white rounded-[8px] border border-[#e5e5e5] px-[12px] py-[12px] font-['Pretendard'] text-[14px] leading-[20px] text-[#333] outline-none placeholder:text-[#999] focus:border-[#333] transition-colors min-h-[100px] resize-none"
              />
              <p className="font-['Pretendard'] text-[12px] text-[#999] text-right -mt-[8px]">{freeReview.length}/300</p>
            </div>
          </motion.div>
        )}

        {/* Step 9: 재구매 의향 - 아이콘+텍스트 태그, 접힘 없음 */}
        {reasonCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-[16px]"
          >
            <div className="bg-[#fafafa] rounded-[12px] px-[16px] pt-[20px] pb-[16px] flex flex-col gap-[12px]">
              <p className="font-['Pretendard'] font-bold text-[15px] leading-[22px] text-[#555] text-center">
                이 제품을 재구매 할 의향이 있으신가요?
              </p>
              <div className="flex flex-wrap gap-[8px] justify-center">
                {repurchaseOptions.map(({ label, icon }) => (
                  <button
                    key={label}
                    onClick={() => handleRepurchaseSelect(label)}
                    className={`flex items-center gap-[4px] px-[12px] py-[7px] rounded-[22px] border transition-colors font-['Pretendard'] text-[14px] leading-[20px] ${
                      repurchaseIntent === label
                        ? 'bg-[#fff2ee] border-[#FF5542] text-[#FF5542] font-bold'
                        : 'bg-white border-[#ddd] text-[#555] font-medium'
                    }`}
                  >
                    {icon}
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 10: Skin Info */}
        {reasonCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-[32px] border-t border-[#f0f0f0] pt-[32px]"
            ref={skinInfoRef}
          >
            <p className="font-['Pretendard'] font-bold text-[16px] leading-[24px] text-black mb-[4px]">
              내 피부 정보
            </p>
            <p className="font-['Pretendard'] text-[13px] leading-[20px] text-[#999] mb-[20px]">
              피부 정보를 등록하면 더 정확한 추천을 받을 수 있어요
            </p>

            {/* Skin Type Dropdown */}
            <div className="mb-[10px] bg-white border border-[#e5e5e5] rounded-[20px] px-[20px]">
              <button
                onClick={() => setSkinTypeOpen(!skinTypeOpen)}
                className="w-full py-[12px] flex items-center justify-between"
              >
                <span className="font-['Pretendard'] text-[14px] leading-[20px] text-[#777]">피부 타입</span>
                <div className="flex items-center gap-[6px]">
                  {skinType && <span className="font-['Pretendard'] font-bold text-[14px] leading-[20px] text-[#555]">{skinType}</span>}
                  <ChevronDown className={`size-[18px] text-[#999] transition-transform duration-200 ${skinTypeOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>
              <div style={{ display: 'grid', gridTemplateRows: skinTypeOpen ? '1fr' : '0fr', transition: 'grid-template-rows 0.25s cubic-bezier(0.4,0,0.2,1)' }}>
                <div style={{ overflow: 'hidden', minHeight: 0 }}>
                  <div className="pb-[14px] flex flex-wrap gap-[8px]">
                    {skinTypeOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => { setSkinType(option); setSkinTypeOpen(false); }}
                        className={`px-[14px] py-[7px] rounded-[33px] border transition-all font-['Pretendard'] text-[13px] leading-[18px] ${
                          skinType === option
                            ? 'bg-[#fff2ee] border-[#FF5542] text-[#FF5542] font-bold'
                            : 'bg-white border-[#e5e5e5] text-[#666] font-medium'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Skin Tone Dropdown */}
            <div className="mb-[10px] bg-white border border-[#e5e5e5] rounded-[20px] px-[20px]">
              <button
                onClick={() => setSkinToneOpen(!skinToneOpen)}
                className="w-full py-[12px] flex items-center justify-between"
              >
                <span className="font-['Pretendard'] text-[14px] leading-[20px] text-[#777]">피부톤</span>
                <div className="flex items-center gap-[6px]">
                  {skinTone && <span className="font-['Pretendard'] font-bold text-[14px] leading-[20px] text-[#555]">{skinTone}</span>}
                  <ChevronDown className={`size-[18px] text-[#999] transition-transform duration-200 ${skinToneOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>
              <div style={{ display: 'grid', gridTemplateRows: skinToneOpen ? '1fr' : '0fr', transition: 'grid-template-rows 0.25s cubic-bezier(0.4,0,0.2,1)' }}>
                <div style={{ overflow: 'hidden', minHeight: 0 }}>
                  <div className="pb-[14px] flex flex-wrap gap-[8px]">
                    {skinToneOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => { setSkinTone(option); setSkinToneOpen(false); }}
                        className={`px-[14px] py-[7px] rounded-[33px] border transition-all font-['Pretendard'] text-[13px] leading-[18px] ${
                          skinTone === option
                            ? 'bg-[#fff2ee] border-[#FF5542] text-[#FF5542] font-bold'
                            : 'bg-white border-[#e5e5e5] text-[#666] font-medium'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Color Dropdown */}
            <div className="mb-[10px] bg-white border border-[#e5e5e5] rounded-[20px] px-[20px]">
              <button
                onClick={() => setPersonalColorOpen(!personalColorOpen)}
                className="w-full py-[12px] flex items-center justify-between"
              >
                <span className="font-['Pretendard'] text-[14px] leading-[20px] text-[#777]">퍼스널컬러</span>
                <div className="flex items-center gap-[6px]">
                  {personalColor && <span className="font-['Pretendard'] font-bold text-[14px] leading-[20px] text-[#555]">{personalColor}</span>}
                  <ChevronDown className={`size-[18px] text-[#999] transition-transform duration-200 ${personalColorOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>
              <div style={{ display: 'grid', gridTemplateRows: personalColorOpen ? '1fr' : '0fr', transition: 'grid-template-rows 0.25s cubic-bezier(0.4,0,0.2,1)' }}>
                <div style={{ overflow: 'hidden', minHeight: 0 }}>
                  <div className="pb-[14px] flex flex-wrap gap-[8px]">
                    {personalColorOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => { setPersonalColor(option); setPersonalColorOpen(false); }}
                        className={`px-[14px] py-[7px] rounded-[33px] border transition-all font-['Pretendard'] text-[13px] leading-[18px] ${
                          personalColor === option
                            ? 'bg-[#fff2ee] border-[#FF5542] text-[#FF5542] font-bold'
                            : 'bg-white border-[#e5e5e5] text-[#666] font-medium'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Skin Concerns Dropdown */}
            <div className="mb-[20px] bg-white border border-[#e5e5e5] rounded-[20px] px-[20px]">
              <button
                onClick={() => setSkinConcernsOpen(!skinConcernsOpen)}
                className="w-full py-[12px] flex items-center justify-between"
              >
                <span className="font-['Pretendard'] text-[14px] leading-[20px] text-[#777]">피부 고민</span>
                <div className="flex items-center gap-[6px]">
                  {skinConcerns.length > 0 && (
                    <span className="font-['Pretendard'] font-bold text-[14px] leading-[20px] text-[#555]">
                      {skinConcerns.length === 1 ? skinConcerns[0] : `${skinConcerns[0]} 외 ${skinConcerns.length - 1}개`}
                    </span>
                  )}
                  <ChevronDown className={`size-[18px] text-[#999] transition-transform duration-200 ${skinConcernsOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>
              <div style={{ display: 'grid', gridTemplateRows: skinConcernsOpen ? '1fr' : '0fr', transition: 'grid-template-rows 0.25s cubic-bezier(0.4,0,0.2,1)' }}>
                <div style={{ overflow: 'hidden', minHeight: 0 }}>
                  <div className="pb-[14px] flex flex-wrap gap-[8px]">
                    {skinConcernOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleSkinConcernToggle(option)}
                        className={`px-[14px] py-[7px] rounded-[33px] border transition-all font-['Pretendard'] text-[13px] leading-[18px] ${
                          skinConcerns.includes(option)
                            ? 'bg-[#fff2ee] border-[#FF5542] text-[#FF5542] font-bold'
                            : 'bg-white border-[#e5e5e5] text-[#666] font-medium'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Reset Button */}
            <div className="flex justify-center">
              <button
                onClick={() => { setSkinType(''); setSkinTone(''); setPersonalColor(''); setSkinConcerns([]); }}
                className="flex items-center gap-[6px] px-[16px] py-[10px] font-['Pretendard'] text-[13px] leading-[18px] text-[#999]"
              >
                <RotateCcw className="size-[14px]" />
                선택 초기화
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom Fixed Progress & Submit */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[360px] bg-white">
        <div className="border-t border-[#ececec] pt-[12px] px-[16px] pb-[16px]">
          <button
            disabled={!canSubmit}
            className={`w-full rounded-[8px] px-[16px] py-[14px] transition-all ${
              canSubmit
                ? 'bg-[#FF5542] hover:bg-[#e64d3a] active:scale-[0.98]'
                : 'bg-[#e5e5e5] cursor-not-allowed'
            }`}
          >
            <p className={`font-['Pretendard'] font-bold text-[16px] leading-[24px] ${canSubmit ? 'text-white' : 'text-[#999]'}`}>
              입력 완료 하기
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}

// 공통 접힘/펼침 카드 컴포넌트
function CollapsibleCard({
  question,
  subText,
  expanded,
  selectedSummary,
  onToggle,
  canCollapse,
  children,
}: {
  question: React.ReactNode;
  subText?: string;
  expanded: boolean;
  selectedSummary: string;
  onToggle: () => void;
  canCollapse: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      layout
      onClick={() => canCollapse && !expanded && onToggle()}
      className="relative rounded-[12px] overflow-hidden"
      style={{
        backgroundColor: expanded ? '#fafafa' : '#ffffff',
        boxShadow: !expanded && canCollapse ? 'inset 0 0 0 1px #e5e5e5' : 'none',
        cursor: !expanded && canCollapse ? 'pointer' : 'default',
      }}
      transition={{ layout: { type: 'spring', stiffness: 350, damping: 30 } }}
    >
      <motion.div layout className="px-[16px] pt-[20px] pb-[16px] flex flex-col items-center gap-[8px]">
        <p className="font-['Pretendard'] font-bold text-[15px] leading-[22px] text-[#555] text-center w-full">
          {question}
        </p>
        {subText && expanded && (
          <p className="font-['Pretendard'] text-[13px] leading-[18px] text-[#777] text-center w-full -mt-[4px]">
            {subText}
          </p>
        )}

        {/* 접힌 상태: 선택값 요약 */}
        <AnimatePresence>
          {!expanded && selectedSummary && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden flex items-center gap-[6px]"
            >
              <p className="font-['Pretendard'] font-bold text-[18px] leading-[20px] text-[#ea4619]">
                {selectedSummary}
              </p>
              <div className="bg-[#ececec] rounded-[4px] size-[20px] flex items-center justify-center">
                <ChevronDown className="size-[14px] text-[#555]" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 펼친 상태: 내용 */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex flex-col gap-[8px] pt-[4px]">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

function StatusBar() {
  const now = new Date();
  const time = now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
  return (
    <div className="flex justify-between items-center px-[16px] h-full">
      <p className="font-['Pretendard'] text-[12px] text-[#333]">{time}</p>
      <div className="flex gap-[4px] items-center">
        <div className="w-[18px] h-[12px] border border-[#333] rounded-[2px] relative">
          <div className="absolute left-[1px] top-[1px] bottom-[1px] w-[12px] bg-[#333] rounded-[1px]" />
        </div>
      </div>
    </div>
  );
}

function BackIcon() {
  return (
    <svg className="size-full" fill="none" viewBox="0 0 24 24">
      <path d="M10 6L4 12L10 18" stroke="#333333" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      <path d="M4.5 12H20" stroke="#333333" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

function RollingNumber({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prevRef = useRef(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const from = prevRef.current;
    prevRef.current = value;
    if (from === value) return;
    const controls = animate(from, value, {
      duration: 0.5,
      ease: 'easeOut',
      onUpdate: (v) => { el.textContent = Math.round(v).toString(); },
    });
    return () => controls.stop();
  }, [value]);

  return <span ref={ref} className={className}>{value}</span>;
}

function CashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7.5" fill="#FFE465" stroke="#FFC73D" strokeWidth="0.5" />
      <circle cx="8" cy="8" r="5" fill="#FFC73D" />
      <path d="M8 5V11M6 8H10" stroke="#EE8F00" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
