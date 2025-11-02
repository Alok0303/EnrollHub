import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Wallet } from "lucide-react";
import { useState, useEffect } from "react";
import { createWalletClient, custom } from "viem";
import { sepolia } from "viem/chains";

export const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [address, setAddress] = useState("");

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/enroll", label: "Enroll" },
    { path: "/view", label: "View" },
  ];

  const connectWallet = async () => {
  if (!window.ethereum) {
    alert("Please install MetaMask!");
    return;
  }

  // Force MetaMask popup for connection
  await window.ethereum.request({ method: "eth_requestAccounts" });

  const walletClient = createWalletClient({
    chain: sepolia,
    transport: custom(window.ethereum),
  });

  const accounts = await walletClient.requestAddresses();
  setAddress(accounts[0]);
  setIsWalletConnected(true);
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
              onClick={connectWallet}
              variant={isWalletConnected ? "default" : "outline"}
              className="ml-4 transition-all"
            >
              <Wallet className="mr-2 h-4 w-4" />
              {isWalletConnected
                ? `Connected: ${address.slice(0, 6)}...${address.slice(-4)}`
                : "Connect Wallet"}
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
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
              >
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
                connectWallet();
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
