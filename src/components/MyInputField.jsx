import { useState } from "react";

const MyInputField = ({name, onSend}) => {
    const [value, setValue] = useState('')
    const onChange = (e) =>{
        if (e.target.value < 0 || e.target.value > 50 ){alert("Temperature only between 0 and 50")}
        else{setValue(e.target.value)}
    }
    return (
    <div className="">
    <input type="number" onChange={onChange} value={value} className="form-control" placeholder={name} autoComplete="off"/>
    <button className='btn btn-secondary btn-sm mb-2 mt-1' onClick={()=>onSend(value)}>Отправить</button>
    </div>
    )
}

export default MyInputField