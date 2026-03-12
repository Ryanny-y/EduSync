export const navigateBackWithDelay = (navigation: any, delay: number = 1500) => {
  setTimeout(() => {
    navigation.goBack();
  }, delay);
};
