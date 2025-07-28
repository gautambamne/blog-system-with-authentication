import Link from "next/link"
import { BookOpen, Twitter, Github, Linkedin, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export function FooterMain() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand and description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
              <BookOpen className="h-6 w-6" />
              BlogApp
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Discover insightful articles, tutorials, and stories from our community of writers and developers.
            </p>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" asChild>
                <Link href="https://twitter.com" aria-label="Twitter">
                  <Twitter className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="https://github.com" aria-label="GitHub">
                  <Github className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="https://linkedin.com" aria-label="LinkedIn">
                  <Linkedin className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link href="/posts" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                All Articles
              </Link>
              <Link
                href="/categories"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Categories
              </Link>
              <Link href="/authors" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Authors
              </Link>
              <Link href="/archive" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Archive
              </Link>
            </nav>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Categories</h3>
            <nav className="flex flex-col gap-2">
              <Link
                href="/categories/technology"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Technology
              </Link>
              <Link
                href="/categories/design"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Design
              </Link>
              <Link
                href="/categories/development"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Development
              </Link>
              <Link
                href="/categories/lifestyle"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Lifestyle
              </Link>
              <Link
                href="/categories/business"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Business
              </Link>
            </nav>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Stay Updated</h3>
            <p className="text-sm text-muted-foreground">
              Subscribe to our newsletter for the latest articles and updates.
            </p>
            <form className="space-y-2">
              <Input type="email" placeholder="Enter your email" className="w-full" />
              <Button type="submit" className="w-full">
                <Mail className="mr-2 h-4 w-4" />
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
            <p className="text-sm text-muted-foreground">© 2024 BlogApp. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Made with</span>
            <span className="text-red-500">♥</span>
            <span className="text-sm text-muted-foreground">by the BlogApp team</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
