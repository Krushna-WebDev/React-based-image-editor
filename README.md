# React-based Image Editor

A modern, minimal, and fast image editor built with **React**, **Vite**, and **TailwindCSS**. Easily apply filters, adjust image properties, and download your edited images—all in your browser.

---

## ✨ Features

- **Image Upload:**  
  Upload images from your device, drag & drop, or paste an image URL (supports jpg, png, webp, gif).

- **Live Filter Adjustments:**  
  Instantly tweak brightness, contrast, saturation, grayscale, sepia, invert, hue rotation, blur, zoom, and rotation with smooth sliders.

- **Preset Filters:**  
  Apply ready-made looks like Warm, Black & White, Vintage, and Cool Blue with one click.

- **Undo/Redo:**  
  Step back and forth through your filter history.

- **Before/After Comparison:**  
  Use the slider to compare the original and edited image side by side.

- **Download:**  
  Save your edited image as PNG or JPG.

- **Dark/Light Mode:**  
  Switch between beautiful dark and light themes.

- **Responsive Design:**  
  Works great on desktop and mobile screens.

- **Keyboard Accessible:**  
  All controls and upload area are accessible via keyboard.

---

## 🛠️ Setup Instructions

1. **Clone the repository:**
   ```sh
   git clone <repo-url>
   cd react-based-image-editor
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Start the development server:**
   ```sh
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Build for production:**
   ```sh
   npm run build
   ```

---

## 💡 Extra Notes

- **All processing is local:**  
  Your images never leave your device—everything runs in your browser.

- **Smooth Transitions:**  
  UI and filter changes are animated for a polished experience.

- **Tech Stack:**  
  Built with [React](https://react.dev/), [Vite](https://vitejs.dev/), and [TailwindCSS](https://tailwindcss.com/).

- **Linting:**  
  ESLint is configured for code quality and best practices.

---

## 🎬 Demo

- **Live App:** [https://image-editorlive.netlify.app/](https://image-editorlive.netlify.app/)
- **Watch the demo video:** [Demo Video](https://drive.google.com/file/d/1hpAJ8Jwesakwny9M82PjG2mT2izjFfAm/view?usp=drive_link)

## 📁 Project Structure

- `src/App.jsx` – Main app logic and state management
- `src/components/` – UI components (ImageCanvas, FilterSlider, PresetFilters, etc.)
- `public/` – Static files (favicon, etc.)

---

## 📜 License

MIT

--- 