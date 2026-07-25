"use client";

import React from "react";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export function Footer() {
    return (
        <footer className="w-full relative z-10 bg-[#faeefd] text-black border-t border-[#f0d4f6]">
            <div className="max-w-6xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-1">
                        <span className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2 mb-4">
                            PH Campus Hero
                        </span>
                        <p className="text-sm text-black leading-relaxed mb-6 font-medium">
                            Empowering students to lead, inspire, and make a real impact on their campuses. Join the movement and earn exclusive rewards.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all shadow-sm">
                                <FaFacebook size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all shadow-sm">
                                <FaTwitter size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all shadow-sm">
                                <FaInstagram size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all shadow-sm">
                                <FaLinkedin size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-black font-extrabold mb-6 tracking-wide uppercase text-sm">Quick Links</h3>
                        <ul className="space-y-4">
                            <li>
                                <a href="#stats" className="text-sm text-black hover:text-purple-600 transition-colors font-semibold">Our Impact</a>
                            </li>
                            <li>
                                <a href="#heroes" className="text-sm text-black hover:text-purple-600 transition-colors font-semibold">Campus Heroes</a>
                            </li>
                            <li>
                                <a href="#feedbacks" className="text-sm text-black hover:text-purple-600 transition-colors font-semibold">Testimonials</a>
                            </li>
                            <li>
                                <a href="#register" className="text-sm text-black hover:text-purple-600 transition-colors font-semibold">Become an Ambassador</a>
                            </li>
                        </ul>
                    </div>

                    {/* Resources & Legal */}
                    <div>
                        <h3 className="text-black font-extrabold mb-6 tracking-wide uppercase text-sm">Legal</h3>
                        <ul className="space-y-4">
                            <li>
                                <Link href="#" className="text-sm text-black hover:text-purple-600 transition-colors font-semibold">Privacy Policy</Link>
                            </li>
                            <li>
                                <Link href="#" className="text-sm text-black hover:text-purple-600 transition-colors font-semibold">Terms of Service</Link>
                            </li>
                            <li>
                                <Link href="#" className="text-sm text-black hover:text-purple-600 transition-colors font-semibold">Cookie Policy</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-black font-extrabold mb-6 tracking-wide uppercase text-sm">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                                <span className="text-sm text-black font-semibold">Level 4, House 1162, Road 10,<br/>Avenue 12, Mirpur DOHS, Dhaka</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Phone className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                                <div className="text-sm text-black font-semibold flex flex-col">
                                    <span>যেকোন জিজ্ঞাসায় ফোন করো</span>
                                    <span className="font-extrabold">01332502004</span>
                                    <span className="text-xs text-gray-700">(Sat - Thu, 10:00 AM to 7:00 PM)</span>
                                </div>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-purple-600 shrink-0" />
                                <span className="text-sm text-black font-semibold">web@programming-hero.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 pt-8 border-t border-[#f0d4f6] flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-black text-sm font-semibold">
                        &copy; {new Date().getFullYear()} PH Campus Hero. All rights reserved.
                    </p>
                    <p className="text-black text-sm font-semibold flex items-center gap-1">
                        Made with <span className="text-red-500">❤</span> for Students
                    </p>
                </div>
            </div>
        </footer>
    );
}
