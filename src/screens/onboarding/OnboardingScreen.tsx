import React, { useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthStore } from '@/src/modules/auth/stores/auth.store';
import { OnboardingSlideType } from '@/src/shared/types/onboarding';
import { useTheme } from '@/src/shared/use-theme';
import BackgroundCircles from '@components/ui-kit/background-circles';
import Button from '@components/ui-kit/button';
import OnboardingPagination from '@components/ui-kit/onboarding-pagination';
import OnboardingSlide from '@components/ui-kit/onboarding-slide';
import { router } from 'expo-router';
// import { BlurView } from 'expo-blur';

import imgCard1 from '@/assets/images/onboaring/bucket-onboarding.png';
import imgCard2 from '@/assets/images/onboaring/enter-onboaring.png';
import imgCard3 from '@/assets/images/onboaring/third-onboaring.png';

const { width } = Dimensions.get('window');



const OnboardingScreen: React.FC = () => {
  const { colors, fonts, weights, sizes } = useTheme();
  const { setIsFirstEnter } = useAuthStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isProgrammaticScroll, setIsProgrammaticScroll] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const styles = getStyles(colors);

  const slides: OnboardingSlideType[] = [
    {
      id: 1,
      title: 'Добро пожаловать\nв Чисто дома',
      description: 'Быстрый вынос мусора\nи управление подписками',
      image: imgCard1,
    },
    {
      id: 2,
      title: 'Мгновенный вынос мусора',
      description: 'Выбирайте адрес,и выносите мусор\n в пару кликов',
      image: imgCard2,
    },
    {
      id: 3,
      title: 'Управление подписками',
      description: 'Отслеживайте статус подписки\n и управляйте ею в пару кликов',
      image: imgCard3,
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      const nextSlide = currentSlide + 1;
      setIsProgrammaticScroll(true);
      scrollViewRef.current?.scrollTo({ x: nextSlide * width, animated: true });
      setTimeout(() => {
        setCurrentSlide(nextSlide);
        setIsProgrammaticScroll(false);
      }, 300);
    } else {
      setIsFirstEnter(true);
      router.replace("/(auth)");
    }
  };

  const handleSkip = () => {
    setIsFirstEnter(true);
    router.replace("/(auth)");
  };

  const handleScroll = (event: any) => {
    if (isProgrammaticScroll) return;
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    if (slideIndex >= 0 && slideIndex < slides.length) {
      setCurrentSlide(slideIndex);
    }
  };



  const renderBackgroundCircles = (slide: OnboardingSlideType) => {
    return <BackgroundCircles variant={slide.image as any} />;
  };

  return (
    <View style={styles.fullScreenContainer}>

      <View style={styles.backgroundContainer}>

        {renderBackgroundCircles(slides[currentSlide])}
      </View>

      <SafeAreaView style={styles.container}>
        <View style={styles.mainContent}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            style={styles.scrollView}
          >

            {slides.map((slide, index) => (
              <View key={slide.id} style={[styles.slide, { width }]}>
                <OnboardingSlide
                  title={slide.title}
                  description={slide.description}
                  image={slide.image}
                  pagination={
                    <OnboardingPagination
                      totalSlides={slides.length}
                      currentSlide={currentSlide}
                    />
                  }
                >

                  {/* <BlurView
                    intensity={20}
                    experimentalBlurMethod="dimezisBlurView"
                    style={styles.blurOverlay}
                  /> */}
                </OnboardingSlide>

              </View>
            ))}
          </ScrollView>
          <View style={styles.bottomSection}>
            <View style={styles.buttonContainer}>
              {currentSlide < slides.length - 1 && (
                <Button
                  type="secondary"
                  onPress={handleSkip}
                  containerStyle={styles.skipButton}
                >
                  Пропустить
                </Button>
              )}

              <Button
                type="primary"
                onPress={handleNext}
                containerStyle={
                  currentSlide === slides.length - 1
                    ? styles.startButton
                    : styles.nextButton
                }
              >
                {currentSlide === slides.length - 1 ? 'Начать' : 'Далее'}
              </Button>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const getStyles = (colors: any) => StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: colors.background,
    position: 'relative',
  },
  blurOverlay: {
    zIndex: 99,

    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    top: 200,

    height: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'space-between',
    overflow: 'visible',
    position: 'relative',
  },
  scrollView: {
    flex: 1,
    overflow: 'visible',
  },
  backgroundContainer: {
    position: 'absolute',
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

  },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 1,
  },
  bottomSection: {
    paddingHorizontal: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  skipButton: {
    flex: 1,
  },
  nextButton: {
    flex: 1,
  },
  startButton: {
    flex: 1,
  },


  searchImage: {
    width: 327,
    height: 400,
    borderRadius: 40,
  },


});

export default OnboardingScreen;
