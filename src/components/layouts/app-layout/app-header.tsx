import { LanguageDropdown } from "@/components/language-dropdown";
import { ModeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import AuthButtons from "./auth-buttons";
import NewPost from "@/components/posts/new-post";

const AppHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur bg-background/90">
      <div className="container mx-auto flex h-16 w-full items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
            <span className="text-primary-foreground text-sm font-bold">S</span>
          </div>
          <span className="font-bold">Supabase Starter</span>
        </Link>

        {/* Right side - Theme toggle and Language dropdown */}
        <div className="flex items-center space-x-2">
          <LanguageDropdown />

          <ModeToggle />

          <NewPost />

          <AuthButtons />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
