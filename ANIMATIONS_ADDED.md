# Animations Added - Framer Motion

Your marketplace now has smooth, beautiful animations throughout every section using **Framer Motion**. Here's what was added:

## 📱 Header Component Animations

- **Logo**: Scale and tap animations on hover
- **Navigation Links**: Staggered fade-in with individual link scale hover effects
- **Search Bar**: Scale animation on hover
- **Cart Badge**: Pop-in animation when items are added (uses AnimatePresence)
- **User Menu**: Scale animations on buttons and smooth dropdown
- **Mobile Menu**: Smooth height and opacity animations for open/close
- **Menu Icons**: Rotate animation between menu and close icons

```tsx
// Example: Logo animation
<motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
  Artisan
</motion.div>
```

---

## 🎨 Hero Section Animations

- **Container**: Staggered children animation
- **Title & Text**: Slide up with fade-in (20px offset)
- **Buttons**: Scale animation on hover and tap
- **Hero Image**: 
  - Initial slide-in from right with 5° rotation
  - Hover effect with slight scale and rotateY
- **Feature Cards**: 
  - Bounce in with staggered delay
  - Scale and rotate on hover
  - Icon zoom on hover

```tsx
// Feature icon animation
<motion.div whileHover={{ scale: 1.2, rotate: 10 }}>
  🎨
</motion.div>
```

---

## 🛍️ Product Card Animations

- **Card Container**: 
  - Fade in and slide up on view
  - Lift up on hover with enhanced shadow
- **Product Image**: 
  - Zoom scale on hover (1.15x)
- **Action Buttons**: 
  - Pop in with scale animation
  - Bounce heart icon when wishlisted
- **Cart Button**: 
  - Scale up on hover
  - Scale down on tap

```tsx
// Product card hover effect
<motion.div
  whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
  transition={{ duration: 0.3 }}
>
```

---

## 📊 Product Grid Animations

- **Category Filters**: 
  - Staggered scale-in from 0.8 to 1
  - Individual hover and tap animations
- **Product Grid**: 
  - Column-based stagger animation
  - Each product animates in sequence
- **Loading State**: 
  - Pulsing skeleton loaders with subtle opacity animation
- **Empty State**: 
  - Scale in animation when no products found

```tsx
// Category button animation
<motion.button
  initial={{ opacity: 0, scale: 0.8 }}
  whileInView={{ opacity: 1, scale: 1 }}
  transition={{ delay: i * 0.05 }}
  whileHover={{ scale: 1.05 }}
>
```

---

## 📑 Footer Component Animations

- **Sections**: Fade in and slide up on scroll into view
- **Section Items**: Staggered list item animations
- **Social Icons**: Scale and color change on hover
- **Links**: Slide animation on hover
- **Newsletter Box**: 
  - Fade in and slide up
  - Scale slightly on hover
  - Input focus animation
- **Subscribe Button**: Scale and tap animations

```tsx
// Footer section animation
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ delay: i * 0.1 }}
>
```

---

## 🔧 Admin Product Form Animations

- **Form Container**: Fade in and slide up
- **Form Fields**: Staggered entrance animations
- **Image Upload**: 
  - Add button with scale animations
  - Image previews fade and scale in
  - Remove buttons appear on hover with scale
  - Individual image animations with stagger
- **Submit Button**: Scale and tap animations

```tsx
// Form field animation
<motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: 0.1 }}
>
```

---

## 📦 Admin Products Page Animations

- **Page Header**: Fade in and slide down
- **Add Button**: Scale on hover and tap
- **Product Form**: 
  - AnimatePresence for smooth open/close
  - Fade and slide animations
- **Product Table**: 
  - Fade in and slide up
  - Table rows stagger in from left
  - Rating badges scale on hover
- **Action Buttons**: Scale and tap animations

```tsx
// Table row animation
<motion.tr
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: i * 0.05 }}
>
```

---

## 🎯 Common Animation Patterns Used

### 1. **Stagger Animation**
Multiple elements animate in sequence with calculated delays:
```tsx
initial={{ opacity: 0, y: 20 }}
whileInView={{ opacity: 1, y: 0 }}
transition={{ delay: i * 0.1 }}
```

### 2. **Scroll Trigger Animation**
Elements animate when they come into viewport:
```tsx
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true, amount: 0.3 }}
```

### 3. **Interactive Animations**
Elements respond to user interaction:
```tsx
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
```

### 4. **Presence Animation**
Elements animate in and out using AnimatePresence:
```tsx
<AnimatePresence>
  {isOpen && <motion.div ... />}
</AnimatePresence>
```

---

## 🚀 Performance Optimization

- Using `whileInView` with `once: true` to prevent re-rendering
- Staggering large lists to keep animations smooth
- Using `viewport={{ amount: 0.3 }}` for better performance
- GPU-accelerated transforms (scale, rotate, opacity)

---

## 🎮 User Experience Benefits

1. **Visual Feedback**: Users know when elements are interactive
2. **Guidance**: Animations guide user's attention to important elements
3. **Smoothness**: Natural motion makes the interface feel polished
4. **Engagement**: Delightful animations encourage exploration
5. **Modern Look**: Framer Motion animations feel contemporary and professional

---

## 📝 Installation & Usage

Framer Motion is already installed in `package.json`:
```bash
npm install framer-motion
```

All animations are implemented with Framer Motion's `motion` API:
```tsx
import { motion, AnimatePresence } from 'framer-motion';
```

---

## 🎨 Animation Principles Applied

- **Duration**: Most animations are 0.2-0.5s for snappy feel
- **Easing**: Using default easing for natural motion
- **Stagger**: 0.05-0.1s delay between items for visual appeal
- **Scale**: Hover effects use 1.05-1.2x scale for emphasis
- **Opacity**: Fade animations start from 0.5-1 opacity range
- **Transform**: Using transforms (scale, rotate, y) for GPU acceleration

Enjoy your beautifully animated marketplace!
