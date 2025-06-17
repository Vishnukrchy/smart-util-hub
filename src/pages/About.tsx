import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FaLinkedin, FaInstagram, FaGithub } from "react-icons/fa";

const About = () => (
  <div className="flex justify-center items-center min-h-[60vh]">
    <div className="bg-white dark:bg-zinc-900 shadow-xl rounded-2xl p-10 max-w-md w-full text-center border border-zinc-200 dark:border-zinc-800">
      <img
        src="https://abqnzkisj9zeuqyg.public.blob.vercel-storage.com/pesonal-image/vishnu-image-CHtASJstxIpHJ6V41Mdq3wCRonQRH5.jpg"
        alt="Vishnu Kumar"
        className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-blue-500 object-cover shadow-md"
      />
      <h2 className="text-2xl font-bold mb-1">Vishnu Kumar</h2>
      <p className="text-blue-600 dark:text-blue-400 font-semibold mb-2">Java Full Stack Developer</p>
      <p className="text-zinc-600 dark:text-zinc-300 mb-4 text-sm">
        Hi! I'm a Software Developer building scalable, high-performance systems. I love clean code, cloud tech, and collaborating on meaningful projects. Let's build something amazing together!
      </p>
      <div className="flex justify-center gap-4 mb-6">
        <a href="https://www.linkedin.com/in/vishnu-kumar-2235971a7/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn">
          <FaLinkedin className="w-7 h-7 text-blue-700 hover:text-blue-800 transition" />
        </a>
        <a href="https://www.instagram.com/vishnu_choudhary____/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram">
          <FaInstagram className="w-7 h-7 text-pink-600 hover:text-pink-700 transition" />
        </a>
        <a href="https://github.com/Vishnukrchy" target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub">
          <FaGithub className="w-7 h-7 text-zinc-800 dark:text-zinc-200 hover:text-black transition" />
        </a>
      </div>
      <Link to="/connect">
        <Button size="lg" className="w-full bg-gradient-to-r from-purple-600 via-blue-500 to-blue-600 text-white font-bold py-3 text-lg shadow-md hover:scale-105 transition-transform">
          🤝 Connect with Me
        </Button>
      </Link>
      {/* <p className="mt-4 text-xs text-zinc-400">Open to remote work, collaborations, and new opportunities!</p> */}
    </div>
  </div>
);

export default About; 