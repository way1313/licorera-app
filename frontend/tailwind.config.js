/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
    colors: {
        // Tono ámbar / oro envejecido cálido
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        gold: {
          400: '#e5c07b',
          500: '#d4a359',
          600: '#b8863b',
        },
        // Escala de carbón/pizarra (elimina el negro plano)
        cava: {
          bg: '#0d0f12',       // Fondo de aplicación
          surface: '#15181e',  // Tarjetas y Sidebar
          card: '#1b1f27',     // Contenedores secundarios y modales
          hover: '#242a35',    // Estados hover e inputs
          border: '#2b323f',   // Bordes sutiles y elegantes
          text: '#f1f5f9',     // Texto principal
          muted: '#8b9bb4',    // Subtítulos y etiquetas
        }
      }
    },
  },
  plugins: [],
}