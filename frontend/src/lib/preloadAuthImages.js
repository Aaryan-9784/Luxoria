/**
 * Auth Image Preloader
 * 
 * Call preloadAuthImages() to begin downloading all auth page background
 * images in the background. Useful to call on hover of "Sign In" / 
 * "Register" links so images are cached by the time the user navigates.
 */

const AUTH_IMAGES = [
  'https://images.alphacoders.com/127/1271987.jpg',       // Login + Admin
  'https://www.hdcarwallpapers.com/walls/2021_rolls_royce_phantom_extended_5k_2-HD.jpg', // Register
  'https://wallpaperaccess.com/full/1125043.jpg',          // Forgot Password
  'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&q=80&w=1920', // Reset
  'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',        // Vendor Login
];

let preloaded = false;

export function preloadAuthImages() {
  if (preloaded) return;
  preloaded = true;

  AUTH_IMAGES.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}
