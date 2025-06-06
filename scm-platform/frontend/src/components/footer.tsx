"use client";

import { FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { BiMailSend } from "react-icons/bi";
import * as Separator from "@radix-ui/react-separator";
import { Flex, TextField, IconButton } from "@radix-ui/themes";

export default function Footer() {
  return (
    <footer className="bg-sky-50 text-sky-600 !bg-sky-50 !bg-opacity-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Social Links */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <SocialButton label="Twitter" href="#">
                <FaTwitter className="w-5 h-5" />
              </SocialButton>
              <SocialButton label="YouTube" href="#">
                <FaYoutube className="w-5 h-5" />
              </SocialButton>
              <SocialButton label="Instagram" href="#">
                <FaInstagram className="w-5 h-5" />
              </SocialButton>
            </div>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <FooterHeading>Company</FooterHeading>
            <FooterLink href="#">About us</FooterLink>
            <FooterLink href="#">Blog</FooterLink>
            <FooterLink href="#">Contact us</FooterLink>
            <FooterLink href="#">Pricing</FooterLink>
            <FooterLink href="#">Testimonials</FooterLink>
          </div>

          {/* Support Links */}
          <div className="space-y-4">
            <FooterHeading>Support</FooterHeading>
            <FooterLink href="#">Help Center</FooterLink>
            <FooterLink href="#">Terms of Service</FooterLink>
            <FooterLink href="#">Legal</FooterLink>
            <FooterLink href="#">Privacy Policy</FooterLink>
            <FooterLink href="#">Status</FooterLink>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <FooterHeading>Stay up to date</FooterHeading>
            <Flex gap="2">
              <TextField.Root
                placeholder="Your email address"
                className="bg-white/80 backdrop-blur-sm focus:bg-white focus:ring-2 focus:ring-sky-500 text-sky-700"
              />
              <IconButton className="bg-sky-600 hover:bg-sky-700 text-white transition-colors">
                <BiMailSend className="w-5 h-5" />
              </IconButton>
            </Flex>
          </div>
        </div>

        <Separator.Root className="my-8 h-px bg-sky-200 w-full" />

        <div className="text-center text-sm text-sky-500">
          © {new Date().getFullYear()} Orontis. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

const SocialButton = ({
  children,
  label,
  href,
}: {
  children: React.ReactNode;
  label: string;
  href: string;
}) => {
  return (
    <a
      href={href}
      aria-label={label}
      className="p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-all duration-200 hover:bg-sky-100 text-sky-600 hover:text-sky-700"
    >
      {children}
    </a>
  );
};

const FooterHeading = ({ children }: { children: React.ReactNode }) => {
  return <h4 className="text-lg font-medium text-sky-700">{children}</h4>;
};

const FooterLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  return (
    <a
      href={href}
      className="block text-sky-600 hover:text-sky-800 transition-colors duration-200"
    >
      {children}
    </a>
  );
};
