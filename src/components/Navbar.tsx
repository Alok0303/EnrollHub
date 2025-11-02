import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Wallet } from "lucide-react";
import { useState } from "react";

export const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/enroll", label: "Enroll" },
    { path: "/view", label: "View" },
  ];

  const handleWalletToggle = () => {
    setIsWalletConnected(!isWalletConnected);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent" />
            <span className="text-xl font-bold text-foreground">EnrollHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}>
                <Button
                  variant={isActive(link.path) ? "secondary" : "ghost"}
                  className="text-sm font-medium transition-all"
                >
                  {link.label}
                </Button>
              </Link>
            ))}
            <Button
              onClick={handleWalletToggle}
              variant={isWalletConnected ? "default" : "outline"}
              className="ml-4 transition-all"
            >
              <Wallet className="mr-2 h-4 w-4" />
              {isWalletConnected ? "Wallet Connected" : "Connect Wallet"}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden rounded-lg p-2 hover:bg-secondary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant={isActive(link.path) ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  {link.label}
                </Button>
              </Link>
            ))}
            <Button
              onClick={() => {
                handleWalletToggle();
                setIsMenuOpen(false);
              }}
              variant={isWalletConnected ? "default" : "outline"}
              className="w-full justify-start"
            >
              <Wallet className="mr-2 h-4 w-4" />
              {isWalletConnected ? "Wallet Connected" : "Connect Wallet"}
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};
