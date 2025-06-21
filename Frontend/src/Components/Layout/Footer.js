import React, { useContext } from 'react'
import {Context} from "../../main"
import {Link} from "react-router-dom"
import { FaGithub , FaLinkedin} from "react-icons/fa"
import { SiLeetcode } from "react-icons/si";
import { RiInstagramFill} from "react-icons/ri";
import "../../App.css";
import './Footer.css';

function Footer() {
  const {isAuthorized}  = useContext(Context)
  console.log("Navbar isAuthorized:", isAuthorized);
  return (
   <footer id="footer-section" className= {"footerShow"}>
  <div>© All Rights Reserved by Ajeet.</div>
  <div>
    <Link to="https://github.com/Ajeetchirag" target="_blank" rel="noopener noreferrer"><FaGithub /></Link>
    <Link to="https://leetcode.com/u/Ajeet_211538/" target="_blank" rel="noopener noreferrer"><SiLeetcode /></Link>
    <Link to="https://www.linkedin.com/in/ajeet-kumar-4ba383244/" target="_blank" rel="noopener noreferrer"><FaLinkedin /></Link>
    <Link to="https://www.instagram.com/ajeet_chirag" target="_blank" rel="noopener noreferrer"><RiInstagramFill /></Link>
  </div>
</footer>

  )
}

export default Footer