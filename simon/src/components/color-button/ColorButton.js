import React from 'react'
const ColorButton = ({color,onClick,flash}) => {

    const style = {

        width:"200px",
        height:'200px',
        margin:"auto",
        border: "solid 2px black",
        
    }

  return (
    <div style={style} onClick={onClick} className={`${color} `+ (flash?`clicked`:``)}></div>
  )
}

export default ColorButton