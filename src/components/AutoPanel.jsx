import { useState } from "react"
import MyInputField from "./MyInputField"


const AutoPanel = ({panelState, changePanelState, sendData, wsState, wsSend}) =>{
    const panelStyle =  panelState === "auto" ? null : "opacity-25"
    const [targetTemp, setTargetTemp] = useState(28)

    const mainBtnSend = (data) =>{
        sendData(data, wsSend, wsState).then(changePanelState, () => alert("Cannot send data"))
    }

    const onSend = (data) =>{
        sendData(data, wsSend, wsState).then(() => setTargetTemp(data), () => alert("Cannot send data"))
    }

    return (
    <div className={`col-6 d-flex flex-column justify-content-center align-items-center border border-primary ${panelStyle}`}>
        <button className={`btn btn-primary btn-lg w-50 m-4 p-5 ${panelState === "auto" ? "disabled" : null}`} onClick={()=>mainBtnSend('a')}>Автоматический</button>
        <span className="fs-5 text-center m-2">{`Текущая целевая температура: ${targetTemp}`}</span>
        <MyInputField name={"Целевая температура"} onSend={onSend}/>
    </div>
    )
}

export default AutoPanel