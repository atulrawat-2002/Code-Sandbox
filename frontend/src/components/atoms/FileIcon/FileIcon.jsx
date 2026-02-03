import { FaCss3, FaHtml5, FaJs, FaReact, FaReadme } from "react-icons/fa";
import { IoIosGitBranch } from "react-icons/io";
import { TbBrandEnvato, TbFileTypeSvg, TbFileTypeXml } from "react-icons/tb";
import { VscJson } from "react-icons/vsc";

const FileIcon = ({ extension }) => {

    const iconStyle = {
        height: '20px',
        width: '20px' 
    }

    const iconMapper = {
        'json': <VscJson  color="#fffb17ff" style={iconStyle} />,
        'js': <FaJs  color="yellow" style={iconStyle} />,
        'jsx': <FaReact  color="#17e4ffff" style={iconStyle} />,
        'css': <FaCss3  color="#fc35d1ff" style={iconStyle} />,
        'html': <FaHtml5  color="#ff2727ff" style={iconStyle} />,
        'local': <TbBrandEnvato color="#fffb17ff" style={iconStyle} />,
        'env': <TbBrandEnvato color="#fffb17ff" style={iconStyle} />,
        'gitignore': <IoIosGitBranch color="#fffb17ff" style={iconStyle} />,
        'md': <FaReadme color="rgb(174, 3, 197)" style={iconStyle} />,
        'svg': <TbFileTypeSvg color="rgb(5, 223, 212)" style={iconStyle} />,
        'xml': <TbFileTypeXml color="rgb(240, 97, 14)" style={iconStyle} />
        
    }

  return (
        <>
            { 
                iconMapper[extension]
            }
        </>
  )
}

export default FileIcon