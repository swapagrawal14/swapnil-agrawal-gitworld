import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import appCss from "../styles.css?url";

const APP_NAME = "Swapnil Agrawal";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: APP_NAME },
      {
        name: "description",
        content:
          "Drive the studio of Swapnil Agrawal — dentist, AI researcher, and builder in Udaipur. A 3D playground of AI products, 3D tools, and dental storytelling.",
      },
      { name: "theme-color", content: "#c5e4f5" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500;600&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  component: RootLayout,
});

function RootLayout() {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="bg-bg text-ink">
        <PreviewHostBridge />
        <AuthProvider>
          <Outlet />
          <Toaster
            theme="light"
            position="bottom-center"
            toastOptions={{
              style: {
                background: "var(--color-paper)",
                color: "var(--color-ink)",
                border: "1px solid var(--color-line-strong)",
              },
            }}
          />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}
