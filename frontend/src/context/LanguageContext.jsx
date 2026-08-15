import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

// Translation data
const translations = {
  en: {
    // Navigation
    nav: {
      home: 'Home',
      cars: 'Cars',
      compare: 'Compare',
      favorites: 'Favorites',
      configurator: 'Configurator',
      about: 'About',
      contact: 'Contact',
      login: 'Login',
      register: 'Register',
      cart: 'Cart',
    },
    // Common
    common: {
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      close: 'Close',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      submit: 'Submit',
      readMore: 'Read More',
      learnMore: 'Learn More',
    },
    // Home page
    home: {
      hero: {
        title: '1M MOTORS',
        subtitle: 'LUXURY · PERFORMANCE · EXCELLENCE',
        cta: 'Explore Collection',
      },
      features: {
        quality: 'Premium Quality',
        service: '24/7 Support',
        delivery: 'Fast Delivery',
      },
    },
    // Cars page
    cars: {
      title: 'Luxury Collection',
      subtitle: 'Discover our exclusive range of premium vehicles',
      filters: {
        brand: 'Brand',
        category: 'Category',
        priceRange: 'Price Range',
        year: 'Year',
        all: 'All',
      },
      sortBy: {
        label: 'Sort By',
        newest: 'Newest',
        priceHigh: 'Price: High to Low',
        priceLow: 'Price: Low to High',
        popular: 'Most Popular',
      },
      specs: {
        horsepower: 'HP',
        topSpeed: 'Top Speed',
        acceleration: '0-60 mph',
      },
      cta: {
        viewDetails: 'View Details',
        configure: 'Configure',
        addToCart: 'Add to Cart',
      },
    },
    // Product details
    product: {
      overview: 'Overview',
      specifications: 'Specifications',
      features: 'Features',
      reviews: 'Reviews',
      price: 'Price',
      startingAt: 'Starting at',
      available: 'Available',
      outOfStock: 'Out of Stock',
      addToWishlist: 'Add to Wishlist',
      share: 'Share',
      financing: 'Financing Available',
    },
    // Loyalty
    loyalty: {
      title: 'Loyalty Rewards',
      subtitle: 'Earn points with every purchase and unlock exclusive benefits',
      points: 'Points',
      tier: 'Tier',
      benefits: 'Benefits',
      history: 'History',
      earnedPoints: 'Earned',
      redeemedPoints: 'Redeemed',
      availablePoints: 'Available Points',
      tiers: {
        bronze: 'Bronze',
        silver: 'Silver',
        gold: 'Gold',
        platinum: 'Platinum',
      },
    },
    // Notifications
    notifications: {
      title: 'Notifications',
      markAllRead: 'Mark all read',
      clearAll: 'Clear all',
      noNotifications: 'No notifications yet',
    },
    // Footer
    footer: {
      about: 'About 1M Motors',
      quickLinks: 'Quick Links',
      contact: 'Contact Us',
      followUs: 'Follow Us',
      copyright: '© 2026 1M Motors. All rights reserved.',
      terms: 'Terms of Service',
      privacy: 'Privacy Policy',
    },
  },
  ar: {
    // التنقل
    nav: {
      home: 'الرئيسية',
      cars: 'السيارات',
      compare: 'المقارنة',
      favorites: 'المفضلة',
      configurator: 'التخصيص',
      about: 'عن الشركة',
      contact: 'اتصل بنا',
      login: 'تسجيل الدخول',
      register: 'إنشاء حساب',
      cart: 'السلة',
    },
    // عام
    common: {
      search: 'بحث',
      filter: 'تصفية',
      sort: 'ترتيب',
      loading: 'جاري التحميل...',
      error: 'خطأ',
      success: 'نجاح',
      cancel: 'إلغاء',
      confirm: 'تأكيد',
      save: 'حفظ',
      delete: 'حذف',
      edit: 'تعديل',
      view: 'عرض',
      close: 'إغلاق',
      back: 'رجوع',
      next: 'التالي',
      previous: 'السابق',
      submit: 'إرسال',
      readMore: 'اقرأ المزيد',
      learnMore: 'اعرف المزيد',
    },
    // الصفحة الرئيسية
    home: {
      hero: {
        title: '1M موتورز',
        subtitle: 'الفخامة · الأداء · التميز',
        cta: 'استكشف المجموعة',
      },
      features: {
        quality: 'جودة عالية',
        service: 'دعم 24/7',
        delivery: 'توصيل سريع',
      },
    },
    // صفحة السيارات
    cars: {
      title: 'مجموعة الفخامة',
      subtitle: 'اكتشف مجموعتنا الحصرية من السيارات الفاخرة',
      filters: {
        brand: 'العلامة التجارية',
        category: 'الفئة',
        priceRange: 'نطاق السعر',
        year: 'السنة',
        all: 'الكل',
      },
      sortBy: {
        label: 'ترتيب حسب',
        newest: 'الأحدث',
        priceHigh: 'السعر: من الأعلى للأقل',
        priceLow: 'السعر: من الأقل للأعلى',
        popular: 'الأكثر شعبية',
      },
      specs: {
        horsepower: 'حصان',
        topSpeed: 'السرعة القصوى',
        acceleration: '0-100 كم/س',
      },
      cta: {
        viewDetails: 'عرض التفاصيل',
        configure: 'تخصيص',
        addToCart: 'أضف للسلة',
      },
    },
    // تفاصيل المنتج
    product: {
      overview: 'نظرة عامة',
      specifications: 'المواصفات',
      features: 'المميزات',
      reviews: 'التقييمات',
      price: 'السعر',
      startingAt: 'يبدأ من',
      available: 'متوفر',
      outOfStock: 'غير متوفر',
      addToWishlist: 'أضف للمفضلة',
      share: 'مشاركة',
      financing: 'التمويل متاح',
    },
    // برنامج الولاء
    loyalty: {
      title: 'مكافآت الولاء',
      subtitle: 'اكسب نقاط مع كل عملية شراء واحصل على مزايا حصرية',
      points: 'النقاط',
      tier: 'المستوى',
      benefits: 'المزايا',
      history: 'السجل',
      earnedPoints: 'المكتسبة',
      redeemedPoints: 'المستخدمة',
      availablePoints: 'النقاط المتاحة',
      tiers: {
        bronze: 'برونزي',
        silver: 'فضي',
        gold: 'ذهبي',
        platinum: 'بلاتيني',
      },
    },
    // الإشعارات
    notifications: {
      title: 'الإشعارات',
      markAllRead: 'تحديد الكل كمقروء',
      clearAll: 'مسح الكل',
      noNotifications: 'لا توجد إشعارات بعد',
    },
    // التذييل
    footer: {
      about: 'عن 1M موتورز',
      quickLinks: 'روابط سريعة',
      contact: 'اتصل بنا',
      followUs: 'تابعنا',
      copyright: '© 2026 1M موتورز. جميع الحقوق محفوظة.',
      terms: 'شروط الخدمة',
      privacy: 'سياسة الخصوصية',
    },
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    return saved || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.setAttribute('lang', language);
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');

    // Update CSS for RTL
    if (language === 'ar') {
      document.body.style.direction = 'rtl';
      document.body.style.textAlign = 'right';
    } else {
      document.body.style.direction = 'ltr';
      document.body.style.textAlign = 'left';
    }
  }, [language]);

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    return value || key;
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  const setLang = (lang) => {
    if (['en', 'ar'].includes(lang)) {
      setLanguage(lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, t, toggleLanguage, setLang, isRTL: language === 'ar' }}>
      {children}
    </LanguageContext.Provider>
  );
};
