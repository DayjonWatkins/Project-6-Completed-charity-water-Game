import React from 'react';
import { ExternalLink, ArrowUpRight, ShieldCheck } from 'lucide-react';

export const WaterImpactFooter: React.FC = () => {
  return (
    <footer className="w-full max-w-[800px] mt-6 bg-white rounded-xl border border-gray-200/90 shadow-xs overflow-hidden">
      {/* Top Banner / Mission Highlight */}
      <div className="bg-[#ffc907] px-4 py-3 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <img
            src="/img/water-can-transparent.png"
            alt="charity: water jerry can"
            className="w-7 h-7 object-contain drop-shadow-xs"
          />
          <div>
            <span className="font-black text-[#131313] text-sm sm:text-base font-heading">
              Clean Water Changes Everything
            </span>
            <p className="text-xs text-black/80 font-medium">
              703 million people lack basic access to clean, safe drinking water.
            </p>
          </div>
        </div>

        <a
          href="https://www.charitywater.org/donate"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#131313] hover:bg-black text-white text-xs sm:text-sm font-bold rounded-md shadow-xs transition transform hover:scale-105 active:scale-95 shrink-0"
        >
          <span>Donate Clean Water</span>
          <ArrowUpRight className="w-4 h-4 text-[#ffc907]" />
        </a>
      </div>

      {/* 100% Model & Core Links */}
      <div className="p-4 sm:p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a
            href="https://www.charitywater.org/donate"
            target="_blank"
            rel="noopener noreferrer"
            className="group p-3 rounded-lg border border-gray-200 hover:border-[#2e9df7] bg-gray-50/50 hover:bg-blue-50/30 transition text-left"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-[#131313] group-hover:text-[#2e9df7]">
                Make a Donation
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#2e9df7]" />
            </div>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              $40 can bring clean, lasting water to one person. 100% funds water projects.
            </p>
          </a>

          <a
            href="https://www.charitywater.org/the-spring"
            target="_blank"
            rel="noopener noreferrer"
            className="group p-3 rounded-lg border border-gray-200 hover:border-[#2e9df7] bg-gray-50/50 hover:bg-blue-50/30 transition text-left"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-[#131313] group-hover:text-[#2e9df7]">
                Join The Spring
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#2e9df7]" />
            </div>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Join a global community giving clean water every single month.
            </p>
          </a>

          <a
            href="https://www.charitywater.org/our-work"
            target="_blank"
            rel="noopener noreferrer"
            className="group p-3 rounded-lg border border-gray-200 hover:border-[#2e9df7] bg-gray-50/50 hover:bg-blue-50/30 transition text-left"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-[#131313] group-hover:text-[#2e9df7]">
                Our Impact & Proof
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#2e9df7]" />
            </div>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Every project is mapped with GPS coordinates and verified by local partners.
            </p>
          </a>
        </div>

        {/* The 100% Promise guarantee */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-3 border-t border-gray-100 gap-2 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#159a48]" />
            <span>
              <strong>The 100% Model:</strong> Private donors cover operational costs so 100% of public donations fund water projects.
            </span>
          </div>

          <a
            href="https://www.charitywater.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#2e9df7] hover:underline font-semibold shrink-0"
          >
            <span>Visit charitywater.org</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </footer>
  );
};
