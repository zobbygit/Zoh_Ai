import React from 'react'
import { assets} from '../assets/assets'
const Footer = () => {

 
    return (
        <div className='text-gray-500/80 pt-8 px-6 md:px-16 lg:px-24 xl:px-32'>
            <div className='flex flex-wrap justify-between gap-12 md:gap-6'>
                <div className='max-w-80'>
                    <img src={assets.neww} alt="logo" className='mb-4 h-8 md:h-9' />
                    <p className='text-sm'>
                      zoh.ai empowers creators and professionals with powerful AI tools that simplify work, accelerate productivity, and turn ideas into stunning content instantly.
                    </p>



<div className="flex items-center gap-3 mt-4">

    {/* Instagram */}
    <a 
        href="https://instagram.com/ig_zohaib_25" 
        target="_blank" 
        rel="noopener noreferrer"
    >
        <svg className="w-6 h-6 hover:text-pink-500 transition" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7.75 2A5.75 5.75 0 002 7.75v8.5A5.75 5.75 0 007.75 22h8.5A5.75 5.75 0 0022 16.25v-8.5A5.75 5.75 0 0016.25 2h-8.5zM4.5 7.75A3.25 3.25 0 017.75 4.5h8.5a3.25 3.25 0 013.25 3.25v8.5a3.25 3.25 0 01-3.25 3.25h-8.5a3.25 3.25 0 01-3.25-3.25v-8.5zm9.5 1a4 4 0 11-4 4 4 4 0 014-4zm0 1.5a2.5 2.5 0 102.5 2.5 2.5 2.5 0 00-2.5-2.5zm3.5-.75a.75.75 0 11.75-.75.75.75 0 01-.75.75z" />
        </svg>
    </a>

    {/* Facebook */}
    <a 
        href="https://facebook.com/sheikh.zohaib.5891" 
        target="_blank" 
        rel="noopener noreferrer"
    >
        <svg className="w-6 h-6 hover:text-blue-600 transition" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13.5 9H15V6.5h-1.5c-1.933 0-3.5 1.567-3.5 3.5v1.5H8v3h2.5V21h3v-7.5H16l.5-3h-3z" />
        </svg>
    </a>

    {/* GitHub */}
    <a 
        href="https://github.com/zobbygit" 
        target="_blank" 
        rel="noopener noreferrer"
    >
        <svg className="w-6 h-6 hover:text-gray-800 transition" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 008 10.94c.59.11.8-.26.8-.58v-2.02c-3.25.7-3.93-1.41-3.93-1.41a3.1 3.1 0 00-1.3-1.72c-1.06-.72.08-.7.08-.7a2.47 2.47 0 011.8 1.2 2.52 2.52 0 003.44 1 2.5 2.5 0 01.75-1.57c-2.6-.3-5.34-1.3-5.34-5.8A4.54 4.54 0 017.2 7.1a4.2 4.2 0 01.11-3.09s.98-.31 3.2 1.2a10.9 10.9 0 015.83 0c2.22-1.51 3.2-1.2 3.2-1.2a4.2 4.2 0 01.11 3.09 4.54 4.54 0 011.2 3.16c0 4.52-2.75 5.5-5.37 5.79a2.7 2.7 0 01.78 2.1v3.1c0 .33.2.7.8.58A11.5 11.5 0 0023.5 12c0-6.35-5.15-11.5-11.5-11.5z"/>
        </svg>
    </a>

    {/* LinkedIn */}
    <a 
        href="https://www.linkedin.com/in/zohaib-aslam-245a40253/e" 
        target="_blank" 
        rel="noopener noreferrer"
    >
        <svg className="w-6 h-6 hover:text-blue-700 transition" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4.98 3.5C3.88 3.5 3 4.38 3 5.48c0 1.1.88 1.98 1.98 1.98h.02c1.1 0 1.98-.88 1.98-1.98C6.98 4.38 6.1 3.5 4.98 3.5zM3 8.75h3.96V21H3V8.75zm6.25 0h3.8v1.68h.05c.53-.98 1.82-2.02 3.75-2.02 4.01 0 4.75 2.64 4.75 6.07V21H17v-5.63c0-1.34-.03-3.07-1.88-3.07-1.88 0-2.17 1.47-2.17 2.98V21H9.25V8.75z" />
        </svg>
    </a>

</div>











                </div>

                <div>
                    <p className='text-lg text-gray-800'>COMPANY</p>
                    <ul className='mt-3 flex flex-col gap-2 text-sm'>
               <li>
  <a href="#" onClick={() => alert("About ZOH.AI\nWe create powerful AI tools to make your work faster and smarter.")}>
    About
  </a>
</li>

<li>
  <a href="#" onClick={() => alert("Careers at ZOH.AI\nJoin our mission to build the next generation of AI experiences.")}>
    Careers
  </a>
</li>

<li>
  <a href="#" onClick={() => alert("Press — ZOH.AI\nStay updated with our latest news, announcements, and media coverage.")}>
    Press
  </a>
</li>

<li>
  <a href="#" onClick={() => alert("ZOH.AI Blog\nExplore tips, updates, and AI insights to help you create more.")}>
    Blog
  </a>
</li>

<li>
  <a href="#" onClick={() => alert("ZOH.AI Partners\nWe collaborate with amazing teams to expand innovation and impact.")}>
    Partners
  </a>
</li>


                    </ul>
                </div>

                <div>
                    <p className='text-lg text-gray-800'>SUPPORT</p>
                    <ul className='mt-3 flex flex-col gap-2 text-sm'>
                      <li>
  <a href="#" onClick={() => alert("Help Center\nFind answers to common questions and get support instantly.")}>
    Help Center
  </a>
</li>

<li>
  <a href="#" onClick={() => alert("Safety Information\nLearn how ZOH.AI protects your data and keeps your experience secure.")}>
    Safety Information
  </a>
</li>

<li>
  <a href="#" onClick={() => alert("Cancellation Options\nManage your subscription and explore easy cancellation choices.")}>
    Cancellation Options
  </a>
</li>

<li>
  <a href="#" onClick={() => alert("Contact Us\nReach out anytime Our Email:iamzohaib777@gmail.com")}>
    Contact Us
  </a>
</li>

<li>
  <a href="#" onClick={() => alert("Accessibility\nSee how ZOH.AI ensures an inclusive experience for all users.")}>
    Accessibility
  </a>
</li>

                    </ul>
                </div>

                <div className='max-w-80'>
                    <p className='text-lg text-gray-800'>STAY UPDATED</p>
                    <p className='mt-3 text-sm'>
                        Subscribe to our newsletter for inspiration and special offers.
                    </p>
                  <div className="flex items-center mt-4">

  <input
    type="email"
    placeholder="Enter your email"
    className="bg-white px-4 h-10 rounded-l-lg border border-gray-300 
               text-sm outline-none transition 
               focus:ring-2 focus:ring-[#3d85c6]/60 focus:border-[#3d85c6]"
  />

  <button
    className="h-10 w-10 rounded-r-lg flex items-center justify-center 
               bg-[#3d85c6] hover:bg-[#3577b2] transition active:scale-95"
  >
    <svg
      className="w-5 h-5 text-white"
      stroke="currentColor"
      fill="none"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 12H5m14 0-4 4m4-4-4-4"
      />
    </svg>
  </button>



  
                    </div>
                </div>
            </div>
            <hr className='border-gray-300 mt-8' />
            <div className='flex flex-col md:flex-row gap-2 items-center justify-between py-5'>
                <p>© {new Date().getFullYear()} <a href="https://Github.com/zobbygit">Zohaib Aslam</a>. All rights reserved.</p>
                <ul className='flex items-center gap-4'>
                   <li>
  <a href="#" 
     onClick={() => alert("Privacy Policy\nLearn how ZOH.AI collects, uses, and protects your data to ensure a secure experience.")}>
    Privacy
  </a>
</li>

<li>
  <a href="#" 
     onClick={() => alert("Terms & Conditions\nReview the rules, guidelines, and usage policies that govern your experience on ZOH.AI.")}>
    Terms
  </a>
</li>

<li>
  <a href="#" 
     onClick={() => alert("Sitemap\nExplore a full overview of all ZOH.AI pages to easily navigate our platform.")}>
    Sitemap
  </a>
</li>

                </ul>
            </div>
        </div>
    );
};



export default Footer
