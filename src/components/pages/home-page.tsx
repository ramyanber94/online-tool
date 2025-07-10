"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { 
  Code2, 
  FileText, 
  Shuffle, 
  Hash, 
  Link as LinkIcon, 
  Palette, 
  Lock,
  QrCode,
  Timer,
  Globe,
  Binary,
  FileImage
} from "lucide-react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { CookieConsent } from "@/components/cookie-consent"
import { StructuredData, organizationSchema, websiteSchema } from "@/components/structured-data"

const tools = [
  {
    title: "JSON Formatter",
    description: "Format, validate, and beautify JSON data",
    icon: FileText,
    href: "/tools/json-formatter",
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "UUID Generator",
    description: "Generate unique identifiers for your applications",
    icon: Shuffle,
    href: "/tools/uuid-generator",
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "Hash Generator",
    description: "Create MD5, SHA-1, SHA-256 hashes from text",
    icon: Hash,
    href: "/tools/hash-generator",
    color: "from-green-500 to-emerald-500"
  },
  {
    title: "URL Encoder/Decoder",
    description: "Encode and decode URLs and query parameters",
    icon: LinkIcon,
    href: "/tools/url-encoder",
    color: "from-orange-500 to-red-500"
  },
  {
    title: "Color Palette Generator",
    description: "Generate beautiful color palettes for your designs",
    icon: Palette,
    href: "/tools/color-palette",
    color: "from-pink-500 to-rose-500"
  },
  {
    title: "Base64 Encoder/Decoder",
    description: "Encode and decode Base64 strings",
    icon: Binary,
    href: "/tools/base64",
    color: "from-indigo-500 to-purple-500"
  },
  {
    title: "Password Generator",
    description: "Generate secure passwords with custom options",
    icon: Lock,
    href: "/tools/password-generator",
    color: "from-red-500 to-pink-500"
  },
  {
    title: "Barcode Generator",
    description: "Generate various types of barcodes and QR codes",
    icon: QrCode,
    href: "/tools/barcode-generator",
    color: "from-teal-500 to-cyan-500"
  },
  {
    title: "Image Converter",
    description: "Convert and compress images between different formats",
    icon: FileImage,
    href: "/tools/image-converter",
    color: "from-violet-500 to-purple-500"
  },
  {
    title: "Unix Timestamp Converter",
    description: "Convert between Unix timestamps and human-readable dates",
    icon: Timer,
    href: "/tools/unix-timestamp",
    color: "from-amber-500 to-orange-500"
  },
  {
    title: "Regex Tester",
    description: "Test and debug regular expressions with real-time matching",
    icon: Code2,
    href: "/tools/regex-tester",
    color: "from-emerald-500 to-teal-500"
  },
  {
    title: "IP & Hosting Checker",
    description: "Get detailed information about IP addresses and domains",
    icon: Globe,
    href: "/tools/ip-hosting-checker",
    color: "from-sky-500 to-blue-500"
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <StructuredData data={organizationSchema} />
      <StructuredData data={websiteSchema} />
      
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Code2 className="h-6 w-6" />
            <span className="font-bold text-xl">DevToolbox</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-muted/30 min-h-[80vh] flex items-center">
        {/* Animated Background */}
        <div className="absolute inset-0">
          {/* Gradient mesh background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/8 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-500/8 via-transparent to-transparent"></div>
          
          {/* Floating geometric shapes */}
          <motion.div
            animate={{ 
              y: [-20, 20, -20],
              rotate: [0, 180, 360],
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-20 left-[10%] w-24 h-24 bg-gradient-to-br from-primary/15 to-primary/3 rounded-2xl blur-xl"
          />
          <motion.div
            animate={{ 
              y: [20, -20, 20],
              rotate: [360, 180, 0],
            }}
            transition={{ 
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-32 right-[15%] w-32 h-32 bg-gradient-to-br from-blue-500/15 to-blue-500/3 rounded-full blur-xl"
          />
          <motion.div
            animate={{ 
              y: [-15, 15, -15],
              x: [-10, 10, -10],
            }}
            transition={{ 
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-32 left-[20%] w-20 h-20 bg-gradient-to-br from-violet-500/15 to-violet-500/3 rounded-xl blur-xl"
          />
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ 
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-primary/3 to-blue-500/3 rounded-full blur-3xl"
          />
          
          {/* Code-like decorative elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute top-24 left-[5%] text-primary/30 dark:text-primary/20 font-mono text-sm select-none"
          >
            {`{ "tools": 12 }`}
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3
            }}
            className="absolute bottom-32 right-[8%] text-blue-600/30 dark:text-blue-400/20 font-mono text-sm select-none"
          >
            {`<DevTools />`}
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ 
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 5
            }}
            className="absolute top-1/3 right-[10%] text-violet-600/30 dark:text-violet-400/20 font-mono text-sm select-none"
          >
            {`privacy: true`}
          </motion.div>
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--primary)/0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--primary)/0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black_40%,transparent_100%)]"></div>
          
          {/* Floating particles */}
          {[
            { left: 15, top: 25, duration: 12, delay: 0 },
            { left: 85, top: 15, duration: 18, delay: 1 },
            { left: 35, top: 75, duration: 15, delay: 2 },
            { left: 65, top: 45, duration: 20, delay: 0.5 },
            { left: 25, top: 85, duration: 14, delay: 3 },
            { left: 75, top: 35, duration: 16, delay: 1.5 },
            { left: 45, top: 65, duration: 13, delay: 2.5 },
            { left: 55, top: 25, duration: 17, delay: 0.8 },
          ].map((particle, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary/20 dark:bg-primary/30 rounded-full"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
              }}
              animate={{
                y: [-100, -20, -100],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
                ease: "easeInOut",
              }}
            />
          ))}
          
          {/* Additional rotating rings */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute top-[20%] left-[15%] w-40 h-40 border border-primary/8 dark:border-primary/10 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[25%] right-[20%] w-32 h-32 border border-blue-500/8 dark:border-blue-400/10 rounded-full"
          />
          
          {/* Animated dots pattern */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={`dot-${i}`}
                className="absolute w-1 h-1 bg-primary/15 dark:bg-primary/20 rounded-full"
                style={{
                  left: `${(i * 13) % 100}%`,
                  top: `${(i * 17) % 100}%`,
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.1, 0.4, 0.1],
                }}
                transition={{
                  duration: 3 + (i % 3),
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
          
          {/* Tech symbols floating around */}
          <motion.div
            animate={{ 
              y: [-10, 10, -10],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-[30%] left-[8%] text-primary/10 dark:text-primary/15 text-2xl font-mono select-none"
          >
            {`{}`}
          </motion.div>
          <motion.div
            animate={{ 
              y: [10, -10, 10],
              rotate: [0, -5, 5, 0]
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute top-[60%] right-[12%] text-blue-600/10 dark:text-blue-400/15 text-2xl font-mono select-none"
          >
            {`[]`}
          </motion.div>
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.05, 0.15, 0.05]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4
            }}
            className="absolute top-[45%] left-[85%] text-violet-600/10 dark:text-violet-400/15 text-xl font-mono select-none"
          >
            {`<>`}
          </motion.div>
        </div>
        
        <div className="container mx-auto px-4 py-20 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-sm mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-primary font-medium">12 Tools Available • Always Free</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-6 leading-tight">
              Essential Tools for{" "}
              <span className="relative">
                Developers
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="absolute bottom-2 left-0 right-0 h-2 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-full origin-left"
                />
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              A curated collection of privacy-first developer tools. Format JSON, generate UUIDs, create hashes, and much more. 
              <span className="font-semibold text-foreground">All tools work offline</span> and respect your privacy.
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
            >
              <motion.a
                href="#tools"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center space-x-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
              >
                <Code2 className="w-5 h-5" />
                <span>Explore Tools</span>
              </motion.a>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="inline-flex items-center space-x-2 bg-background/50 border border-border/50 backdrop-blur supports-[backdrop-filter]:bg-background/30 rounded-lg px-6 py-3"
              >
                <Lock className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium">Privacy-first • No data collection • Works offline</span>
              </motion.div>
            </motion.div>
            
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-3 gap-8 max-w-md mx-auto"
            >
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">12+</div>
                <div className="text-sm text-muted-foreground">Tools</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">Privacy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">0</div>
                <div className="text-sm text-muted-foreground">Data Stored</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Tools Grid */}
      <section id="tools" className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Choose Your <span className="text-primary">Developer Tool</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            All tools are designed with privacy in mind. No data leaves your browser, and everything works offline.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {tools.map((tool) => (
            <motion.div key={tool.title} variants={itemVariants}>
              <Link href={tool.href} className="block group">
                <Card className="h-full transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2 group-hover:border-primary/40 cursor-pointer overflow-hidden relative">
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <CardHeader className="pb-4 relative z-10">
                    <div className="relative">
                      <div className={`inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r ${tool.color} mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl`}>
                        <tool.icon className="h-7 w-7 text-white" />
                      </div>
                      {/* Popular badge for certain tools */}
                      {(tool.title === "JSON Formatter" || tool.title === "UUID Generator") && (
                        <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
                          Popular
                        </div>
                      )}
                    </div>
                    
                    <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300 font-semibold">
                      {tool.title}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {tool.description}
                    </CardDescription>
                    
                    {/* Feature tags */}
                    <div className="flex flex-wrap gap-1 mt-3">
                      <span className="inline-flex items-center text-xs bg-green-200 dark:bg-green-900 text-green-800 dark:text-green-300 px-2 py-1 rounded-full font-medium">
                        <Lock className="w-3 h-3 mr-1" />
                        Offline
                      </span>
                      <span className="inline-flex text-xs bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full font-medium">
                        Free
                      </span>
                    </div>
                  </CardHeader>
                  
                  {/* Hover arrow */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Why Developers Choose DevToolbox</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built with modern web standards and best practices in mind
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6 rounded-xl bg-background/50 backdrop-blur border border-border/50"
            >
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Lock className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold mb-2">100% Private</h3>
              <p className="text-sm text-muted-foreground">
                No data collection, no tracking, no analytics. Everything stays in your browser.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center p-6 rounded-xl bg-background/50 backdrop-blur border border-border/50"
            >
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold mb-2">Works Offline</h3>
              <p className="text-sm text-muted-foreground">
                All tools function without internet connection once loaded. Perfect for secure environments.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center p-6 rounded-xl bg-background/50 backdrop-blur border border-border/50"
            >
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Timer className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold mb-2">Lightning Fast</h3>
              <p className="text-sm text-muted-foreground">
                Optimized for performance with instant results and minimal loading times.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center p-6 rounded-xl bg-background/50 backdrop-blur border border-border/50"
            >
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Code2 className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="font-semibold mb-2">Developer First</h3>
              <p className="text-sm text-muted-foreground">
                Built by developers, for developers. Clean UI, keyboard shortcuts, and efficient workflows.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/20 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Why Choose DevToolbox?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built with privacy and performance in mind. All our tools run entirely in your browser.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={itemVariants} className="text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Privacy First</h3>
              <p className="text-muted-foreground">
                No data collection, no tracking. Everything runs locally in your browser.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                <Timer className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Optimized for performance with instant results and minimal loading times.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                <Globe className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Works Offline</h3>
              <p className="text-muted-foreground">
                All tools work without an internet connection once the page is loaded.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Code2 className="h-5 w-5" />
              <span className="font-semibold">DevToolbox</span>
              <span className="text-sm text-muted-foreground">© 2024</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Made with ❤️ for developers
            </div>
          </div>
        </div>
      </footer>

      {/* Cookie Consent */}
      <CookieConsent />
    </div>
  )
}
