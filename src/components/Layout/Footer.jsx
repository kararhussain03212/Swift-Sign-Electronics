import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import { FaGithub, FaDiscord, FaTwitter, FaLinkedin, FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';
import { useShop } from '../../context/ShopContext';
import {
  DEFAULT_SITE_SETTINGS,
  DEFAULT_FOOTER_LINK_GROUPS,
  DEFAULT_SOCIAL_LINKS,
} from '../../data/siteContent';
import './Footer.css';

const SOCIAL_ICONS = {
  github: FaGithub,
  discord: FaDiscord,
  twitter: FaTwitter,
  linkedin: FaLinkedin,
  facebook: FaFacebook,
  instagram: FaInstagram,
  youtube: FaYoutube,
};

export default function Footer() {
  const { siteSettings, footerLinkGroups, socialLinks } = useShop();
  const settings = { ...DEFAULT_SITE_SETTINGS, ...siteSettings };
  const groups = footerLinkGroups?.length ? footerLinkGroups : DEFAULT_FOOTER_LINK_GROUPS;
  const socials = socialLinks?.length ? socialLinks : DEFAULT_SOCIAL_LINKS;

  return (
    <footer className="w-full bg-slate-950 border-t-4 border-[#0fafb8] text-slate-300 font-sans relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#0fafb8]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand */}
          <div className="flex flex-col gap-6 lg:col-span-1">
            <Link to="/" className="inline-block">
              <h2 className="text-2xl font-black text-white tracking-tight">
                {settings.brand_name} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0fafb8] to-blue-400">{settings.brand_subtitle}</span>
              </h2>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              {settings.footer_description}
            </p>
          </div>

          {/* Footer link groups (Quick Links / Legal Information / admin-managed) */}
          {groups.map((group) => (
            <div key={group.id} className="flex flex-col gap-6">
              <h3 className="text-sm font-bold text-white tracking-widest uppercase">{group.title}</h3>
              <ul className="flex flex-col gap-3">
                {(group.links || []).map((link) => (
                  <li key={link.id}>
                    <Link to={link.url} className="text-sm text-slate-400 hover:text-[#0fafb8] hover:translate-x-1 inline-block transition-all duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact & Socials */}
          <div className="flex flex-col gap-6">
            <h3 className="text-sm font-bold text-white tracking-widest uppercase">Get in Touch</h3>
            <ul className="flex flex-col gap-5 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <Phone className="text-[#0fafb8] shrink-0 mt-0.5" size={20} />
                <div className="flex flex-col">
                  <span className="text-white font-medium text-base">{settings.contact_phone}</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="text-[#0fafb8] shrink-0 mt-0.5" size={20} />
                <div className="flex flex-col">
                  <span className="text-white font-medium text-base">{settings.contact_email}</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="text-[#0fafb8] shrink-0 mt-0.5" size={20} />
                <div className="flex flex-col">
                  <span className="text-slate-300 leading-relaxed">{settings.contact_address}</span>
                </div>
              </li>
            </ul>

            <div className="flex items-center gap-3 mt-2">
              {socials.map((social) => {
                const Icon = SOCIAL_ICONS[social.platform] || FaGithub;
                return (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-slate-900 hover:bg-[#0fafb8] border border-slate-800 hover:border-[#0fafb8] text-slate-400 hover:text-white flex items-center justify-center transition-all duration-300"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-slate-800 bg-slate-950/80 backdrop-blur-sm relative z-10">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 font-medium">
            © {new Date().getFullYear()} {settings.copyright_text}
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-slate-600 font-medium">Designed by <a href={settings.designed_by_url} target="_blank" rel="noopener noreferrer" className="text-[#0fafb8] hover:text-blue-400 font-bold transition-colors">{settings.designed_by_text}</a></span>
          </div>
        </div>
      </div>
    </footer>
  );
}