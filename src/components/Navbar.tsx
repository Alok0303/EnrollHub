import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Wallet, LogOut } from "lucide-react";
import { useState } from "react";
import { createWalletClient, custom } from "viem";
import { sepolia } from "viem/chains";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [address, setAddress] = useState("");

  // Temporary auth simulation (no crash)
  const [currentUser, setCurrentUser] = useState<{ name: string } | null>(null);

  const isActive = (path: string) => location.pathname === path;

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

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const walletClient = createWalletClient({
        chain: sepolia,
        transport: custom(window.ethereum),
      });

      const accounts = await walletClient.requestAddresses();
      setAddress(accounts[0]);
      setIsWalletConnected(true);
    } catch (err) {
      console.error("Wallet connection failed:", err);
    }
  };

  const handleLogout = () => {
    // Simulate logout (clear fake user)
    setCurrentUser(null);
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

            {currentUser ? (
              <div className="flex items-center gap-3 ml-2">
                <span className="text-sm text-muted-foreground">
                  {currentUser.name}
                </span>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="icon"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Link to="/login" className="ml-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentUser({ name: "Demo User" })}
                >
                  Login
                </Button>
              </Link>
            )}
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

            {currentUser ? (
              <>
                <div className="text-center text-sm text-muted-foreground py-2 border-t">
                  Logged in as {currentUser.name}
                </div>
                <Button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setCurrentUser({ name: "Demo User" })}
                >
                  Login
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
