'use client';

export default function CompanyTrustBar() {
  const companies = [
    { name: 'Volkswagen', logo: 'VOLKSWAGEN' },
    { name: 'Samsung', logo: 'SAMSUNG' },
    { name: 'Cisco', logo: 'CISCO' },
    { name: 'Vimeo', logo: 'vimeo' },
    { name: 'P&G', logo: 'P&G' },
    { name: 'HP Enterprise', logo: 'Hewlett Packard Enterprise' },
    { name: 'Citi', logo: 'citi' },
    { name: 'Ericsson', logo: 'ERICSSON' },
  ];

  return (
    <section className="bg-[#f7f9fa] border-b border-[#d1d7dc] py-10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 text-center">
        <p className="text-sm font-normal text-[#6a6f73] mb-6">
          Trusted by over 16,000 companies and thousands of learners around the world
        </p>

        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-70 grayscale hover:grayscale-0 transition-all">
          {companies.map((c, i) => (
            <span
              key={i}
              className="text-base sm:text-lg font-black tracking-wider text-[#6a6f73] font-sans"
            >
              {c.logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
